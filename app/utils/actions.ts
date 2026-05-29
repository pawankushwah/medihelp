'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { createSession } from '@/lib/session';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    
    if (user.length === 0) {
      return { error: 'Invalid credentials.' };
    }

    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return { error: 'Invalid credentials.' };
    }

    await createSession(user[0].id, user[0].role);
    
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred.' };
  }
  
  redirect('/dashboard');
}

export async function signupAction(role: 'patient' | 'doctor', prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const specialization = formData.get('specialization') as string | null;

  if (!name || !email || !password) {
    return { error: 'All fields are required.' };
  }
  if (role === 'doctor' && !specialization) {
    return { error: 'Specialization is required for doctors.' };
  }

  try {
    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return { error: 'Email is already in use.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role,
      specialization: role === 'doctor' ? specialization : null,
    }).returning();

    await createSession(newUser[0].id, newUser[0].role);
    
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred.' };
  }

  redirect('/dashboard');
}
