// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Simulate loading
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 2000);
    
    // Setup download tracking
    const downloadBtn = document.querySelector('.download-btn.android');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Track download in localStorage
            let downloads = localStorage.getItem('appDownloads') || 0;
            downloads = parseInt(downloads) + 1;
            localStorage.setItem('appDownloads', downloads);
            
            // Show success message
            showNotification('Download started! Thank you for choosing Legend Tech Academy.');
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .course-preview-card, .social-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add fade-in class for animation
    document.addEventListener('fadeIn', function(e) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
    });
});

// Show notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--new-year-blue), var(--new-year-green));
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
        border-left: 5px solid var(--new-year-gold);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Global functions
window.scrollToDownload = function() {
    document.querySelector('.app-download-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
};

window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.showDisclaimer = function() {
    document.getElementById('popup').style.display = 'flex';
};