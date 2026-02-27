import { useState } from 'react';
import { createJob, panicButton, createGroup, addLaborerToGroup, assignTask } from '../services/api';
import { useLang } from '../context/LanguageContext';

const WORKER_TYPES = ['MISTRI', 'MAZDOOR', 'PLUMBER', 'ELECTRICIAN', 'PAINTER', 'CARPENTER', 'WELDER'];

function ThekedarDashboard({ user }) {
    const { t } = useLang();
    const [activeTab, setActiveTab] = useState('post-job');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [jobForm, setJobForm] = useState({
        title: '', description: '', requiredWorkerType: '', pincode: '', urgent: false
    });
    const [postedJobs, setPostedJobs] = useState([]);
    const [panicJobId, setPanicJobId] = useState('');
    const [groupForm, setGroupForm] = useState({ name: '', pincode: '' });
    const [createdGroups, setCreatedGroups] = useState([]);
    const [addLaborerForm, setAddLaborerForm] = useState({ groupId: '', laborerId: '' });
    const [taskForm, setTaskForm] = useState({ groupId: '', laborerId: '', description: '' });

    const showMessage = (msg) => { setMessage(msg); setError(''); setTimeout(() => setMessage(''), 4000); };
    const showError = (msg) => { setError(msg); setMessage(''); setTimeout(() => setError(''), 4000); };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const res = await createJob(user.id, jobForm);
            setPostedJobs([res.data, ...postedJobs]);
            showMessage(`Job "${res.data.title}" posted successfully!`);
            setJobForm({ title: '', description: '', requiredWorkerType: '', pincode: '', urgent: false });
        } catch (err) {
            showError(err.response?.data?.error || 'Failed to post job');
        }
    };

    const handlePanic = async (e) => {
        e.preventDefault();
        try {
            const res = await panicButton(panicJobId, user.id);
            showMessage(res.data.message);
            setPanicJobId('');
        } catch (err) {
            showError(err.response?.data?.error || 'Panic failed');
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const res = await createGroup(user.id, groupForm);
            setCreatedGroups([res.data, ...createdGroups]);
            showMessage(`Group "${res.data.name}" created!`);
            setGroupForm({ name: '', pincode: '' });
        } catch (err) {
            showError(err.response?.data?.error || 'Failed to create group');
        }
    };

    const handleAddLaborer = async (e) => {
        e.preventDefault();
        try {
            const res = await addLaborerToGroup(addLaborerForm.groupId, addLaborerForm.laborerId);
            showMessage(res.data.message);
            setAddLaborerForm({ groupId: '', laborerId: '' });
        } catch (err) {
            showError(err.response?.data?.error || 'Failed to add laborer');
        }
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        try {
            await assignTask(taskForm.groupId, {
                laborerId: parseInt(taskForm.laborerId),
                description: taskForm.description
            });
            showMessage(`Task assigned successfully!`);
            setTaskForm({ groupId: '', laborerId: '', description: '' });
        } catch (err) {
            showError(err.response?.data?.error || 'Failed to assign task');
        }
    };

    const tabs = [
        { key: 'post-job', label: `📝 ${t('postJob')}` },
        { key: 'panic', label: `🚨 ${t('panic')}` },
        { key: 'groups', label: `👥 ${t('groups')}` },
        { key: 'tasks', label: `📋 ${t('tasks')}` },
    ];

    return (
        <div className="container dashboard-container">
            {/* Welcome */}
            <div className="welcome-section fade-in-up">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h1>{t('welcome')}, {user.name}! 🏗️</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{t('manageJobs')}</p>
                    </div>
                    <span className="role-badge badge-thekedar">🏗️ {t('thekedar')}</span>
                </div>
            </div>

            {message && <div className="alert alert-success alert-custom fade-in-up">{message}</div>}
            {error && <div className="alert alert-danger alert-custom fade-in-up">{error}</div>}

            {/* Tabs */}
            <div className="d-flex gap-2 mb-4 flex-wrap">
                {tabs.map(tab => (
                    <button key={tab.key}
                        className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ─── Post Job ─────────────────────── */}
            {activeTab === 'post-job' && (
                <div className="row g-4">
                    <div className="col-lg-6 fade-in-up">
                        <div className="card-custom">
                            <h5 style={{ marginBottom: '1.2rem' }}>📝 {t('postNewJob')}</h5>
                            <form onSubmit={handlePostJob}>
                                <div className="mb-3">
                                    <label className="form-label">{t('jobTitle')}</label>
                                    <input type="text" className="form-control" placeholder={t('jobTitlePlaceholder')}
                                        value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{t('description')}</label>
                                    <textarea className="form-control" rows="2" placeholder={t('describeWork')}
                                        value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="form-label">{t('workerType')}</label>
                                        <select className="form-select" value={jobForm.requiredWorkerType}
                                            onChange={(e) => setJobForm({ ...jobForm, requiredWorkerType: e.target.value })} required>
                                            <option value="">{t('selectType')}</option>
                                            {WORKER_TYPES.map(wt => <option key={wt} value={wt}>{wt}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">{t('pincode')}</label>
                                        <input type="text" className="form-control" placeholder="110001"
                                            value={jobForm.pincode} onChange={(e) => setJobForm({ ...jobForm, pincode: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="urgentSwitch"
                                            checked={jobForm.urgent}
                                            onChange={(e) => setJobForm({ ...jobForm, urgent: e.target.checked })} />
                                        <label className="form-check-label" htmlFor="urgentSwitch" style={{ color: 'var(--text-secondary)' }}>
                                            ⚡ {t('markUrgent')}
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary-custom">{t('postJob')}</button>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-6 fade-in-up fade-in-up-delay-1">
                        <div className="section-header">
                            <h4>📑 {t('recentlyPosted')}</h4>
                        </div>
                        {postedJobs.length === 0 ? (
                            <div className="empty-state card-custom">
                                <div className="icon">📑</div>
                                <h5>{t('noJobsPosted')}</h5>
                                <p>{t('postFirstJob')}</p>
                            </div>
                        ) : (
                            postedJobs.map(job => (
                                <div key={job.id} className={`card-custom mb-3 job-card ${job.urgent ? 'urgent' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 style={{ margin: 0 }}>{job.title}</h5>
                                        {job.urgent && <span className="urgent-badge">🚨 {t('urgent')}</span>}
                                    </div>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <span className="worker-type-badge">🔧 {job.requiredWorkerType}</span>
                                        <span className="pincode-badge">📍 {job.pincode}</span>
                                        <span className={`status-badge status-${job.status}`}>{job.status}</span>
                                    </div>
                                    <p className="card-info mt-2 mb-0">{t('jobId')}: {job.id}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* ─── Panic Button ─────────────────── */}
            {activeTab === 'panic' && (
                <div className="row justify-content-center fade-in-up">
                    <div className="col-lg-5">
                        <div className="card-custom" style={{ textAlign: 'center', padding: '2.5rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚨</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>{t('panicButton')}</h4>
                            <p className="card-info mb-4">{t('panicDesc')}</p>
                            <form onSubmit={handlePanic}>
                                <div className="mb-4">
                                    <label className="form-label">{t('jobId')}</label>
                                    <input type="number" className="form-control" placeholder={t('enterJobId')}
                                        value={panicJobId} onChange={(e) => setPanicJobId(e.target.value)} required
                                        style={{ textAlign: 'center', fontSize: '1.2rem' }} />
                                </div>
                                <button type="submit" className="btn btn-panic" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                                    🚨 {t('sendPanicAlert')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Groups ───────────────────────── */}
            {activeTab === 'groups' && (
                <div className="row g-4">
                    <div className="col-lg-4 fade-in-up">
                        <div className="card-custom">
                            <h5 style={{ marginBottom: '1.2rem' }}>👥 {t('createGroup')}</h5>
                            <form onSubmit={handleCreateGroup}>
                                <div className="mb-3">
                                    <label className="form-label">{t('groupName')}</label>
                                    <input type="text" className="form-control" placeholder={t('groupNamePlaceholder')}
                                        value={groupForm.name} onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{t('pincode')}</label>
                                    <input type="text" className="form-control" placeholder="110001"
                                        value={groupForm.pincode} onChange={(e) => setGroupForm({ ...groupForm, pincode: e.target.value })} />
                                </div>
                                <button type="submit" className="btn btn-primary-custom">{t('createGroup')}</button>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-4 fade-in-up fade-in-up-delay-1">
                        <div className="card-custom">
                            <h5 style={{ marginBottom: '1.2rem' }}>➕ {t('addLaborerToGroup')}</h5>
                            <form onSubmit={handleAddLaborer}>
                                <div className="mb-3">
                                    <label className="form-label">{t('groupId')}</label>
                                    <input type="number" className="form-control" placeholder={t('groupId')}
                                        value={addLaborerForm.groupId}
                                        onChange={(e) => setAddLaborerForm({ ...addLaborerForm, groupId: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{t('laborerUserId')}</label>
                                    <input type="number" className="form-control" placeholder={t('laborerId')}
                                        value={addLaborerForm.laborerId}
                                        onChange={(e) => setAddLaborerForm({ ...addLaborerForm, laborerId: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-success-custom" style={{ width: '100%' }}>{t('addToGroup')}</button>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-4 fade-in-up fade-in-up-delay-2">
                        <div className="section-header">
                            <h4>📂 {t('yourGroups')}</h4>
                        </div>
                        {createdGroups.length === 0 ? (
                            <div className="empty-state card-custom">
                                <div className="icon">📂</div>
                                <h5>{t('noGroups')}</h5>
                                <p>{t('createFirstGroup')}</p>
                            </div>
                        ) : (
                            createdGroups.map(g => (
                                <div key={g.id} className="card-custom mb-3">
                                    <h5>{g.name}</h5>
                                    <div className="d-flex gap-2">
                                        <span className="pincode-badge">📍 {g.pincode}</span>
                                        <span className="card-info">ID: {g.id}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* ─── Assign Tasks ─────────────────── */}
            {activeTab === 'tasks' && (
                <div className="row justify-content-center fade-in-up">
                    <div className="col-lg-6">
                        <div className="card-custom">
                            <h5 style={{ marginBottom: '1.2rem' }}>📋 {t('assignTask')}</h5>
                            <form onSubmit={handleAssignTask}>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="form-label">{t('groupId')}</label>
                                        <input type="number" className="form-control" placeholder={t('groupId')}
                                            value={taskForm.groupId}
                                            onChange={(e) => setTaskForm({ ...taskForm, groupId: e.target.value })} required />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label">{t('laborerUserId')}</label>
                                        <input type="number" className="form-control" placeholder={t('laborerId')}
                                            value={taskForm.laborerId}
                                            onChange={(e) => setTaskForm({ ...taskForm, laborerId: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">{t('taskDescription')}</label>
                                    <textarea className="form-control" rows="3" placeholder={t('taskDescPlaceholder')}
                                        value={taskForm.description}
                                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-primary-custom">{t('assignTask')}</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ThekedarDashboard;
