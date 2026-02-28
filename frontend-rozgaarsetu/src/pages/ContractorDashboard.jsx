import { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Crown, IndianRupee, MapPin, ShieldCheck, Star, TrendingUp, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';

const PLATFORM_FEE_PER_WORKER = 50;

const ContractorDashboard = () => {
    const { user } = useContext(AuthContext);
    const { t } = useContext(LanguageContext);
    const [bookings, setBookings] = useState([]);
    const [trade, setTrade] = useState('');
    const [count, setCount] = useState('');
    const [location, setLocation] = useState('');
    const [fixedSalary, setFixedSalary] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [tab, setTab] = useState('ACTIVE');
    const [reviewTarget, setReviewTarget] = useState(null);
    const [totalHired, setTotalHired] = useState(0);

    const fetchBookings = async () => {
        if (!user?.id) return;
        try {
            const response = await api.get(`/bookings/client/${user.id}`);
            const data = response.data || [];
            setBookings(data);
            setTotalHired(data.length);
        } catch {
            toast.error('Unable to load contractor jobs');
        }
    };

    useEffect(() => { fetchBookings(); }, [user?.id]);

    const groupedBookings = useMemo(() => {
        const pending = bookings.filter((b) => b.status === 'PENDING');
        const active = bookings.filter((b) => ['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(b.status));
        const completed = bookings.filter((b) => b.status === 'COMPLETED');
        return { PENDING: pending, ACTIVE: active, COMPLETED: completed };
    }, [bookings]);

    const siteGroups = useMemo(() => {
        const map = new Map();
        bookings.forEach((b) => {
            const key = b.location || 'Unassigned Site';
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(b);
        });
        return Array.from(map.entries());
    }, [bookings]);

    const totalSpent = useMemo(() =>
        bookings.filter(b => b.isPaid).reduce((sum, b) => sum + (b.amount || 0), 0),
        [bookings]);

    const platformFee = totalHired * PLATFORM_FEE_PER_WORKER;

    const bulkHire = async (event) => {
        event.preventDefault();
        const needed = Number(count);
        if (!trade || !needed || !location.trim()) {
            toast.error('Trade, worker count, and location are required');
            return;
        }
        try {
            setSubmitting(true);
            const jobData = {
                trade: trade,
                location: location.trim(),
                requiredWorkers: needed,
                fixedSalary: Number(fixedSalary)
            };

            await api.post(`/jobs/client/${user.id}`, jobData);

            const fee = needed * PLATFORM_FEE_PER_WORKER;
            toast.success(`🏗️ Bulk hiring job for ${needed} workers posted! Platform fee: ₹${fee}`);
            setTrade(''); setCount(''); setLocation(''); setFixedSalary('');
            setTab('PENDING');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk dispatch failed');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmAndReview = async ({ rating, review }) => {
        if (!reviewTarget) return;
        try {
            await api.put(`/bookings/client/${user.id}/${reviewTarget.id}/confirm-payment`, {
                rating,
                comment: review || ''
            });
            toast.success(`Escrow released. Rated ${reviewTarget.worker?.name} ${rating}/5.`);
            setReviewTarget(null);
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not release escrow');
        }
    };

    const trustScore = (worker) => {
        const base = worker?.averageRating ? Math.round(worker.averageRating * 20) : 76;
        return Math.min(99, Math.max(70, base));
    };

    return (
        <motion.div
            className="container py-4 py-md-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="d-flex align-items-center gap-3 mb-4">
                <div className="contractor-org-badge"><Building2 size={20} /></div>
                <div>
                    <h2 className="h3 fw-bold mb-1" style={{ color: 'var(--text-heading)' }}>{t('contractor_dashboard')}</h2>
                    <p className="mb-0" style={{ color: 'var(--text-body)' }}>{t('contractor_desc')}</p>
                </div>
            </div>

            {/* ── Stats Banner ── */}
            <section className="card-surface p-3 p-md-4 mb-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-heading)' }}><TrendingUp size={18} /> {t('platform_fee') ? 'Platform Statistics' : 'Platform Statistics'}</h5>
                <div className="row g-3">
                    <div className="col-6 col-md-3">
                        <div className="card-surface p-3 text-center" style={{ background: 'var(--primary-soft)' }}>
                            <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{totalHired}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{t('total_hired')}</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card-surface p-3 text-center" style={{ background: 'var(--emerald-soft)' }}>
                            <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--emerald)' }}>₹{totalSpent.toLocaleString('en-IN')}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{t('total_spent')}</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card-surface p-3 text-center" style={{ background: 'var(--gold-soft)' }}>
                            <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--gold-hover)' }}>₹{platformFee.toLocaleString('en-IN')}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{t('platform_fee')} (₹50/worker)</small>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card-surface p-3 text-center">
                            <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--text-heading)' }}>{siteGroups.length}</div>
                            <small style={{ color: 'var(--text-muted)' }}>Active Sites</small>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Bulk Hiring ── */}
            <section className="card-surface p-3 p-md-4 mb-4">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--text-heading)' }}>{t('bulk_hiring')}</h5>
                <form onSubmit={bulkHire} className="row g-3">
                    <div className="col-12 col-md-4">
                        <label className="form-label">{t('trade') || 'Trade'}</label>
                        <select className="form-select" value={trade} onChange={(e) => setTrade(e.target.value)} required>
                            <option value="">Select trade</option>
                            {['PLUMBER', 'PAINTER', 'ELECTRICIAN', 'MAID', 'CARPENTER', 'BELDAR'].map(o => (
                                <option key={o} value={o}>{t(o.toLowerCase()) || o}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-6 col-md-2">
                        <label className="form-label">Workers</label>
                        <input className="form-control" type="number" min="1" max="50" value={count} onChange={(e) => setCount(e.target.value)} required />
                    </div>
                    <div className="col-6 col-md-4">
                        <label className="form-label">Site Location</label>
                        <input className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </div>
                    <div className="col-6 col-md-4">
                        <label className="form-label">Fixed Salary (₹)</label>
                        <input className="form-control" type="number" min="1" value={fixedSalary} onChange={(e) => setFixedSalary(e.target.value)} required />
                    </div>
                    <div className="col-12 col-md-2 d-flex align-items-end">
                        <motion.button className="btn btn-primary w-100" type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            {submitting ? 'Sending...' : 'Dispatch'}
                        </motion.button>
                    </div>
                </form>
                {count > 0 && (
                    <p className="small mt-2" style={{ color: 'var(--text-muted)' }}>
                        💡 {t('platform_fee')} for {count} worker(s): <strong>₹{Number(count) * PLATFORM_FEE_PER_WORKER}</strong>
                    </p>
                )}
            </section>

            {/* ── My Sites ── */}
            <section className="card-surface p-3 p-md-4 mb-4">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--text-heading)' }}>My Sites</h5>
                {siteGroups.length === 0 && <p className="mb-0" style={{ color: 'var(--text-body)' }}>No active sites.</p>}
                {siteGroups.length > 0 && (
                    <div className="row g-3">
                        {siteGroups.map(([siteName, siteBookings]) => (
                            <div key={siteName} className="col-12 col-lg-6">
                                <motion.article
                                    className="card-surface p-3 h-100 hover-scale"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="fw-bold mb-0 d-flex align-items-center" style={{ color: 'var(--text-heading)' }}><MapPin size={15} className="me-2" />{siteName}</h6>
                                        <span className="site-worker-count"><Users size={14} className="me-1" />{siteBookings.length}</span>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {siteBookings.slice(0, 5).map((b) => (
                                            <span key={b.id} className="badge" style={{ background: 'var(--bg-page)', color: 'var(--text-body)', border: '1px solid var(--border-light)' }}>
                                                {b.worker?.name || 'Worker'}
                                                {b.worker?.isPremium && <Crown size={10} className="ms-1" style={{ color: 'var(--gold-hover)' }} />}
                                            </span>
                                        ))}
                                    </div>
                                </motion.article>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Job Pipeline ── */}
            <section className="card-surface p-3 p-md-4">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--text-heading)' }}>{t('job_pipeline')}</h5>
                <div className="dashboard-tabs mb-3 d-flex flex-nowrap overflow-auto" style={{ gap: '0.5rem', paddingBottom: '0.5rem' }}>
                    {['PENDING', 'ACTIVE', 'COMPLETED'].map((key) => (
                        <button key={key} className={`dashboard-tab-btn flex-shrink-0 ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
                            {t(key.toLowerCase()) || key} ({groupedBookings[key].length})
                        </button>
                    ))}
                </div>
                {groupedBookings[tab].length === 0 && <p className="mb-0" style={{ color: 'var(--text-body)' }}>No jobs in this tab.</p>}
                {groupedBookings[tab].length > 0 && (
                    <div className="row g-3">
                        {groupedBookings[tab].map((booking) => (
                            <div key={booking.id} className="col-12 col-xl-6">
                                <motion.article
                                    className="card-surface p-3 h-100 hover-scale"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 className="fw-bold mb-1 d-flex align-items-center gap-1" style={{ color: 'var(--text-heading)' }}>
                                                {booking.worker?.name}
                                                {booking.worker?.isPremium && (
                                                    <span className="premium-badge">
                                                        <Crown size={10} /> Premium
                                                    </span>
                                                )}
                                            </h6>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <span className="badge rounded-pill d-inline-flex align-items-center gap-1" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                                                    <ShieldCheck size={14} /> Aadhaar Verified
                                                </span>
                                                <span className="badge rounded-pill" style={{ background: 'var(--bg-page)', color: 'var(--text-body)', border: '1px solid var(--border-light)' }}>Trust Score: {trustScore(booking.worker)}</span>
                                                <span className="badge rounded-pill d-inline-flex align-items-center gap-1" style={{ background: 'var(--gold-soft)', color: 'var(--gold-hover)' }}>
                                                    <Star size={12} /> {booking.worker?.averageRating ? booking.worker.averageRating.toFixed(1) : 'New'}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="status-badge status-badge-soft">{booking.status}</span>
                                    </div>
                                    <p className="small mb-1" style={{ color: 'var(--text-body)' }}>{booking.location}</p>
                                    <p className="small mb-2"><IndianRupee size={13} className="me-1" />Rs. {booking.amount}</p>
                                    {['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(booking.status) && (
                                        <p className="small fw-semibold mb-2" style={{ color: 'var(--emerald)' }}>Payment Secured in Platform Escrow</p>
                                    )}
                                    {booking.status === 'APPROVAL_PENDING' && (
                                        <motion.button
                                            className="btn btn-sm"
                                            onClick={() => setReviewTarget(booking)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{ background: 'linear-gradient(135deg, var(--emerald), var(--emerald-hover))', color: '#fff', border: 'none', fontWeight: 600 }}
                                        >
                                            {t('confirm_payment')}
                                        </motion.button>
                                    )}
                                </motion.article>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <ReviewModal
                show={Boolean(reviewTarget)}
                workerName={reviewTarget?.worker?.name || ''}
                onSubmit={confirmAndReview}
            />
        </motion.div>
    );
};

export default ContractorDashboard;
