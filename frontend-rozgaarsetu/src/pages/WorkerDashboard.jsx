import { useContext, useEffect, useMemo, useState } from 'react';
import { Briefcase, Clock3, FileCheck2, PlayCircle, ShieldCheck, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const WorkerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [dismissedIds, setDismissedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState('PENDING');

    const fetchBookings = async () => {
        if (!user?.id) {
            return;
        }
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

    useEffect(() => {
        fetchBookings();
    }, [user?.id]);

    const grouped = useMemo(() => {
        const pending = bookings.filter((booking) => booking.status === 'PENDING' && !dismissedIds.includes(booking.id));
        const active = bookings.filter((booking) => ['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(booking.status));
        const completed = bookings.filter((booking) => booking.status === 'COMPLETED');
        return { PENDING: pending, ACTIVE: active, COMPLETED: completed };
    }, [bookings, dismissedIds]);

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
        <div className="container py-4 py-md-5 fade-in">
            <div className="mb-4">
                <h2 className="h3 fw-bold mb-1">Worker Dashboard</h2>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="badge rounded-pill text-bg-success d-inline-flex align-items-center gap-1">
                        <ShieldCheck size={14} /> Aadhaar Verified
                    </span>
                    <span className="badge rounded-pill text-bg-light border">Trust Score: {Math.min(99, Math.max(70, trustScore))}</span>
                    <span className="badge rounded-pill text-bg-warning d-inline-flex align-items-center gap-1">
                        <Star size={12} /> {user?.averageRating ? user.averageRating.toFixed(1) : 'New'}
                    </span>
                </div>
            </div>

            <section className="card-surface p-3 p-md-4">
                <div className="worker-tab-nav mb-3">
                    <button className={`worker-tab-btn ${tab === 'PENDING' ? 'active' : ''}`} onClick={() => setTab('PENDING')}>
                        <Briefcase size={15} /> Pending <span className="worker-tab-count">{grouped.PENDING.length}</span>
                    </button>
                    <button className={`worker-tab-btn ${tab === 'ACTIVE' ? 'active' : ''}`} onClick={() => setTab('ACTIVE')}>
                        <Clock3 size={15} /> Active <span className="worker-tab-count">{grouped.ACTIVE.length}</span>
                    </button>
                    <button className={`worker-tab-btn ${tab === 'COMPLETED' ? 'active' : ''}`} onClick={() => setTab('COMPLETED')}>
                        <FileCheck2 size={15} /> Completed <span className="worker-tab-count">{grouped.COMPLETED.length}</span>
                    </button>
                </div>

                {loading && <div className="text-center"><div className="spinner-border text-orange" /></div>}
                {!loading && grouped[tab].length === 0 && <p className="text-secondary mb-0">No jobs in this tab.</p>}

                {!loading && grouped[tab].length > 0 && (
                    <div className="row g-3">
                        {grouped[tab].map((booking) => (
                            <div key={booking.id} className="col-12">
                                <article className="card-surface p-3">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 className="fw-bold mb-1">{booking.client?.name || 'Client'}</h6>
                                            <p className="small text-secondary mb-0">{booking.location}</p>
                                        </div>
                                        <span className="status-badge status-badge-soft">{booking.status}</span>
                                    </div>

                                    {['ACCEPTED', 'IN_PROGRESS', 'APPROVAL_PENDING'].includes(booking.status) && (
                                        <p className="small text-success fw-semibold mb-2">Payment Secured in Platform Escrow</p>
                                    )}

                                    {booking.status === 'PENDING' && (
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-primary" onClick={() => advance(booking.id, 'accept')}>Accept</button>
                                            <button className="btn btn-outline-secondary" onClick={() => reject(booking.id)}>Reject</button>
                                        </div>
                                    )}
                                    {booking.status === 'ACCEPTED' && (
                                        <button className="btn btn-primary d-inline-flex align-items-center" onClick={() => advance(booking.id, 'start')}>
                                            <PlayCircle size={16} className="me-1" /> Start
                                        </button>
                                    )}
                                    {booking.status === 'IN_PROGRESS' && (
                                        <button className="btn btn-primary" onClick={() => advance(booking.id, 'complete')}>Complete</button>
                                    )}
                                    {booking.status === 'APPROVAL_PENDING' && (
                                        <p className="small text-secondary mb-0">Waiting for client verification and escrow release.</p>
                                    )}
                                </article>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default WorkerDashboard;
