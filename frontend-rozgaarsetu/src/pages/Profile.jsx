import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProfilePhotoManager from '../components/ProfilePhotoManager';
import { Phone, Briefcase, Shield } from 'lucide-react';

const roleBadge = {
    CLIENT: { label: 'Client', color: '#2563eb' },
    CONTRACTOR: { label: 'Contractor', color: '#7c3aed' },
    WORKER: { label: 'Worker', color: '#059669' },
};

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    const badge = roleBadge[user.role] || roleBadge.CLIENT;

    return (
        <div className="profile-wrapper fade-in">
            <div className="glass-container profile-card">
                <ProfilePhotoManager userName={user.name} />

                <h3 className="fw-bold text-charcoal mb-1">{user.name}</h3>

                <span
                    className="status-badge mb-3"
                    style={{ background: badge.color + '22', color: badge.color, fontSize: '0.78rem' }}
                >
                    <Shield size={12} className="me-1" />
                    {badge.label}
                </span>

                <div className="mt-4 text-start">
                    <div className="d-flex align-items-center gap-2 mb-3 p-2 glass-container-subtle" style={{ borderRadius: 10 }}>
                        <Phone size={16} className="text-orange" />
                        <span className="text-charcoal fw-semibold" style={{ fontSize: '0.9rem' }}>{user.phone}</span>
                    </div>

                    {user.category && (
                        <div className="d-flex align-items-center gap-2 mb-3 p-2 glass-container-subtle" style={{ borderRadius: 10 }}>
                            <Briefcase size={16} className="text-orange" />
                            <span className="text-charcoal fw-semibold" style={{ fontSize: '0.9rem' }}>
                                Trade: {user.category}
                            </span>
                        </div>
                    )}

                    {user.organizationName && (
                        <div className="d-flex align-items-center gap-2 mb-3 p-2 glass-container-subtle" style={{ borderRadius: 10 }}>
                            <Briefcase size={16} className="text-orange" />
                            <span className="text-charcoal fw-semibold" style={{ fontSize: '0.9rem' }}>
                                Org: {user.organizationName}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
