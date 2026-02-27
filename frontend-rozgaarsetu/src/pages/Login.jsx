import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Phone, HardHat } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { getDashboardRoute } from '../utils/roleRouting';
import logo from '../assets/logo.jpeg';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const { t } = useContext(LanguageContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!phone.trim() || !password.trim()) return;

        setSubmitting(true);
        const ok = await login(phone.trim(), password);
        setSubmitting(false);

        if (ok) {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            navigate(getDashboardRoute(storedUser.role));
        }
    };

    return (
        <div className="auth-wrapper fade-in">
            <div className="auth-container">
                {/* ── Branded Panel ── */}
                <div className="auth-brand-panel">
                    <img
                        src={logo}
                        alt="RozgaarSetu"
                        style={{ height: 64, marginBottom: '1.5rem', borderRadius: 12, position: 'relative', zIndex: 1 }}
                    />
                    <h2 className="fw-bold mb-3">Welcome Back!</h2>
                    <p className="mb-0">
                        Sign in to access your dashboard, manage jobs, and connect with
                        skilled workers across India.
                    </p>
                    <div style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
                        <HardHat size={48} strokeWidth={1.2} style={{ opacity: 0.3 }} />
                    </div>
                </div>

                {/* ── Glass Form Panel ── */}
                <div className="auth-form-panel">
                    <h2 className="h3 fw-bold mb-1 text-charcoal">{t('login')}</h2>
                    <p className="text-earth-muted mb-4">Enter your account details to continue.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">{t('phone')}</label>
                            <div className="input-group">
                                <span className="input-group-text"><Phone size={16} /></span>
                                <input
                                    className="form-control"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="9876543210"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">{t('password')}</label>
                            <div className="input-group">
                                <span className="input-group-text"><Lock size={16} /></span>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button className="btn btn-primary w-100 py-2" type="submit" disabled={submitting}>
                            {submitting ? 'Logging in…' : t('login')}
                        </button>
                    </form>

                    <p className="mt-3 mb-0 text-center text-earth-muted">
                        <Link to="/register" className="text-decoration-none">{t('no_account')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
