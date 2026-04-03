@echo off
setlocal EnableDelayedExpansion

:: ─────────────────────────────────────────
:: Flag parsing  (order-independent)
:: ─────────────────────────────────────────
set BYPASS=0
set DRY_RUN=0

for %%A in (%*) do (
  if "%%A"=="--bypass"  set BYPASS=1
  if "%%A"=="--dry-run" set DRY_RUN=1
)

if !DRY_RUN!==1 (
  echo [DRY-RUN] Dry-run mode: nothing will be written, committed, or pushed.
)
if !BYPASS!==1 (
  echo [BYPASS] Bypass mode: skipping Prettier, ESLint, and audit.
  echo          Only build errors will be shown -- push proceeds regardless.
)

:: ─────────────────────────────────────────
:: 1. Current branch + fetch
:: ─────────────────────────────────────────
for /f "delims=" %%B in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%B
echo.
echo [INFO] Current branch: !CURRENT_BRANCH!
git fetch origin --quiet

:: ─────────────────────────────────────────
:: 2. Find unpushed JS/TS files
::    Stored as a space-separated list in CHANGED_FILES
::    and a newline-friendly version in CHANGED_FILES_NL
:: ─────────────────────────────────────────
set CHANGED_FILES=
set HAS_CHANGES=0

for /f "delims=" %%F in ('git diff --name-only "origin/!CURRENT_BRANCH!...HEAD" 2^>nul ^| findstr /R "\.\(js\|jsx\|ts\|tsx\)$"') do (
  set CHANGED_FILES=!CHANGED_FILES! "%%F"
  set HAS_CHANGES=1
)

:: ─────────────────────────────────────────
:: ── BYPASS PATH: build-only, always push ─
:: ─────────────────────────────────────────
if !BYPASS!==1 (
  echo.
  echo [BUILD] Running Next.js build ^(bypass mode -- errors shown, push proceeds^)...

  if !DRY_RUN!==1 (
    echo [DRY-RUN] Would run: npm run build
    echo [DRY-RUN] Would show build output then push directly.
  ) else (
    npm run build > build_error.md 2>&1
    type build_error.md
    if !ERRORLEVEL! neq 0 (
      echo.
      echo [WARN] Build has errors ^(logged to build_error.md^) -- pushing anyway due to --bypass.
    ) else (
      echo [OK] Build passed.
      del /f build_error.md >nul 2>&1
    )
  )

  echo.
  if !DRY_RUN!==1 (
    echo [DRY-RUN] Would run: git push origin !CURRENT_BRANCH!
    echo [DRY-RUN] Dry run complete.
  ) else (
    echo [PUSH] Pushing to origin/!CURRENT_BRANCH!...
    git push origin !CURRENT_BRANCH!
    echo [DONE] Code successfully pushed!
  )
  goto :eof
)

:: ─────────────────────────────────────────
:: ── NORMAL PATH ──────────────────────────
:: ─────────────────────────────────────────

