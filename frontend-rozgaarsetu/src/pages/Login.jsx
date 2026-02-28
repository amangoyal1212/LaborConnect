import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Phone, Mail, HardHat } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { getDashboardRoute } from '../utils/roleRouting';


const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const { t } = useContext(LanguageContext);
    const navigate = useNavigate();

    const isEmail = identifier.includes('@');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!identifier.trim() || !password.trim()) return;

        setSubmitting(true);
        const ok = await login(identifier.trim(), password);
        setSubmitting(false);

        if (ok) {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            navigate(getDashboardRoute(storedUser.role));
        }
    };

    return (
        <motion.div
            className="auth-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="auth-container">
                {/* ── Deep Navy Branded Panel ── */}
                <div className="auth-brand-panel d-none d-md-flex flex-column justify-content-center align-items-center">
                    <div className="h-16 w-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto shrink-0 shadow-md" style={{ position: 'relative', zIndex: 1 }}>
                        R
                    </div>
                    <h2 className="fw-bold mb-3">{t('welcome_back')}</h2>
                    <p className="mb-0">{t('login_desc')}</p>
                    <div style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
                        <HardHat size={48} strokeWidth={1.2} style={{ opacity: 0.3 }} />
                    </div>
                </div>

                {/* ── White Form Panel ── */}
                <motion.div
                    className="auth-form-panel"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <h2 className="h3 fw-bold mb-1" style={{ color: 'var(--text-heading)' }}>{t('login')}</h2>
                    <p style={{ color: 'var(--text-muted)' }} className="mb-4">{t('login_desc')}</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">{t('email_or_phone')}</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    {isEmail ? <Mail size={16} /> : <Phone size={16} />}
                                </span>
                                <input
                                    className="form-control"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder={t('email_or_phone_placeholder')}
                                    autoComplete="username"
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
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            className="btn btn-primary w-100 py-2"
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {submitting ? '…' : t('login')}
                        </motion.button>
                    </form>

                    <p className="mt-3 mb-0 text-center" style={{ color: 'var(--text-muted)' }}>
                        <Link to="/register" className="text-decoration-none">{t('no_account')}</Link>
                    </p>
                    <p className="mt-2 mb-0 text-center small">
                        <Link to="/admin" className="text-decoration-none" style={{ color: 'var(--text-muted)' }}>{t('admin_portal')} →</Link>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Login;
