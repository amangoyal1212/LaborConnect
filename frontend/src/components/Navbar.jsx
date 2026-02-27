import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

function Navbar({ user, onLogout }) {
    const location = useLocation();
    const { t, lang, toggleLang } = useLang();
    const { isDark, toggleTheme } = useTheme();
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar-custom">
            <div className="navbar-inner container">
                <Link className="navbar-logo" to="/dashboard">
                    <span className="logo-icon">⚡</span>
                    <span className="logo-text">{t('appName')}</span>
                </Link>

                <div className="navbar-links">
                    <Link
                        className={`nav-link-custom ${location.pathname === '/dashboard' ? 'active' : ''}`}
                        to="/dashboard"
                    >
                        <span className="nav-icon">🏠</span>
                        <span className="nav-label">{t('dashboard')}</span>
                    </Link>
                    <Link
                        className={`nav-link-custom ${location.pathname === '/profile' ? 'active' : ''}`}
                        to="/profile"
                    >
                        <span className="nav-icon">👤</span>
                        <span className="nav-label">{t('profile')}</span>
                    </Link>
                    <Link
                        className={`nav-link-custom ${location.pathname === '/chat' ? 'active' : ''}`}
                        to="/chat"
                    >
                        <span className="nav-icon">💬</span>
                        <span className="nav-label">{t('chat')}</span>
                    </Link>
                </div>

                <div className="navbar-right">
                    <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className={`role-chip ${user.role === 'THEKEDAR' ? 'chip-thekedar' : 'chip-laborer'}`}>
                            {user.role === 'THEKEDAR' ? '🏗️' : '🔨'} {user.role === 'THEKEDAR' ? t('thekedar') : t('laborer')}
                        </span>
                    </div>

                    {/* Settings Button */}
                    <div className="settings-wrapper" ref={settingsRef}>
                        <button
                            className="settings-btn"
                            onClick={() => setShowSettings(!showSettings)}
                            aria-label={t('settings')}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </button>

                        {showSettings && (
                            <div className="settings-dropdown">
                                <div className="settings-header">
                                    <span>⚙️</span> {t('settings')}
                                </div>

                                {/* Theme Toggle */}
                                <button className="settings-item" onClick={toggleTheme}>
                                    <span className="settings-item-icon">{isDark ? '☀️' : '🌙'}</span>
                                    <span>{isDark ? t('lightMode') : t('darkMode')}</span>
                                    <span className="settings-toggle">
                                        <span className={`toggle-track ${isDark ? 'active' : ''}`}>
                                            <span className="toggle-thumb" />
                                        </span>
                                    </span>
                                </button>

                                {/* Language Toggle */}
                                <button className="settings-item" onClick={toggleLang}>
                                    <span className="settings-item-icon">🌐</span>
                                    <span>{t('language')}</span>
                                    <span className="lang-chip">{lang === 'en' ? 'EN' : 'हि'}</span>
                                </button>

                                <div className="settings-divider" />

                                {/* Logout */}
                                <button className="settings-item settings-item-danger" onClick={onLogout}>
                                    <span className="settings-item-icon">🚪</span>
                                    <span>{t('logout')}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
