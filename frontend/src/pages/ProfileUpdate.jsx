import { useState } from 'react';
import { updateLaborerProfile, updateThekedarProfile } from '../services/api';
import { useLang } from '../context/LanguageContext';

const WORKER_TYPES = ['MISTRI', 'MAZDOOR', 'PLUMBER', 'ELECTRICIAN', 'PAINTER', 'CARPENTER', 'WELDER'];

function ProfileUpdate({ user }) {
    const { t } = useLang();
    const isLaborer = user.role === 'LABORER';

    const [laborerForm, setLaborerForm] = useState({
        workerType: '', experienceYears: '', dailyWage: '', city: '', area: '', pincode: '', availableToday: true
    });

    const [thekedarForm, setThekedarForm] = useState({
        companyName: '', city: '', area: '', pincode: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLaborerSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError(''); setLoading(true);
        try {
            const data = {
                ...laborerForm,
                experienceYears: laborerForm.experienceYears ? parseInt(laborerForm.experienceYears) : null,
                dailyWage: laborerForm.dailyWage ? parseFloat(laborerForm.dailyWage) : null,
            };
            await updateLaborerProfile(user.id, data);
            setMessage(t('profileUpdated'));
        } catch (err) {
            setError(err.response?.data?.error || t('updateFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleThekedarSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError(''); setLoading(true);
        try {
            await updateThekedarProfile(user.id, thekedarForm);
            setMessage(t('profileUpdated'));
        } catch (err) {
            setError(err.response?.data?.error || t('updateFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container dashboard-container">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card-custom fade-in-up">
                        <h4 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>
                            👤 {t('updateProfile')}
                        </h4>

                        {message && <div className="alert alert-success alert-custom">{message}</div>}
                        {error && <div className="alert alert-danger alert-custom">{error}</div>}

                        {isLaborer ? (
                            <form onSubmit={handleLaborerSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">{t('skill')}</label>
                                    <select className="form-select" value={laborerForm.workerType}
                                        onChange={(e) => setLaborerForm({ ...laborerForm, workerType: e.target.value })} required>
                                        <option value="">{t('selectSkill')}</option>
                                        {WORKER_TYPES.map(wt => <option key={wt} value={wt}>{wt}</option>)}
                                    </select>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="form-label">{t('experience')}</label>
                                        <input type="number" className="form-control" placeholder="e.g. 5"
                                            value={laborerForm.experienceYears}
                                            onChange={(e) => setLaborerForm({ ...laborerForm, experienceYears: e.target.value })} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">{t('dailyWage')}</label>
                                        <input type="number" className="form-control" placeholder="e.g. 800"
                                            value={laborerForm.dailyWage}
                                            onChange={(e) => setLaborerForm({ ...laborerForm, dailyWage: e.target.value })} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{t('pincode')}</label>
                                    <input type="text" className="form-control" placeholder="e.g. 110001"
                                        value={laborerForm.pincode}
                                        onChange={(e) => setLaborerForm({ ...laborerForm, pincode: e.target.value })} required />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="form-label">{t('city')}</label>
                                        <input type="text" className="form-control" placeholder="e.g. Delhi"
                                            value={laborerForm.city}
                                            onChange={(e) => setLaborerForm({ ...laborerForm, city: e.target.value })} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">{t('area')}</label>
                                        <input type="text" className="form-control" placeholder="e.g. Karol Bagh"
                                            value={laborerForm.area}
                                            onChange={(e) => setLaborerForm({ ...laborerForm, area: e.target.value })} />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="availableToday"
                                            checked={laborerForm.availableToday}
                                            onChange={(e) => setLaborerForm({ ...laborerForm, availableToday: e.target.checked })} />
                                        <label className="form-check-label" htmlFor="availableToday" style={{ color: 'var(--text-secondary)' }}>
                                            {t('availableToday')}
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary-custom" disabled={loading}>
                                    {loading ? t('saving') : t('saveProfile')}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleThekedarSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">{t('companyName')}</label>
                                    <input type="text" className="form-control" placeholder="e.g. Raj Constructions"
                                        value={thekedarForm.companyName}
                                        onChange={(e) => setThekedarForm({ ...thekedarForm, companyName: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{t('pincode')}</label>
                                    <input type="text" className="form-control" placeholder="e.g. 110001"
                                        value={thekedarForm.pincode}
                                        onChange={(e) => setThekedarForm({ ...thekedarForm, pincode: e.target.value })} required />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="form-label">{t('city')}</label>
                                        <input type="text" className="form-control" placeholder="e.g. Delhi"
                                            value={thekedarForm.city}
                                            onChange={(e) => setThekedarForm({ ...thekedarForm, city: e.target.value })} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">{t('area')}</label>
                                        <input type="text" className="form-control" placeholder="e.g. Karol Bagh"
                                            value={thekedarForm.area}
                                            onChange={(e) => setThekedarForm({ ...thekedarForm, area: e.target.value })} />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary-custom" disabled={loading}>
                                    {loading ? t('saving') : t('saveProfile')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileUpdate;
