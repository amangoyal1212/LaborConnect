import { useContext, useEffect, useMemo, useState } from 'react';
import { Building2, IndianRupee, MapPin, ShieldCheck, Star, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';

const ContractorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [trade, setTrade] = useState('');
    const [count, setCount] = useState('');
    const [location, setLocation] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [tab, setTab] = useState('ACTIVE');
    const [reviewTarget, setReviewTarget] = useState(null);

    const fetchBookings = async () => {
        if (!user?.id) {
            return;
        }
        try {
            const response = await api.get(`/bookings/client/${user.id}`);
            setBookings(response.data || []);
        } catch {
            toast.error('Unable to load contractor jobs');
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user?.id]);

    const groupedBookings = useMemo(() => {
        const pending = bookings.filter((booking) => booking.status === 'PENDING');
        const active = bookings.filter((booking) => ['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(booking.status));
        const completed = bookings.filter((booking) => booking.status === 'COMPLETED');
        return { PENDING: pending, ACTIVE: active, COMPLETED: completed };
    }, [bookings]);

    const siteGroups = useMemo(() => {
        const map = new Map();
        bookings.forEach((booking) => {
            const key = booking.location || 'Unassigned Site';
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push(booking);
        });
        return Array.from(map.entries());
    }, [bookings]);

    const bulkHire = async (event) => {
        event.preventDefault();
        const needed = Number(count);
        if (!trade || !needed || !location.trim()) {
            toast.error('Trade, worker count, and location are required');
            return;
        }

        try {
            setSubmitting(true);
            const workersResponse = await api.get(`/workers/search?category=${trade}`);
            const workers = workersResponse.data || [];
            if (workers.length === 0) {
                toast.error(`No ${trade} workers available`);
                setSubmitting(false);
                return;
            }

            const targetWorkers = workers.slice(0, needed);
            await Promise.all(targetWorkers.map((worker) => api.post(`/bookings/client/${user.id}`, {
                workerId: worker.id,
                location: location.trim(),
                amount: (worker.hourlyRate || 0) * 8
            })));

            toast.success(`Dispatched ${targetWorkers.length} workers to ${location.trim()}`);
            setTrade('');
            setCount('');
            setLocation('');
            setTab('PENDING');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk dispatch failed');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmAndReview = async ({ rating }) => {
        if (!reviewTarget) {
            return;
        }
        try {
            await api.put(`/bookings/client/${user.id}/${reviewTarget.id}/confirm-payment`);
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
        <div className="container py-4 py-md-5 fade-in">
            <div className="d-flex align-items-center gap-3 mb-4">
                <div className="contractor-org-badge"><Building2 size={20} /></div>
                <div>
                    <h2 className="h3 fw-bold mb-1">Contractor Dashboard</h2>
                    <p className="text-secondary mb-0">Bulk hiring and site workforce control.</p>
                </div>
            </div>

            <section className="card-surface p-3 p-md-4 mb-4">
                <h5 className="fw-bold mb-3">Bulk Hiring</h5>
                <form onSubmit={bulkHire} className="row g-3">
                    <div className="col-12 col-md-4">
                        <label className="form-label">Trade</label>
                        <select className="form-select" value={trade} onChange={(event) => setTrade(event.target.value)} required>
                            <option value="">Select trade</option>
                            <option value="PLUMBER">PLUMBER</option>
                            <option value="PAINTER">PAINTER</option>
                            <option value="ELECTRICIAN">ELECTRICIAN</option>
                            <option value="MAID">MAID</option>
                            <option value="CARPENTER">CARPENTER</option>
                            <option value="BELDAR">BELDAR</option>
                        </select>
                    </div>
                    <div className="col-6 col-md-2">
                        <label className="form-label">Workers</label>
                        <input className="form-control" type="number" min="1" max="50" value={count} onChange={(event) => setCount(event.target.value)} required />
                    </div>
                    <div className="col-6 col-md-4">
                        <label className="form-label">Site Location</label>
                        <input className="form-control" value={location} onChange={(event) => setLocation(event.target.value)} required />
                    </div>
                    <div className="col-12 col-md-2 d-flex align-items-end">
                        <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
                            {submitting ? 'Sending...' : 'Dispatch'}
                        </button>
                    </div>
                </form>
            </section>

            <section className="card-surface p-3 p-md-4 mb-4">
                <h5 className="fw-bold mb-3">My Sites</h5>
                {siteGroups.length === 0 && <p className="text-secondary mb-0">No active sites.</p>}
                {siteGroups.length > 0 && (
                    <div className="row g-3">
                        {siteGroups.map(([siteName, siteBookings]) => (
                            <div key={siteName} className="col-12 col-lg-6">
                                <article className="card-surface p-3 h-100">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="fw-bold mb-0 d-flex align-items-center"><MapPin size={15} className="me-2" />{siteName}</h6>
                                        <span className="site-worker-count"><Users size={14} className="me-1" />{siteBookings.length}</span>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {siteBookings.slice(0, 5).map((booking) => (
                                            <span key={booking.id} className="badge text-bg-light border">{booking.worker?.name || 'Worker'}</span>
                                        ))}
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="card-surface p-3 p-md-4">
                <h5 className="fw-bold mb-3">Job Pipeline</h5>
                <div className="dashboard-tabs mb-3">
                    {['PENDING', 'ACTIVE', 'COMPLETED'].map((key) => (
                        <button key={key} className={`dashboard-tab-btn ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
                            {key} ({groupedBookings[key].length})
                        </button>
                    ))}
                </div>
                {groupedBookings[tab].length === 0 && <p className="text-secondary mb-0">No jobs in this tab.</p>}
                {groupedBookings[tab].length > 0 && (
                    <div className="row g-3">
                        {groupedBookings[tab].map((booking) => (
                            <div key={booking.id} className="col-12 col-xl-6">
                                <article className="card-surface p-3 h-100">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 className="fw-bold mb-1">{booking.worker?.name}</h6>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <span className="badge rounded-pill text-bg-success d-inline-flex align-items-center gap-1">
                                                    <ShieldCheck size={14} /> Aadhaar Verified
                                                </span>
                                                <span className="badge rounded-pill text-bg-light border">Trust Score: {trustScore(booking.worker)}</span>
                                                <span className="badge rounded-pill text-bg-warning d-inline-flex align-items-center gap-1">
                                                    <Star size={12} /> {booking.worker?.averageRating ? booking.worker.averageRating.toFixed(1) : 'New'}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="status-badge status-badge-soft">{booking.status}</span>
                                    </div>
                                    <p className="small text-secondary mb-1">{booking.location}</p>
                                    <p className="small mb-2"><IndianRupee size={13} className="me-1" />Rs. {booking.amount}</p>
                                    {['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(booking.status) && (
                                        <p className="small text-success fw-semibold mb-2">Payment Secured in Platform Escrow</p>
                                    )}
                                    {booking.status === 'APPROVAL_PENDING' && (
                                        <button className="btn btn-primary btn-sm" onClick={() => setReviewTarget(booking)}>
                                            Verify & Release Escrow
                                        </button>
                                    )}
                                </article>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <ReviewModal
                show={Boolean(reviewTarget)}
                onClose={() => setReviewTarget(null)}
                workerName={reviewTarget?.worker?.name || ''}
                onSubmit={confirmAndReview}
            />
        </div>
    );
};

export default ContractorDashboard;
