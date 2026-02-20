import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { pool } from '@/lib/db';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = verifyToken(token);
        if (!payload?.sub) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        const [rows] = await pool.execute(
            'SELECT username, email, role FROM KodUser WHERE username = ?',
            [payload.sub]
        ) as any[];

        if (!rows.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const user = rows[0];
        return NextResponse.json({ username: user.username, email: user.email, role: user.role });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
