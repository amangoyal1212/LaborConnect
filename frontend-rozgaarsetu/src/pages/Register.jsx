import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Building2, IndianRupee, Lock, Mail, Phone, User, HardHat, CreditCard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { getDashboardRoute } from '../utils/roleRouting';


const workerTrades = ['CARPENTER', 'BELDAR', 'PAINTER', 'PLUMBER', 'ELECTRICIAN', 'MAID'];

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        role: 'CLIENT',
        category: '',
        dailyWage: '',
        organizationName: '',
        gstNumber: '',
        aadharNumber: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const { register } = useContext(AuthContext);
    const { t } = useContext(LanguageContext);
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

        if (formData.email.trim()) {
            payload.email = formData.email.trim().toLowerCase();
        }

        if (formData.aadharNumber.trim()) {
            payload.aadharNumber = formData.aadharNumber.trim();
        }

        if (isWorker) {
            payload.category = formData.category;
            payload.dailyWage = Number(formData.dailyWage);
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
        <motion.div
            className="auth-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="auth-container" style={{ maxWidth: 1060 }}>
                {/* ── White Form Panel (left) ── */}
                <motion.div
                    className="auth-form-panel"
                    style={{ flex: 1.3 }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <h2 className="h3 fw-bold mb-1" style={{ color: 'var(--text-heading)' }}>{t('create_account') || 'Create Account'}</h2>
                    <p style={{ color: 'var(--text-muted)' }} className="mb-4">{t('register_desc') || 'Register as client, contractor, or worker.'}</p>

                    <form onSubmit={submit}>
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <label className="form-label">{t('name')}</label>
                                <div className="input-group">
                                    <span className="input-group-text"><User size={16} /></span>
                                    <input className="form-control" name="name" value={formData.name} onChange={updateField} required />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label">{t('phone')}</label>
                                <div className="input-group">
                                    <span className="input-group-text"><Phone size={16} /></span>
                                    <input className="form-control" name="phone" value={formData.phone} onChange={updateField} required />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label">{t('email')} <small style={{ color: 'var(--text-muted)' }}>(optional)</small></label>
                                <div className="input-group">
                                    <span className="input-group-text"><Mail size={16} /></span>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={updateField} />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label">{t('password')}</label>
                                <div className="input-group">
                                    <span className="input-group-text"><Lock size={16} /></span>
                                    <input type="password" className="form-control" name="password" value={formData.password} onChange={updateField} minLength={6} required />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label">{t('role')}</label>
                                <select className="form-select" name="role" value={formData.role} onChange={updateField}>
                                    <option value="CLIENT">{t('role_client')}</option>
                                    <option value="CONTRACTOR">{t('role_contractor')}</option>
                                    <option value="WORKER">{t('role_worker')}</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label">{t('aadhar_number')} <small style={{ color: 'var(--text-muted)' }}>(optional)</small></label>
                                <div className="input-group">
                                    <span className="input-group-text"><CreditCard size={16} /></span>
                                    <input className="form-control" name="aadharNumber" value={formData.aadharNumber} onChange={updateField} placeholder="12-digit Aadhaar" maxLength={12} />
                                </div>
                            </div>

                            {isWorker && (
                                <>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label">{t('trade') || 'Trade'}</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><Briefcase size={16} /></span>
                                            <select className="form-select" name="category" value={formData.category} onChange={updateField} required>
                                                <option value="">Select trade</option>
                                                {workerTrades.map((trade) => (
                                                    <option key={trade} value={trade}>{t(trade.toLowerCase())}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label">{t('daily_wage')}</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><IndianRupee size={16} /></span>
                                            <input type="number" min="1" className="form-control" name="dailyWage" value={formData.dailyWage} onChange={updateField} required />
                                        </div>
                                    </div>
                                </>
                            )}

                            {isContractor && (
                                <>
                                    <div className="col-12 col-md-8">
                                        <label className="form-label">{t('org_name') || 'Organization Name'}</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><Building2 size={16} /></span>
                                            <input className="form-control" name="organizationName" value={formData.organizationName} onChange={updateField} required />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label className="form-label">{t('gst_optional') || 'GST (Optional)'}</label>
                                        <input className="form-control" name="gstNumber" value={formData.gstNumber} onChange={updateField} />
                                    </div>
                                </>
                            )}
                        </div>

                        <motion.button
                            className="btn btn-primary w-100 mt-4 py-2"
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {submitting ? '…' : t('register')}
                        </motion.button>
                    </form>

                    <p className="mt-3 mb-0 text-center" style={{ color: 'var(--text-muted)' }}>
                        <Link to="/login" className="text-decoration-none">{t('have_account')}</Link>
                    </p>
                </motion.div>

                {/* ── Deep Navy Branded Panel (right) ── */}
                <div className="auth-brand-panel d-none d-md-flex flex-column justify-content-center align-items-center">
                    <div className="h-16 w-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 mx-auto shrink-0 shadow-md" style={{ position: 'relative', zIndex: 1 }}>
                        R
                    </div>
                    <h2 className="fw-bold mb-3">{t('join_rs') || 'Join RozgaarSetu'}</h2>
                    <p className="mb-0">
                        {t('join_desc') || "Create your free account and become part of India's most trusted blue-collar hiring network."}
                    </p>
                    <div style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
                        <HardHat size={48} strokeWidth={1.2} style={{ opacity: 0.3 }} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Register;
