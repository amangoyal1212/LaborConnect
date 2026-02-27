import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Building2, IndianRupee, Lock, Phone, User, HardHat } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getDashboardRoute } from '../utils/roleRouting';
import logo from '../assets/logo.jpeg';

const workerTrades = ['CARPENTER', 'BELDAR', 'PAINTER', 'PLUMBER', 'ELECTRICIAN', 'MAID'];

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        role: 'CLIENT',
        category: '',
        hourlyRate: '',
        organizationName: '',
        gstNumber: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const isWorker = formData.role === 'WORKER';
    const isContractor = formData.role === 'CONTRACTOR';

    const updateField = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
            role: formData.role,
        };

        if (isWorker) {
            payload.category = formData.category;
            payload.hourlyRate = Number(formData.hourlyRate);
            payload.latitude = 28.6139;
            payload.longitude = 77.209;
        }

        if (isContractor) {
            payload.organizationName = formData.organizationName.trim();
            if (formData.gstNumber.trim()) {
                payload.gstNumber = formData.gstNumber.trim();
            }
        }

        const ok = await register(payload);
        setSubmitting(false);

        if (ok) {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            navigate(getDashboardRoute(storedUser.role));
        }
    };

    return (
        <div className="auth-wrapper fade-in">
            <div className="auth-container" style={{ maxWidth: 1060 }}>
                {/* ── Glass Form Panel (left) ── */}
                <div className="auth-form-panel auth-form-panel-left" style={{ flex: 1.3 }}>
                    <h2 className="h3 fw-bold mb-1 text-charcoal">Create Account</h2>
                    <p className="text-earth-muted mb-4">Register as client, contractor, or worker.</p>

                    <form onSubmit={submit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <div className="input-group">
                                    <span className="input-group-text"><User size={16} /></span>
                                    <input className="form-control" name="name" value={formData.name} onChange={updateField} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Phone</label>
                                <div className="input-group">
                                    <span className="input-group-text"><Phone size={16} /></span>
                                    <input className="form-control" name="phone" value={formData.phone} onChange={updateField} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text"><Lock size={16} /></span>
                                    <input type="password" className="form-control" name="password" value={formData.password} onChange={updateField} minLength={6} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Role</label>
                                <select className="form-select" name="role" value={formData.role} onChange={updateField}>
                                    <option value="CLIENT">Client</option>
                                    <option value="CONTRACTOR">Contractor</option>
                                    <option value="WORKER">Worker</option>
                                </select>
                            </div>

                            {isWorker && (
                                <>
                                    <div className="col-md-6">
                                        <label className="form-label">Trade</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><Briefcase size={16} /></span>
                                            <select className="form-select" name="category" value={formData.category} onChange={updateField} required>
                                                <option value="">Select trade</option>
                                                {workerTrades.map((t) => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Hourly Rate</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><IndianRupee size={16} /></span>
                                            <input type="number" min="1" className="form-control" name="hourlyRate" value={formData.hourlyRate} onChange={updateField} required />
                                        </div>
                                    </div>
                                </>
                            )}

                            {isContractor && (
                                <>
                                    <div className="col-md-8">
                                        <label className="form-label">Organization Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><Building2 size={16} /></span>
                                            <input className="form-control" name="organizationName" value={formData.organizationName} onChange={updateField} required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">GST (Optional)</label>
                                        <input className="form-control" name="gstNumber" value={formData.gstNumber} onChange={updateField} />
                                    </div>
                                </>
                            )}
                        </div>

                        <button className="btn btn-primary w-100 mt-4 py-2" type="submit" disabled={submitting}>
                            {submitting ? 'Creating account…' : 'Register'}
                        </button>
                    </form>

                    <p className="mt-3 mb-0 text-center text-earth-muted">
                        <Link to="/login" className="text-decoration-none">Already have an account? Login</Link>
                    </p>
                </div>

                {/* ── Branded Panel (right) ── */}
                <div className="auth-brand-panel">
                    <img
                        src={logo}
                        alt="RozgaarSetu"
                        style={{ height: 64, marginBottom: '1.5rem', borderRadius: 12, position: 'relative', zIndex: 1 }}
                    />
                    <h2 className="fw-bold mb-3">Join RozgaarSetu</h2>
                    <p className="mb-0">
                        Create your free account and become part of India's most trusted
                        blue-collar hiring network.
                    </p>
                    <div style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
                        <HardHat size={48} strokeWidth={1.2} style={{ opacity: 0.3 }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
