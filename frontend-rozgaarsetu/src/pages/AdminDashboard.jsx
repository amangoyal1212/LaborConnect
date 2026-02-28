import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldOff, Crown, Lock, Mail, Users, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { LanguageContext } from '../context/LanguageContext';
import api from '../services/api';

// Hardcoded admin credentials for hackathon demo
const ADMIN_EMAIL = 'admin@rozgaarsetu.com';
const ADMIN_PASSWORD = 'AdminSecret123';

const AdminDashboard = () => {
    const { t } = useContext(LanguageContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminToken, setAdminToken] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suspendTarget, setSuspendTarget] = useState(null);
    const [suspendDuration, setSuspendDuration] = useState('24H');

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            try {
                const res = await api.post('/auth/login', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
                setAdminToken(res.data.token);
                setIsLoggedIn(true);
                toast.success('🔐 Admin access granted');
            } catch {
                toast.error('Backend admin login failed — check if backend is running');
            }
        } else {
            toast.error('Invalid admin credentials');
        }
    };

    const fetchWorkers = async () => {
        if (!adminToken) return;
        setLoading(true);
        try {
            const res = await api.get('/admin/workers', {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setWorkers(res.data || []);
        } catch {
            toast.error('Failed to load worker data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) fetchWorkers();
    }, [isLoggedIn]);

    const suspendWorker = async () => {
        if (!suspendTarget) return;
        try {
            await api.put(`/admin/workers/${suspendTarget.id}/suspend`,
                { duration: suspendDuration },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            toast.success(`Worker ${suspendTarget.name} ${suspendDuration === 'PERMANENT' ? 'terminated' : `suspended for ${suspendDuration}`}`);
            setSuspendTarget(null);
            fetchWorkers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        }
    };

    const reinstateWorker = async (worker) => {
        try {
            await api.put(`/admin/workers/${worker.id}/reinstate`, {},
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            toast.success(`${worker.name} reinstated`);
            fetchWorkers();
        } catch {
            toast.error('Reinstate failed');
        }
    };

    const getStatusColor = (status) => {
        if (!status || status === 'ACTIVE') return { color: 'var(--emerald)', bg: 'var(--emerald-soft)' };
        if (status === 'TERMINATED') return { color: 'var(--danger)', bg: 'var(--danger-soft)' };
        return { color: 'var(--gold-hover)', bg: 'var(--gold-soft)' };
    };

    /* ── Login Screen ── */
    if (!isLoggedIn) {
        return (
            <motion.div
                className="auth-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-container" style={{ maxWidth: 480 }}>
                    <div className="auth-form-panel" style={{ width: '100%' }}>
                        <div className="text-center mb-4">
                            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <Lock size={24} color="#fff" />
                            </div>
                            <h2 className="h4 fw-bold" style={{ color: 'var(--text-heading)' }}>{t('admin_portal')}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>{t('admin_dashboard')}</p>
                        </div>
                        <form onSubmit={handleAdminLogin}>
                            <div className="mb-3">
                                <label className="form-label">Admin Email</label>
                                <div className="input-group">
                                    <span className="input-group-text"><Mail size={16} /></span>
                                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text"><Lock size={16} /></span>
                                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                            </div>
                            <motion.button
                                type="submit"
                                className="btn btn-primary w-100 py-2 fw-semibold"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Access Admin Dashboard
                            </motion.button>
                        </form>
                    </div>
                </div>
            </motion.div>
        );
    }

    /* ── Admin Dashboard ── */
    return (
        <motion.div
            className="container py-4 py-md-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Suspend Modal */}
            <AnimatePresence>
                {suspendTarget && (
                    <motion.div
                        className="review-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="review-modal-content"
                            style={{ maxWidth: 420 }}
                            initial={{ scale: 0.85, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.85, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <button className="review-modal-close" onClick={() => setSuspendTarget(null)}><X size={20} /></button>
                            <AlertTriangle size={36} color="var(--danger)" style={{ marginBottom: '0.75rem' }} />
                            <h5 className="fw-bold mb-2" style={{ color: 'var(--text-heading)' }}>Suspend Worker</h5>
                            <p className="mb-3" style={{ color: 'var(--text-body)' }}>Select suspension duration for <strong>{suspendTarget.name}</strong>:</p>
                            <select className="form-select mb-3" value={suspendDuration} onChange={e => setSuspendDuration(e.target.value)}>
                                <option value="24H">24 Hours</option>
                                <option value="7D">7 Days</option>
                                <option value="PERMANENT">Permanent Termination</option>
                            </select>
                            <div className="d-flex gap-2">
                                <motion.button className="btn flex-fill" style={{ background: 'var(--danger)', color: '#fff', border: 'none' }} onClick={suspendWorker} whileHover={{ scale: 1.02 }}>Confirm</motion.button>
                                <button className="btn btn-outline-secondary flex-fill" onClick={() => setSuspendTarget(null)}>Cancel</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                <div>
                    <h2 className="h3 fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                        <span style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={16} color="#fff" />
                        </span>
                        {t('admin_dashboard')}
                    </h2>
                    <p className="mb-0" style={{ color: 'var(--text-body)' }}>{t('admin_desc')}</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={fetchWorkers}>↻ Refresh</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => setIsLoggedIn(false)}>Sign Out</button>
                </div>
            </div>

            {/* Stats */}
            <section className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="card-surface p-3 text-center">
                        <div className="fw-bold" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>{workers.length}</div>
                        <small className="d-flex align-items-center justify-content-center gap-1" style={{ color: 'var(--text-muted)' }}><Users size={12} /> {t('total_workers')}</small>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card-surface p-3 text-center">
                        <div className="fw-bold" style={{ fontSize: '1.8rem', color: 'var(--emerald)' }}>{workers.filter(w => w.accountStatus === 'ACTIVE').length}</div>
                        <small className="d-flex align-items-center justify-content-center gap-1" style={{ color: 'var(--text-muted)' }}><CheckCircle size={12} /> {t('active')}</small>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card-surface p-3 text-center">
                        <div className="fw-bold" style={{ fontSize: '1.8rem', color: 'var(--gold-hover)' }}>{workers.filter(w => w.isPremium).length}</div>
                        <small className="d-flex align-items-center justify-content-center gap-1" style={{ color: 'var(--text-muted)' }}><Crown size={12} /> {t('premium_badge')}</small>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card-surface p-3 text-center">
                        <div className="fw-bold" style={{ fontSize: '1.8rem', color: 'var(--danger)' }}>{workers.filter(w => w.accountStatus !== 'ACTIVE').length}</div>
                        <small className="d-flex align-items-center justify-content-center gap-1" style={{ color: 'var(--text-muted)' }}><ShieldOff size={12} /> {t('suspended')}</small>
                    </div>
                </div>
            </section>

            {/* Worker Grid */}
            <section className="card-surface p-3 p-md-4">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--text-heading)' }}>{t('worker_management')}</h5>
                {loading && <div className="text-center py-4"><div className="spinner-border text-orange" /></div>}
                {!loading && workers.length === 0 && <p style={{ color: 'var(--text-body)' }}>No workers found.</p>}
                {!loading && workers.length > 0 && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px', minWidth: 760 }}>
                            <thead>
                                <tr style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    <th style={{ padding: '6px 12px', textAlign: 'left' }}>Worker</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'left' }}>Trade</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'center' }}>Trust Score</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'left' }}>Phone / Aadhaar</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'center' }}>Earnings</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workers.map((worker) => {
                                    const { color, bg } = getStatusColor(worker.accountStatus);
                                    const trust = worker.averageRating ? Math.min(99, Math.round(worker.averageRating * 20)) : 75;
                                    return (
                                        <motion.tr
                                            key={worker.id}
                                            style={{ background: 'var(--bg-card)', borderRadius: 10, boxShadow: 'var(--shadow-xs)' }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            whileHover={{ backgroundColor: 'var(--bg-page)' }}
                                        >
                                            <td style={{ padding: '10px 12px' }}>
                                                <div className="fw-semibold d-flex align-items-center gap-1" style={{ color: 'var(--text-heading)' }}>
                                                    {worker.name}
                                                    {worker.isPremium && <Crown size={12} style={{ color: 'var(--gold-hover)' }} />}
                                                </div>
                                                <small style={{ color: 'var(--text-muted)' }}>{worker.email || '—'}</small>
                                            </td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <span className="badge rounded-pill" style={{ background: 'var(--gold-soft)', color: 'var(--gold-hover)' }}>{worker.category || 'N/A'}</span>
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <span className="fw-semibold" style={{ color: trust > 85 ? 'var(--emerald)' : trust > 70 ? 'var(--gold-hover)' : 'var(--danger)' }}>
                                                    {trust}
                                                </span>
                                                <small className="d-block" style={{ color: 'var(--text-muted)' }}>{worker.averageRating ? `⭐ ${worker.averageRating.toFixed(1)}` : 'New'}</small>
                                            </td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <div className="small" style={{ color: 'var(--text-heading)' }}>{worker.phone || '—'}</div>
                                                <div className="small" style={{ color: 'var(--text-muted)' }}>
                                                    {worker.aadharNumber
                                                        ? `XXXX-XXXX-${worker.aadharNumber.slice(-4)}`
                                                        : <span style={{ color: 'var(--danger)' }}>No Aadhaar</span>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <span className="fw-semibold small" style={{ color: 'var(--emerald)' }}>₹{(worker.totalEarnings || 0).toLocaleString('en-IN')}</span>
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, color, background: bg }}>
                                                    {worker.accountStatus || 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                {(!worker.accountStatus || worker.accountStatus === 'ACTIVE') ? (
                                                    <motion.button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => setSuspendTarget(worker)}
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        Suspend
                                                    </motion.button>
                                                ) : (
                                                    <motion.button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => reinstateWorker(worker)}
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        Reinstate
                                                    </motion.button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </motion.div>
    );
};

export default AdminDashboard;
