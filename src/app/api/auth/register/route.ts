import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Role } from '@/generated/prisma/enums';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'doctor', 'nurse']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: validated.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, confirmPassword, role } = validated.data;

    // Password match check
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Email duplication check
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    // In our prisma schema, User has firstName and lastName
    // We'll split the name or use as firstName
    const names = name.split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names.slice(1).join(' ') : '-';

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role.toUpperCase() as Role,
        firstName,
        lastName,
      },
    });

    // JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`,
    };

    // Expiry (7 days by default for register success)
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const token = await encrypt(payload, expires);

    // Set cookies
    const cookieStore = await cookies();

    // Auth token (HttpOnly)
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires,
      path: '/',
    });

    // Client-side hint cookie (Role)
    cookieStore.set('role', user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires,
      path: '/',
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: payload.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
