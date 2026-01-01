// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyC6O2VX4GPnPAC9U12faOh2WGq7S536OWc",
        authDomain: "legend-tech-07.firebaseapp.com",
        projectId: "legend-tech-07",
        storageBucket: "legend-tech-07.appspot.com",
        messagingSenderId: "478316698486",
        appId: "1:478316698486:web:f197ea6f7860eb462cb857"
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();

    // Simulate loading
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        checkAuthState();
    }, 2000);
    
    // Currency conversion rates
    const currencyRates = {
        'NG': { code: 'NGN', symbol: '₦', rate: 1 },
        'US': { code: 'USD', symbol: '$', rate: 0.0022 },
        'GB': { code: 'GBP', symbol: '£', rate: 0.0017 },
        'ES': { code: 'EUR', symbol: '€', rate: 0.0020 },
        'FR': { code: 'EUR', symbol: '€', rate: 0.0020 },
        'DE': { code: 'EUR', symbol: '€', rate: 0.0020 },
        'IN': { code: 'INR', symbol: '₹', rate: 0.18 },
        'BR': { code: 'BRL', symbol: 'R$', rate: 0.011 },
        'CA': { code: 'CAD', symbol: 'CA$', rate: 0.0029 },
        'AU': { code: 'AUD', symbol: 'A$', rate: 0.0033 }
    };
    
    // LP Packages in Naira (2026 New Year Pricing)
    const lpPackages = [
        { amount: 100, price: 500 },
        { amount: 500, price: 2500 },
        { amount: 1000, price: 4500 },
        { amount: 5000, price: 20000 },
        { amount: 15000, price: 50000 }
    ];

    // Hardcoded courses (now including price)
    let courses = [
        { 
            id: 1, 
            title: "Web Development Fundamentals", 
            description: "Learn HTML, CSS and JavaScript basics",
            url: "https://privatecourses.netlify.app/learn.html?id=crs1&token=tk_3tghhvcpn_mdulbd5i",
            image: "https://i.supaimg.com/3abc4676-98ab-49c4-89a0-c745525dbf71.jpg",
            price: 100,
            source: "hardcoded"
        },            
        { 
            id: 2, 
            title: "Advanced JavaScript", 
            description: "Master modern JavaScript techniques",
            url: "https://privatecourses.netlify.app/learn.html?id=crs2&token=tk_h01y0muj7_mdyb01mn",
            image: "https://i.supaimg.com/8182e851-8791-4d76-ab6a-aa86904b6bc4.jpg",
            price: 100,
            source: "hardcoded"
        },
        { 
            id: 3, 
            title: "React.js Crash Course", 
            description: "Build modern web apps with React",
            url: "https://privatecourses.netlify.app/learn.html?id=crs3&token=tk_8e4d5jkxm_mdyb0uus",
            image: "https://i.supaimg.com/8bc76852-1787-4b02-9f4c-b6f93bdb4021.jpg",
            price: 100,
            source: "hardcoded"
        },
        { 
            id: 4, 
            title: "Node.js Backend Development", 
            description: "Create server-side applications",
            url: "https://privatecourses.netlify.app/learn.html?id=crs4&token=tk_jj0d60ydc_mdyb2bur",
            image: "https://i.supaimg.com/eec5944f-84b9-454d-93df-6f9196c58240.png",
            price: 100,
            source: "hardcoded"
        },
        { 
            id: 5, 
            title: "Python for Beginners", 
            description: "Learn Python programming basics",
            url: "https://privatecourses.netlify.app/learn.html?id=crs5&token=tk_hqa4bxuxo_mdz1mopu",
            image: "https://i.supaimg.com/f8b6b81d-1719-453f-ae92-0adc30b2a48d.jpg",
            price: 100,
            source: "hardcoded"
        },
        { 
            id: 6, 
            title: "Data Science Fundamentals", 
            description: "Introduction to data analysis",
            url: "https://example.com/data-science",
            image: "https://i.supaimg.com/3ba81f47-90e1-4a58-a7f6-2f267f8e0633.jpg",
            price: 100,
            source: "hardcoded"
        },
        { 
            id: 7, 
            title: "SEO mastery course", 
            description: "Boost your website's ranking on Google. Learn the secrets of Search Engine Optimization!",
            url: "https://privatecourses.netlify.app/learn.html?id=crs6&token=tk_p1h1bz0in_me0gqix3",
            image: "https://i.supaimg.com/a9f3afed-035c-4f8c-aeba-9b64cc1ff4a6.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 8,
            title: "Master 3D Animation",
            description: "Bring your imagination to life, frame by frame. Jump into the world of 3D animation where your ideas turn into moving art!",
            url: "https://privatecourses.netlify.app/learn.html?id=crs7&token=tk_cukkxpowu_me1g1e9n",
            image: "https://i.supaimg.com/c421cee3-35c3-4626-9a18-ec8785c1ef10.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 9,
            title: "Ai Mastery Course",
            description: "The world is being automated. Don't get left behind. Master AI-powered creation, innovation, and monetization.",
            url: "https://privatecourses.netlify.app/learn.html?id=crs8&token=tk_amrxxvi19_me1xjs5y",
            image: "https://i.supaimg.com/c0eb774d-fd4f-4057-a802-aabbaa4eda90.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 10,
            title: "A to Z Cracking Course",
            description: "💻 Cracking Course Full A To Z For Beginner's 💻. Access your course materials below. Happy learning! 🚀",
            url: "https://privatecourses.netlify.app/learn.html?id=crs9&token=tk_oizclwt4u_me4hid2v",
            image: "https://i.supaimg.com/5bd10eca-3ae4-4a70-b581-7d1fc820fe16.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 11,
            title: "Object Oriented Programming in C++",
            description: "Object Oriented Programming in C++ & Interview Preparation. 🧑‍🏫 Lectures: 2 📚 Category: Development",
            url: "https://privatecourses.netlify.app/learn.html?id=crs10&token=tk_r0h3ofydu_me4taaed",
            image: "https://i.supaimg.com/e48bdbf9-a563-43a4-9678-b978dbc2bc45.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 12,
            title: "Kali Linux Mastery",
            description: "Mastering Kali Linux for Ethical Hackers. Welcome to the exciting journey of Mastering Kali Linux for Ethical Hackers!",
            url: "https://privatecourses.netlify.app/learn.html?id=crs11&token=tk_c94qwhuwu_me9zxtb6",
            image: "https://i.supaimg.com/89439f66-7f7d-44ab-a506-a39690a75492.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 13,
            title: "Ethical Hacking",
            description: "Learning Ethical hacking to hack, defend.",
            url: "https://privatecourses.netlify.app/learn.html?id=crs12&token=tk_kmvecrfx1_megrhkqv",
            image: "https://i.supaimg.com/e295b9ac-2535-4cb5-9cec-c04f878f77e1.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 14,
            title: "Hack Android With TheFatRat",
            description: "Learn To Hack Android Phones With TheFatRat Virus. ⚠️ Note- For Educational And Ethical Purposes Only",
            url: "https://privatecourses.netlify.app/learn.html?id=crs13&token=tk_u3mx52x5r_memq7z4x",
            image: "https://i.supaimg.com/8c2fa12e-ab29-4654-b958-8e55cd9dfa9d.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 15,
            title: "Mod Games With Lucky Patcher And Mt Manager",
            description: "In A Simple And Easy Way, Learn How To Mod Games Using Lucky Patcher And Mt Manager.",
            url: "https://privatecourses.netlify.app/learn.html?id=crs14&token=tk_fw1tfxp01_meph3vri",
            image: "https://i.supaimg.com/6620895c-c2b0-4a15-8228-115ad3b79660.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 16,
            title: "WhatsApp Ai support",
            description: "Learn key components in building a WhatsApp bot.",
            url: "https://privatecourses.netlify.app/learn.html?id=crs15&token=tk_lhp3fhp14_meylxpa0",
            image: "https://i.supaimg.com/a566f4e6-47c1-46ed-8ecd-043a83a7d280.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 17,
            title: "Copyright Software Method",
            description: "Learn Copyright software and how to utilise it.",
            url: "https://privatecourses.netlify.app/learn.html?id=crs16&token=tk_23kel9ipm_mfavw0fe",
            image: "https://i.supaimg.com/f6201410-e436-460a-aa87-d24e19e8bce7.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id:18,
            title: "Graphics design Resource Pack.",
            description: "Get different resource packs of graphics designing for free.",
            url: "https://privatecourses.netlify.app/learn.html?id=crs17&token=tk_4z1nbt7zs_mfc9hmh2",
            image: "https://i.supaimg.com/87ac6436-157d-4ea9-839c-c56f9c9ab2bf.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id:19,
            title: "Trading With Exness From A To Z.",
            description: "Trading, a form of freelancing, had been known to be among the best of the bests when it comes to making money.",
            url: "https://whatsapp.com/channel/0029VbBWcNJK0IBk4hlvDb0J",
            image: "http://betterbox-api-pw3j.onrender.com/i/4f8b722f-7774-48f5-9e2b-62fd8bc4a437.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 20,
            title: "How To Find The Bins Of Websites.",
            description: "*👽Find Bins Of Any Website Or App For Carding 💳 - Full Explained 2025 Latest Method By @DIGITAL MASTERS 🗿*",
            url: "https://t.me/legendtechhacksarena/158",
            image: "http://betterbox-api-pw3j.onrender.com/i/69b5f74e-0456-42f2-bd8d-e62e73132e09.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 21,
            title: "Chatgpt competitive Analysis.",
            description: "*🔥 CHATGPT COMPETITIVE ANALYSIS*  📊 Analyze ChatGPT & rivals, 🧠 Master AI market intelligence",
            url: "https://drive.google.com/drive/folders/1qrcKiTy3KBESkxzV_0p4EPbSZDfEcwxl",
            image: "http://betterbox-api-pw3j.onrender.com/i/9afc3246-8ed4-4042-9dd4-c4fd9a80f2b5.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 22,
            title: "Top Burner Email And SMS Services.",
            description: "Looking for quick and anonymous sign ins, we've got you covered.",
            url: "https://coursesarchive.netlify.app/email-burner.html",
            image: "https://i.ibb.co/7x7bs5v1/adb018240bdfda5b9cd88fa0161edf85.webp",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 23,
            title: "All Pro Source Codes(Resource Pack)",
            description: "Get different tech source codes for free. Note this is a resource pack.",
            url: "https://t.me/legendtechhacksarena/174",
            image: "https://i.ibb.co/5hvZqMNV/9a75c3a2c449553fb1dd706c4a1948cd.webp",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 24,
            title: "Web3 And Blockchain Mastery",
            description: "Get ultimate knowledge on web3 and how it works, smart contracts, blockchain flow and business opportunities in it.",
            url: "https://coursesarchive.netlify.app/web3-outline.html",
            image: "https://images.openai.com/thumbnails/url/Q5lkJnicu1mUUVJSUGylr5-al1xUWVCSmqJbkpRnoJdeXJJYkpmsl5yfq5-Zm5ieWmxfaAuUsXL0S7F0Tw62TAkrcC2u9HEsMckyLUsxyXUOrSwtN_E3y_GM9EsyLCoOtwgyCwkLK3YxzskP8CxISnMs9I0INs5WKwYAzJkpRA",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 25,
            title: "Important Websites And Tools You Need To Know.",
            description: "This a video based course which comprises different videos of websites that contain tools that it's very helpful.",
            url: "https://youtube.com/playlist?list=PLWXDPABA54cow_7cnMdb7MK9tuxGXPv6d&si=tiuc-kwE-ZQefRs6",
            image: "https://files.catbox.moe/biv9bo.jpg",
            price: 100,
            source: "hardcoded"
        },
        {
            id: 26,
            title: "How To Get Unlimited Number|Lifetime Working Method.",
            description: "You can get unlimited numbers without worrying about losing them.",
            url: "https://drive.google.com/drive/fders/1wDqIy5eB6Mz6SRJfhMmIfcnU-koQJ2Lr",
            image: "https://files.catbox.moe/81tlw2.jpg",
            price: 100,
            source: "hardcoded"
        }
    ];
    
    // UPDATED: Bonus Codes - Purchase codes (can be used infinitely)
    const purchaseCodes = {
        '12AB61': 100,
        'WE49OP': 500,
        '73AS63': 1000,
        'PO48G5': 5000,
        'AZ31SG': 15000
    };
    
    // UPDATED: Promo Codes - Can only be used once per user (2026 New Year Special)
    const promoCodes = {
        'UPDATE': 500,
        'WELCOME100': 100,
        'LEGEND500': 500,
        'NEWYEAR2026': 1000,  // NEW 2026 promo code
        'FUTURETECH': 500     // NEW 2026 promo code
    };
    
    // Global chat messages
    const globalChatMessages = [
        { username: "Admin", message: "🎉 Welcome to Legend Tech community chat in 2026!", time: "10:00 AM" },
        { username: "User123", message: "Hello everyone! How's the learning going?", time: "10:05 AM" },
        { username: "TechGuru", message: "Just completed the React course. It was amazing!", time: "10:15 AM" },
        { username: "Admin", message: "🚀 2026 New Year Special: Use promo code 'NEWYEAR2026' for 1000 LP!"},
        { username: "Coder2026", message: "The new reply feature is awesome! Makes discussions so much better", time: "10:30 AM"}
    ];
    
    // User data
    let currentUser = null;
    let currentStreak = 0;
    
    // Chat reply state
    let currentReply = null;
    
    // Social media visited status
    let socialVisited = {
        whatsapp: false,
        youtube: false,
        twitter: false,
        tiktok: false
    };
    
    // Managers
    let notificationManager = null;
    let announcementManager = null;
    let broadcastManager = null;
    let chatNotificationManager = null;
    
        // DOM Elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const authTabs = document.querySelectorAll('.auth-tab');
    const appContainer = document.getElementById('app-container');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const claimBtn = document.getElementById('claim-btn');
    const streakContainer = document.getElementById('streak-container');
    const lpBalanceDisplay = document.getElementById('lp-balance');
    const userLpDisplay = document.getElementById('user-lp-display');
    const userName = document.getElementById('user-name');
    const redeemBtn = document.getElementById('redeem-btn');
    const promoCodeInput = document.getElementById('promo-code-input');
    const bonusCodeInput = document.getElementById('bonus-code-input');
    const bonusRedeemBtn = document.getElementById('bonus-redeem-btn');
    const bonusResult = document.getElementById('bonus-result');
    const lpPackagesContainer = document.getElementById('lp-packages');
    const coursesContainer = document.getElementById('courses-container');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const feedbackMessage = document.getElementById('feedback-message');
    const sendFeedbackBtn = document.getElementById('send-feedback');
    const courseModal = document.getElementById('course-modal');
    const closeCourseModal = document.getElementById('close-course-modal');
    const cancelPurchase = document.getElementById('cancel-purchase');
    const confirmPurchase = document.getElementById('confirm-purchase');
    const courseCostDisplay = document.getElementById('course-cost');
    const userLpModal = document.getElementById('user-lp-modal');
    const purchaseError = document.getElementById('purchase-error');
    const successModal = document.getElementById('success-modal');
    const closeSuccessModal = document.getElementById('close-success-modal');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    const successMessage = document.getElementById('success-message');
    const uploadCourseBtn = document.getElementById('upload-course-btn');
    const replyPreview = document.getElementById('reply-preview');
    const cancelReplyBtn = document.getElementById('cancel-reply');
    
    // Airdrop elements
    const airdropModal = document.getElementById('airdrop-modal');
    const closeAirdropModal = document.getElementById('close-airdrop-modal');
    const closeAirdropBtn = document.getElementById('close-airdrop-btn');
    const airdropMessage = document.getElementById('airdrop-message');
    
    // Social media elements
    const socialButtons = document.querySelectorAll('.visit-social-btn');
    const websiteButtons = document.querySelectorAll('.visit-website-btn');
    const socialStatus = {
        whatsapp: document.getElementById('whatsapp-status'),
        youtube: document.getElementById('youtube-status'),
        twitter: document.getElementById('twitter-status'),
        tiktok: document.getElementById('tiktok-status')
    };
    const totalSocialLp = document.getElementById('total-social-lp');
    
    // Community notification badge
    let unreadChatMessages = 0;
    let lastReadTimestamp = null;

    // Notification System Class
    class NotificationManager {
        constructor(db) {
            this.db = db;
            this.notifications = [];
            this.unreadCount = 0;
        }
        
        async init() {
            await this.loadNotifications();
            this.setupRealTimeListener();
            this.renderNotifications();
            this.updateBadge();
            this.setupEventListeners();
        }
        
        async loadNotifications() {
            try {
                const snapshot = await this.db.collection('notifications')
                    .orderBy('createdAt', 'desc')
                    .limit(20)
                    .get();
                
                this.notifications = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    this.notifications.push({
                        id: doc.id,
                        title: data.title || 'Notification',
                        message: data.message || '',
                        icon: data.icon || '🔔',
                        type: data.type || 'info',
                        createdAt: data.createdAt,
                        read: false
                    });
                });
                
                this.loadReadStatus();
                
            } catch (error) {
                console.error('Error loading notifications:', error);
            }
        }
        
        loadReadStatus() {
            const readNotifications = JSON.parse(localStorage.getItem('readNotifications')) || [];
            this.notifications.forEach(notification => {
                notification.read = readNotifications.includes(notification.id);
            });
            this.calculateUnreadCount();
        }
        
        calculateUnreadCount() {
            this.unreadCount = this.notifications.filter(n => !n.read).length;
        }
        
        setupRealTimeListener() {
            this.db.collection('notifications')
                .orderBy('createdAt', 'desc')
                .limit(20)
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const data = change.doc.data();
                            const newNotification = {
                                id: change.doc.id,
                                title: data.title || 'Notification',
                                message: data.message || '',
                                icon: data.icon || '🔔',
                                type: data.type || 'info',
                                createdAt: data.createdAt,
                                read: false
                            };
                            
                            if (!this.notifications.find(n => n.id === newNotification.id)) {
                                this.notifications.unshift(newNotification);
                                this.loadReadStatus();
                                this.renderNotifications();
                                this.updateBadge();
                                
                                // Show popup for new notifications
                                this.showNewNotificationPopup(newNotification);
                            }
                        }
                    });
                });
        }
        
        showNewNotificationPopup(notification) {
            const popup = document.createElement('div');
            popup.className = 'notification-popup';
            popup.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(26, 26, 46, 0.95);
                border: 1px solid rgba(255, 209, 102, 0.3);
                border-radius: 15px;
                padding: 1.2rem;
                max-width: 350px;
                z-index: 10000;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(20px);
                animation: slideInRight 0.3s ease-out;
                border-left: 5px solid var(--new-year-blue);
            `;
            
            popup.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                    <div style="font-size: 24px;">${notification.icon}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; margin-bottom: 8px; font-size: 15px; color: var(--new-year-gold);">${notification.title}</div>
                        <div style="font-size: 13px; opacity: 0.9; color: white; line-height: 1.4;">${notification.message}</div>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 18px; padding: 0.2rem 0.6rem; border-radius: 8px;">
                        ✕
                    </button>
                </div>
            `;
            
            document.body.appendChild(popup);
            
            setTimeout(() => {
                if (popup.parentElement) {
                    popup.remove();
                }
            }, 6000);
        }
        
        renderNotifications() {
            const notificationList = document.querySelector('.notification-list');
            if (!notificationList) return;
            
            notificationList.innerHTML = '';
            
            if (this.notifications.length === 0) {
                notificationList.innerHTML = `
                    <div class="empty-notifications">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔔</div>
                        <p style="color: rgba(255,255,255,0.5);">No notifications yet</p>
                    </div>
                `;
                return;
            }
            
            this.notifications.forEach(notification => {
                const notificationItem = document.createElement('div');
                notificationItem.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
                
                const timeAgo = notification.createdAt ? 
                    this.getTimeAgo(notification.createdAt.toDate()) : 'Recently';
                
                notificationItem.innerHTML = `
                    <div class="notification-icon">${notification.icon}</div>
                    <div class="notification-content">
                        <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px; color: var(--new-year-gold);">${notification.title}</p>
                        <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.4;">${notification.message}</div>
                        <small style="color: rgba(255,255,255,0.5); font-size: 12px;">${timeAgo}</small>
                    </div>
                `;
                
                notificationItem.addEventListener('click', () => {
                    this.markAsRead(notification.id);
                });
                
                notificationList.appendChild(notificationItem);
            });
        }
        
        getTimeAgo(date) {
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            
            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
            return `${Math.floor(diffInSeconds / 86400)}d ago`;
        }
        
        markAsRead(notificationId) {
            const readNotifications = JSON.parse(localStorage.getItem('readNotifications')) || [];
            if (!readNotifications.includes(notificationId)) {
                readNotifications.push(notificationId);
                localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
                
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.read = true;
                }
                
                this.calculateUnreadCount();
                this.updateBadge();
                this.renderNotifications();
            }
        }
        
        markAllAsRead() {
            const readNotifications = this.notifications.map(n => n.id);
            localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
            
            this.notifications.forEach(notification => {
                notification.read = true;
            });
            
            this.calculateUnreadCount();
            this.updateBadge();
            this.renderNotifications();
        }
        
        updateBadge() {
            const badge = document.querySelector('.notification-badge');
            const countElement = document.querySelector('.notification-count');
            
            if (badge) {
                if (this.unreadCount > 0) {
                    badge.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
            
            if (countElement) {
                countElement.textContent = `${this.unreadCount} unread`;
            }
            
            const footer = document.querySelector('.notification-footer');
            if (footer) {
                footer.style.display = this.unreadCount > 0 ? 'block' : 'none';
            }
        }
        
        setupEventListeners() {
            const notificationButton = document.querySelector('.notification-button');
            const dropdown = document.querySelector('.notification-dropdown');
            const markAllReadBtn = document.querySelector('.mark-all-read');
            
            if (notificationButton && dropdown) {
                notificationButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isVisible = dropdown.style.display === 'block';
                    dropdown.style.display = isVisible ? 'none' : 'block';
                });
            }
            
            if (markAllReadBtn) {
                markAllReadBtn.addEventListener('click', () => {
                    this.markAllAsRead();
                });
            }
            
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.notification-container')) {
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                }
            });
        }
    }
    
    // Chat Notification Manager
    class ChatNotificationManager {
        constructor(db) {
            this.db = db;
            this.unreadCount = 0;
            this.lastReadTimestamp = null;
            this.userMentioned = false;
            this.userReplied = false;
        }
        
        async init() {
            this.loadLastReadTime();
            await this.setupChatListener();
            this.updateBadge();
            this.setupEventListeners();
        }
        
        loadLastReadTime() {
            this.lastReadTimestamp = localStorage.getItem('lastChatReadTime');
            if (!this.lastReadTimestamp) {
                this.lastReadTimestamp = new Date().toISOString();
                this.saveLastReadTime();
            }
        }
        
        saveLastReadTime() {
            localStorage.setItem('lastChatReadTime', this.lastReadTimestamp);
        }
        
        async setupChatListener() {
            // Listen for new messages
            this.db.collection('globalChat')
                .orderBy('timestamp', 'desc')
                .limit(1)
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const newMessage = change.doc.data();
                            this.handleNewMessage(newMessage);
                        }
                    });
                });
        }
        
        handleNewMessage(message) {
            const messageTime = message.timestamp ? message.timestamp.toDate() : new Date();
            const lastReadTime = new Date(this.lastReadTimestamp);
            
            // Check if message is new (after last read time)
            if (messageTime > lastReadTime) {
                this.unreadCount++;
                
                // Check if user is mentioned
                const username = currentUser ? currentUser.username : '';
                if (username) {
                    // Check for @username mention
                    if (message.message && message.message.toLowerCase().includes(`@${username.toLowerCase()}`)) {
                        this.userMentioned = true;
                        this.showMentionNotification(message);
                    }
                    
                    // Check for reply to user's message
                    if (message.replyToUserId === currentUser.uid) {
                        this.userReplied = true;
                        this.showReplyNotification(message);
                    }
                }
                
                this.updateBadge();
            }
        }
        
        showMentionNotification(message) {
            const popup = document.createElement('div');
            popup.className = 'mention-notification';
            popup.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: rgba(255, 209, 102, 0.15);
                border: 1px solid rgba(255, 209, 102, 0.3);
                border-radius: 15px;
                padding: 1.2rem;
                max-width: 350px;
                z-index: 9999;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(20px);
                animation: slideInRight 0.3s ease-out;
                cursor: pointer;
                border-left: 5px solid var(--new-year-gold);
            `;
            
            popup.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                    <div style="font-size: 24px; color: var(--new-year-gold);">@</div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; margin-bottom: 8px; font-size: 15px; color: var(--new-year-gold);">
                            You were mentioned!
                        </div>
                        <div style="font-size: 13px; color: white; line-height: 1.4;">
                            <strong style="color: var(--new-year-teal);">${message.username}:</strong> ${message.message}
                        </div>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 18px; padding: 0.2rem 0.6rem; border-radius: 8px;">
                        ✕
                    </button>
                </div>
            `;
            
            popup.addEventListener('click', () => {
                this.markAsRead();
                popup.remove();
                // Navigate to community page
                document.querySelector('.nav-item[data-page="community"]').click();
            });
            
            document.body.appendChild(popup);
            
            setTimeout(() => {
                if (popup.parentElement) {
                    popup.remove();
                }
            }, 12000);
        }
        
        markAsRead() {
            this.lastReadTimestamp = new Date().toISOString();
            this.saveLastReadTime();
            this.unreadCount = 0;
            this.userMentioned = false;
            this.userReplied = false;
            this.updateBadge();
        }
        
        updateBadge() {
            const communityNavItem = document.querySelector('.nav-item[data-page="community"]');
            let badge = communityNavItem.querySelector('.community-badge');
            
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'community-badge';
                badge.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--danger);
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                `;
                communityNavItem.style.position = 'relative';
                communityNavItem.appendChild(badge);
            }
            
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
                badge.style.display = 'flex';
                
                // Add mention indicator
                if (this.userMentioned) {
                    badge.style.background = 'var(--new-year-gold)';
                    badge.style.animation = 'pulse 1s infinite';
                }
                
                // Add reply indicator
                if (this.userReplied) {
                    badge.style.background = 'var(--new-year-teal)';
                    badge.style.animation = 'pulse 1s infinite';
                }
            } else {
                badge.style.display = 'none';
            }
        }
        
        setupEventListeners() {
            const communityNavItem = document.querySelector('.nav-item[data-page="community"]');
            if (communityNavItem) {
                communityNavItem.addEventListener('click', () => {
                    this.markAsRead();
                });
            }
        }
    }
    
    // Announcement System Class
    class AnnouncementManager {
        constructor(db) {
            this.db = db;
            this.announcements = [];
            this.seenAnnouncements = new Set();
        }
        
        async init() {
            await this.loadAnnouncements();
            this.setupRealTimeListener();
            this.loadSeenAnnouncements();
            this.showAnnouncements();
            this.loadDashboardAnnouncements();
        }
        
        async loadAnnouncements() {
            try {
                const snapshot = await this.db.collection('announcements')
                    .where('active', '==', true)
                    .orderBy('createdAt', 'desc')
                    .get();
                
                this.announcements = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    this.announcements.push({
                        id: doc.id,
                        title: data.title || 'Announcement',
                        message: data.message || '',
                        type: data.type || 'general',
                        priority: data.priority || 'medium',
                        createdAt: data.createdAt
                    });
                });
                
            } catch (error) {
                console.error('Error loading announcements:', error);
            }
        }
        
        loadSeenAnnouncements() {
            const seen = JSON.parse(localStorage.getItem('seenAnnouncements')) || [];
            this.seenAnnouncements = new Set(seen);
        }
        
        saveSeenAnnouncements() {
            localStorage.setItem('seenAnnouncements', JSON.stringify([...this.seenAnnouncements]));
        }
        
        setupRealTimeListener() {
            this.db.collection('announcements')
                .where('active', '==', true)
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            this.loadAnnouncements().then(() => {
                                this.showAnnouncements();
                                this.loadDashboardAnnouncements();
                            });
                        }
                    });
                });
        }
        
        showAnnouncements() {
            const newAnnouncements = this.announcements
                .filter(announcement => !this.seenAnnouncements.has(announcement.id))
                .sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                });
            
            if (newAnnouncements.length > 0) {
                this.showAnnouncementModal(newAnnouncements);
            }
        }
        
        showAnnouncementModal(announcements) {
            let currentIndex = 0;
            
            const showCurrentAnnouncement = () => {
                if (currentIndex >= announcements.length) {
                    modal.remove();
                    return;
                }
                
                const announcement = announcements[currentIndex];
                
                const modal = document.createElement('div');
                modal.className = 'announcement-modal';
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    backdrop-filter: blur(10px);
                `;
                
                modal.innerHTML = `
                    <div class="announcement-content" style="
                        background: rgba(26, 26, 46, 0.98);
                        border-radius: 20px;
                        padding: 2.5rem;
                        max-width: 550px;
                        width: 90%;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
                        backdrop-filter: blur(20px);
                        border-top: 5px solid var(--new-year-blue);
                        border-bottom: 5px solid var(--new-year-green);
                    ">
                        <div class="announcement-badge priority-${announcement.priority}" style="
                            background: ${announcement.priority === 'high' ? 'linear-gradient(135deg, var(--danger), #ff7b9c)' : 
                                       announcement.priority === 'medium' ? 'linear-gradient(135deg, var(--warning), #ffe082)' : 
                                       'linear-gradient(135deg, var(--new-year-gold), #ffeaa7)'};
                            color: ${announcement.priority === 'medium' ? 'black' : 'white'};
                            padding: 0.5rem 1rem;
                            border-radius: 25px;
                            font-size: 0.8rem;
                            font-weight: bold;
                            display: inline-block;
                            margin-bottom: 1.5rem;
                            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                        ">
                            ${this.getPriorityIcon(announcement.priority)} ${announcement.priority.toUpperCase()} PRIORITY
                        </div>
                        <h2 class="announcement-header" style="color: var(--new-year-gold); margin-bottom: 1.5rem; font-size: 1.8rem; display: flex; align-items: center; gap: 0.8rem;">
                            ${this.getTypeIcon(announcement.type)} ${announcement.title}
                        </h2>
                        <div class="announcement-message" style="color: white; line-height: 1.6; margin-bottom: 2.5rem; font-size: 1.05rem;">
                            ${announcement.message}
                        </div>
                        <div class="announcement-buttons" style="display: flex; gap: 1rem; justify-content: space-between; align-items: center;">
                            ${currentIndex > 0 ? 
                                `<button class="btn btn-prev" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-weight: 500;">
                                    ← Previous
                                </button>` : 
                                '<div></div>'
                            }
                            <button class="btn btn-next" style="background: linear-gradient(135deg, var(--new-year-blue), var(--new-year-green)); border: none; color: white; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; font-weight: bold; min-width: 120px;">
                                ${currentIndex === announcements.length - 1 ? 'Got it!' : 'Next →'}
                            </button>
                        </div>
                        <div class="announcement-nav" style="text-align: center; margin-top: 1.5rem; color: rgba(255,255,255,0.6); font-size: 0.9rem;">
                            ${currentIndex + 1} of ${announcements.length}
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                const prevBtn = modal.querySelector('.btn-prev');
                const nextBtn = modal.querySelector('.btn-next');
                
                if (prevBtn) {
                    prevBtn.addEventListener('click', () => {
                        modal.remove();
                        currentIndex--;
                        showCurrentAnnouncement();
                    });
                }
                
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => {
                        this.seenAnnouncements.add(announcement.id);
                        this.saveSeenAnnouncements();
                        
                        modal.remove();
                        currentIndex++;
                        showCurrentAnnouncement();
                    });
                }
                
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.seenAnnouncements.add(announcement.id);
                        this.saveSeenAnnouncements();
                        modal.remove();
                        currentIndex++;
                        showCurrentAnnouncement();
                    }
                });
            };
            
            showCurrentAnnouncement();
        }
        
        getPriorityIcon(priority) {
            const icons = {
                high: '🚨',
                medium: '⚠️',
                low: 'ℹ️'
            };
            return icons[priority] || '📢';
        }
        
        getTypeIcon(type) {
            const icons = {
                general: '📢',
                important: '🚨',
                update: '🔄',
                maintenance: '🔧',
                event: '🎉',
                newyear: '🎊',
                future: '🚀'
            };
            return icons[type] || '📢';
        }
        
        loadDashboardAnnouncements() {
            const announcementsList = document.getElementById('announcements-list');
            const announcementsSection = document.getElementById('announcements-section');
            
            if (!announcementsList || !announcementsSection) return;
            
            const latestAnnouncements = this.announcements.slice(0, 3);
            
            if (latestAnnouncements.length === 0) {
                announcementsSection.style.display = 'none';
                return;
            }
            
            announcementsSection.style.display = 'block';
            announcementsList.innerHTML = latestAnnouncements.map(announcement => `
                <div class="announcement-item">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
                        <div>
                            <div style="font-weight: bold; color: var(--new-year-gold); margin-bottom: 0.5rem; font-size: 1.1rem;">
                                ${this.getTypeIcon(announcement.type)} ${announcement.title}
                            </div>
                            <div style="font-size: 0.85rem; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 0.5rem;">
                                <span class="badge priority-${announcement.priority}" style="font-size: 0.7rem;">
                                    ${announcement.priority}
                                </span>
                                • ${announcement.createdAt ? new Date(announcement.createdAt.toDate()).toLocaleDateString() : 'Recently'}
                            </div>
                        </div>
                    </div>
                    <div style="color: rgba(255,255,255,0.9); font-size: 0.95rem; line-height: 1.5;">
                        ${announcement.message}
                    </div>
                </div>
            `).join('');
        }
    }

    // Broadcast System Class
    class BroadcastManager {
        constructor(db) {
            this.db = db;
            this.broadcasts = [];
            this.seenBroadcasts = new Set();
        }
        
        async init() {
            await this.loadBroadcasts();
            this.setupRealTimeListener();
            this.loadSeenBroadcasts();
            this.showBroadcasts();
        }
        
        async loadBroadcasts() {
            try {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                
                const snapshot = await this.db.collection('broadcasts')
                    .where('sentAt', '>', oneWeekAgo)
                    .orderBy('sentAt', 'desc')
                    .limit(10)
                    .get();
                
                this.broadcasts = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    this.broadcasts.push({
                        id: doc.id,
                        title: data.title || 'Broadcast',
                        message: data.message || '',
                        broadcastType: data.broadcastType || 'all',
                        method: data.method || 'notification',
                        sentAt: data.sentAt
                    });
                });
                
            } catch (error) {
                console.error('Error loading broadcasts:', error);
            }
        }
        
        loadSeenBroadcasts() {
            const seen = JSON.parse(localStorage.getItem('seenBroadcasts')) || [];
            this.seenBroadcasts = new Set(seen);
        }
        
        saveSeenBroadcasts() {
            localStorage.setItem('seenBroadcasts', JSON.stringify([...this.seenBroadcasts]));
        }
        
        setupRealTimeListener() {
            this.db.collection('broadcasts')
                .orderBy('sentAt', 'desc')
                .limit(1)
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            this.loadBroadcasts().then(() => {
                                this.showBroadcasts();
                            });
                        }
                    });
                });
        }
        
        showBroadcasts() {
            const newBroadcasts = this.broadcasts
                .filter(broadcast => 
                    !this.seenBroadcasts.has(broadcast.id) && 
                    broadcast.method !== 'notification'
                );
            
            newBroadcasts.forEach(broadcast => {
                this.showBroadcastBanner(broadcast);
            });
        }
        
        showBroadcastBanner(broadcast) {
            const banner = document.createElement('div');
            banner.className = 'broadcast-banner';
            banner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: linear-gradient(135deg, var(--new-year-blue), var(--new-year-green));
                color: white;
                padding: 1.2rem;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                animation: slideDown 0.5s ease-out;
            `;
            
            banner.innerHTML = `
                <div class="broadcast-content" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                ">
                    <div class="broadcast-message" style="flex: 1; font-size: 1rem;">
                        <strong>🚀 ${broadcast.title}:</strong> ${broadcast.message}
                    </div>
                    <button class="broadcast-close" onclick="this.parentElement.parentElement.remove(); broadcastManager.markAsSeen('${broadcast.id}')" style="
                        background: rgba(255,255,255,0.2);
                        border: 1px solid rgba(255,255,255,0.3);
                        color: white;
                        padding: 0.6rem 1.2rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.3s;
                    ">
                        Got it!
                    </button>
                </div>
            `;
            
            document.body.appendChild(banner);
            
            setTimeout(() => {
                if (banner.parentElement) {
                    banner.remove();
                    this.markAsSeen(broadcast.id);
                }
            }, 12000);
        }
        
        markAsSeen(broadcastId) {
            this.seenBroadcasts.add(broadcastId);
            this.saveSeenBroadcasts();
        }
    }
    
    // Add logout button to header
    function addLogoutButton() {
        const userInfo = document.querySelector('.user-info');
        if (!userInfo.querySelector('.logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.className = 'logout-btn';
            logoutBtn.style.background = 'rgba(239, 71, 111, 0.2)';
            logoutBtn.style.border = '1px solid rgba(239, 71, 111, 0.3)';
            logoutBtn.style.color = 'var(--danger)';
            logoutBtn.style.padding = '0.6rem';
            logoutBtn.style.borderRadius = '12px';
            logoutBtn.style.marginLeft = '0.5rem';
            logoutBtn.style.cursor = 'pointer';
            logoutBtn.style.transition = 'all 0.3s';
            logoutBtn.title = 'Logout';
            
            logoutBtn.addEventListener('mouseenter', () => {
                logoutBtn.style.background = 'rgba(239, 71, 111, 0.3)';
                logoutBtn.style.transform = 'translateY(-2px)';
            });
            
            logoutBtn.addEventListener('mouseleave', () => {
                logoutBtn.style.background = 'rgba(239, 71, 111, 0.2)';
                logoutBtn.style.transform = 'translateY(0)';
            });
            
            logoutBtn.addEventListener('click', handleLogout);
            userInfo.appendChild(logoutBtn);
        }
    }
        
    // Check authentication state
    function checkAuthState() {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const doc = await db.collection('users').doc(user.uid).get();
                    
                    if (doc.exists) {
                        currentUser = {
                            uid: user.uid,
                            ...doc.data()
                        };
                        
                        // Initialize arrays if they don't exist
                        if (!currentUser.unlockedCourses) currentUser.unlockedCourses = [];
                        if (!currentUser.usedPromoCodes) currentUser.usedPromoCodes = [];
                        if (!currentUser.likedCourses) currentUser.likedCourses = [];
                        if (!currentUser.dislikedCourses) currentUser.dislikedCourses = [];
                        if (!currentUser.claimedAirdrops) currentUser.claimedAirdrops = [];
                        if (!currentUser.usedBonusCodes) currentUser.usedBonusCodes = [];
                        if (!currentUser.visitedSocials) currentUser.visitedSocials = {};
                        
                        await initializeApp();
                        document.getElementById('auth-container').style.display = 'none';
                        appContainer.style.display = 'grid';
                    } else {
                        await auth.signOut();
                        document.getElementById('auth-container').style.display = 'flex';
                    }
                } catch (error) {
                    console.error('Error checking user data:', error);
                    document.getElementById('auth-container').style.display = 'flex';
                }
            } else {
                document.getElementById('auth-container').style.display = 'flex';
            }
        });
    }
    
    // Handle logout
    async function handleLogout() {
        try {
            await auth.signOut();
            currentUser = null;
            appContainer.style.display = 'none';
            document.getElementById('auth-container').style.display = 'flex';
            
            loginForm.reset();
            registerForm.reset();
            
            showSuccess('You have been logged out successfully.');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed: ' + error.message);
        }
    }
    
    // Auth Tab Switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            
            document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
        });
    });
    
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.auth-tab[data-tab="register"]').click();
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.auth-tab[data-tab="login"]').click();
    });
    
    // Register Form Submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const country = document.getElementById('register-country').value;
        
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            await db.collection('users').doc(user.uid).set({
                username,
                email,
                country,
                lp: 150, // Starting LP for 2026
                streak: 0,
                lastClaimDate: null,
                unlockedCourses: [],
                usedBonusCodes: [],
                usedPromoCodes: [],
                likedCourses: [],
                dislikedCourses: [],
                claimedAirdrops: [],
                visitedSocials: {},
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            currentUser = {
                uid: user.uid,
                username,
                email,
                country,
                lp: 150,
                streak: 0,
                lastClaimDate: null,
                unlockedCourses: [],
                usedBonusCodes: [],
                usedPromoCodes: [],
                likedCourses: [],
                dislikedCourses: [],
                claimedAirdrops: [],
                visitedSocials: {}
            };
            
            await initializeApp();
            
            document.getElementById('auth-container').style.display = 'none';
            appContainer.style.display = 'grid';
            
            showSuccess('Registration successful! Welcome to Legend Tech Academy 2026.');
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Login Form Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            const doc = await db.collection('users').doc(user.uid).get();
            
            if (doc.exists) {
                currentUser = {
                    uid: user.uid,
                    ...doc.data()
                };
                
                // Initialize arrays if they don't exist
                if (!currentUser.unlockedCourses) currentUser.unlockedCourses = [];
                if (!currentUser.usedPromoCodes) currentUser.usedPromoCodes = [];
                if (!currentUser.likedCourses) currentUser.likedCourses = [];
                if (!currentUser.dislikedCourses) currentUser.dislikedCourses = [];
                if (!currentUser.claimedAirdrops) currentUser.claimedAirdrops = [];
                if (!currentUser.usedBonusCodes) currentUser.usedBonusCodes = [];
                if (!currentUser.visitedSocials) currentUser.visitedSocials = {};
                
                await initializeApp();
                
                document.getElementById('auth-container').style.display = 'none';
                appContainer.style.display = 'grid';
            } else {
                alert('User data not found. Please register again.');
            }
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Initialize App
    async function initializeApp() {
        userName.textContent = currentUser.username;
        updateLpDisplay();
        loadSocialStatus();
        
        addLogoutButton();
        
        notificationManager = new NotificationManager(db);
        await notificationManager.init();
        
        announcementManager = new AnnouncementManager(db);
        await announcementManager.init();
        
        broadcastManager = new BroadcastManager(db);
        await broadcastManager.init();
        
        // Initialize chat notification manager
        chatNotificationManager = new ChatNotificationManager(db);
        await chatNotificationManager.init();
        
        initializeStreak();
        initializeLpPackages();
        await initializeCourses();
        await initializeChat();
        setupNavigation();
        
        // Setup upload button
        if (uploadCourseBtn) {
            uploadCourseBtn.addEventListener('click', () => {
                window.location.href = 'tutor.html';
            });
        }
        
        // Setup social media buttons
        setupSocialButtons();
        
        // Setup website buttons
        setupWebsiteButtons();
        
        // Load available airdrops
        await loadAvailableAirdrops();
    }
    
    function updateLpDisplay() {
        const lp = currentUser.lp || 0;
        lpBalanceDisplay.textContent = `${lp} LP`;
        userLpDisplay.textContent = `${lp} LP`;
        if (userLpModal) {
            userLpModal.textContent = lp;
        }
    }
    
    function loadSocialStatus() {
        if (!currentUser.visitedSocials) {
            currentUser.visitedSocials = {};
        }
        
        socialVisited = {
            whatsapp: currentUser.visitedSocials.whatsapp || false,
            youtube: currentUser.visitedSocials.youtube || false,
            twitter: currentUser.visitedSocials.twitter || false,
            tiktok: currentUser.visitedSocials.tiktok || false
        };
        
        // Update status displays
        Object.keys(socialStatus).forEach(platform => {
            if (socialStatus[platform]) {
                socialStatus[platform].textContent = socialVisited[platform] ? 'Visited ✓' : 'Not Visited';
                socialStatus[platform].style.color = socialVisited[platform] ? 'var(--new-year-green)' : 'var(--danger)';
            }
        });
        
        // Calculate total social LP earned
        let total = 0;
        Object.values(socialVisited).forEach(visited => {
            if (visited) total += 50;
        });
        
        if (totalSocialLp) {
            totalSocialLp.textContent = total;
        }
    }
    
    function initializeStreak() {
        streakContainer.innerHTML = '';
        
        const today = new Date().toDateString();
        const lastClaim = currentUser.lastClaimDate ? new Date(currentUser.lastClaimDate).toDateString() : null;
        
        if (lastClaim === today) {
            claimBtn.disabled = true;
            claimBtn.textContent = 'Already Claimed Today';
            claimBtn.style.opacity = '0.7';
        } else if (lastClaim && isYesterday(new Date(currentUser.lastClaimDate))) {
            currentStreak = currentUser.streak;
        } else {
            currentStreak = 0;
        }
        
        for (let i = 1; i <= 7; i++) {
            const day = document.createElement('div');
            day.className = 'streak-day';
            
            if (i <= currentStreak) {
                day.classList.add('completed');
            } else if (i === currentStreak + 1) {
                day.classList.add('active');
            }
            
            day.textContent = i;
            streakContainer.appendChild(day);
        }
    }
    
    function isYesterday(date) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.toDateString() === yesterday.toDateString();
    }
    
    // Claim Daily LP
    claimBtn.addEventListener('click', async () => {
        const today = new Date();
        
        if (currentUser.lastClaimDate && new Date(currentUser.lastClaimDate).toDateString() === today.toDateString()) {
            return;
        }
        
        const isContinuingStreak = currentUser.lastClaimDate && isYesterday(new Date(currentUser.lastClaimDate));
        
        if (isContinuingStreak) {
            currentUser.streak++;
        } else {
            currentUser.streak = 1;
        }
        
        let lpEarned = 10;
        if (currentUser.streak % 7 === 0) {
            lpEarned += 30;
            showSuccess(`✨ Congratulations! You completed a 7-day streak and earned 40 LP total!`);
        } else {
            showSuccess(`🚀 You claimed 10 LP! Come back tomorrow for more.`);
        }
        
        currentUser.lp = (currentUser.lp || 0) + lpEarned;
        currentUser.lastClaimDate = today.toISOString();
        
        await updateUserData();
        updateLpDisplay();
        initializeStreak();
    });
    
    // Redeem Promo Code
    redeemBtn.addEventListener('click', async () => {
        const code = promoCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            showSuccess('Please enter a promo code.', false);
            return;
        }
        
        if (promoCodes[code]) {
            if (currentUser.usedPromoCodes && currentUser.usedPromoCodes.includes(code)) {
                showSuccess('You have already used this promo code.', false);
                return;
            }
            
            const lpToAdd = promoCodes[code];
            currentUser.lp = (currentUser.lp || 0) + lpToAdd;
            
            if (!currentUser.usedPromoCodes) {
                currentUser.usedPromoCodes = [];
            }
            
            currentUser.usedPromoCodes.push(code);
            
            await updateUserData();
            updateLpDisplay();
            promoCodeInput.value = '';
            
            showSuccess(`🎉 Promo code "${code}" redeemed! You received ${lpToAdd} LP.`);
        } else {
            showSuccess('Invalid promo code. Please try again.', false);
        }
    });
          
     // Redeem Purchase Code
    bonusRedeemBtn.addEventListener('click', async () => {
        const code = bonusCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            bonusResult.textContent = 'Please enter a purchase code';
            bonusResult.style.color = 'var(--danger)';
            return;
        }
        
        if (purchaseCodes[code]) {
            const lpToAdd = purchaseCodes[code];
            currentUser.lp = (currentUser.lp || 0) + lpToAdd;
            
            await updateUserData();
            updateLpDisplay();
            bonusCodeInput.value = '';
            
            bonusResult.textContent = `Success! You received ${lpToAdd} LP`;
            bonusResult.style.color = 'var(--success)';
            
            showSuccess(`🪙 Purchase code redeemed! You received ${lpToAdd} LP.`);
        } else {
            bonusResult.textContent = 'Invalid purchase code';
            bonusResult.style.color = 'var(--danger)';
        }
    });
    
    function initializeLpPackages() {
        lpPackagesContainer.innerHTML = '';
        
        const currency = currencyRates[currentUser.country] || currencyRates['NG'];
        
        lpPackages.forEach(pkg => {
            const convertedPrice = Math.round(pkg.price * currency.rate);
            const packageElement = document.createElement('div');
            packageElement.className = 'lp-package';
            packageElement.innerHTML = `
                <h4>${pkg.amount} LP</h4>
                <div class="price">${currency.symbol}${convertedPrice} ${currency.code}</div>
                <button class="btn purchase-btn" data-amount="${pkg.amount}">Purchase</button>
            `;
            lpPackagesContainer.appendChild(packageElement);
        });
        
        document.querySelectorAll('.purchase-btn').forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const paypalLinks = [
                    'https://www.paypal.com/ncp/payment/ZS9JMERWH637S',
                    'https://www.paypal.com/ncp/payment/MLZM5P6MSAR6W',
                    'https://www.paypal.com/ncp/payment/L3M3A7V23YK8J',
                    'https://www.paypal.com/ncp/payment/AEJXLGMYZKGQ2',
                    'https://www.paypal.com/ncp/payment/59HBQS5BS89W6'
                ];
                
                const paypalUrl = paypalLinks[index] || paypalLinks[0];
                window.open(paypalUrl, '_blank');
            });
        });
    }
    
    // Store all courses for search functionality
    let allCourses = [];
    
    // Initialize courses - loads from all sources
    async function initializeCourses() {
        coursesContainer.innerHTML = '';
        
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.style.cssText = `
            position: relative;
            margin-bottom: 2rem;
            width: 100%;
            max-width: 600px;
        `;
        searchContainer.innerHTML = `
            <input type="text" id="course-search-input" placeholder="Search all courses..." 
                   style="width: 100%; padding: 1rem 1.5rem 1rem 4rem; 
                          border: 1px solid rgba(255, 255, 255, 0.15); 
                          background: rgba(255, 255, 255, 0.07); 
                          color: white; border-radius: 15px; font-size: 1rem;">
            <i class="fas fa-search" style="position: absolute; left: 1.5rem; top: 50%; 
                transform: translateY(-50%); color: var(--new-year-teal); font-size: 1.2rem;"></i>
        `;
        coursesContainer.appendChild(searchContainer);
        
        // Create courses grid
        const coursesGrid = document.createElement('div');
        coursesGrid.className = 'courses-grid';
        coursesGrid.id = 'courses-grid';
        coursesGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.8rem;
            margin-top: 1rem;
        `;
        coursesContainer.appendChild(coursesGrid);
        
        // Create no results message
        const noResults = document.createElement('div');
        noResults.id = 'no-results-message';
        noResults.className = 'no-results';
        noResults.textContent = 'No courses found matching your search.';
        noResults.style.cssText = `
            text-align: center;
            padding: 3rem;
            color: rgba(255, 255, 255, 0.5);
            font-size: 1.1rem;
            display: none;
        `;
        coursesContainer.appendChild(noResults);
        
        // Load courses from all sources
        await loadAllCourses();
        
        // Setup search functionality
        const searchInput = document.getElementById('course-search-input');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterCourses(searchTerm);
        });
    }
    
    // Load courses from all sources
    async function loadAllCourses() {
        try {
            // Load from Firestore (admin and tutor courses)
            const coursesSnapshot = await db.collection('courses').get();
            const firestoreCourses = [];
            
            coursesSnapshot.forEach(doc => {
                const courseData = doc.data();
                firestoreCourses.push({
                    id: courseData.id || doc.id,
                    title: courseData.title,
                    description: courseData.description,
                    image: courseData.image,
                    url: courseData.url,
                    price: courseData.price || 100,
                    source: courseData.source || 'firestore',
                    tutorName: courseData.tutorName,
                    tutorId: courseData.tutorId,
                    likes: courseData.likes || 0,
                    dislikes: courseData.dislikes || 0,
                    unlocks: courseData.unlocks || 0
                });
            });
            
            // Combine all courses
            allCourses = [...courses, ...firestoreCourses];
            renderCourses(allCourses);
        } catch (error) {
            console.error('Error loading courses:', error);
            allCourses = courses;
            renderCourses(allCourses);
        }
    }
    
    function renderCourses(coursesToRender) {
        const coursesGrid = document.getElementById('courses-grid');
        const noResults = document.getElementById('no-results-message');
        
        if (!coursesGrid) return;
        
        coursesGrid.innerHTML = '';
        
        if (coursesToRender.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        coursesToRender.forEach(course => {
            const isUnlocked = currentUser.unlockedCourses && currentUser.unlockedCourses.includes(course.id);
            const hasLiked = currentUser.likedCourses && currentUser.likedCourses.includes(course.id);
            const hasDisliked = currentUser.dislikedCourses && currentUser.dislikedCourses.includes(course.id);
            
            const courseElement = document.createElement('div');
            courseElement.className = `course-card ${isUnlocked ? '' : 'locked'}`;
            courseElement.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 1.5rem;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                height: 100%;
            `;
            
            let courseContent = '';
            
            // Course image container
            const imageContainer = `
                <div class="course-image-container" style="
                    width: 100%;
                    height: 200px;
                    overflow: hidden;
                    border-radius: 10px;
                    margin-bottom: 1.2rem;
                ">
                    <img src="${course.image}" alt="${course.title}" 
                         style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            `;
            
            if (isUnlocked) {
                courseContent = `
                    ${imageContainer}
                    <h3 style="margin: 0 0 0.8rem 0; color: var(--new-year-gold); font-size: 1.3rem; min-height: 3.5rem;">${course.title}</h3>
                    <p style="margin: 0 0 1.2rem 0; color: rgba(255, 255, 255, 0.8); font-size: 0.95rem; flex-grow: 1; line-height: 1.5;">${course.description}</p>
                    ${course.tutorName ? `
                        <div class="tutor-info" style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem;">
                            <i class="fas fa-chalkboard-teacher" style="color: var(--new-year-teal);"></i>
                            <span style="color: rgba(255, 255, 255, 0.8); font-size: 0.9rem;">By: ${course.tutorName}</span>
                            <span class="tutor-badge" style="background: var(--new-year-green); color: white; padding: 0.3rem 0.7rem; border-radius: 6px; font-size: 0.75rem;">Tutor</span>
                        </div>
                    ` : ''}
                    <div class="course-interactions" style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <button class="interaction-btn like-btn ${hasLiked ? 'liked' : ''}" data-course-id="${course.id}" style="
                            background: ${hasLiked ? 'var(--new-year-green)' : 'rgba(255, 255, 255, 0.07)'};
                            border: 1px solid ${hasLiked ? 'var(--new-year-green)' : 'rgba(255, 255, 255, 0.15)'};
                            color: white; padding: 0.6rem 1.2rem; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fas fa-thumbs-up"></i>
                            <span class="like-count">${course.likes || 0}</span>
                        </button>
                        <button class="interaction-btn dislike-btn ${hasDisliked ? 'disliked' : ''}" data-course-id="${course.id}" style="
                            background: ${hasDisliked ? 'var(--danger)' : 'rgba(255, 255, 255, 0.07)'};
                            border: 1px solid ${hasDisliked ? 'var(--danger)' : 'rgba(255, 255, 255, 0.15)'};
                            color: white; padding: 0.6rem 1.2rem; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fas fa-thumbs-down"></i>
                            <span class="dislike-count">${course.dislikes || 0}</span>
                        </button>
                    </div>
                    <div class="course-meta" style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                        <div class="course-price" style="color: var(--new-year-green); font-weight: bold; font-size: 1rem;">Unlocked</div>
                        <a href="${course.url}" target="_blank" class="btn" style="background: var(--new-year-green); color: black; padding: 0.7rem 1.5rem; border-radius: 12px; text-decoration: none; font-weight: bold; display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fas fa-play"></i> Start Learning
                        </a>
                    </div>
                `;
            } else {
                courseContent = `
                    ${imageContainer}
                    <h3 style="margin: 0 0 0.8rem 0; color: var(--new-year-gold); font-size: 1.3rem; min-height: 3.5rem;">${course.title}</h3>
                    <p style="margin: 0 0 1.2rem 0; color: rgba(255, 255, 255, 0.8); font-size: 0.95rem; flex-grow: 1; line-height: 1.5;">${course.description}</p>
                    ${course.tutorName ? `
                        <div class="tutor-info" style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem;">
                            <i class="fas fa-chalkboard-teacher" style="color: var(--new-year-teal);"></i>
                            <span style="color: rgba(255, 255, 255, 0.8); font-size: 0.9rem;">By: ${course.tutorName}</span>
                            <span class="tutor-badge" style="background: var(--new-year-green); color: white; padding: 0.3rem 0.7rem; border-radius: 6px; font-size: 0.75rem;">Tutor</span>
                        </div>
                    ` : ''}
                    <div class="course-meta" style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                        <div class="course-price" style="color: var(--danger); font-weight: bold; font-size: 1rem;">${course.price || 100} LP</div>
                        <button class="btn" data-course-id="${course.id}" style="background: var(--danger); color: white; padding: 0.7rem 1.5rem; border-radius: 12px; border: none; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 0.6rem;">
                            <i class="fas fa-lock-open"></i> Unlock
                        </button>
                    </div>
                `;
            }
            
            courseElement.innerHTML = courseContent;
            
            // Add data attributes for search filtering
            courseElement.setAttribute('data-title', course.title.toLowerCase());
            courseElement.setAttribute('data-description', course.description.toLowerCase());
            
            if (isUnlocked) {
                // Add interaction event listeners
                const likeBtn = courseElement.querySelector('.like-btn');
                const dislikeBtn = courseElement.querySelector('.dislike-btn');
                
                if (likeBtn) {
                    likeBtn.addEventListener('click', () => handleCourseInteraction(course.id, 'like'));
                }
                
                if (dislikeBtn) {
                    dislikeBtn.addEventListener('click', () => handleCourseInteraction(course.id, 'dislike'));
                }
            } else {
                const unlockBtn = courseElement.querySelector('.btn');
                unlockBtn.addEventListener('click', () => {
                    openCourseModal(course);
                });
            }
            
            coursesGrid.appendChild(courseElement);
        });
    }
    
    // Search and filter courses
    function filterCourses(searchTerm) {
        const coursesGrid = document.getElementById('courses-grid');
        const noResults = document.getElementById('no-results-message');
        
        if (!coursesGrid || !searchTerm) {
            renderCourses(allCourses);
            return;
        }
        
        const filteredCourses = allCourses.filter(course => {
            const titleMatch = course.title.toLowerCase().includes(searchTerm);
            const descriptionMatch = course.description.toLowerCase().includes(searchTerm);
            const tutorMatch = course.tutorName && course.tutorName.toLowerCase().includes(searchTerm);
            
            return titleMatch || descriptionMatch || tutorMatch;
        });
        
        if (filteredCourses.length === 0) {
            coursesGrid.innerHTML = '';
            noResults.style.display = 'block';
        } else {
            renderCourses(filteredCourses);
        }
    }
    
    function openCourseModal(course) {
        courseCostDisplay.textContent = course.price || 100;
        if (userLpModal) {
            userLpModal.textContent = currentUser.lp || 0;
        }
        
        if ((currentUser.lp || 0) >= (course.price || 100)) {
            purchaseError.style.display = 'none';
            confirmPurchase.disabled = false;
        } else {
            purchaseError.style.display = 'block';
            confirmPurchase.disabled = true;
        }
        
        confirmPurchase.dataset.courseId = course.id;
        confirmPurchase.dataset.courseTitle = course.title;
        courseModal.classList.add('active');
    }
    
    function closeModals() {
        courseModal.classList.remove('active');
        successModal.classList.remove('active');
        airdropModal.classList.remove('active');
    }
    
    if (closeCourseModal) closeCourseModal.addEventListener('click', closeModals);
    if (cancelPurchase) cancelPurchase.addEventListener('click', closeModals);
    if (closeSuccessModal) closeSuccessModal.addEventListener('click', closeModals);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModals);
    if (closeAirdropModal) closeAirdropModal.addEventListener('click', closeModals);
    if (closeAirdropBtn) closeAirdropBtn.addEventListener('click', closeModals);
    
    // Confirm purchase handler
    if (confirmPurchase) {
        confirmPurchase.addEventListener('click', async function() {
            const courseId = this.dataset.courseId;
            const courseTitle = this.dataset.courseTitle;
            const coursePrice = parseInt(courseCostDisplay.textContent);
            
            if ((currentUser.lp || 0) >= coursePrice) {
                currentUser.lp -= coursePrice;
                
                if (!currentUser.unlockedCourses) {
                    currentUser.unlockedCourses = [];
                }
                
                if (!currentUser.unlockedCourses.includes(courseId)) {
                    currentUser.unlockedCourses.push(courseId);
                }
                
                await updateUserData();
                await updateCourseUnlocks(courseId);
                updateLpDisplay();
                closeModals();
                showSuccess(`Course unlocked: ${courseTitle}`);
                await loadAllCourses(); // Refresh courses
            } else {
                purchaseError.style.display = 'block';
            }
        });
    }
    
    // Update course unlocks and tutor points
    async function updateCourseUnlocks(courseId) {
        try {
            // First check hardcoded courses
            const hardcodedCourse = courses.find(c => c.id.toString() === courseId.toString());
            if (hardcodedCourse) {
                // For hardcoded courses, just update user data
                return;
            }
            
            // Find the course in Firestore
            const coursesQuery = await db.collection('courses').where('id', '==', courseId).get();
            
            if (!coursesQuery.empty) {
                const courseDoc = coursesQuery.docs[0];
                const courseRef = db.collection('courses').doc(courseDoc.id);
                const courseData = courseDoc.data();
                
                // Update course unlocks
                await courseRef.update({
                    unlocks: (courseData.unlocks || 0) + 1
                });
                
                // Update tutor points if this is a tutor course
                if (courseData.tutorId) {
                    await db.collection('tutors').doc(courseData.tutorId).update({
                        totalUnlocks: firebase.firestore.FieldValue.increment(1),
                        tutorPoints: firebase.firestore.FieldValue.increment(1)
                    });
                    
                    // Update tutor points on the course
                    await courseRef.update({
                        tutorPointsEarned: (courseData.tutorPointsEarned || 0) + 1
                    });
                }
            }
        } catch (error) {
            console.error('Error updating course unlocks:', error);
        }
    }
    
    // Handle course interactions (likes/dislikes)
    async function handleCourseInteraction(courseId, type) {
        try {
            // First check hardcoded courses
            const hardcodedCourse = courses.find(c => c.id.toString() === courseId.toString());
            let isHardcoded = !!hardcodedCourse;
            
            let courseRef = null;
            let courseData = null;
            let tutorUpdateData = {};
            
            if (!isHardcoded) {
                // Find the course in Firestore
                const coursesQuery = await db.collection('courses').where('id', '==', courseId).get();
                
                if (coursesQuery.empty) return;
                
                const courseDoc = coursesQuery.docs[0];
                courseRef = db.collection('courses').doc(courseDoc.id);
                courseData = courseDoc.data();
            } else {
                courseData = hardcodedCourse;
            }
            
            // Initialize arrays if they don't exist
            if (!currentUser.likedCourses) currentUser.likedCourses = [];
            if (!currentUser.dislikedCourses) currentUser.dislikedCourses = [];
            
            let updateData = {};
            let userUpdateData = {};
            
            if (type === 'like') {
                if (currentUser.likedCourses.includes(courseId)) {
                    // Remove like
                    updateData.likes = (courseData.likes || 1) - 1;
                    userUpdateData.likedCourses = currentUser.likedCourses.filter(id => id !== courseId);
                    
                    if (courseData.tutorId && !isHardcoded) {
                        tutorUpdateData.tutorPoints = firebase.firestore.FieldValue.increment(-1);
                        tutorUpdateData.totalLikes = firebase.firestore.FieldValue.increment(-1);
                    }
                } else {
                    // Add like
                    updateData.likes = (courseData.likes || 0) + 1;
                    userUpdateData.likedCourses = [...currentUser.likedCourses, courseId];
                    
                    // Remove from dislikes if previously disliked
                    if (currentUser.dislikedCourses.includes(courseId)) {
                        updateData.dislikes = (courseData.dislikes || 1) - 1;
                        userUpdateData.dislikedCourses = currentUser.dislikedCourses.filter(id => id !== courseId);
                        
                        if (courseData.tutorId && !isHardcoded) {
                            tutorUpdateData.tutorPoints = firebase.firestore.FieldValue.increment(2); // +1 for like, +1 for removing dislike
                            tutorUpdateData.totalDislikes = firebase.firestore.FieldValue.increment(-1);
                        }
                    }
                    
                    if (courseData.tutorId && !isHardcoded) {
                        tutorUpdateData.tutorPoints = firebase.firestore.FieldValue.increment(1);
                        tutorUpdateData.totalLikes = firebase.firestore.FieldValue.increment(1);
                    }
                }
            } else if (type === 'dislike') {
                if (currentUser.dislikedCourses.includes(courseId)) {
                    // Remove dislike
                    updateData.dislikes = (courseData.dislikes || 1) - 1;
                    userUpdateData.dislikedCourses = currentUser.dislikedCourses.filter(id => id !== courseId);
                    
                    if (courseData.tutorId && !isHardcoded) {
                        tutorUpdateData.tutorPoints = firebase.firestore.FieldValue.increment(1);
                        tutorUpdateData.totalDislikes = firebase.firestore.FieldValue.increment(-1);
                    }
                } else {
                    // Add dislike
                    updateData.dislikes = (courseData.dislikes || 0) + 1;
                    userUpdateData.dislikedCourses = [...currentUser.dislikedCourses, courseId];
                    
                    // Remove from likes if previously liked
                    if (currentUser.likedCourses.includes(courseId)) {
                        updateData.likes = (courseData.likes || 1) - 1;
                        userUpdateData.likedCourses = currentUser.likedCourses.filter(id => id !== courseId);
                        
                        if (courseData.tutorId && !isHardcoded) {
                            tutorUpdateData.tutorPoints = firebase.firestore.FieldValue.increment(-2); // -1 for dislike, -1 for removing like
                            tutorUpdateData.totalLikes = firebase.firestore.FieldValue.increment(-1);
                        }
                    }
                    
                    if (courseData.tutorId && !isHardcoded) {
                        tutorUpdateData.tutorPoints = firebase.firestore.FieldValue.increment(-1);
                        tutorUpdateData.totalDislikes = firebase.firestore.FieldValue.increment(1);
                    }
                }
            }
            
            // Update course in Firestore if not hardcoded
            if (!isHardcoded && courseRef) {
                await courseRef.update(updateData);
                
                // Update tutor if this is a tutor course
                if (courseData.tutorId && Object.keys(tutorUpdateData).length > 0) {
                    await db.collection('tutors').doc(courseData.tutorId).update(tutorUpdateData);
                }
            }
            
            // Update user
            await db.collection('users').doc(currentUser.uid).update(userUpdateData);
            
            // Update current user object
            if (type === 'like') {
                if (currentUser.likedCourses.includes(courseId)) {
                    currentUser.likedCourses = currentUser.likedCourses.filter(id => id !== courseId);
                } else {
                    currentUser.likedCourses = [...currentUser.likedCourses, courseId];
                    if (currentUser.dislikedCourses.includes(courseId)) {
                        currentUser.dislikedCourses = currentUser.dislikedCourses.filter(id => id !== courseId);
                    }
                }
            } else {
                if (currentUser.dislikedCourses.includes(courseId)) {
                    currentUser.dislikedCourses = currentUser.dislikedCourses.filter(id => id !== courseId);
                } else {
                    currentUser.dislikedCourses = [...currentUser.dislikedCourses, courseId];
                    if (currentUser.likedCourses.includes(courseId)) {
                        currentUser.likedCourses = currentUser.likedCourses.filter(id => id !== courseId);
                    }
                }
            }
            
            // Refresh the course display
            await loadAllCourses();
            
        } catch (error) {
            console.error('Error handling course interaction:', error);
            showSuccess('Error updating interaction. Please try again.', false);
        }
    }
   
    // Initialize chat
    async function initializeChat() {
        if (!chatMessagesContainer) return;
        
        chatMessagesContainer.innerHTML = '';
        
        // Add initial global chat messages
        globalChatMessages.forEach(msg => {
            addChatMessage(msg.username, msg.message, msg.time);
        });
        
        // Load global chat messages from Firestore
        await loadGlobalChat();
        
        // Set up real-time listener for new messages
        setupChatListener();
        
        // Setup reply functionality
        setupReplyFunctionality();
    }
    
    // Load global chat from Firestore
    async function loadGlobalChat() {
        try {
            const chatRef = db.collection('globalChat').orderBy('timestamp', 'asc');
            const snapshot = await chatRef.get();
            
            snapshot.forEach(doc => {
                const msg = doc.data();
                addChatMessage(msg.username, msg.message, msg.time, msg.replyToUsername, msg.replyToMessage);
            });
            
            // Update last read time after loading messages
            if (chatNotificationManager) {
                chatNotificationManager.lastReadTimestamp = new Date().toISOString();
                chatNotificationManager.saveLastReadTime();
            }
        } catch (error) {
            console.error('Error loading global chat:', error);
        }
    }
    
    // Set up real-time chat listener
    function setupChatListener() {
        db.collection('globalChat')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const msg = change.doc.data();
                        addChatMessage(msg.username, msg.message, msg.time, msg.replyToUsername, msg.replyToMessage);
                    }
                });
            });
    }
    
    // Add chat message
    function addChatMessage(username, message, time = null, replyToUsername = null, replyToMessage = null) {
        if (!chatMessagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${username === currentUser?.username ? 'user' : ''}`;
        
        if (replyToUsername) {
            messageElement.classList.add('reply');
        }
        
        // Check for mentions
        if (message && message.includes(`@${currentUser?.username}`)) {
            messageElement.classList.add('mention');
        }
        
        if (!time) {
            const now = new Date();
            time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        let replySection = '';
        if (replyToUsername) {
            replySection = `
                <div class="message-reply">
                    <span class="reply-username">${replyToUsername}</span>
                    ${replyToMessage}
                </div>
            `;
        }
        
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${username.charAt(0).toUpperCase()}</div>
                <div class="message-username">${username}</div>
                <div class="message-time">${time}</div>
            </div>
            ${replySection}
            <div class="message-content">${message}</div>
        `;
        
        // Add click event for reply
        messageElement.addEventListener('click', (e) => {
            if (e.target.closest('.message-reply')) return;
            setReplyTarget(username, message);
        });
        
        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
    
    // Setup reply functionality
    function setupReplyFunctionality() {
        if (cancelReplyBtn) {
            cancelReplyBtn.addEventListener('click', () => {
                currentReply = null;
                replyPreview.style.display = 'none';
                chatInput.placeholder = 'Type your message...';
            });
        }
    }
    
    // Set reply target
    function setReplyTarget(username, message) {
        currentReply = { username, message };
        
        replyPreview.querySelector('.reply-username').textContent = username;
        replyPreview.querySelector('.reply-message').textContent = message.length > 50 ? message.substring(0, 50) + '...' : message;
        replyPreview.style.display = 'flex';
        
        chatInput.placeholder = `Replying to ${username}...`;
        chatInput.focus();
    }
    
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Send message to global chat
    async function sendMessage() {
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (message && currentUser) {
            const now = new Date();
            
            const newMessage = {
                username: currentUser.username,
                message,
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userId: currentUser.uid
            };
            
            // Add reply data if replying
            if (currentReply) {
                newMessage.replyToUsername = currentReply.username;
                newMessage.replyToMessage = currentReply.message;
                
                // Find the user being replied to
                const usersSnapshot = await db.collection('users')
                    .where('username', '==', currentReply.username)
                    .limit(1)
                    .get();
                    
                if (!usersSnapshot.empty) {
                    const userDoc = usersSnapshot.docs[0];
                    newMessage.replyToUserId = userDoc.id;
                }
            }
            
            try {
                await db.collection('globalChat').add(newMessage);
                chatInput.value = '';
                
                // Clear reply
                currentReply = null;
                replyPreview.style.display = 'none';
                chatInput.placeholder = 'Type your message...';
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Error sending message. Please try again.');
            }
        }
    }
    
    // Setup social media buttons
    function setupSocialButtons() {
        socialButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const url = button.dataset.url;
                const platform = button.closest('.social-card').dataset.platform;
                
                if (!socialVisited[platform]) {
                    // Award LP
                    currentUser.lp = (currentUser.lp || 0) + 50;
                    currentUser.visitedSocials = currentUser.visitedSocials || {};
                    currentUser.visitedSocials[platform] = true;
                    
                    await updateUserData();
                    updateLpDisplay();
                    
                    socialVisited[platform] = true;
                    if (socialStatus[platform]) {
                        socialStatus[platform].textContent = 'Visited ✓';
                        socialStatus[platform].style.color = 'var(--new-year-green)';
                    }
                    
                    // Update total social LP
                    let total = 0;
                    Object.values(socialVisited).forEach(visited => {
                        if (visited) total += 50;
                    });
                    
                    if (totalSocialLp) {
                        totalSocialLp.textContent = total;
                    }
                    
                    showSuccess(`🎉 50 LP awarded for visiting ${platform}!`);
                }
                
                // Open social media link
                window.open(url, '_blank');
            });
        });
    }
    
    // Setup website buttons
    function setupWebsiteButtons() {
        websiteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const url = button.dataset.url;
                window.open(url, '_blank');
            });
        });
    }
    
    if (sendFeedbackBtn) {
        sendFeedbackBtn.addEventListener('click', () => {
            const message = feedbackMessage.value.trim();
            if (message) {
                const whatsappNumber = '+2347048929112';
                const email = 'legendtechlord@gmail.com';
                const subject = 'Legend Tech Feedback';
                const body = `From: ${currentUser.username} (${currentUser.email})\n\n${message}`;
                
                if (Math.random() > 0.5) {
                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`;
                    window.open(whatsappUrl, '_blank');
                } else {
                    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.location.href = mailtoUrl;
                }
                
                feedbackMessage.value = '';
                showSuccess('Thank you for your feedback!');
            }
        });
    }
    
    function setupNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                const pageId = `${item.dataset.page}-page`;
                pages.forEach(page => page.classList.remove('active'));
                document.getElementById(pageId).classList.add('active');
                
                if (item.dataset.page === 'learn') {
                    initializeCourses();
                } else if (item.dataset.page === 'community') {
                    setTimeout(() => {
                        if (chatMessagesContainer) {
                            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                        }
                    }, 100);
                    
                    // Mark chat as read when visiting community page
                    if (chatNotificationManager) {
                        chatNotificationManager.markAsRead();
                    }
                }
            });
        });
    }

    // Make functions globally available
    window.showAllAnnouncements = function() {
        if (!announcementManager || announcementManager.announcements.length === 0) {
            alert('No announcements available.');
            return;
        }
        
        announcementManager.showAnnouncementModal(announcementManager.announcements);
    };
    
    window.broadcastManager = broadcastManager;
    
    // Load available airdrops
    async function loadAvailableAirdrops() {
        try {
            const now = new Date();
            const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
            
            const airdropsSnapshot = await db.collection('airdrops')
                .where('createdAt', '>', twoHoursAgo)
                .orderBy('createdAt', 'desc')
                .limit(5)
                .get();
            
            // Check and claim available airdrops
            airdropsSnapshot.forEach(async doc => {
                const airdrop = doc.data();
                const airdropId = doc.id;
                
                // Check if user already claimed this airdrop
                if (!currentUser.claimedAirdrops || !currentUser.claimedAirdrops.includes(airdropId)) {
                    // Auto-claim the airdrop
                    await claimAirdrop(airdropId, airdrop);
                }
            });
        } catch (error) {
            console.error('Error loading airdrops:', error);
        }
    }
    
    // Claim airdrop
    async function claimAirdrop(airdropId, airdrop) {
        try {
            // Check if already claimed
            if (currentUser.claimedAirdrops && currentUser.claimedAirdrops.includes(airdropId)) {
                return;
            }
            
            // Check if expired
            const now = new Date();
            const createdAt = airdrop.createdAt.toDate();
            const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);
            
            if (now > expiresAt) {
                return;
            }
            
            // Update airdrop
            const claimedBy = airdrop.claimedBy || [];
            claimedBy.push(currentUser.uid);
            
            await db.collection('airdrops').doc(airdropId).update({
                claimedBy: claimedBy,
                claimedCount: (airdrop.claimedCount || 0) + 1
            });
            
            // Update user's LP
            const newLp = (currentUser.lp || 0) + airdrop.amount;
            await db.collection('users').doc(currentUser.uid).update({
                lp: newLp,
                claimedAirdrops: [...(currentUser.claimedAirdrops || []), airdropId]
            });
            
            // Update current user
            currentUser.lp = newLp;
            currentUser.claimedAirdrops = [...(currentUser.claimedAirdrops || []), airdropId];
            updateLpDisplay();
            
            // Show success message
            if (airdropMessage) {
                airdropMessage.textContent = `🎉 You claimed ${airdrop.amount} LP from the airdrop!`;
            }
            if (airdropModal) {
                airdropModal.classList.add('active');
            }
            
            showSuccess(`Airdrop claimed! You received ${airdrop.amount} LP.`);
            
        } catch (error) {
            console.error('Error claiming airdrop:', error);
        }
    }
    
    // Update user data
    async function updateUserData() {
        try {
            await db.collection('users').doc(currentUser.uid).update({
                username: currentUser.username,
                email: currentUser.email,
                country: currentUser.country,
                lp: currentUser.lp,
                streak: currentUser.streak,
                lastClaimDate: currentUser.lastClaimDate,
                unlockedCourses: currentUser.unlockedCourses,
                usedBonusCodes: currentUser.usedBonusCodes,
                usedPromoCodes: currentUser.usedPromoCodes,
                likedCourses: currentUser.likedCourses,
                dislikedCourses: currentUser.dislikedCourses,
                claimedAirdrops: currentUser.claimedAirdrops,
                visitedSocials: currentUser.visitedSocials,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    }
    
    function showSuccess(message, isSuccess = true) {
        if (!successMessage || !successModal) return;
        
        successMessage.textContent = message;
        successMessage.style.color = isSuccess ? 'var(--new-year-green)' : 'var(--danger)';
        successModal.classList.add('active');
    }
    
    window.addEventListener('click', (e) => {
        if (courseModal && e.target === courseModal) {
            closeModals();
        }
        if (successModal && e.target === successModal) {
            closeModals();
        }
        if (airdropModal && e.target === airdropModal) {
            closeModals();
        }
    });
});