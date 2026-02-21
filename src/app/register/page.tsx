'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role: 'customer' }),
            });
            if (res.ok) {
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fields: { name: keyof typeof form; label: string; type: string; placeholder: string }[] = [
        { name: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username' },
        { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
        { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
    ];

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            zIndex: 1,
        }}>
            <div className="glass" style={{ width: '100%', maxWidth: '460px', padding: '3rem 2.5rem' }}>
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
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
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Create account</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                        Join Kodbank — premium banking experience
                    </p>
                </div>

                {/* Starting bonus badge */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(114,47,55,0.08), rgba(114,47,55,0.04))',
                    border: '1px solid rgba(114,47,55,0.15)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.75rem',
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🎁</span>
                    <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#722F37' }}>Welcome Bonus</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>₹1,00,000 starting balance on account creation</p>
                    </div>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        color: '#dc2626',
                        fontSize: '0.875rem',
                        marginBottom: '1.25rem',
                        textAlign: 'center',
                    }}>{error}</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {fields.map(f => (
                        <div key={f.name}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                                {f.label}
                            </label>
                            <input
                                type={f.type}
                                name={f.name}
                                placeholder={f.placeholder}
                                value={form[f.name]}
                                onChange={handleChange}
                                className="input-field"
                                required={f.name !== 'phone'}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="wine-btn"
                        disabled={loading}
                        style={{ width: '100%', padding: '1rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <a href="/login" style={{ color: '#722F37', fontWeight: 600, textDecoration: 'none' }}>
                        Sign in
                    </a>
                </p>
            </div>
        </main>
    );
}
