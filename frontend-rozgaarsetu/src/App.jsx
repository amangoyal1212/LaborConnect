import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const ContractorDashboard = lazy(() => import('./pages/ContractorDashboard'));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard'));
const RoleBasedRedirect = lazy(() => import('./routes/RoleBasedRedirect'));

const PageLoader = () => (
    <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-orange" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <main>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<RoleBasedRedirect />} />

                        {/* Profile — any authenticated role */}
                        <Route element={<ProtectedRoute allowedRoles={['CLIENT', 'CONTRACTOR', 'WORKER']} />}>
                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
                            <Route path="/client" element={<ClientDashboard />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['CONTRACTOR']} />}>
                            <Route path="/contractor" element={<ContractorDashboard />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
                            <Route path="/worker" element={<WorkerDashboard />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
        </BrowserRouter>
    );
}

export default App;
