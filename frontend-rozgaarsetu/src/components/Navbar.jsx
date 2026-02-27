import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Globe, LogOut, User } from 'lucide-react';
import logo from '../assets/logo.jpeg';
import { getDashboardRoute } from '../utils/roleRouting';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { language, toggleLanguage } = useContext(LanguageContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-custom py-2 sticky-top">
            <div className="container d-flex align-items-center">
                {/* Brand — logo only (image contains brand text) */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img
                        src={logo}
                        alt="रोजगार-Setu"
                        style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
                        className="rounded"
                    />
                </Link>

                {/* Right actions */}
                <div className="d-flex align-items-center gap-2 ms-auto">
                    {user && (
                        <>
                            <Link className="btn btn-outline-primary btn-sm" to={getDashboardRoute(user.role)}>
                                Dashboard
                            </Link>
                            <Link className="btn btn-outline-primary btn-sm d-flex align-items-center" to="/profile">
                                <User size={15} className="me-1" />
                                Profile
                            </Link>
                        </>
                    )}
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm d-flex align-items-center"
                        onClick={toggleLanguage}
                    >
                        <Globe size={15} className="me-1" />
                        {language === 'en' ? 'हिंदी' : 'Eng'}
                    </button>
                    {user ? (
                        <button
                            type="button"
                            className="btn btn-primary btn-sm d-flex align-items-center"
                            onClick={handleLogout}
                        >
                            <LogOut size={15} className="me-1" />
                            Logout
                        </button>
                    ) : (
                        <div className="d-flex gap-2">
                            <Link to="/login" className="btn btn-outline-primary btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
