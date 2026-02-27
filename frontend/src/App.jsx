import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ThekedarDashboard from './pages/ThekedarDashboard';
import LaborerDashboard from './pages/LaborerDashboard';
import ProfileUpdate from './pages/ProfileUpdate';
import GroupChat from './pages/GroupChat';

function App() {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('lc_user');
        return saved ? JSON.parse(saved) : null;
    });

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('lc_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('lc_user');
    };

    return (
        <>
            {user && <Navbar user={user} onLogout={handleLogout} />}
            <Routes>
                <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
                <Route path="/signup" element={!user ? <Signup onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={
                    !user ? <Navigate to="/login" /> :
                        user.role === 'THEKEDAR' ?
                            <ThekedarDashboard user={user} /> :
                            <LaborerDashboard user={user} />
                } />
                <Route path="/profile" element={
                    !user ? <Navigate to="/login" /> :
                        <ProfileUpdate user={user} />
                } />
                <Route path="/chat" element={
                    !user ? <Navigate to="/login" /> :
                        <GroupChat user={user} />
                } />
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            </Routes>
        </>
    );
}

export default App;
