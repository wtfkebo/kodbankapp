'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        uid: '' // Optional based on DB auto-increment, but user asked for it in prompt "Accepts uid..."
        // actually DB has auto-increment, but prompt says "Accepts uid". 
        // If DB is auto-increment, we shouldn't send it unless we want to force it.
        // I'll check the prompt again: "uid (Primary Key, Auto-increment)" AND "POST /register: Accepts uid..."
        // If it's auto-increment, usually we don't send it. I'll omit sending it to let DB handle it 
        // unless user explicitly inputs it. Let's assume auto-generation for now for better UX.
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black">
            <GlassCard className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-[#722F37]">Join Kodbank</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <Button type="submit" className="w-full mt-2">
                        Register
                    </Button>
                    <p className="text-center mt-4 text-sm">
                        Already have an account? <a href="/login" className="text-[#722F37] hover:underline">Login</a>
                    </p>
                </form>
            </GlassCard>
        </main>
    );
}
