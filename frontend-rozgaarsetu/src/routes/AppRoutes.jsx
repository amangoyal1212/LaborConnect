import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import HireWorker from '../pages/HireWorker';
import WorkerDashboard from '../pages/WorkerDashboard';
import ClientDashboard from '../pages/ClientDashboard';
import ContractorDashboard from '../pages/ContractorDashboard';
import RoleBasedRedirect from './RoleBasedRedirect';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Search Route (Public, but hiring requires auth) */}
            <Route path="/workers" element={<HireWorker />} />
            <Route path="/dashboard" element={<RoleBasedRedirect />} />

            {/* Protected Dashboards */}
            <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
                <Route path="/dashboard/worker" element={<WorkerDashboard />} />
                <Route path="/dashboard/labour" element={<WorkerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
                <Route path="/dashboard/client" element={<ClientDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['CONTRACTOR']} />}>
                <Route path="/dashboard/contractor" element={<ContractorDashboard />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
