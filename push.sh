#!/bin/bash
set -euo pipefail

# ─────────────────────────────────────────
# Flag parsing  (order-independent)
# ─────────────────────────────────────────
BYPASS=0
DRY_RUN=0

for arg in "$@"; do
  case $arg in
    --bypass)  BYPASS=1 ;;
    --dry-run) DRY_RUN=1 ;;
  esac
done

dry() { echo "🌵 [DRY-RUN] $*"; }

if [ $DRY_RUN -eq 1 ]; then
  dry "Dry-run mode: nothing will be written, committed, or pushed."
fi
if [ $BYPASS -eq 1 ]; then
  echo "⚡ Bypass mode: skipping Prettier, ESLint, and audit."
  echo "   Only build errors will be shown — push proceeds regardless."
fi

# ─────────────────────────────────────────
# 1. Current branch + fetch
# ─────────────────────────────────────────
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo ""
echo "🌿 Current branch: $CURRENT_BRANCH"
git fetch origin --quiet

# ─────────────────────────────────────────
# 2. Find unpushed JS/TS files
# ─────────────────────────────────────────
mapfile -t CHANGED_FILES < <(
  git diff --name-only "origin/$CURRENT_BRANCH...HEAD" 2>/dev/null \
  | grep -E '\.(js|jsx|ts|tsx)$' || true
)

# ─────────────────────────────────────────
# ── BYPASS PATH: build-only, always push ─
# ─────────────────────────────────────────
if [ $BYPASS -eq 1 ]; then

  echo ""
  echo "🏗️  Running Next.js build (bypass mode — errors shown, push proceeds)..."

  if [ $DRY_RUN -eq 1 ]; then
    dry "Would run: npm run build"
    dry "Would show build output (errors or not) then push directly."
  else
    set +e
    npm run build 2>&1 | tee build_error.md
    BUILD_EXIT_CODE=${PIPESTATUS[0]}
    set -e

    if [ $BUILD_EXIT_CODE -ne 0 ]; then
      echo ""
      echo "⚠️  Build has errors (logged to build_error.md) — pushing anyway due to --bypass."
    else
      echo "✅ Build passed."
      rm -f build_error.md
    fi
  fi

  echo ""
  if [ $DRY_RUN -eq 1 ]; then
    dry "Would run: git push origin $CURRENT_BRANCH"
    dry "Dry run complete."
  else
    echo "🚀 Pushing to origin/$CURRENT_BRANCH..."
    git push origin "$CURRENT_BRANCH"
    echo "🎉 Code successfully pushed!"
  fi

  exit 0
fi

# ─────────────────────────────────────────
# ── NORMAL PATH ──────────────────────────
# ─────────────────────────────────────────

if [ ${#CHANGED_FILES[@]} -gt 0 ]; then

  echo ""
  echo "📂 Changed JS/TS files in unpushed commits:"
  printf '   • %s\n' "${CHANGED_FILES[@]}"

  # ───────────────────────────────────────
  # 3. Prettier
  # ───────────────────────────────────────
  echo ""
  echo "💅 Running Prettier on unpushed files..."

  if [ $DRY_RUN -eq 1 ]; then
    dry "Would run: npx prettier --write ${CHANGED_FILES[*]}"
    dry "Would auto-commit any formatting changes."
  else
    npx prettier --write "${CHANGED_FILES[@]}"

    if [[ $(git status --porcelain) ]]; then
      echo "📝 Formatting changes detected. Creating PRETTY commit..."
      SHORT_NAMES=()
      for f in "${CHANGED_FILES[@]}"; do
        SHORT_NAMES+=("$(basename "$(dirname "$f")")/$(basename "$f")")
      done
      FLAT_FILES="${SHORT_NAMES[*]}"
      git add .
      git commit -m "PRETTY: these files were formatted: $FLAT_FILES"
    else
      echo "✨ No formatting changes needed."
    fi
  fi

  # ───────────────────────────────────────
  # 4. ESLint
  # ───────────────────────────────────────
  echo ""
  echo "🔍 Running ESLint on modified files..."

  if [ $DRY_RUN -eq 1 ]; then
    dry "Would run: npx eslint ${CHANGED_FILES[*]} --format stylish"
    dry "Would block push on lint errors."
  else
    set +e
    npx eslint "${CHANGED_FILES[@]}" --format stylish > lint_error.md 2>&1
    LINT_EXIT_CODE=$?
    cat lint_error.md
    set -e

    if [ $LINT_EXIT_CODE -ne 0 ]; then
      echo "❌ Push blocked: ESLint found issues."
      echo "📄 Errors saved to lint_error.md"
      echo "👉 Fix them, or push anyway using: npm run push -- --bypass"
      exit 1
    else
      echo "✅ ESLint passed."
      rm -f lint_error.md
    fi
  fi

else
  echo ""
  echo "⏩ No JS/TS files in unpushed commits — skipping Prettier & ESLint."
fi

# ─────────────────────────────────────────
# 5. Next.js Build
# ─────────────────────────────────────────
echo ""
echo "🏗️  Running Next.js build check..."

if [ $DRY_RUN -eq 1 ]; then
  dry "Would run: npm run build"
  dry "Would block push on build failure."
else
  set +e
  npm run build 2>&1 | tee build_error.md
  BUILD_EXIT_CODE=${PIPESTATUS[0]}
  set -e

  if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "❌ Push blocked: Build failed."
    echo "📄 Errors saved to build_error.md"
    echo "👉 Fix them, or push anyway using: npm run push -- --bypass"
    exit 1
  else
    echo "✅ Build passed."
    rm -f build_error.md
  fi
fi

# ─────────────────────────────────────────
# 6. npm audit
# ─────────────────────────────────────────
echo ""
echo "🔒 Running npm audit..."

if [ $DRY_RUN -eq 1 ]; then
  dry "Would run: npm audit"
  dry "Would block push on vulnerabilities."
else
  set +e
  npm audit > audit_error.md 2>&1
  AUDIT_EXIT_CODE=$?
  cat audit_error.md
  set -e

  if [ $AUDIT_EXIT_CODE -ne 0 ]; then
    echo "❌ Push blocked: npm audit found vulnerabilities."
    echo "📄 Report saved to audit_error.md"
    echo "👉 Fix them, or push anyway using: npm run push -- --bypass"
    exit 1
  else
    echo "✅ npm audit passed."
    rm -f audit_error.md
  fi
fi

# ─────────────────────────────────────────
# 7. Push
# ─────────────────────────────────────────
echo ""
if [ $DRY_RUN -eq 1 ]; then
  dry "All checks passed. Would run: git push origin $CURRENT_BRANCH"
  dry "Dry run complete. Nothing was written, committed, or pushed."
else
  echo "🚀 Pushing to origin/$CURRENT_BRANCH..."
  git push origin "$CURRENT_BRANCH"
  echo "🎉 Code successfully pushed!"
fi