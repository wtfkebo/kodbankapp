import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    const token = (await cookies()).get('token')?.value;


    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.sub) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    try {
        const [rows]: any = await pool.execute(
            'SELECT balance FROM KodUser WHERE username = ?',
            [payload.sub]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ balance: rows[0].balance }, { status: 200 });
    } catch (error) {
        console.error('Balance fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
