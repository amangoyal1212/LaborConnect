import { useEffect, useMemo, useState } from 'react';
import { Star, X } from 'lucide-react';

const ReviewModal = ({ show, onClose, workerName, onSubmit }) => {
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

    if (!show) {
        return null;
    }

    const handleSubmit = async () => {
        if (rating === 0) {
            return;
        }
        setSubmitting(true);
        await onSubmit({ rating, review: review.trim() });
        setSubmitting(false);
    };

    return (
        <div className="review-modal-backdrop" onClick={onClose}>
            <div className="review-modal-content slide-up" onClick={(event) => event.stopPropagation()}>
                <button className="review-modal-close" onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>
                <h4 className="fw-bold mb-2">Verify Work and Release Escrow</h4>
                <p className="text-secondary mb-3">
                    Add a 5-star review for <strong>{workerName}</strong>.
                </p>
                <div className="d-flex justify-content-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            className="review-star-btn"
                            onMouseEnter={() => setHover(value)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(value)}
                            aria-label={`${value} stars`}
                        >
                            <Star
                                size={34}
                                fill={(hover || rating) >= value ? '#ea580c' : 'none'}
                                stroke={(hover || rating) >= value ? '#ea580c' : '#cbd5e1'}
                            />
                        </button>
                    ))}
                </div>
                <textarea
                    className="form-control mb-3"
                    rows="3"
                    placeholder="Optional feedback"
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    maxLength={300}
                />
                <button className="btn btn-primary w-100" onClick={handleSubmit} disabled={isDisabled}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </div>
    );
};

export default ReviewModal;
