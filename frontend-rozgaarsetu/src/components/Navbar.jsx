import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Globe, LogOut, User, Menu, X, Settings, Search, Bell } from 'lucide-react';

import { getDashboardRoute } from '../utils/roleRouting';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { language, toggleLanguage, t } = useContext(LanguageContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    const closeMobile = () => setMobileOpen(false);

    /* ── Auth-aware NavLinks ── */
    const NavLinks = ({ mobile }) => (
        <>
            {/* ── Language Toggle (always visible) ── */}
            <button
                type="button"
                className={`btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center ${mobile ? 'w-100' : ''}`}
                onClick={() => { toggleLanguage(); if (mobile) closeMobile(); }}
            >
                <Globe size={15} className="me-1" />
                {language === 'en' ? 'हिंदी' : 'Eng'}
            </button>

            {user ? (
                /* ── LOGGED IN: Dashboard, Profile, Settings, Logout ── */
                <>
                    {/* Notification Bell */}
                    <div className="position-relative d-inline-block me-2">
                        <button
                            className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center p-2 border-0"
                            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                        >
                            <Bell size={18} className="text-slate-700" />
                            {user.role === 'WORKER' && (
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                    <span className="visually-hidden">New alerts</span>
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {notifOpen && !mobile && (
                                <motion.div
                                    className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-md border"
                                    style={{ width: '300px', zIndex: 1050 }}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="p-3 border-bottom fw-bold text-slate-800">Notifications</div>
                                    <div className="p-3">
                                        {user.role === 'WORKER' ? (
                                            <div className="small text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 cursor-pointer" style={{ hover: { backgroundColor: '#f1f5f9' } }}>
                                                <span className="fw-bold" style={{ color: '#4f46e5' }}>New job posted near you</span> by Client - Click to view!
                                            </div>
                                        ) : (
                                            <div className="small text-muted text-center py-2">No new notifications</div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Dropdown */}
                    {mobile ? (
                        <>
                            <div className="fw-bold text-slate-800 my-2 px-2 border-top pt-2">Hi, {user.name}</div>
                            <Link className="btn btn-outline-primary btn-sm w-100 text-start mb-2" to={getDashboardRoute(user.role)} onClick={closeMobile}>
                                {t('dashboard')}
                            </Link>
                            <Link className="btn btn-outline-primary btn-sm w-100 text-start mb-2" to="/settings" onClick={closeMobile}>
                                <Settings size={15} className="me-2 d-inline" />Settings
                            </Link>
                            <button type="button" className="btn btn-danger btn-sm w-100 text-start text-white" onClick={handleLogout}>
                                <LogOut size={15} className="me-2 d-inline" />{t('logout')}
                            </button>
                        </>
                    ) : (
                        <div className="position-relative d-inline-block">
                            <div
                                className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold cursor-pointer shadow-sm"
                                style={{ width: 35, height: 35, backgroundColor: '#4f46e5', transition: 'transform 0.2s', ...({ ':hover': { transform: 'scale(1.05)' } }) }}
                                onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-md border overflow-hidden"
                                        style={{ minWidth: '200px', zIndex: 1050 }}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="p-3 border-bottom">
                                            <div className="fw-bold text-slate-800 text-truncate">{user.name}</div>
                                            <div className="small text-muted text-truncate">{user.phone}</div>
                                        </div>
                                        <div className="py-1">
                                            <Link className="dropdown-item d-flex align-items-center py-2 px-3 text-slate-700 dropdown-hover" to={getDashboardRoute(user.role)} onClick={() => setDropdownOpen(false)}>
                                                <User size={16} className="me-2 text-slate-400" /> My Dashboard
                                            </Link>
                                            <Link className="dropdown-item d-flex align-items-center py-2 px-3 text-slate-700 dropdown-hover" to="/settings" onClick={() => setDropdownOpen(false)}>
                                                <Settings size={16} className="me-2 text-slate-400" /> Settings
                                            </Link>
                                        </div>
                                        <div className="border-top py-1">
                                            <button
                                                className="dropdown-item d-flex align-items-center py-2 px-3 text-danger w-100 text-start bg-transparent border-0 dropdown-hover-red"
                                                onClick={handleLogout}
                                            >
                                                <LogOut size={16} className="me-2" /> {t('logout')}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            ) : (
                /* ── LOGGED OUT: Home, Find Workers, Login, Register ── */
                <>
                    <Link
                        className={`btn btn-outline-primary btn-sm ${mobile ? 'w-100' : ''}`}
                        to="/"
                        onClick={closeMobile}
                    >
                        {t('home')}
                    </Link>
                    <Link
                        className={`btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center ${mobile ? 'w-100' : ''}`}
                        to="/login"
                        onClick={closeMobile}
                    >
                        <Search size={15} className="me-1" />
                        {t('find_workers')}
                    </Link>
                    <Link to="/login" className={`btn btn-outline-primary btn-sm ${mobile ? 'w-100' : ''}`} onClick={closeMobile}>
                        {t('login')}
                    </Link>
                    <Link to="/register" className={`btn btn-primary btn-sm ${mobile ? 'w-100' : ''}`} onClick={closeMobile}>
                        {t('register')}
                    </Link>
                </>
            )}
        </>
    );

    return (
        <>
            <nav className="navbar-custom py-2 sticky-top" style={{ zIndex: 1040 }}>
                <div className="container d-flex align-items-center justify-content-between">
                    {/* Brand — Perfect logo fit: no stretch, no squish */}
                    <Link className="d-flex align-items-center text-decoration-none" to="/" style={{ flexShrink: 0 }}>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold shrink-0 shadow-sm">
                                R
                            </div>
                            <span className="text-lg md:text-xl font-extrabold text-slate-800 tracking-tight hidden sm:block">
                                रोजगार<span className="text-orange-600">-Setu</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop actions — pill container */}
                    <div className="d-none d-lg-flex">
                        <div className="navbar-pill-actions">
                            <NavLinks mobile={false} />
                        </div>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="btn btn-outline-primary btn-sm d-lg-none d-flex align-items-center px-2 py-1"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </nav>

            {/* ── Mobile Slide-In Menu ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            className="mobile-menu-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={closeMobile}
                        />
                        <motion.div
                            className="mobile-menu-panel"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="fw-bold" style={{ color: 'var(--text-heading)', fontSize: '1.1rem' }}>Menu</span>
                                <button
                                    className="btn btn-sm"
                                    onClick={closeMobile}
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <NavLinks mobile={true} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
