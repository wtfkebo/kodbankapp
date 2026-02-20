import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { uid, username, password, email, phone } = await req.json();

        if (!username || !password || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Hash password using SHA-256
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const [result] = await pool.execute(
            'INSERT INTO KodUser (username, email, password, balance, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, 100000.00, phone, 'customer']
        );

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
