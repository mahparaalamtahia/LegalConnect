import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>LegalConnect</h3>
            <p>Connecting clients with qualified lawyers for all legal needs.</p>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/lawyers">Find Lawyers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Services</h4>
            <ul>
              <li>Legal Consultation</li>
              <li>Document Review</li>
              <li>Case Management</li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>Email: info@legalconnect.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; 2025 LegalConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


