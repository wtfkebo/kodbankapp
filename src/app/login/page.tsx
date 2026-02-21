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
            {faceIdActive && (
                <div className="faceid-overlay">
                    <div className="faceid-circle">
                        <div className="faceid-scan-line" />
                    </div>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em' }}>Authenticating...</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Face ID verification in progress</p>
                </div>
            )}

            <main style={{
                minHeight: '100vh', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                padding: '2rem', position: 'relative', zIndex: 1,
            }}>
                <div style={{ display: 'flex', width: '100%', maxWidth: 900, alignItems: 'stretch', borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 80px rgba(114,47,55,0.12)' }}>

                    {/* ── LEFT ART PANEL ── */}
                    <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '3rem', position: 'relative', overflow: 'hidden',
                        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                    }}>
                        {/* Floating orbs */}
                        <div style={{ position: 'absolute', top: '8%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(114,47,55,0.18) 0%, transparent 70%)', animation: 'floatA 7s ease-in-out infinite', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: '12%', right: '8%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,61,71,0.14) 0%, transparent 70%)', animation: 'floatB 9s ease-in-out infinite', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', top: '50%', right: '20%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(114,47,55,0.1) 0%, transparent 70%)', animation: 'floatA 11s ease-in-out infinite 2s', pointerEvents: 'none' }} />

                        {/* Stacked card art */}
                        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 340 }}>
                            {/* Main wine-red card */}
                            <div style={{
                                width: '100%', height: 195, borderRadius: 22,
                                background: 'linear-gradient(135deg, #722F37 0%, #9b3d47 45%, #5c2430 100%)',
                                boxShadow: '0 24px 64px rgba(114,47,55,0.5)',
                                position: 'relative', overflow: 'hidden',
                                transform: 'rotate(-3deg)', marginBottom: '-28px',
                            }}>
                                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                                <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                                {/* Top row */}
                                <div style={{ position: 'absolute', top: 22, left: 26, color: 'rgba(255,255,255,0.92)', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.04em' }}>KODBANK</div>
                                <div style={{ position: 'absolute', top: 22, right: 26, display: 'flex' }}>
                                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(234,62,45,0.8)' }} />
                                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,165,0,0.7)', marginLeft: -10 }} />
                                </div>
                                {/* Chip */}
                                <div style={{ position: 'absolute', top: 58, left: 26, width: 40, height: 30, borderRadius: 6, background: 'linear-gradient(135deg, #d4a017, #f5c842 40%, #c8860c)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
                                {/* Bottom */}
                                <div style={{ position: 'absolute', bottom: 22, left: 26, right: 26 }}>
                                    <p style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '0.22em' }}>•••• &nbsp;•••• &nbsp;•••• &nbsp;••••</p>
                                </div>
                            </div>

                            {/* Glass card underneath */}
                            <div style={{
                                width: '88%', height: 175, borderRadius: 20, marginLeft: 'auto',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.4)',
                                boxShadow: '0 12px 40px rgba(114,47,55,0.12)',
                                position: 'relative', overflow: 'hidden',
                                transform: 'rotate(2deg)',
                            }}>
                                <div style={{ position: 'absolute', top: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(114,47,55,0.06)' }} />
                                <div style={{ position: 'absolute', top: 20, right: 20, fontSize: '1.8rem' }}>💳</div>
                                <div style={{ position: 'absolute', bottom: 22, left: 22 }}>
                                    <p style={{ fontSize: '0.65rem', color: 'rgba(114,47,55,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>Savings Account</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#722F37' }}>₹ ••• ••••••</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT FORM PANEL ── */}
                    <div style={{
                        width: 400, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '2.5rem',
                        background: 'rgba(255,255,255,0.45)',
                        backdropFilter: 'blur(24px)',
                        borderLeft: '1px solid rgba(255,255,255,0.5)',
                    }}>
                        <div style={{ width: '100%' }}>
                            {/* Logo */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: 'linear-gradient(135deg, #722F37, #9b3d47)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(114,47,55,0.35)', marginBottom: '1.25rem',
                                }}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                        <line x1="2" y1="10" x2="22" y2="10" />
                                    </svg>
                                </div>
                                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a1a2e' }}>Welcome back</h1>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.35rem' }}>Sign in to your Kodbank account</p>
                            </div>

                            {error && (
                                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                {[
                                    { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username' },
                                    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
                                ].map(f => (
                                    <div key={f.name}>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {f.label}
                                        </label>
                                        <input
                                            type={f.type} name={f.name}
                                            placeholder={f.placeholder}
                                            value={form[f.name as keyof typeof form]}
                                            onChange={handleChange}
                                            className="input-field" required
                                        />
                                    </div>
                                ))}

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#722F37', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>
                                </div>

                                <button type="submit" className="wine-btn" style={{ width: '100%', padding: '1rem', fontSize: '0.95rem' }}>
                                    Sign In →
                                </button>
                            </form>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.75rem 0' }}>
                                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>or</span>
                                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                            </div>

                            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                                Don&apos;t have an account?{' '}
                                <a href="/register" style={{ color: '#722F37', fontWeight: 700, textDecoration: 'none' }}>Create account</a>
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            <style>{`
        @keyframes floatA { 0%,100% { transform:translateY(0px) scale(1); } 50% { transform:translateY(-20px) scale(1.04); } }
        @keyframes floatB { 0%,100% { transform:translateY(0px) scale(1); } 50% { transform:translateY(18px) scale(0.97); } }
      `}</style>
        </>
    );
}
