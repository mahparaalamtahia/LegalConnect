import React from 'react';
import styles from './Timeline.module.css';

const Timeline = ({ events }) => {
  return (
    <div className={styles.timeline}>
      {events.map((event, index) => (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineMarker}></div>
          <div className={styles.timelineContent}>
            <h4 className={styles.timelineTitle}>{event.title}</h4>
            <p className={styles.timelineDate}>{event.date}</p>
            {event.description && (
              <p className={styles.timelineDescription}>{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;


