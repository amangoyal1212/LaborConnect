import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

/**
 * Non-dismissible ReviewModal with Framer Motion animations.
 * The user MUST submit a star rating before this modal closes.
 */
const ReviewModal = ({ show, workerName, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!show) {
            setRating(0);
            setHover(0);
            setReview('');
            setSubmitting(false);
        }
    }, [show]);

    const isDisabled = useMemo(() => rating === 0 || submitting, [rating, submitting]);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        await onSubmit({ rating, review: review.trim() });
        setSubmitting(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="review-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="review-modal-content"
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <h4 className="fw-bold mb-1" style={{ color: 'var(--text-heading)' }}>⭐ Rate the Work</h4>
                        <p className="mb-3" style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>
                            Please rate <strong>{workerName}</strong> to release the escrow payment.
                            <br />
                            <span className="small fw-semibold" style={{ color: 'var(--gold)' }}>A rating is required — this cannot be skipped.</span>
                        </p>
                        <div className="d-flex justify-content-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <motion.button
                                    key={value}
                                    type="button"
                                    className="review-star-btn"
                                    onMouseEnter={() => setHover(value)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(value)}
                                    aria-label={`${value} stars`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Star
                                        size={34}
                                        fill={(hover || rating) >= value ? '#10b981' : 'none'}
                                        stroke={(hover || rating) >= value ? '#10b981' : '#cbd5e1'}
                                    />
                                </motion.button>
                            ))}
                        </div>
                        <textarea
                            className="form-control mb-3"
                            rows="3"
                            placeholder="Optional: Leave a comment about this worker..."
                            value={review}
                            onChange={(event) => setReview(event.target.value)}
                            maxLength={300}
                        />
                        <motion.button
                            className="btn btn-primary w-100"
                            onClick={handleSubmit}
                            disabled={isDisabled}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={!isDisabled ? { background: 'linear-gradient(135deg, var(--emerald), var(--emerald-hover))', border: 'none' } : {}}
                        >
                            {submitting ? 'Confirming Payment…' : `Submit Review & Release ₹ Escrow`}
                        </motion.button>
                        {rating === 0 && (
                            <p className="text-center small mt-2" style={{ color: 'var(--text-muted)' }}>👆 Please select a star rating to continue</p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReviewModal;
