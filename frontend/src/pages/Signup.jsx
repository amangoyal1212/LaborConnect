import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../services/api';
import { useLang } from '../context/LanguageContext';

function Signup({ onLogin }) {
    const { t, lang, toggleLang } = useLang();
    const [form, setForm] = useState({ phone: '', name: '', password: '', role: 'LABORER' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await signup(form);
            onLogin(res.data);
        } catch (err) {
            setError(err.response?.data?.error || t('signupFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card fade-in-up">
                {/* Language Toggle */}
                <div className="auth-lang-toggle">
                    <button className="auth-lang-btn" onClick={toggleLang}>
                        🌐 {lang === 'en' ? 'हिंदी में देखें' : 'View in English'}
                    </button>
                </div>

                <h2>⚡ {t('appName')}</h2>
                <p className="subtitle">{t('createYourAccount')}</p>

                {error && <div className="alert alert-danger alert-custom">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">{t('fullName')}</label>
                        <input type="text" className="form-control" name="name" placeholder={t('enterName')}
                            value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">{t('phone')}</label>
                        <input type="text" className="form-control" name="phone" placeholder={t('enterPhone')}
                            value={form.phone} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">{t('password')}</label>
                        <input type="password" className="form-control" name="password" placeholder={t('createPassword')}
                            value={form.password} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">{t('iAmA')}</label>
                        <div className="d-flex gap-3">
                            <button type="button"
                                className={`btn flex-fill ${form.role === 'LABORER' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
                                onClick={() => setForm({ ...form, role: 'LABORER' })} style={{ width: 'auto' }}>
                                🔨 {t('laborer')}
                            </button>
                            <button type="button"
                                className={`btn flex-fill ${form.role === 'THEKEDAR' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
                                onClick={() => setForm({ ...form, role: 'THEKEDAR' })} style={{ width: 'auto' }}>
                                🏗️ {t('thekedar')}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary-custom mb-3" disabled={loading}>
                        {loading ? t('creatingAccount') : t('createAccount')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {t('haveAccount')}{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('signIn')}</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
