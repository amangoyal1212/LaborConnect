import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { MapPin, Star, IndianRupee, ShieldCheck } from 'lucide-react';

const WorkerCard = ({ worker, onHire }) => {
    const { t } = useContext(LanguageContext);

    return (
        <div className="glass-card p-4 mb-4 d-flex flex-column flex-md-row align-items-md-center gap-4 slide-up">
            <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary border flex-shrink-0"
                style={{ width: '100px', height: '100px', fontSize: '2rem' }}
            >
                {worker.profilePhotoUrl ? (
                    <img src={worker.profilePhotoUrl} alt={worker.name} className="w-100 h-100 rounded-circle object-fit-cover" />
                ) : worker.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-grow-1">
                <div className="d-flex align-items-start justify-content-between mb-2">
                    <div>
                        <h5 className="mb-1 text-navy d-flex align-items-center gap-2">
                            {worker.name}
                            {worker.isVerified && <ShieldCheck size={18} className="text-success" title="Verified Worker" />}
                        </h5>
                        <span className="badge bg-navy mb-2">{t(worker.category.toLowerCase())}</span>
                    </div>
                    <div className="text-end">
                        <div className="d-flex align-items-center text-warning fw-bold fs-5">
                            <Star size={20} className="me-1" />
                            {worker.averageRating > 0 ? worker.averageRating.toFixed(1) : 'New'}
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-3 text-secondary small mb-3">
                    <div className="d-flex align-items-center">
                        <IndianRupee size={16} className="me-1" />
                        <span className="fw-semibold text-orange fs-5">{worker.dailyWage}/day</span>
                    </div>
                    {worker.latitude && worker.longitude && (
                        <div className="d-flex align-items-center">
                            <MapPin size={16} className="me-1" />
                            Loc: {worker.latitude.toFixed(2)}, {worker.longitude.toFixed(2)}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0">
                <button className="btn btn-primary w-100 fs-5 py-2 shadow-sm book-now-btn" onClick={() => onHire(worker)}>
                    Hire Worker
                </button>
            </div>
        </div>
    );
};
const HireWorker = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useContext(LanguageContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const categoryParam = searchParams.get('category') || '';

    useEffect(() => {
        fetchWorkers();
    }, [categoryParam]);

    const fetchWorkers = async () => {
        setLoading(true);
        try {
            const url = categoryParam ? `/workers/search?category=${categoryParam}` : `/workers/search`;
            const response = await api.get(url);
            setWorkers(response.data);
        } catch (error) {
            toast.error('Failed to load workers');
        } finally {
            setLoading(false);
        }
    };

    const handleHire = async (worker) => {
        if (!user) {
            toast.info('Please login as a Client or Contractor to hire.');
            navigate('/login');
            return;
        }
        if (user.role === 'WORKER') {
            toast.error('Workers cannot hire other workers.');
            return;
        }

        try {
            const amount = worker.dailyWage || 0;
            const payload = {
                workerId: worker.id,
                location: 'Customer Provided Location',
                amount
            };
            await api.post(`/bookings/client/${user.id}`, payload);
            toast.success(`Booking request sent to ${worker.name}!`);
            navigate('/dashboard/client');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create booking');
        }
    };

    const handleFilterChange = (e) => {
        const val = e.target.value;
        if (val) {
            setSearchParams({ category: val });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="bg-cream min-vh-100 py-5 fade-in">
            <div className="container">
                <div className="row mb-4 align-items-center">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <h2 className="display-6 fw-bold text-navy mb-2">Client Dashboard</h2>
                        <p className="text-secondary mb-0">Filter by hiring mode and book trusted workers quickly.</p>
                    </div>
                    <div className="col-md-6 d-flex flex-column flex-md-row justify-content-md-end gap-3 align-items-md-center">


                        <select
                            className="form-select glass-card border-0 py-2"
                            style={{ maxWidth: '200px' }}
                            value={categoryParam}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Categories</option>
                            <option value="PLUMBER">{t('plumber')}</option>
                            <option value="PAINTER">{t('painter')}</option>
                            <option value="ELECTRICIAN">{t('electrician')}</option>
                            <option value="MAID">{t('maid')}</option>
                            <option value="BELDAR">{t('beldar')}</option>
                            <option value="CARPENTER">{t('carpenter')}</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-orange" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : workers.length > 0 ? (
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            {workers.map(worker => (
                                <WorkerCard key={worker.id} worker={worker} onHire={handleHire} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-5 glass-card rounded-4 mx-auto" style={{ maxWidth: '600px' }}>
                        <h4 className="text-navy">{t('no_workers')}</h4>
                        <p className="mb-0 text-secondary">Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HireWorker;
