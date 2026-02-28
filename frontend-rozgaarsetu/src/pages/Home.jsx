import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Hammer,
    Zap,
    Droplets,
    PaintBucket,
    BrickWall,
    SprayCan,
} from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import About from '../components/About';

const categories = [
    { key: 'carpenter', icon: <Hammer size={26} /> },
    { key: 'electrician', icon: <Zap size={26} /> },
    { key: 'plumber', icon: <Droplets size={26} /> },
    { key: 'painter', icon: <PaintBucket size={26} /> },
    { key: 'beldar', icon: <BrickWall size={26} /> },
    { key: 'maid', icon: <SprayCan size={26} /> },
];

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.08, delayChildren: 0.3 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const Home = () => {
    const { t } = useContext(LanguageContext);

    return (
        <div className="landing-shell">
            {/* ── Hero Section ── */}
            <section className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-9">
                        <motion.div
                            className="landing-hero p-4 p-md-5 text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <p className="landing-kicker mb-2">रोज़गार-Setu</p>
                            <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-heading)' }}>
                                {t('hero_title') || 'Trusted Blue-Collar Hiring for'}
                                <span style={{ color: 'var(--primary)' }}> {t('find_workers') || 'Clients, Contractors & Workers'}</span>
                            </h1>
                            <p className="lead mb-4" style={{ maxWidth: 560, margin: '0 auto', color: 'var(--text-body)' }}>
                                {t('hero_subtitle') || 'Sign in to access worker discovery, bulk hiring, job acceptance, escrow-safe payouts, and verified reviews.'}
                            </p>
                            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link to="/login" className="btn btn-primary px-4 py-2">
                                        {t('login')}
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link to="/register" className="btn btn-outline-primary px-4 py-2">
                                        {t('register')}
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Popular Categories ── */}
            <section className="container pb-5">
                <motion.h3
                    className="fw-bold text-center mb-4"
                    style={{ color: 'var(--text-heading)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {t('popular_categories')}
                </motion.h3>
                <motion.div
                    className="row g-3 justify-content-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {categories.map((cat) => (
                        <motion.div className="col-6 col-sm-4 col-lg-2" key={cat.key} variants={itemVariants}>
                            <div className="category-card hover-scale">
                                <div className="category-icon mx-auto">{cat.icon}</div>
                                <h6 className="fw-semibold mb-0" style={{ color: 'var(--text-heading)' }}>
                                    {t(cat.key)}
                                </h6>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── About Section ── */}
            <About />
        </div>
    );
};

export default Home;
