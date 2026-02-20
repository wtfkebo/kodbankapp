import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { signToken } from '@/lib/auth';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const [rows]: any = await pool.execute(
            'SELECT uid, username, role FROM KodUser WHERE username = ? AND password = ?',
            [username, hashedPassword]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = rows[0];
        const token = signToken({ sub: user.username, role: user.role });

        // Store token in DB
        await pool.execute(
            'INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)',
            [token, user.uid, new Date(Date.now() + 3600000)] // 1 hour expiry
        );

        // Set cookie
        (await cookies()).set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600
        });


        return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
