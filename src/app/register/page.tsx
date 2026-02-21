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
        <>
            <main style={{ minHeight: '100vh', display: 'flex', position: 'relative', zIndex: 1 }}>

                {/* ── LEFT ART PANEL ── */}
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '3rem', position: 'relative', overflow: 'hidden',
                }}>
                    {/* Floating orbs */}
                    <div style={{ position: 'absolute', top: '15%', right: '15%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(114,47,55,0.16) 0%, transparent 70%)', animation: 'floatB 8s ease-in-out infinite', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,61,71,0.12) 0%, transparent 70%)', animation: 'floatA 10s ease-in-out infinite', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: '40%', left: '25%', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(114,47,55,0.09) 0%, transparent 70%)', animation: 'floatB 12s ease-in-out infinite 3s', pointerEvents: 'none' }} />

                    {/* Art: welcome bonus visual */}
                    <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 360, textAlign: 'center' }}>

                        {/* Big coin / reward circle */}
                        <div style={{
                            width: 180, height: 180, borderRadius: '50%', margin: '0 auto',
                            background: 'linear-gradient(135deg, #d4a017 0%, #f5c842 40%, #c8860c 100%)',
                            boxShadow: '0 20px 60px rgba(212,160,23,0.4), inset 0 2px 0 rgba(255,255,255,0.3)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            {/* Inner shine */}
                            <div style={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(100,60,0,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1 }}>Welcome</p>
                            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#5c3800', lineHeight: 1.1 }}>₹1L</p>
                            <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(100,60,0,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bonus</p>
                        </div>

                        {/* Floating mini cards around the coin */}
                        <div style={{
                            position: 'absolute', top: 10, right: 0,
                            background: 'linear-gradient(135deg, #722F37, #9b3d47)',
                            borderRadius: 14, padding: '0.6rem 0.9rem',
                            boxShadow: '0 8px 24px rgba(114,47,55,0.35)',
                            transform: 'rotate(8deg)',
                        }}>
                            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Balance</p>
                            <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 800 }}>₹1,00,000</p>
                        </div>

                        <div style={{
                            position: 'absolute', bottom: 20, left: 0,
                            background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.6)',
                            borderRadius: 14, padding: '0.6rem 0.9rem',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                            transform: 'rotate(-6deg)',
                        }}>
                            <p style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 600 }}>Instant Access</p>
                            <p style={{ fontSize: '0.85rem', color: '#722F37', fontWeight: 800 }}>⚡ Today</p>
                        </div>

                        {/* 3 steps */}
                        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
                            {[
                                { n: '01', title: 'Create your account', sub: 'Takes less than 2 minutes' },
                                { n: '02', title: 'Get ₹1L welcome bonus', sub: 'Instantly credited on sign-up' },
                                { n: '03', title: 'Start banking smarter', sub: 'AI-powered insights & transfers' },
                            ].map(s => (
                                <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                        background: 'linear-gradient(135deg, #722F37, #9b3d47)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.65rem', fontWeight: 800, color: '#fff',
                                        boxShadow: '0 4px 12px rgba(114,47,55,0.3)',
                                    }}>{s.n}</div>
                                    <div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a2e' }}>{s.title}</p>
                                        <p style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{s.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Brand tagline */}
                    <div style={{ marginTop: '2.5rem', textAlign: 'center', zIndex: 2 }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a1a2e', lineHeight: 1.2 }}>
                            Join 10,000+ users<br />
                            <span style={{ color: '#722F37' }}>banking smarter.</span>
                        </h2>
                    </div>
                </div>

                {/* ── RIGHT FORM PANEL ── */}
                <div style={{
                    width: 480, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '2.5rem',
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(24px)',
                    borderLeft: '1px solid rgba(255,255,255,0.4)',
                }}>
                    <div style={{ width: '100%', maxWidth: 400 }}>
                        {/* Logo */}
                        <div style={{ marginBottom: '2rem' }}>
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
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1a1a2e' }}>Create account</h1>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.35rem' }}>Join Kodbank — premium banking experience</p>
                        </div>

                        {/* Bonus banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(114,47,55,0.08), rgba(114,47,55,0.04))',
                            border: '1px solid rgba(114,47,55,0.15)',
                            borderRadius: 12, padding: '0.7rem 1rem',
                            display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem',
                        }}>
                            <span style={{ fontSize: '1.3rem' }}>🎁</span>
                            <div>
                                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#722F37' }}>Welcome Bonus</p>
                                <p style={{ fontSize: '0.72rem', color: '#6b7280' }}>₹1,00,000 starting balance on account creation</p>
                            </div>
                        </div>

                        {error && (
                            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            {fields.map(f => (
                                <div key={f.name}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {f.label}
                                    </label>
                                    <input
                                        type={f.type} name={f.name}
                                        placeholder={f.placeholder}
                                        value={form[f.name]}
                                        onChange={handleChange}
                                        className="input-field"
                                        required={f.name !== 'phone'}
                                    />
                                </div>
                            ))}

                            <button type="submit" className="wine-btn" disabled={loading} style={{ width: '100%', padding: '1rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                                {loading ? 'Creating account...' : 'Create Account →'}
                            </button>
                        </form>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>or</span>
                            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                        </div>

                        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                            Already have an account?{' '}
                            <a href="/login" style={{ color: '#722F37', fontWeight: 700, textDecoration: 'none' }}>Sign in</a>
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.75rem' }}>
                            {[{ icon: '🔒', text: 'SSL Encrypted' }, { icon: '🛡️', text: 'Bank-grade' }, { icon: '✅', text: 'Verified' }].map(b => (
                                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>
                                    <span>{b.icon}</span>{b.text}
                                </div>
                            ))}
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
