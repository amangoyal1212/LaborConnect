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

const About = () => (
    <section className="about-section fade-in">
        <div className="container">
            <div className="text-center mb-4">
                <div className="about-icon-ring mx-auto">
                    <Handshake size={32} />
                </div>
                <h2 className="fw-bold text-charcoal mt-2">About RozgaarSetu</h2>
                <p className="text-earth-muted mx-auto" style={{ maxWidth: 560 }}>
                    रोज़गार-Setu means <strong>"Bridge to Employment"</strong>. We are on a mission to dignify
                    blue-collar hiring by connecting skilled workers directly with clients and contractors
                    through a transparent, technology-driven platform.
                </p>
            </div>

            <div className="row g-4 justify-content-center">
                {features.map((f, i) => (
                    <div className="col-12 col-sm-6 col-lg-3" key={i}>
                        <div className="glass-container-subtle p-4 h-100 text-center">
                            <div className="category-icon mx-auto">{f.icon}</div>
                            <h5 className="fw-bold text-charcoal mt-2 mb-1" style={{ fontSize: '1rem' }}>
                                {f.title}
                            </h5>
                            <p className="text-earth-muted mb-0" style={{ fontSize: '0.88rem' }}>
                                {f.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default About;
