'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [faceIdActive, setFaceIdActive] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setFaceIdActive(true);
                setTimeout(() => router.push('/dashboard'), 2000);
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch {
            setError('Connection error. Please try again.');
        }
    };

    return (
        <>
            {/* FaceID Overlay */}
            {faceIdActive && (
                <div className="faceid-overlay">
                    <div className="faceid-circle">
                        <div className="faceid-scan-line" />
                    </div>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em' }}>
                        Authenticating...
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                        Face ID verification in progress
                    </p>
                </div>
            )}

            <main style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative',
                zIndex: 1,
            }}>
                <div className="glass" style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '3rem 2.5rem',
                }}>
                    {/* Logo / Brand */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            width: '60px', height: '60px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #722F37, #9b3d47)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1rem',
                            boxShadow: '0 8px 24px rgba(114,47,55,0.35)',
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a1a2e' }}>Welcome back</h1>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                            Sign in to your Kodbank account
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '10px',
                            padding: '0.75rem 1rem',
                            color: '#dc2626',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                            textAlign: 'center',
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={form.username}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.8rem', color: '#722F37', cursor: 'pointer', fontWeight: 500 }}>
                                Forgot password?
                            </span>
                        </div>

                        <button type="submit" className="wine-btn" style={{ width: '100%', padding: '1rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                            Sign In
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        Don't have an account?{' '}
                        <a href="/register" style={{ color: '#722F37', fontWeight: 600, textDecoration: 'none' }}>
                            Create account
                        </a>
                    </p>
                </div>
            </main>
        </>
    );
}
