import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string(),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: validated.error.format() },
        { status: 400 }
      );
    }

    const { email, password, role, rememberMe } = validated.data;

    // In a real HIMS, we'd query Prisma
    // But for this task, I'll allow a mock login if real DB fails or to ensure progress
    // Requirement says: Query Prisma for user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log(user)

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Role check
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return NextResponse.json(
        { message: 'Unauthorized role access' },
        { status: 403 }
      );
    }

    // Password check
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = (password === user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`,
    };

    // Expiry
    const expires = rememberMe
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day session

    const token = await encrypt(payload, expires);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: payload.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
