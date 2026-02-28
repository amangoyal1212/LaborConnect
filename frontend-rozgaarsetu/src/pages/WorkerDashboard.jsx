import { useContext, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Clock3, Crown, FileCheck2, IndianRupee, PlayCircle, ShieldCheck, Star, TrendingUp, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import api from '../services/api';

const WorkerDashboard = () => {
    const { user } = useContext(AuthContext);
    const { t } = useContext(LanguageContext);
    const [bookings, setBookings] = useState([]);
    const [dismissedIds, setDismissedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState('PENDING');
    const [showPremiumNag, setShowPremiumNag] = useState(false);

    // Show premium nag on mount if not premium
    useEffect(() => {
        if (user && user.isPremium === false) {
            setShowPremiumNag(true);
        }
    }, [user?.id]);

    const fetchBookings = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const response = await api.get(`/bookings/worker/${user.id}`);
            setBookings(response.data || []);
        } catch {
            toast.error('Unable to load worker jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, [user?.id]);

    const grouped = useMemo(() => {
        const pending = bookings.filter((b) => b.status === 'PENDING' && !dismissedIds.includes(b.id));
        const active = bookings.filter((b) => ['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(b.status));
        const completed = bookings.filter((b) => b.status === 'COMPLETED');
        return { PENDING: pending, ACTIVE: active, COMPLETED: completed };
    }, [bookings, dismissedIds]);

    /* Monthly earnings: sum of paid completed bookings this calendar month */
    const monthlyEarnings = useMemo(() => {
        const now = new Date();
        return grouped.COMPLETED
            .filter(b => {
                const d = new Date(b.bookingDate);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && b.isPaid;
            })
            .reduce((sum, b) => sum + (b.amount || 0), 0);
    }, [grouped.COMPLETED]);

    const advance = async (bookingId, action) => {
        try {
            let url = `/bookings/worker/${user.id}/${bookingId}/${action}`;
            if (action === 'start') {
                url += '?beforePhotoUrl=https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=500&q=80';
            }
            if (action === 'complete') {
                url += '?afterPhotoUrl=https://images.unsplash.com/photo-1504307651254-35680f356f58?auto=format&fit=crop&w=500&q=80';
            }
            await api.put(url);
            toast.success('Job updated');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const reject = (bookingId) => {
        setDismissedIds((prev) => [...prev, bookingId]);
        toast.info('Request rejected');
    };

    const trustScore = user?.averageRating ? Math.round(user.averageRating * 20) : 80;

    return (
        <motion.div
            className="container py-4 py-md-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* ── Premium Upgrade Nag Modal ── */}
            <AnimatePresence>
                {showPremiumNag && (
                    <motion.div
                        className="review-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="review-modal-content"
                            style={{ textAlign: 'center', maxWidth: 420 }}
                            initial={{ scale: 0.85, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.85, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <Crown size={48} style={{ color: 'var(--gold)', marginBottom: '1rem' }} />
                            <h4 className="fw-bold mb-2" style={{ color: 'var(--text-heading)' }}>Unlock Premium & Get More Jobs!</h4>
                            <p className="mb-1" style={{ color: 'var(--text-body)' }}>Premium workers appear at the <strong>top of search results</strong> and get a verified badge seen by all clients &amp; contractors.</p>
                            <ul className="text-start small mb-3" style={{ paddingLeft: '1.2rem', color: 'var(--text-body)' }}>
                                <li>⭐ Verified Premium badge on your profile</li>
                                <li>📈 Priority ranking in worker search</li>
                                <li>💼 Access to exclusive bulk-hire contracts</li>
                            </ul>
                            <motion.button
                                className="btn w-100 mb-2"
                                onClick={() => { toast.info('Premium plan coming soon! Contact support.'); setShowPremiumNag(false); }}
                                style={{ background: 'linear-gradient(135deg, var(--gold), var(--emerald))', border: 'none', color: '#fff', fontWeight: 600 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Crown size={16} className="me-2" /> Upgrade to Premium — ₹99/month
                            </motion.button>
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => setShowPremiumNag(false)}
                            >
                                Skip for Now
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-4">
                <h2 className="h3 fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                    {t('worker_dashboard')}
                    {user?.isPremium && (
                        <span className="premium-badge">
                            <Crown size={12} /> {t('premium_badge')}
                        </span>
                    )}
                </h2>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="badge rounded-pill d-inline-flex align-items-center gap-1" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                        <ShieldCheck size={14} /> Aadhaar Verified
                    </span>
                    <span className="badge rounded-pill" style={{ background: 'var(--bg-page)', color: 'var(--text-body)', border: '1px solid var(--border-light)' }}>
                        Trust Score: {Math.min(99, Math.max(70, trustScore))}
                    </span>
                    <span className="badge rounded-pill d-inline-flex align-items-center gap-1" style={{ background: 'var(--gold-soft)', color: 'var(--gold-hover)' }}>
                        <Star size={12} /> {user?.averageRating ? user.averageRating.toFixed(1) : 'New'}
                    </span>
                </div>
            </div>

            {/* ── Earnings Summary ── */}
            <section className="card-surface p-3 p-md-4 mb-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-heading)' }}><TrendingUp size={18} /> {t('my_earnings')}</h5>
                <div className="row g-3">
                    <div className="col-6 col-md-3">
                        <div className="card-surface p-3 text-center" style={{ background: 'var(--primary-soft)' }}>
                            <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                                ₹{(user?.totalEarnings || 0).toLocaleString('en-IN')}
                            </div>
                            <small style={{ color: 'var(--text-muted)' }}>{t('total_earnings')}</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card-surface p-3 text-center" style={{ background: 'var(--emerald-soft)' }}>
                            <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--emerald)' }}>
                                ₹{monthlyEarnings.toLocaleString('en-IN')}
                            </div>
                            <small style={{ color: 'var(--text-muted)' }}>{t('this_month')}</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card-surface p-3 text-center">
                            <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--text-heading)' }}>{grouped.COMPLETED.length}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{t('jobs_done')}</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card-surface p-3 text-center">
                            <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--text-heading)' }}>{grouped.ACTIVE.length}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{t('active_jobs')}</small>
                        </div>
                    </div>
                </div>
                {grouped.COMPLETED.length > 0 && (
                    <div className="mt-3">
                        <h6 className="fw-semibold mb-2" style={{ color: 'var(--text-heading)' }}>{t('paid_job_history')}</h6>
                        {grouped.COMPLETED.filter(b => b.isPaid).slice(0, 5).map(b => (
                            <div key={b.id} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <div>
                                    <span className="fw-semibold small" style={{ color: 'var(--text-heading)' }}>{b.client?.name || 'Client'}</span>
                                    <span className="small ms-2" style={{ color: 'var(--text-muted)' }}>· {b.location}</span>
                                </div>
                                <span className="fw-semibold small" style={{ color: 'var(--emerald)' }}>+₹{b.amount}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Job Tabs ── */}
            <section className="card-surface p-3 p-md-4">
                <div className="worker-tab-nav mb-3 d-flex flex-nowrap overflow-auto" style={{ gap: '0.5rem', paddingBottom: '0.5rem' }}>
                    <button className={`worker-tab-btn flex-shrink-0 ${tab === 'PENDING' ? 'active' : ''}`} onClick={() => setTab('PENDING')}>
                        <Briefcase size={15} /> {t('pending')} <span className="worker-tab-count">{grouped.PENDING.length}</span>
                    </button>
                    <button className={`worker-tab-btn flex-shrink-0 ${tab === 'ACTIVE' ? 'active' : ''}`} onClick={() => setTab('ACTIVE')}>
                        <Clock3 size={15} /> {t('active')} <span className="worker-tab-count">{grouped.ACTIVE.length}</span>
                    </button>
                    <button className={`worker-tab-btn flex-shrink-0 ${tab === 'COMPLETED' ? 'active' : ''}`} onClick={() => setTab('COMPLETED')}>
                        <FileCheck2 size={15} /> {t('completed')} <span className="worker-tab-count">{grouped.COMPLETED.length}</span>
                    </button>
                </div>

                {loading && <div className="text-center"><div className="spinner-border text-orange" /></div>}
                {!loading && grouped[tab].length === 0 && <p className="mb-0" style={{ color: 'var(--text-body)' }}>No jobs in this tab.</p>}

                {!loading && grouped[tab].length > 0 && (
                    <div className="row g-3">
                        {grouped[tab].map((booking) => (
                            <div key={booking.id} className="col-12">
                                <motion.article
                                    className="card-surface p-3 hover-scale"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 className="fw-bold mb-1" style={{ color: 'var(--text-heading)' }}>{booking.client?.name || 'Client'}</h6>
                                            <p className="small mb-0" style={{ color: 'var(--text-body)' }}>{booking.location}</p>
                                        </div>
                                        <div className="text-end">
                                            <span className="status-badge status-badge-soft d-block mb-1">{booking.status}</span>
                                            <span className="small fw-semibold" style={{ color: 'var(--emerald)' }}><IndianRupee size={12} />₹{booking.amount}</span>
                                        </div>
                                    </div>
                                    {['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(booking.status) && (
                                        <p className="small fw-semibold mb-2" style={{ color: 'var(--emerald)' }}>Payment Secured in Platform Escrow</p>
                                    )}
                                    {booking.status === 'PENDING' && (
                                        <div className="d-flex gap-2">
                                            <motion.button className="btn btn-primary" onClick={() => advance(booking.id, 'accept')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Accept</motion.button>
                                            <button className="btn btn-outline-secondary" onClick={() => reject(booking.id)}>Reject</button>
                                        </div>
                                    )}
                                    {booking.status === 'ACCEPTED' && (
                                        <motion.button className="btn btn-primary d-inline-flex align-items-center" onClick={() => advance(booking.id, 'start')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <PlayCircle size={16} className="me-1" /> Start
                                        </motion.button>
                                    )}
                                    {booking.status === 'IN_PROGRESS' && (
                                        <motion.button className="btn btn-primary" onClick={() => advance(booking.id, 'complete')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Mark Complete</motion.button>
                                    )}
                                    {booking.status === 'APPROVAL_PENDING' && (
                                        <p className="small mb-0" style={{ color: 'var(--text-body)' }}>⏳ Waiting for client verification and escrow release.</p>
                                    )}
                                </motion.article>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </motion.div>
    );
};

export default WorkerDashboard;
