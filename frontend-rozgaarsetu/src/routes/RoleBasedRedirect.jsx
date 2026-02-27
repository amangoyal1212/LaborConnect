import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getDashboardRoute } from '../utils/roleRouting';

const RoleBasedRedirect = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-orange" role="status" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Navigate to={getDashboardRoute(user.role)} replace />;
};

export default RoleBasedRedirect;
