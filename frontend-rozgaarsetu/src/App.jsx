import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import ChatWidget from './components/ChatWidget';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const ContractorDashboard = lazy(() => import('./pages/ContractorDashboard'));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const RoleBasedRedirect = lazy(() => import('./routes/RoleBasedRedirect'));
const Settings = lazy(() => import('./pages/Settings'));

const PageLoader = () => (
    <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-orange" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter>
                <Navbar />
                <main>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<RoleBasedRedirect />} />

                            {/* Admin — self-contained login, no JWT guard needed */}
                            <Route path="/admin" element={<AdminDashboard />} />

                            {/* Profile & Settings — any authenticated role */}
                            <Route element={<ProtectedRoute allowedRoles={['CLIENT', 'CONTRACTOR', 'WORKER']} />}>
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/settings" element={<Settings />} />
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
                {/* ChatWidget is mounted at root level — always visible on every page */}
                <ChatWidget />
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
            </BrowserRouter>
        </div>
    );
}

export default App;
