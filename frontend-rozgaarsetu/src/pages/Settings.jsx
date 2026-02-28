import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, Lock, Shield, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { toast } from 'react-toastify';

const Settings = () => {
    const { user } = useContext(AuthContext);
    const { t, language, toggleLanguage } = useContext(LanguageContext);

    const settingsGroups = [
        {
            title: 'Account',
            items: [
                { icon: <User size={18} />, label: 'Edit Profile', desc: 'Update your name, phone, and email', action: () => toast.info('Profile editing coming soon!') },
                { icon: <Lock size={18} />, label: 'Change Password', desc: 'Secure your account with a new password', action: () => toast.info('Password change coming soon!') },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: <Globe size={18} />, label: `Language: ${language === 'en' ? 'English' : 'हिंदी'}`, desc: 'Toggle between English and Hindi', action: toggleLanguage },
                { icon: <Bell size={18} />, label: 'Notifications', desc: 'Manage email and push notifications', action: () => toast.info('Notification settings coming soon!') },
            ]
        },
        {
            title: 'Security',
            items: [
                { icon: <Shield size={18} />, label: 'Aadhaar Verification', desc: user?.aadharNumber ? `Verified: XXXX-${user.aadharNumber.slice(-4)}` : 'Add your Aadhaar for a verified badge', action: () => toast.info('Aadhaar verification coming soon!') },
            ]
        }
    ];

    return (
        <motion.div
            className="container py-4 py-md-5"
            style={{ maxWidth: 640 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h2 className="h3 fw-bold mb-4" style={{ color: 'var(--text-heading)' }}>⚙️ Settings</h2>

            {settingsGroups.map((group) => (
                <section key={group.title} className="mb-4">
                    <h6 className="fw-bold mb-2 text-uppercase" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.06em' }}>{group.title}</h6>
                    <div className="card-surface" style={{ overflow: 'hidden' }}>
                        {group.items.map((item, i) => (
                            <motion.button
                                key={item.label}
                                className="d-flex align-items-center gap-3 w-100 text-start"
                                onClick={item.action}
                                whileHover={{ backgroundColor: 'var(--bg-beige-subtle, var(--bg-page))' }}
                                style={{
                                    padding: '0.85rem 1rem',
                                    border: 'none',
                                    background: 'transparent',
                                    borderBottom: i < group.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'background var(--transition-fast)',
                                }}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: 'var(--primary-soft)', color: 'var(--primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="fw-semibold" style={{ color: 'var(--text-heading)', fontSize: '0.92rem' }}>{item.label}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.desc}</div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </section>
            ))}
        </motion.div>
    );
};

export default Settings;
