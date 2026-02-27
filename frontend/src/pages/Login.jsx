import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../services/api';
import { useLang } from '../context/LanguageContext';

function Login({ onLogin }) {
    const { t, lang, toggleLang } = useLang();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login({ phone, password });
            onLogin(res.data);
        } catch (err) {
            setError(err.response?.data?.error || t('loginFailed'));
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
                <p className="subtitle">{t('signInToAccount')}</p>

                {error && <div className="alert alert-danger alert-custom">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">{t('phone')}</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={t('enterPhone')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">{t('password')}</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder={t('enterPassword')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary-custom mb-3" disabled={loading}>
                        {loading ? t('signingIn') : t('signIn')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {t('noAccount')}{' '}
                    <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('signUp')}</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
