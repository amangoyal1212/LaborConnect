import { motion } from 'framer-motion';
import { Handshake, Shield, Users, Zap } from 'lucide-react';

const features = [
    {
        icon: <Handshake size={28} />,
        title: 'Trusted Connections',
        desc: 'We bridge the gap between workers, contractors, and clients with verified profiles and transparent reviews.',
    },
    {
        icon: <Shield size={28} />,
        title: 'Escrow-Safe Payments',
        desc: 'Funds are held securely until work is verified and approved — protecting both parties.',
    },
    {
        icon: <Users size={28} />,
        title: 'Bulk Hiring Made Easy',
        desc: 'Contractors and clients can discover, filter, and hire skilled labor at scale in minutes.',
    },
    {
        icon: <Zap size={28} />,
        title: 'Instant Job Matching',
        desc: 'Workers receive real-time job alerts matched to their trade, location, and availability.',
    },
];

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const About = () => (
    <section className="about-section">
        <div className="container">
            <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="about-icon-ring mx-auto">
                    <Handshake size={32} />
                </div>
                <h2 className="fw-bold mt-2" style={{ color: 'var(--text-heading)' }}>About RozgaarSetu</h2>
                <p style={{ maxWidth: 560, color: 'var(--text-body)' }} className="mx-auto">
                    रोज़गार-Setu means <strong>&quot;Bridge to Employment&quot;</strong>. We are on a mission to dignify
                    blue-collar hiring by connecting skilled workers directly with clients and contractors
                    through a transparent, technology-driven platform.
                </p>
            </motion.div>

            <motion.div
                className="row g-4 justify-content-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                {features.map((f, i) => (
                    <motion.div className="col-12 col-sm-6 col-lg-3" key={i} variants={itemVariants}>
                        <div className="card-surface p-4 h-100 text-center hover-scale">
                            <div className="category-icon mx-auto">{f.icon}</div>
                            <h5 className="fw-bold mt-2 mb-1" style={{ fontSize: '1rem', color: 'var(--text-heading)' }}>
                                {f.title}
                            </h5>
                            <p className="mb-0" style={{ fontSize: '0.88rem', color: 'var(--text-body)' }}>
                                {f.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

export default About;
