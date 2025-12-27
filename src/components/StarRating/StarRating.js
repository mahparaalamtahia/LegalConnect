import React from 'react';
import styles from './StarRating.module.css';

const StarRating = ({ rating, maxRating = 5, size = 'medium' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`${styles.rating} ${styles[size]}`}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className={styles.star}>★</span>
      ))}
      {hasHalfStar && <span className={styles.star}>☆</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={i} className={styles.starEmpty}>☆</span>
      ))}
      <span className={styles.ratingText}>({rating.toFixed(1)})</span>
    </div>
  );
};

export default StarRating;


