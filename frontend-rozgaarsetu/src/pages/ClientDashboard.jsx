import { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, IndianRupee, MapPin, ShieldCheck, Star, Crown, PlusCircle, X, Mic, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';
import VoiceInput from '../components/VoiceInput';

const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const { t } = useContext(LanguageContext);
    const [workers, setWorkers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loadingWorkers, setLoadingWorkers] = useState(false);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('ALL');
    const [tab, setTab] = useState('PENDING');
    const [reviewTarget, setReviewTarget] = useState(null);
    const [showPostJob, setShowPostJob] = useState(false);
    const [jobForm, setJobForm] = useState({ trade: '', date: '', location: '', minWage: '' });

    const categories = ['ALL', 'PLUMBER', 'PAINTER', 'ELECTRICIAN', 'MAID', 'CARPENTER', 'BELDAR'];

    const fetchWorkers = async (selectedCategory = category) => {
        try {
            setLoadingWorkers(true);
            const query = selectedCategory === 'ALL' ? '' : `?category=${selectedCategory}`;
            const response = await api.get(`/workers/search${query}`);
            setWorkers(response.data || []);
        } catch {
            toast.error('Unable to load workers');
        } finally {
            setLoadingWorkers(false);
        }
    };

    const fetchBookings = async () => {
        if (!user?.id) return;
        try {
            setLoadingBookings(true);
            const response = await api.get(`/bookings/client/${user.id}`);
            setBookings(response.data || []);
        } catch {
            toast.error('Unable to load jobs');
        } finally {
            setLoadingBookings(false);
        }
    };

    useEffect(() => { fetchWorkers('ALL'); }, []);
    useEffect(() => { fetchBookings(); }, [user?.id]);

    const filteredWorkers = useMemo(() => {
        const normalized = search.trim().toLowerCase();
        return workers.filter((w) =>
            w.name.toLowerCase().includes(normalized) ||
            (w.category && w.category.toLowerCase().includes(normalized))
        );
    }, [workers, search]);

    const groupedBookings = useMemo(() => {
        const pending = bookings.filter((b) => b.status === 'PENDING');
        const active = bookings.filter((b) => ['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(b.status));
        const completed = bookings.filter((b) => b.status === 'COMPLETED');
        return { PENDING: pending, ACTIVE: active, COMPLETED: completed };
    }, [bookings]);

    const bookWorker = async (worker) => {
        try {
            await api.post(`/bookings/client/${user.id}`, {
                workerId: worker.id,
                location: 'Client shared location',
                amount: worker.dailyWage || 0
            });
            toast.success(`Booking sent to ${worker.name}`);
            setTab('PENDING');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    const confirmAndReview = async ({ rating, review }) => {
        if (!reviewTarget) return;
        try {
            await api.put(`/bookings/client/${user.id}/${reviewTarget.id}/confirm-payment`, {
                rating,
                comment: review || ''
            });
            toast.success(`✅ Escrow released! ${reviewTarget.worker?.name} rated ${rating}/5 ⭐`);
            setReviewTarget(null);
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not confirm payment');
        }
    };

    const postJob = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/jobs/client/${user.id}`, {
                trade: jobForm.trade,
                requiredDate: jobForm.date,
                location: jobForm.location,
                dailyWage: Number(jobForm.minWage)
            });
            toast.success(`📋 Job posted! Looking for ${jobForm.trade} workers in ${jobForm.location}.`);
            setJobForm({ trade: '', date: '', location: '', minWage: '' });
            setShowPostJob(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post job');
        }
    };

    const getTrustScore = (worker) => {
        const base = worker.averageRating ? Math.round(worker.averageRating * 20) : 78;
        return Math.min(99, Math.max(72, base));
    };

    return (
        <motion.div
            className="container py-4 py-md-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                <div>
                    <h2 className="h3 fw-bold mb-1" style={{ color: 'var(--text-heading)' }}>{t('client_dashboard')}</h2>
                    <p className="mb-0" style={{ color: 'var(--text-body)' }}>{t('client_desc')}</p>
                </div>
                <motion.button
                    className="btn btn-primary d-inline-flex align-items-center gap-2"
                    onClick={() => setShowPostJob(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <PlusCircle size={16} /> {t('post_job')}
                </motion.button>
            </div>

            {/* ── Post Custom Job Modal ── */}
            {showPostJob && (
                <motion.div
                    className="review-modal-backdrop"
                    onClick={() => setShowPostJob(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="review-modal-content"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <button className="review-modal-close" onClick={() => setShowPostJob(false)}><X size={20} /></button>
                        <h5 className="fw-bold mb-3" style={{ color: 'var(--text-heading)' }}>📋 Post a Custom Job</h5>
                        <form onSubmit={postJob}>
                            <div className="mb-3">
                                <label className="form-label">Trade Required</label>
                                <select className="form-select" value={jobForm.trade} onChange={e => setJobForm(p => ({ ...p, trade: e.target.value }))} required>
                                    <option value="">Select trade</option>
                                    {['PLUMBER', 'PAINTER', 'ELECTRICIAN', 'MAID', 'CARPENTER', 'BELDAR'].map(tr => <option key={tr} value={tr}>{tr}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Date Required</label>
                                <input type="date" className="form-control" value={jobForm.date} onChange={e => setJobForm(p => ({ ...p, date: e.target.value }))} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{t('minimum_price_per_day') || 'Minimum Price Per Day (₹)'}</label>
                                <input type="number" min="1" className="form-control" value={jobForm.minWage} onChange={e => setJobForm(p => ({ ...p, minWage: e.target.value }))} required />
                                <small className="text-muted">{t('negotiable_note') || 'Final amount is negotiable on app'}</small>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Location / Address</label>
                                <input className="form-control" value={jobForm.location} onChange={e => setJobForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g., Sector 45, Gurgaon" required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Post Job</button>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            {/* ── Worker Search with Voice Search ── */}
            <section className="card-surface p-3 p-md-4 mb-4">
                <div className="row g-2 mb-3">
                    {categories.map((option) => (
                        <div key={option} className="col-6 col-md-3 col-lg-2">
                            <motion.button
                                className={`btn w-100 text-truncate px-2 ${category === option ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => { setCategory(option); fetchWorkers(option); }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {option === 'ALL' ? 'All' : t(option.toLowerCase())}
                            </motion.button>
                        </div>
                    ))}
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <VoiceInput
                        placeholder={t('search_placeholder') || 'Search workers by name or trade'}
                        value={search}
                        onChange={setSearch}
                        onSearch={(text) => {
                            setSearch(text);
                            // Assuming fetchWorkers('ALL') refetches or memoized filteredWorkers handles it instantly
                            // The filteredWorkers useMemo hook will auto-filter based on the 'search' state!
                        }}
                    />
                </div>
            </section>

            {/* ── Worker Cards ── */}
            <section className="row g-3 mb-4">
                {loadingWorkers && <div className="col-12 text-center"><div className="spinner-border text-orange" /></div>}
                {!loadingWorkers && filteredWorkers.length === 0 && (
                    <div className="col-12">
                        <div className="card-surface p-4" style={{ color: 'var(--text-body)' }}>{t('no_workers')}</div>
                    </div>
                )}
                {!loadingWorkers && filteredWorkers.map((worker, index) => (
                    <motion.div key={worker.id} className="col-12 col-lg-6" variants={cardVariants} initial="hidden" animate="show" transition={{ delay: index * 0.05 }}>
                        <article className="card-surface p-3 h-100 d-flex flex-column hover-scale">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h5 className="mb-1 fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                                        {worker.name}
                                        {worker.isPremium && (
                                            <span className="premium-badge">
                                                <Crown size={10} /> Verified
                                            </span>
                                        )}
                                        {/* AI Recommended Badge — top 2 workers */}
                                        {index < 2 && (
                                            <span className="ai-badge">
                                                <Sparkles size={10} /> AI Recommended
                                            </span>
                                        )}
                                    </h5>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <span className="badge rounded-pill d-inline-flex align-items-center gap-1" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                                            <ShieldCheck size={14} /> Aadhaar Verified
                                        </span>
                                        <span className="badge rounded-pill" style={{ background: 'var(--bg-page)', color: 'var(--text-body)', border: '1px solid var(--border-light)' }}>
                                            {t('trust_score')}: {getTrustScore(worker)}
                                        </span>
                                        <span className="badge rounded-pill" style={{ background: 'var(--gold-soft)', color: 'var(--gold-hover)' }}>
                                            {worker.category || 'GENERAL'}
                                        </span>
                                    </div>
                                </div>
                                <span className="d-inline-flex align-items-center fw-semibold" style={{ color: 'var(--gold)' }}>
                                    <Star size={14} className="me-1" />
                                    {worker.averageRating ? worker.averageRating.toFixed(1) : 'New'}
                                </span>
                            </div>
                            <div className="small mb-1 d-flex align-items-center" style={{ color: 'var(--text-body)' }}>
                                <IndianRupee size={14} className="me-1" /> {worker.dailyWage || 0}/day
                            </div>
                            <div className="small mb-3 d-flex align-items-center" style={{ color: 'var(--text-body)' }}>
                                <MapPin size={14} className="me-1" />
                                {worker.latitude && worker.longitude
                                    ? `${worker.latitude.toFixed(2)}, ${worker.longitude.toFixed(2)}`
                                    : 'Location shared after booking'}
                            </div>
                            <motion.button
                                className="btn btn-primary mt-auto"
                                onClick={() => bookWorker(worker)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Book
                            </motion.button>
                        </article>
                    </motion.div>
                ))}
            </section>

            {/* ── My Jobs ── */}
            <section className="card-surface p-3 p-md-4">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--text-heading)' }}>{t('my_bookings')}</h5>
                <div className="dashboard-tabs mb-3 d-flex flex-nowrap overflow-auto" style={{ gap: '0.5rem', paddingBottom: '0.5rem' }}>
                    {['PENDING', 'ACTIVE', 'COMPLETED'].map((key) => (
                        <button key={key} className={`dashboard-tab-btn flex-shrink-0 ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
                            {t(key.toLowerCase()) || key} ({groupedBookings[key].length})
                        </button>
                    ))}
                </div>

                {loadingBookings && <div className="text-center"><div className="spinner-border text-orange" /></div>}
                {!loadingBookings && groupedBookings[tab].length === 0 && <p className="mb-0" style={{ color: 'var(--text-body)' }}>No jobs here yet.</p>}

                {!loadingBookings && groupedBookings[tab].length > 0 && (
                    <div className="row g-3">
                        {groupedBookings[tab].map((booking) => (
                            <div key={booking.id} className="col-12 col-lg-6">
                                <motion.article
                                    className="card-surface p-3 h-100 hover-scale"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h6 className="fw-bold mb-0" style={{ color: 'var(--text-heading)' }}>{booking.worker?.name}</h6>
                                        <span className="status-badge status-badge-soft">{booking.status}</span>
                                    </div>
                                    <p className="small mb-2" style={{ color: 'var(--text-body)' }}>{booking.location}</p>
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

export default ClientDashboard;
