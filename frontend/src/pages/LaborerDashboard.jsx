import { useState, useEffect } from 'react';
import { getNearbyJobs, applyToJob, getTodayTasks } from '../services/api';
import { useLang } from '../context/LanguageContext';

function LaborerDashboard({ user }) {
    const { t } = useLang();
    const [jobs, setJobs] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('jobs');

    const fetchJobs = async () => {
        try {
            const res = await getNearbyJobs(user.id);
            setJobs(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log('No jobs found or profile not set');
            setJobs([]);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await getTodayTasks(user.id);
            setTasks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log('No tasks found');
            setTasks([]);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchTasks();
    }, []);

    const handleApply = async (jobId) => {
        setMessage(''); setError('');
        try {
            const res = await applyToJob(jobId, user.id);
            setMessage(res.data.message);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Could not apply');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="container dashboard-container">
            {/* Welcome */}
            <div className="welcome-section fade-in-up">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h1>{t('namaste')}, {user.name}! 🙏</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{t('findWork')}</p>
                    </div>
                    <span className="role-badge badge-laborer">🔨 {t('laborer')}</span>
                </div>
            </div>

            {message && <div className="alert alert-success alert-custom fade-in-up">{message}</div>}
            {error && <div className="alert alert-danger alert-custom fade-in-up">{error}</div>}

            {/* Tabs */}
            <div className="d-flex gap-2 mb-4 flex-wrap">
                <button className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('jobs')}>
                    💼 {t('nearbyJobs')} {jobs.length > 0 && <span className="count">{jobs.length}</span>}
                </button>
                <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tasks')}>
                    📋 {t('todayTasks')} {tasks.length > 0 && <span className="count">{tasks.length}</span>}
                </button>
            </div>

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
                <div>
                    <div className="section-header">
                        <h4><span className="icon">💼</span>{t('jobsMatching')}</h4>
                        <button className="btn btn-secondary-custom btn-sm" onClick={fetchJobs}>🔄 {t('refresh')}</button>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="empty-state card-custom">
                            <div className="icon">🔍</div>
                            <h5>{t('noJobsNearby')}</h5>
                            <p>{t('updateProfileHint')}</p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {jobs.map((job, i) => (
                                <div key={job.id} className={`col-md-6 fade-in-up fade-in-up-delay-${(i % 3) + 1}`}>
                                    <div className={`card-custom job-card ${job.urgent ? 'urgent' : ''}`}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 style={{ margin: 0 }}>{job.title}</h5>
                                            {job.urgent && <span className="urgent-badge">🚨 {t('urgent')}</span>}
                                        </div>
                                        {job.description && (
                                            <p className="card-info mb-2">{job.description}</p>
                                        )}
                                        <div className="d-flex gap-2 flex-wrap mb-3">
                                            <span className="worker-type-badge">🔧 {job.requiredWorkerType}</span>
                                            <span className="pincode-badge">📍 {job.pincode}</span>
                                            <span className={`status-badge status-${job.status}`}>{job.status}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="card-info">{t('by')}: {job.thekedarName}</span>
                                            <button className="btn btn-success-custom btn-sm" onClick={() => handleApply(job.id)}>
                                                ✋ {t('applyNow')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
                <div>
                    <div className="section-header">
                        <h4><span className="icon">📋</span>{t('todayTasks')}</h4>
                        <button className="btn btn-secondary-custom btn-sm" onClick={fetchTasks}>🔄 {t('refresh')}</button>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="empty-state card-custom">
                            <div className="icon">📋</div>
                            <h5>{t('noTasks')}</h5>
                            <p>{t('noTasksHint')}</p>
                        </div>
                    ) : (
                        tasks.map((task, i) => (
                            <div key={task.id} className={`task-item fade-in-up fade-in-up-delay-${(i % 3) + 1}`}>
                                <div className={`task-checkbox ${task.completed ? 'done' : ''}`}>
                                    {task.completed ? '✓' : ''}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{task.description}</div>
                                    <div className="card-info">
                                        🏗️ {task.groupName} • 📅 {task.date}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default LaborerDashboard;