if !HAS_CHANGES!==1 (
  echo.
  echo [INFO] Changed JS/TS files in unpushed commits:
  for /f "delims=" %%F in ('git diff --name-only "origin/!CURRENT_BRANCH!...HEAD" 2^>nul ^| findstr /R "\.\(js\|jsx\|ts\|tsx\)$"') do (
    echo    * %%F
  )

  :: ───────────────────────────────────────
  :: 3. Prettier
  :: ───────────────────────────────────────
  echo.
  echo [FORMAT] Running Prettier on unpushed files...

  if !DRY_RUN!==1 (
    echo [DRY-RUN] Would run: npx prettier --write !CHANGED_FILES!
    echo [DRY-RUN] Would auto-commit any formatting changes.
  ) else (
    npx prettier --write !CHANGED_FILES!

    :: Check if anything changed after Prettier
    for /f "delims=" %%S in ('git status --porcelain') do (
      set HAS_FORMAT_CHANGES=1
    )

    if defined HAS_FORMAT_CHANGES (
      echo [COMMIT] Formatting changes detected. Creating PRETTY commit...

      :: Build short parent/filename labels for the commit message
      set SHORT_NAMES=
      for /f "delims=" %%F in ('git diff --name-only "origin/!CURRENT_BRANCH!...HEAD" 2^>nul ^| findstr /R "\.\(js\|jsx\|ts\|tsx\)$"') do (
        :: %%~dpF = drive+path, %%~nxF = filename
        :: Extract parent folder name using a nested for on the path
        for %%P in ("%%~dpF\.") do set PARENT=%%~nxP
        set SHORT_NAMES=!SHORT_NAMES! !PARENT!/%%~nxF
      )

      git add .
      git commit -m "PRETTY: these files were formatted:!SHORT_NAMES!"
    ) else (
      echo [OK] No formatting changes needed.
    )
  )

  :: ───────────────────────────────────────
  :: 4. ESLint
  :: ───────────────────────────────────────
  echo.
  echo [LINT] Running ESLint on modified files...

  if !DRY_RUN!==1 (
    echo [DRY-RUN] Would run: npx eslint !CHANGED_FILES! --format stylish
    echo [DRY-RUN] Would block push on lint errors.
  ) else (
    npx eslint !CHANGED_FILES! --format stylish > lint_error.md 2>&1
    set LINT_EXIT=!ERRORLEVEL!
    type lint_error.md

    if !LINT_EXIT! neq 0 (
      echo [ERROR] Push blocked: ESLint found issues.
      echo [INFO]  Errors saved to lint_error.md
      echo [TIP]   Fix them, or push anyway using: npm run push -- --bypass
      exit /b 1
    ) else (
      echo [OK] ESLint passed.
      del /f lint_error.md >nul 2>&1
    )
  )

) else (
  echo.
  echo [SKIP] No JS/TS files in unpushed commits -- skipping Prettier ^& ESLint.
)

:: ─────────────────────────────────────────
:: 5. Next.js Build
:: ─────────────────────────────────────────
echo.
echo [BUILD] Running Next.js build check...

if !DRY_RUN!==1 (
  echo [DRY-RUN] Would run: npm run build
  echo [DRY-RUN] Would block push on build failure.
) else (
  npm run build > build_error.md 2>&1
  set BUILD_EXIT=!ERRORLEVEL!
  type build_error.md

  if !BUILD_EXIT! neq 0 (
    echo [ERROR] Push blocked: Build failed.
    echo [INFO]  Errors saved to build_error.md
    echo [TIP]   Fix them, or push anyway using: npm run push -- --bypass
    exit /b 1
  ) else (
    echo [OK] Build passed.
    del /f build_error.md >nul 2>&1
  )
)

:: ─────────────────────────────────────────
:: 6. npm audit
:: ─────────────────────────────────────────
echo.
echo [AUDIT] Running npm audit...

if !DRY_RUN!==1 (
  echo [DRY-RUN] Would run: npm audit
  echo [DRY-RUN] Would block push on vulnerabilities.
) else (
  npm audit > audit_error.md 2>&1
  set AUDIT_EXIT=!ERRORLEVEL!
  type audit_error.md

  if !AUDIT_EXIT! neq 0 (
    echo [ERROR] Push blocked: npm audit found vulnerabilities.
    echo [INFO]  Report saved to audit_error.md
    echo [TIP]   Fix them, or push anyway using: npm run push -- --bypass
    exit /b 1
  ) else (
    echo [OK] npm audit passed.
    del /f audit_error.md >nul 2>&1
  )
)

:: ─────────────────────────────────────────
:: 7. Push
:: ─────────────────────────────────────────
echo.
if !DRY_RUN!==1 (
  echo [DRY-RUN] All checks passed. Would run: git push origin !CURRENT_BRANCH!
  echo [DRY-RUN] Dry run complete. Nothing was written, committed, or pushed.
) else (
  echo [PUSH] Pushing to origin/!CURRENT_BRANCH!...
  git push origin !CURRENT_BRANCH!
  echo [DONE] Code successfully pushed!
)

endlocal