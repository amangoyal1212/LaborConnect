import { Link } from 'react-router-dom';
import {
    Hammer,
    Zap,
    Droplets,
    PaintBucket,
    BrickWall,
    SprayCan,
} from 'lucide-react';
import About from '../components/About';

const categories = [
    { name: 'Carpenter', icon: <Hammer size={26} /> },
    { name: 'Electrician', icon: <Zap size={26} /> },
    { name: 'Plumber', icon: <Droplets size={26} /> },
    { name: 'Painter', icon: <PaintBucket size={26} /> },
    { name: 'Beldar', icon: <BrickWall size={26} /> },
    { name: 'Maid', icon: <SprayCan size={26} /> },
];

const Home = () => {
    return (
        <div className="landing-shell fade-in">
            {/* ── Hero Section ── */}
            <section className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-9">
                        <div className="landing-hero p-4 p-md-5 text-center">
                            <p className="landing-kicker mb-2">रोज़गार-Setu</p>
                            <h1 className="display-5 fw-bold text-charcoal mb-3">
                                Trusted Blue-Collar Hiring for
                                <span className="text-orange"> Clients, Contractors & Workers</span>
                            </h1>
                            <p className="lead text-earth-muted mb-4" style={{ maxWidth: 560, margin: '0 auto' }}>
                                Sign in to access worker discovery, bulk hiring, job acceptance,
                                escrow-safe payouts, and verified reviews.
                            </p>
                            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                                <Link to="/login" className="btn btn-primary px-4 py-2">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-outline-primary px-4 py-2">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Popular Categories (6-column grid) ── */}
            <section className="container pb-5">
                <h3 className="fw-bold text-charcoal text-center mb-4">Popular Categories</h3>
                <div className="row g-3 justify-content-center">
                    {categories.map((cat) => (
                        <div className="col-6 col-sm-4 col-lg-2" key={cat.name}>
                            <div className="category-card">
                                <div className="category-icon mx-auto">{cat.icon}</div>
                                <h6 className="fw-semibold text-charcoal mb-0">{cat.name}</h6>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── About Section ── */}
            <About />
        </div>
    );
};

export default Home;
