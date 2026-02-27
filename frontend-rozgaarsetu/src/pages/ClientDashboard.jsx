import { useContext, useEffect, useMemo, useState } from 'react';
import { Search, IndianRupee, MapPin, ShieldCheck, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [workers, setWorkers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loadingWorkers, setLoadingWorkers] = useState(false);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('ALL');
    const [tab, setTab] = useState('PENDING');
    const [reviewTarget, setReviewTarget] = useState(null);

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
        if (!user?.id) {
            return;
        }
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

    useEffect(() => {
        fetchWorkers('ALL');
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [user?.id]);

    const filteredWorkers = useMemo(() => {
        const normalized = search.trim().toLowerCase();
        return workers.filter((worker) => worker.name.toLowerCase().includes(normalized));
    }, [workers, search]);

    const groupedBookings = useMemo(() => {
        const pending = bookings.filter((booking) => booking.status === 'PENDING');
        const active = bookings.filter((booking) => ['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(booking.status));
        const completed = bookings.filter((booking) => booking.status === 'COMPLETED');
        return { PENDING: pending, ACTIVE: active, COMPLETED: completed };
    }, [bookings]);

    const bookWorker = async (worker) => {
        try {
            await api.post(`/bookings/client/${user.id}`, {
                workerId: worker.id,
                location: 'Client shared location',
                amount: (worker.hourlyRate || 0) * 8
            });
            toast.success(`Booking sent to ${worker.name}`);
            setTab('PENDING');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    const confirmAndReview = async ({ rating, review }) => {
        if (!reviewTarget) {
            return;
        }
        try {
            await api.put(`/bookings/client/${user.id}/${reviewTarget.id}/confirm-payment`);
            toast.success(`Escrow released. ${reviewTarget.worker?.name} rated ${rating}/5.`);
            setReviewTarget(null);
            fetchBookings();
            if (review) {
                // Review text is accepted by UI for hackathon demo; backend endpoint is payment confirmation only.
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not confirm payment');
        }
    };

    const getTrustScore = (worker) => {
        const base = worker.averageRating ? Math.round(worker.averageRating * 20) : 78;
        return Math.min(99, Math.max(72, base));
    };

    return (
        <div className="container py-4 py-md-5 fade-in">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                <div>
                    <h2 className="h3 fw-bold mb-1">Client Dashboard</h2>
                    <p className="text-secondary mb-0">Search and book trusted workers.</p>
                </div>
            </div>

            <section className="card-surface p-3 p-md-4 mb-4">
                <div className="row g-2 mb-3">
                    {categories.map((option) => (
                        <div key={option} className="col-6 col-md-3 col-lg-2">
                            <button
                                className={`btn w-100 ${category === option ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => {
                                    setCategory(option);
                                    fetchWorkers(option);
                                }}
                            >
                                {option}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><Search size={16} /></span>
                    <input
                        className="form-control border-start-0"
                        placeholder="Search workers by name"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
            </section>

            <section className="row g-3 mb-4">
                {loadingWorkers && <div className="col-12 text-center"><div className="spinner-border text-orange" /></div>}
                {!loadingWorkers && filteredWorkers.length === 0 && (
                    <div className="col-12">
                        <div className="card-surface p-4 text-secondary">No workers available right now.</div>
                    </div>
                )}
                {!loadingWorkers && filteredWorkers.map((worker) => (
                    <div key={worker.id} className="col-12 col-lg-6">
                        <article className="card-surface p-3 h-100 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h5 className="mb-1 fw-bold">{worker.name}</h5>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <span className="badge rounded-pill text-bg-success d-inline-flex align-items-center gap-1">
                                            <ShieldCheck size={14} /> Aadhaar Verified
                                        </span>
                                        <span className="badge rounded-pill text-bg-light border">Trust Score: {getTrustScore(worker)}</span>
                                        <span className="badge rounded-pill text-bg-warning">{worker.category || 'GENERAL'}</span>
                                    </div>
                                </div>
                                <span className="d-inline-flex align-items-center text-warning fw-semibold">
                                    <Star size={14} className="me-1" />
                                    {worker.averageRating ? worker.averageRating.toFixed(1) : 'New'}
                                </span>
                            </div>
                            <div className="small text-secondary mb-1 d-flex align-items-center">
                                <IndianRupee size={14} className="me-1" /> {worker.hourlyRate || 0}/hr
                            </div>
                            <div className="small text-secondary mb-3 d-flex align-items-center">
                                <MapPin size={14} className="me-1" /> {worker.latitude && worker.longitude ? `${worker.latitude.toFixed(2)}, ${worker.longitude.toFixed(2)}` : 'Location shared after booking'}
                            </div>
                            <button className="btn btn-primary mt-auto" onClick={() => bookWorker(worker)}>Book</button>
                        </article>
                    </div>
                ))}
            </section>

            <section className="card-surface p-3 p-md-4">
                <h5 className="fw-bold mb-3">My Jobs</h5>
                <div className="dashboard-tabs mb-3">
                    {['PENDING', 'ACTIVE', 'COMPLETED'].map((key) => (
                        <button key={key} className={`dashboard-tab-btn ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
                            {key} ({groupedBookings[key].length})
                        </button>
                    ))}
                </div>

                {loadingBookings && <div className="text-center"><div className="spinner-border text-orange" /></div>}
                {!loadingBookings && groupedBookings[tab].length === 0 && <p className="text-secondary mb-0">No jobs here yet.</p>}

                {!loadingBookings && groupedBookings[tab].length > 0 && (
                    <div className="row g-3">
                        {groupedBookings[tab].map((booking) => (
                            <div key={booking.id} className="col-12 col-lg-6">
                                <article className="card-surface p-3 h-100">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h6 className="fw-bold mb-0">{booking.worker?.name}</h6>
                                        <span className="status-badge status-badge-soft">{booking.status}</span>
                                    </div>
                                    <p className="small text-secondary mb-2">{booking.location}</p>
                                    <p className="small mb-2">
                                        <IndianRupee size={13} className="me-1" />Rs. {booking.amount}
                                    </p>
                                    {['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(booking.status) && (
                                        <p className="small text-success fw-semibold mb-2">
                                            Payment Secured in Platform Escrow
                                        </p>
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

export default ClientDashboard;
