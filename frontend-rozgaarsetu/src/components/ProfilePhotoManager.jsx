import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=ea580c&color=fff&size=120&bold=true&font-size=0.4';

const ProfilePhotoManager = ({ userName }) => {
    const [preview, setPreview] = useState(null);
    const fileRef = useRef(null);

    const initials = userName || 'User';
    const avatarUrl = preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=ea580c&color=fff&size=120&bold=true&font-size=0.4`;

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="text-center mb-3">
            <img
                src={avatarUrl}
                alt="Profile"
                className="profile-avatar mb-3"
            />
            <br />
            <button
                type="button"
                className="photo-change-btn"
                onClick={() => fileRef.current?.click()}
            >
                <Camera size={14} />
                Change Photo
            </button>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default ProfilePhotoManager;
