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
    const storage = firebase.storage();

    // Escape any value before it is placed into innerHTML or an attribute —
    // tutor/course fields are self-reported, so this prevents a malicious
    // name/title/etc. from injecting markup or scripts that run in someone
    // else's browser (most importantly, the admin's).
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text == null ? '' : String(text);
        return div.innerHTML;
    }

    const RANK_NAMES = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Ruby', 'Diamond', 'Elite'];
    function safeRank(rank) {
        return RANK_NAMES.includes(rank) ? rank : 'Iron';
    }

    // Chart instances
    let performanceChart = null;
    let categoryChart = null;

    // Simulate loading
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('auth-container').style.display = 'flex';
        checkAuthState();
    }, 2000);

    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const tutorContainer = document.getElementById('tutor-container');
    const adminContainer = document.getElementById('admin-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const authTabs = document.querySelectorAll('.auth-tab');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    // Forms
    const uploadForm = document.getElementById('upload-form');
    const convertBtn = document.getElementById('convert-btn');
    const convertAmount = document.getElementById('convert-amount');
    
    // Displays
    const tutorPointsDisplay = document.getElementById('tutor-points');
    const userLpDisplay = document.getElementById('user-lp-display');
    const userAvatar = document.getElementById('user-avatar');
    const avatarImg = document.getElementById('avatar-img');
    const avatarText = document.getElementById('avatar-text');
    const userRankBadge = document.getElementById('user-rank');
    
    // Stats
    const totalCoursesDisplay = document.getElementById('total-courses');
    const totalUnlocksDisplay = document.getElementById('total-unlocks');
    const totalLikesDisplay = document.getElementById('total-likes');
    const totalDislikesDisplay = document.getElementById('total-dislikes');
    const tutorPointsStatsDisplay = document.getElementById('tutor-points-display');
    const estimatedEarningsDisplay = document.getElementById('estimated-earnings');
    const currentRankDisplay = document.getElementById('current-rank');
    
    // Rank Progress
    const currentRankName = document.getElementById('current-rank-name');
    const nextRankName = document.getElementById('next-rank-name');
    const rankProgressFill = document.getElementById('rank-progress-fill');
    const currentPointsSpan = document.getElementById('current-points');
    const nextRankPointsSpan = document.getElementById('next-rank-points');
    
    // ID Card Elements
    const miniName = document.getElementById('mini-name');
    const miniRank = document.getElementById('mini-rank');
    const miniAvatarImg = document.getElementById('mini-avatar-img');
    const miniAvatarText = document.getElementById('mini-avatar-text');
    
    // Full ID Card Elements
    const cardFullname = document.getElementById('card-fullname');
    const cardUsername = document.getElementById('card-username');
    const cardDob = document.getElementById('card-dob');
    const cardCountry = document.getElementById('card-country');
    const cardJoined = document.getElementById('card-joined');
    const cardRank = document.getElementById('card-rank');
    const cardPoints = document.getElementById('card-points');
    const cardSerial = document.getElementById('card-serial');
    const cardProfileImg = document.getElementById('card-profile-img');
    const cardProfilePlaceholder = document.getElementById('card-profile-placeholder');
    
    // Search and lists
    const myCoursesGrid = document.getElementById('my-courses');
    const courseSearch = document.getElementById('course-search');
    const airdropList = document.getElementById('airdrop-list');
    
    // Analytics elements
    const topCoursesList = document.getElementById('top-courses-list');
    const recentActivity = document.getElementById('recent-activity');
    const monthlyStats = document.getElementById('monthly-stats');
    
    // Admin elements
    const totalTutorsDisplay = document.getElementById('total-tutors');
    const totalCoursesAdminDisplay = document.getElementById('total-courses-admin');
    const totalTPAdminDisplay = document.getElementById('total-tp-admin');
    const totalConversionsDisplay = document.getElementById('total-conversions');
    const tutorsTableBody = document.getElementById('tutors-table-body');
    const conversionRequestsList = document.getElementById('conversion-requests-list');
    const adminTutorSearch = document.getElementById('admin-tutor-search');
    const rankFilter = document.getElementById('rank-filter');
    const exportTutorsBtn = document.getElementById('export-tutors-btn');
    
    // Modals
    const successModal = document.getElementById('success-modal');
    const successMessage = document.getElementById('success-message');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    const closeSuccessModal = document.getElementById('close-success-modal');
    
    const conversionModal = document.getElementById('conversion-modal');
    const closeConversionBtn = document.getElementById('close-conversion-btn');
    const closeConversionModal = document.getElementById('close-conversion-modal');
    
    const idcardModal = document.getElementById('idcard-modal');
    const idcardModalBody = document.getElementById('idcard-modal-body');
    const closeIdcardModal = document.getElementById('close-idcard-modal');
    const closeIdcardBtn = document.getElementById('close-idcard-btn');
    const downloadIdcardBtn = document.getElementById('download-idcard-btn');
    
    // Current user data
    let currentUser = null;
    let currentTutor = null;
    let isAdmin = false;
    
    // An account is an admin only if its own Firestore user document has
    // isAdmin: true — the same flag used by the other admin panels site-wide,
    // rather than a hardcoded email or a static "access code" that would sit
    // in plain text in this public JS file for anyone to read.
    async function checkIsAdminFlag(uid) {
        const doc = await db.collection('users').doc(uid).get();
        return doc.exists && doc.data().isAdmin === true;
    }
    
    // Rank thresholds
    const RANKS = [
        { name: 'Iron', min: 0, max: 100, color: '#8a8a8a' },
        { name: 'Bronze', min: 101, max: 250, color: '#cd7f32' },
        { name: 'Silver', min: 251, max: 500, color: '#c0c0c0' },
        { name: 'Gold', min: 501, max: 1000, color: '#ffd700' },
        { name: 'Platinum', min: 1001, max: 2000, color: '#e5e4e2' },
        { name: 'Ruby', min: 2001, max: 5000, color: '#e0115f' },
        { name: 'Diamond', min: 5001, max: 10000, color: '#b9f2ff' },
        { name: 'Elite', min: 10001, max: Infinity, color: '#9400d3' }
    ];
    
    // Check authentication state
    function checkAuthState() {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    // Check if admin
                    if (await checkIsAdminFlag(user.uid)) {
                        isAdmin = true;
                        await loadAdminDashboard();
                        authContainer.style.display = 'none';
                        adminContainer.style.display = 'block';
                        return;
                    }
                    
                    const doc = await db.collection('tutors').doc(user.uid).get();
                    
                    if (doc.exists) {
                        currentUser = user;
                        currentTutor = doc.data();
                        
                        // Initialize the app
                        await initializeTutorApp();
                        
                        // Switch to tutor panel
                        authContainer.style.display = 'none';
                        tutorContainer.style.display = 'block';
                    } else {
                        // Not a tutor, sign out
                        await auth.signOut();
                        showLoginForm();
                    }
                } catch (error) {
                    console.error('Error checking tutor data:', error);
                    showLoginForm();
                }
            } else {
                showLoginForm();
            }
        });
    }
    
    function showLoginForm() {
        authContainer.style.display = 'flex';
        tutorContainer.style.display = 'none';
        adminContainer.style.display = 'none';
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
        
        const fullname = document.getElementById('register-fullname').value;
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const dob = document.getElementById('register-dob').value;
        const country = document.getElementById('register-country').value;
        const profileImage = document.getElementById('register-image').value;
        
        try {
            // Create user in Firebase Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Generate serial number
            const year = new Date().getFullYear();
            const tutorsSnapshot = await db.collection('tutors').get();
            const serialNumber = `LEG/${year}/${String(tutorsSnapshot.size + 1).padStart(4, '0')}`;
            
            // Create tutor document in Firestore
            await db.collection('tutors').doc(user.uid).set({
                fullname,
                username,
                email,
                dob,
                country,
                profileImage: profileImage || '',
                tutorPoints: 0,
                totalUnlocks: 0,
                totalLikes: 0,
                totalDislikes: 0,
                lp: 100, // Starting LP
                totalCourses: 0,
                courses: [],
                conversions: [],
                serialNumber,
                rank: 'Iron',
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Set current tutor
            currentUser = user;
            currentTutor = {
                fullname,
                username,
                email,
                dob,
                country,
                profileImage: profileImage || '',
                tutorPoints: 0,
                totalUnlocks: 0,
                totalLikes: 0,
                totalDislikes: 0,
                lp: 100,
                totalCourses: 0,
                courses: [],
                conversions: [],
                serialNumber,
                rank: 'Iron'
            };
            
            await initializeTutorApp();
            
            authContainer.style.display = 'none';
            tutorContainer.style.display = 'block';
            
            showSuccess('Registration successful! Your virtual ID card has been created.');
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
            
            const doc = await db.collection('tutors').doc(user.uid).get();
            
            if (doc.exists) {
                currentUser = user;
                currentTutor = doc.data();
                
                await initializeTutorApp();
                
                authContainer.style.display = 'none';
                tutorContainer.style.display = 'block';
            } else {
                alert('You are not registered as a tutor. Please register first.');
            }
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Admin Login Form Submission
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            if (await checkIsAdminFlag(user.uid)) {
                isAdmin = true;
                await loadAdminDashboard();
                authContainer.style.display = 'none';
                adminContainer.style.display = 'block';
            } else {
                alert('You are not authorized as an admin!');
                await auth.signOut();
            }
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            currentUser = null;
            currentTutor = null;
            
            tutorContainer.style.display = 'none';
            authContainer.style.display = 'flex';
            
            loginForm.reset();
            registerForm.reset();
            
            showSuccess('You have been logged out successfully.');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed: ' + error.message);
        }
    });
    
    adminLogoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            isAdmin = false;
            adminContainer.style.display = 'none';
            authContainer.style.display = 'flex';
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
    
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');
            
            // Refresh data
            if (section === 'dashboard') {
                loadDashboardData();
            } else if (section === 'courses') {
                loadMyCourses();
            } else if (section === 'analytics') {
                loadAnalytics();
            } else if (section === 'idcard') {
                updateIDCard();
            }
        });
    });
    
    // Initialize Tutor App
    async function initializeTutorApp() {
        // Update user info
        updateUserDisplay();
        updateDisplays();
        
        // Load initial data
        await loadDashboardData();
        loadMyCourses();
        
        // Set up real-time listeners
        setupRealTimeListeners();
    }
    
    function updateUserDisplay() {
        // Update avatar
        if (currentTutor.profileImage) {
            avatarImg.src = currentTutor.profileImage;
            avatarImg.style.display = 'block';
            avatarText.style.display = 'none';
            
            miniAvatarImg.src = currentTutor.profileImage;
            miniAvatarImg.style.display = 'block';
            miniAvatarText.style.display = 'none';
        } else {
            avatarText.textContent = currentTutor.username.charAt(0).toUpperCase();
            miniAvatarText.textContent = currentTutor.username.charAt(0).toUpperCase();
        }
        
        // Update mini card
        miniName.textContent = currentTutor.fullname || currentTutor.username;
        miniRank.textContent = currentTutor.rank || 'Iron';
        
        // Update rank badge
        userRankBadge.textContent = currentTutor.rank || 'Iron';
    }
    
    function updateDisplays() {
        const tp = currentTutor.tutorPoints || 0;
        const lp = currentTutor.lp || 0;
        
        tutorPointsDisplay.textContent = `${tp} TP`;
        userLpDisplay.textContent = `${lp} LP`;
        
        // Update rank progress
        updateRankProgress(tp);
    }
    
    function getRankFromPoints(points) {
        for (const rank of RANKS) {
            if (points >= rank.min && points <= rank.max) {
                return rank.name;
            }
        }
        return 'Iron';
    }
    
    function getCurrentRankObj(points) {
        return RANKS.find(rank => points >= rank.min && points <= rank.max) || RANKS[0];
    }
    
    // Returns the tier AFTER the tutor's current one. The old version
    // returned the current tier itself (RANKS[i] where points < RANKS[i].max
    // is true for the rank you're already in), so "next rank" always showed
    // as whatever rank you currently held instead of the one you're working
    // toward — and the progress bar below inherited the same mistake.
    function getNextRank(currentPoints) {
        const currentIndex = RANKS.findIndex(rank => currentPoints >= rank.min && currentPoints <= rank.max);
        if (currentIndex === -1 || currentIndex === RANKS.length - 1) {
            return RANKS[RANKS.length - 1]; // Already at the top tier (Elite)
        }
        return RANKS[currentIndex + 1];
    }
    
    function updateRankProgress(points) {
        const currentRankObj = getCurrentRankObj(points);
        const currentRank = currentRankObj.name;
        const nextRank = getNextRank(points);
        
        currentRankName.textContent = currentRank;
        nextRankName.textContent = nextRank.name;
        currentPointsSpan.textContent = points;
        nextRankPointsSpan.textContent = nextRank.max === Infinity ? '∞' : nextRank.min;
        
        // Progress through the CURRENT rank's range (i.e. how close to the
        // next rank's threshold) — using nextRank's min/max here was the bug,
        // since points sitting inside the current rank are always below
        // nextRank.min, which produced a negative/nonsensical percentage.
        let progress = 100;
        if (currentRankObj.max !== Infinity) {
            const rankRange = currentRankObj.max - currentRankObj.min + 1;
            const pointsInRank = points - currentRankObj.min + 1;
            progress = Math.min(100, Math.max(0, (pointsInRank / rankRange) * 100));
        }
        
        rankProgressFill.style.width = `${progress}%`;
        
        // Update rank displays
        userRankBadge.textContent = currentRank;
        currentRankDisplay.textContent = currentRank;
        
        // Update tutor's rank in database if changed
        if (currentTutor.rank !== currentRank) {
            currentTutor.rank = currentRank;
            db.collection('tutors').doc(currentUser.uid).update({
                rank: currentRank
            });
        }
    }
    
    async function loadDashboardData() {
        try {
         // Load tutor's stats
            const tutorDoc = await db.collection('tutors').doc(currentUser.uid).get();
            const tutorData = tutorDoc.data();
            
            // Update displays
            totalCoursesDisplay.textContent = tutorData.totalCourses || 0;
            totalUnlocksDisplay.textContent = tutorData.totalUnlocks || 0;
            totalLikesDisplay.textContent = tutorData.totalLikes || 0;
            totalDislikesDisplay.textContent = tutorData.totalDislikes || 0;
            tutorPointsStatsDisplay.textContent = tutorData.tutorPoints || 0;
            
            // Calculate estimated earnings
            const earnings = (tutorData.tutorPoints || 0) / 100;
            estimatedEarningsDisplay.textContent = `$${earnings.toFixed(2)}`;
            
            // Load airdrops
            await loadAirdrops();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    async function loadAirdrops() {
        try {
            const now = new Date();
            const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
            
            const airdropsSnapshot = await db.collection('airdrops')
                .where('createdAt', '>', twoHoursAgo)
                .orderBy('createdAt', 'desc')
                .get();
            
            airdropList.innerHTML = '';
            
            if (airdropsSnapshot.empty) {
                airdropList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No available airdrops</p>';
                return;
            }
            
            airdropsSnapshot.forEach(doc => {
                const airdrop = doc.data();
                const airdropElement = document.createElement('div');
                airdropElement.className = 'airdrop-card';
                
                // Calculate time left
                const createdAt = airdrop.createdAt.toDate();
                const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);
                const timeLeft = expiresAt - now;
                const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                
                airdropElement.innerHTML = `
                    <div class="airdrop-header">
                        <div class="airdrop-amount">${airdrop.amount} LP</div>
                        <div class="airdrop-time">Expires in: ${hoursLeft}h ${minutesLeft}m</div>
                    </div>
                    <p>${escapeHtml(airdrop.description) || 'Claim your free LP!'}</p>
                    <button class="btn airdrop-btn" data-id="${doc.id}" ${airdrop.claimedBy && airdrop.claimedBy.includes(currentUser.uid) ? 'disabled' : ''}>
                        ${airdrop.claimedBy && airdrop.claimedBy.includes(currentUser.uid) ? 'Already Claimed' : 'Claim Airdrop'}
                    </button>
                `;
                
                airdropList.appendChild(airdropElement);
            });
            
            // Add event listeners to claim buttons
            document.querySelectorAll('.airdrop-btn').forEach(btn => {
                if (!btn.disabled) {
                    btn.addEventListener('click', async () => {
                        await claimAirdrop(btn.dataset.id);
                    });
                }
            });
            
        } catch (error) {
            console.error('Error loading airdrops:', error);
        }
    }
    
    async function claimAirdrop(airdropId) {
        try {
            const airdropRef = db.collection('airdrops').doc(airdropId);
            const airdropDoc = await airdropRef.get();
            
            if (!airdropDoc.exists) {
                alert('Airdrop not found!');
                return;
            }
            
            const airdrop = airdropDoc.data();
            
            // Check if already claimed
            if (airdrop.claimedBy && airdrop.claimedBy.includes(currentUser.uid)) {
                alert('You have already claimed this airdrop!');
                return;
            }
            
            // Check if expired
            const now = new Date();
            const createdAt = airdrop.createdAt.toDate();
            const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);
            
            if (now > expiresAt) {
                alert('This airdrop has expired!');
                return;
            }
            
            // Update airdrop
            const claimedBy = airdrop.claimedBy || [];
            claimedBy.push(currentUser.uid);
            
            await airdropRef.update({
                claimedBy: claimedBy,
                claimedCount: (airdrop.claimedCount || 0) + 1
            });
            
            // Update tutor's LP
            const newLp = (currentTutor.lp || 0) + airdrop.amount;
            await db.collection('tutors').doc(currentUser.uid).update({
                lp: newLp
            });
            
            // Update current tutor
            currentTutor.lp = newLp;
            updateDisplays();
            
            showSuccess(`Successfully claimed ${airdrop.amount} LP!`);
            
            // Reload airdrops
            loadAirdrops();
            
        } catch (error) {
            console.error('Error claiming airdrop:', error);
            alert('Error claiming airdrop: ' + error.message);
        }
    }
    
    // Atomically get the next course ID from a counter document, instead of
    // reading the current highest id and adding 1 — the old approach let two
    // tutors uploading at the same moment both read the same 'last' course
    // and land on the same id, so lookups by course id could hit either one.
    async function getNextCourseId() {
        const counterRef = db.collection('counters').doc('courses');
        return await db.runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            // Baseline matches the site's original 26 hardcoded courses
            const lastId = counterDoc.exists ? (counterDoc.data().lastId || 26) : 26;
            const nextId = lastId + 1;
            transaction.set(counterRef, { lastId: nextId }, { merge: true });
            return nextId;
        });
    }
    
    // Upload Course
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('course-title').value;
        const description = document.getElementById('course-description').value;
        const image = document.getElementById('course-image').value;
        const url = document.getElementById('course-url').value;
        const category = document.getElementById('course-category').value;
        
        const uploadBtn = uploadForm.querySelector('button[type="submit"]');
        if (uploadBtn) uploadBtn.disabled = true;
        
        try {
            const nextId = await getNextCourseId();
            
            // Create course document
            const courseData = {
                id: nextId,
                title,
                description,
                image,
                url,
                category,
                price: 100, // LP price
                tutorId: currentUser.uid,
                tutorName: currentTutor.username,
                unlocks: 0,
                likes: 0,
                dislikes: 0,
                tutorPointsEarned: 0,
                source: 'tutor',
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Add to courses collection
            await db.collection('courses').add(courseData);
            
            // Update tutor's course list
            const tutorCourses = currentTutor.courses || [];
            tutorCourses.push(nextId);
            
            await db.collection('tutors').doc(currentUser.uid).update({
                courses: tutorCourses,
                totalCourses: (currentTutor.totalCourses || 0) + 1
            });
            
            // Update current tutor
            currentTutor.courses = tutorCourses;
            currentTutor.totalCourses = (currentTutor.totalCourses || 0) + 1;
            
            // Reset form
            uploadForm.reset();
            
            // Show success message
            showSuccess('Course uploaded successfully! It will be visible to students after approval.');
            
            // Refresh data
            loadDashboardData();
            loadMyCourses();
            
        } catch (error) {
            console.error('Error uploading course:', error);
            alert('Error uploading course: ' + error.message);
        } finally {
            if (uploadBtn) uploadBtn.disabled = false;
        }
    });
    
    async function loadMyCourses() {
        try {
            // Get all tutor's courses
            const coursesSnapshot = await db.collection('courses')
                .where('tutorId', '==', currentUser.uid)
                .orderBy('createdAt', 'desc')
                .get();
            
            myCoursesGrid.innerHTML = '';
            
            if (coursesSnapshot.empty) {
                myCoursesGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: rgba(255,255,255,0.6);">No courses uploaded yet</p>';
                return;
            }
            
            coursesSnapshot.forEach(doc => {
                const course = doc.data();
                const courseElement = createCourseCard(course, doc.id);
                myCoursesGrid.appendChild(courseElement);
            });
            
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    }
    
    function createCourseCard(course, docId) {
        const courseElement = document.createElement('div');
        courseElement.className = 'course-card';
        
        courseElement.innerHTML = `
            <h4>${escapeHtml(course.title)}</h4>
            <p>${escapeHtml(course.description)}</p>
            <div class="course-meta">
                <span class="course-category">${escapeHtml(course.category)}</span>
                <span class="course-date">${course.createdAt ? new Date(course.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div class="course-stats">
                <div class="stat-item unlocks">
                    <i class="fas fa-unlock"></i>
                    <span>${course.unlocks || 0}</span>
                </div>
                <div class="stat-item likes">
                    <i class="fas fa-thumbs-up"></i>
                    <span>${course.likes || 0}</span>
                </div>
                <div class="stat-item dislikes">
                    <i class="fas fa-thumbs-down"></i>
                    <span>${course.dislikes || 0}</span>
                </div>
                <div class="stat-item points">
                    <i class="fas fa-star" style="color: var(--gold);"></i>
                    <span>${course.tutorPointsEarned || 0} TP</span>
                </div>
            </div>
            <div class="course-status">
                <span class="badge ${course.status === 'active' ? 'active' : 'pending'}">
                    ${escapeHtml(course.status)}
                </span>
            </div>
        `;
        
        return courseElement;
    }
    
    // ID Card Functions
    function updateIDCard() {
        if (!currentTutor) return;
        
        cardFullname.textContent = currentTutor.fullname || currentTutor.username;
        cardUsername.textContent = '@' + currentTutor.username;
        cardDob.textContent = formatDate(currentTutor.dob) || 'N/A';
        cardCountry.textContent = currentTutor.country || 'N/A';
        cardJoined.textContent = currentTutor.joinedAt ? new Date(currentTutor.joinedAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString();
        cardPoints.textContent = `${currentTutor.tutorPoints || 0} TP`;
        cardSerial.textContent = currentTutor.serialNumber || 'LEG/2024/0001';
        
        // Update rank with color
        const rank = safeRank(currentTutor.rank);
        cardRank.innerHTML = `<span class="rank-badge rank-${rank.toLowerCase()}">${rank}</span>`;
        
        // Update profile image
        if (currentTutor.profileImage) {
            cardProfileImg.src = currentTutor.profileImage;
            cardProfileImg.style.display = 'block';
            cardProfilePlaceholder.style.display = 'none';
        } else {
            cardProfileImg.style.display = 'none';
            cardProfilePlaceholder.style.display = 'flex';
        }
    }
    
    function formatDate(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    // Show ID Card Modal
    window.showIDCard = function() {
        updateIDCard();
        
        // Clone the ID card for modal
        const idCard = document.getElementById('tutor-id-card').cloneNode(true);
        idCard.style.margin = '0';
        idcardModalBody.innerHTML = '';
        idcardModalBody.appendChild(idCard);
        
        idcardModal.classList.add('active');
    };
    
    // Download ID Card
    window.downloadIDCard = function() {
        const idCard = document.getElementById('tutor-id-card');
        
        html2canvas(idCard, {
            scale: 2,
            backgroundColor: null,
            allowTaint: true,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `LegendTech_ID_${currentTutor.username}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };
    
    downloadIdcardBtn.addEventListener('click', () => {
        const modalIdCard = idcardModalBody.querySelector('.id-card');
        if (modalIdCard) {
            html2canvas(modalIdCard, {
                scale: 2,
                backgroundColor: null,
                allowTaint: true,
                useCORS: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `LegendTech_ID_${currentTutor.username}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    });
    
    // Convert Tutor Points
    convertBtn.addEventListener('click', async () => {
        const amount = parseInt(convertAmount.value);
        
        if (!amount || amount < 100) {
            alert('Minimum conversion amount is 100 TP');
            return;
        }
        
        if (amount > currentTutor.tutorPoints) {
            alert('Insufficient tutor points');
            return;
        }
        
        convertBtn.disabled = true;
        
        try {
            const tutorRef = db.collection('tutors').doc(currentUser.uid);
            
            // Check the balance and deduct it inside one atomic transaction.
            // Without this, two near-simultaneous requests (a double-click, or
            // two open tabs) could both read the same balance before either
            // write lands, letting a tutor convert more TP than they actually have.
            await db.runTransaction(async (transaction) => {
                const tutorDoc = await transaction.get(tutorRef);
                const balance = tutorDoc.data().tutorPoints || 0;
                
                if (amount > balance) {
                    throw new Error('Insufficient tutor points');
                }
                
                transaction.update(tutorRef, {
                    tutorPoints: firebase.firestore.FieldValue.increment(-amount)
                });
                
                const conversionRef = db.collection('conversions').doc();
                transaction.set(conversionRef, {
                    tutorId: currentUser.uid,
                    tutorName: currentTutor.username,
                    tutorFullName: currentTutor.fullname,
                    tutorEmail: currentTutor.email,
                    amount: amount,
                    usdValue: amount / 100,
                    status: 'pending',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            
            // Update local cache + UI
            currentTutor.tutorPoints -= amount;
            updateDisplays();
            loadDashboardData();
            
            // Send email (simulated)
            sendConversionEmail(amount);
            
            // Show success modal
            conversionModal.classList.add('active');
            convertAmount.value = '';
            
        } catch (error) {
            console.error('Error processing conversion:', error);
            alert('Error processing conversion: ' + error.message);
        } finally {
            convertBtn.disabled = false;
        }
    });
    
    function sendConversionEmail(amount) {
        const usdValue = amount / 100;
        const emailBody = `
Tutor Conversion Request
            
Tutor: ${currentTutor.username}
Full Name: ${currentTutor.fullname}
Email: ${currentTutor.email}
Serial Number: ${currentTutor.serialNumber}
            
Amount: ${amount} TP
USD Value: $${usdValue.toFixed(2)}
            
Message: "I wish to convert my ${amount} TP to money."
            
Please process this payment within 24-48 hours.
        `;
        
        console.log('Email sent to legendtechlord@gmail.com:', emailBody);
        
        const mailtoLink = `mailto:legendtechlord@gmail.com?subject=Tutor%20Conversion%20Request&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoLink, '_blank');
    }
    
    // Admin Functions
    async function loadAdminDashboard() {
        try {
            // Load tutors
            const tutorsSnapshot = await db.collection('tutors').get();
            const tutors = [];
            tutorsSnapshot.forEach(doc => {
                tutors.push({ id: doc.id, ...doc.data() });
            });
            
            // Load courses
            const coursesSnapshot = await db.collection('courses').get();
            const courses = [];
            coursesSnapshot.forEach(doc => {
                courses.push(doc.data());
            });
            
            // Load conversions
            const conversionsSnapshot = await db.collection('conversions')
                .where('status', '==', 'pending')
                .get();
            
            // Update stats
            totalTutorsDisplay.textContent = tutors.length;
            totalCoursesAdminDisplay.textContent = courses.length;
            
            const totalTP = tutors.reduce((sum, tutor) => sum + (tutor.tutorPoints || 0), 0);
            totalTPAdminDisplay.textContent = totalTP;
            
            const totalConversionValue = conversionsSnapshot.docs.reduce((sum, doc) => {
                return sum + (doc.data().usdValue || 0);
            }, 0);
            totalConversionsDisplay.textContent = `$${totalConversionValue.toFixed(2)}`;
            
            // Render tutors table
            renderTutorsTable(tutors);
            
            // Render conversion requests
            renderConversionRequests(conversionsSnapshot.docs);
            
        } catch (error) {
            console.error('Error loading admin dashboard:', error);
        }
    }
    
    function renderTutorsTable(tutors) {
        tutorsTableBody.innerHTML = '';
        
        tutors.sort((a, b) => (b.tutorPoints || 0) - (a.tutorPoints || 0));
        
        tutors.forEach((tutor, index) => {
            const row = document.createElement('tr');
            const rank = safeRank(getRankFromPoints(tutor.tutorPoints || 0));
            const safeUsername = escapeHtml(tutor.username);
            
            row.innerHTML = `
                <td>${escapeHtml(tutor.serialNumber) || `LEG/${new Date().getFullYear()}/${String(index + 1).padStart(4, '0')}`}</td>
                <td>
                    ${tutor.profileImage ? 
                        `<div class="tutor-photo"><img src="${escapeHtml(tutor.profileImage)}" alt="${safeUsername}"></div>` : 
                        `<div class="tutor-photo-placeholder">${safeUsername.charAt(0).toUpperCase()}</div>`}
                </td>
                <td>${escapeHtml(tutor.fullname) || safeUsername}</td>
                <td>@${safeUsername}</td>
                <td>${escapeHtml(tutor.email)}</td>
                <td>${escapeHtml(tutor.country) || 'N/A'}</td>
                <td><span class="rank-cell rank-${rank.toLowerCase()}">${rank}</span></td>
                <td>${tutor.tutorPoints || 0}</td>
                <td>${tutor.totalCourses || 0}</td>
                <td>${tutor.joinedAt ? new Date(tutor.joinedAt.toDate()).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="action-btn" onclick="viewTutorDetails('${tutor.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editTutor('${tutor.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="suspendTutor('${tutor.id}')" title="Suspend">
                        <i class="fas fa-ban"></i>
                    </button>
                </td>
            `;
            
            tutorsTableBody.appendChild(row);
        });
    }
    
    function renderConversionRequests(conversions) {
        conversionRequestsList.innerHTML = '';
        
        if (conversions.length === 0) {
            conversionRequestsList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No pending conversion requests</p>';
            return;
        }
        
        conversions.forEach(doc => {
            const conversion = doc.data();
            const item = document.createElement('div');
            item.className = 'conversion-item';
            const safeAmount = Number(conversion.amount) || 0;
            const usdValue = Number(conversion.usdValue) || 0;
            
            item.innerHTML = `
                <div class="conversion-info">
                    <div class="conversion-tutor">${escapeHtml(conversion.tutorFullName || conversion.tutorName)}</div>
                    <div class="conversion-details">
                        Amount: <span class="conversion-amount">${safeAmount} TP</span> 
                        ($${usdValue.toFixed(2)})
                    </div>
                    <small>${conversion.createdAt ? new Date(conversion.createdAt.toDate()).toLocaleString() : ''}</small>
                </div>
                <div class="conversion-actions">
                    <button class="approve-btn" onclick="approveConversion('${doc.id}', '${conversion.tutorId}', ${safeAmount})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="reject-btn" onclick="rejectConversion('${doc.id}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            `;
            
            conversionRequestsList.appendChild(item);
        });
    }
    
    // Admin action functions (to be exposed globally)
    window.viewTutorDetails = async function(tutorId) {
        const doc = await db.collection('tutors').doc(tutorId).get();
        if (doc.exists) {
            const tutor = doc.data();
            alert(`
Tutor Details:
Name: ${tutor.fullname || tutor.username}
Username: @${tutor.username}
Email: ${tutor.email}
Country: ${tutor.country || 'N/A'}
Rank: ${tutor.rank || 'Iron'}
TP: ${tutor.tutorPoints || 0}
LP: ${tutor.lp || 0}
Courses: ${tutor.totalCourses || 0}
Joined: ${tutor.joinedAt ? new Date(tutor.joinedAt.toDate()).toLocaleDateString() : 'N/A'}
            `);
        }
    };
    
    window.editTutor = function(tutorId) {
        // Implement edit functionality
        alert('Edit functionality will be implemented here');
    };
    
    window.suspendTutor = async function(tutorId) {
        if (confirm('Are you sure you want to suspend this tutor?')) {
            await db.collection('tutors').doc(tutorId).update({
                status: 'suspended'
            });
            showSuccess('Tutor has been suspended');
            loadAdminDashboard();
        }
    };
    
    window.approveConversion = async function(conversionId, tutorId, amount) {
        if (confirm('Approve this conversion request?')) {
            await db.collection('conversions').doc(conversionId).update({
                status: 'approved',
                approvedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showSuccess('Conversion approved');
            loadAdminDashboard();
        }
    };
    
    window.rejectConversion = async function(conversionId) {
        if (confirm('Reject this conversion request?')) {
            await db.collection('conversions').doc(conversionId).update({
                status: 'rejected',
                rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showSuccess('Conversion rejected');
            loadAdminDashboard();
        }
    };
    
    // Search and filter
    adminTutorSearch.addEventListener('input', () => {
        loadAdminDashboard(); // Reload with filter (simplified)
    });
    
    rankFilter.addEventListener('change', () => {
        loadAdminDashboard(); // Reload with filter (simplified)
    });
    
    exportTutorsBtn.addEventListener('click', () => {
        // Export tutors data to CSV
        alert('Export functionality will be implemented here');
    });
    
    // Analytics Functions
    async function loadAnalytics() {
        try {
            const coursesSnapshot = await db.collection('courses')
                .where('tutorId', '==', currentUser.uid)
                .get();
            
            if (coursesSnapshot.empty) {
                showNoAnalyticsData();
                return;
            }
            
            const courses = [];
            coursesSnapshot.forEach(doc => {
                const course = doc.data();
                course.docId = doc.id;
                courses.push(course);
            });
            
            renderPerformanceChart(courses);
            renderCategoryChart(courses);
            renderTopCourses(courses);
            renderRecentActivity(courses);
            renderMonthlyStats(courses);
            
        } catch (error) {
            console.error('Error loading analytics:', error);
            showNoAnalyticsData();
        }
    }
    
    function renderPerformanceChart(courses) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        if (performanceChart) {
            performanceChart.destroy();
        }
        
        const courseTitles = courses.map(course => course.title.length > 20 ? course.title.substring(0, 20) + '...' : course.title);
        const unlocksData = courses.map(course => course.unlocks || 0);
        const likesData = courses.map(course => course.likes || 0);
        const dislikesData = courses.map(course => course.dislikes || 0);
        
        performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: courseTitles,
                datasets: [
                    {
                        label: 'Unlocks',
                        data: unlocksData,
                        backgroundColor: 'rgba(0, 119, 182, 0.7)',
                        borderColor: 'rgba(0, 119, 182, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Likes',
                        data: likesData,
                        backgroundColor: 'rgba(40, 167, 69, 0.7)',
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Dislikes',
                        data: dislikesData,
                        backgroundColor: 'rgba(220, 53, 69, 0.7)',
                        borderColor: 'rgba(220, 53, 69, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: 'rgba(255, 255, 255, 0.6)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: 'rgba(255, 255, 255, 0.6)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }
    
    function renderCategoryChart(courses) {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        if (categoryChart) {
            categoryChart.destroy();
        }
        
        const categoryCount = {};
        courses.forEach(course => {
            const category = course.category || 'Other';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        
        const categories = Object.keys(categoryCount);
        const counts = Object.values(categoryCount);
        
        const backgroundColors = counts.map((_, index) => {
            const hue = (index * 137) % 360;
            return `hsla(${hue}, 70%, 60%, 0.7)`;
        });
        
        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: counts,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(0, 29, 61, 0.8)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: 20
                        }
                    }
                }
            }
        });
    }
    
    function renderTopCourses(courses) {
        const sortedCourses = [...courses].sort((a, b) => {
            const scoreA = (a.unlocks || 0) + (a.likes || 0) - (a.dislikes || 0);
            const scoreB = (b.unlocks || 0) + (b.likes || 0) - (b.dislikes || 0);
            return scoreB - scoreA;
        });
        
        const topCourses = sortedCourses.slice(0, 5);
        
        if (topCourses.length === 0) {
            topCoursesList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No courses to display</p>';
            return;
        }
        
        topCoursesList.innerHTML = topCourses.map((course, index) => `
            <div class="course-rank-item">
                <div class="rank-badge top-${index + 1}">${index + 1}</div>
                <div class="course-rank-info">
                    <div class="course-rank-title">${escapeHtml(course.title)}</div>
                    <div class="course-rank-stats">
                        <span title="Unlocks">👥 ${course.unlocks || 0}</span>
                        <span title="Likes">👍 ${course.likes || 0}</span>
                        <span title="Dislikes">👎 ${course.dislikes || 0}</span>
                        <span title="Rating">
                            ${course.likes && course.dislikes ? 
                                `${((course.likes / (course.likes + course.dislikes)) * 100).toFixed(1)}%` : 
                                'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function renderRecentActivity(courses) {
        const sortedCourses = [...courses].sort((a, b) => {
            const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
            return dateB - dateA;
        });
        
        const recentCourses = sortedCourses.slice(0, 5);
        
        if (recentCourses.length === 0) {
            recentActivity.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No recent activity</p>';
            return;
        }
        
        recentActivity.innerHTML = recentCourses.map(course => {
            const date = course.createdAt ? course.createdAt.toDate() : new Date();
            const timeAgo = getTimeAgo(date);
            
            return `
                <div class="activity-item">
                    <div class="activity-text">
                        <strong>${escapeHtml(course.title)}</strong> was uploaded
                    </div>
                    <div class="activity-time">
                        <i class="far fa-clock"></i> ${timeAgo}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    function renderMonthlyStats(courses) {
        const monthlyStatsData = {};
        
        courses.forEach(course => {
            if (course.createdAt) {
                const date = course.createdAt.toDate();
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                
                if (!monthlyStatsData[monthYear]) {
                    monthlyStatsData[monthYear] = {
                        unlocks: 0,
                        likes: 0,
                        dislikes: 0,
                        courses: 0
                    };
                }
                
                monthlyStatsData[monthYear].unlocks += course.unlocks || 0;
                monthlyStatsData[monthYear].likes += course.likes || 0;
                monthlyStatsData[monthYear].dislikes += course.dislikes || 0;
                monthlyStatsData[monthYear].courses += 1;
            }
        });
        
        const months = [];
        const now = new Date();
        for (let i = 0; i < 4; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            months.push({
                key: monthYear,
                name: monthName,
                stats: monthlyStatsData[monthYear] || { unlocks: 0, likes: 0, dislikes: 0, courses: 0 }
            });
        }
        
        if (months.length === 0) {
            monthlyStats.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No monthly data available</p>';
            return;
        }
        
        monthlyStats.innerHTML = months.map(month => `
            <div class="month-stat">
                <div class="month-name">${month.name}</div>
                <div class="month-value">${month.stats.unlocks}</div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">
                    ${month.stats.courses} course(s)
                </div>
                <div style="font-size: 0.7rem; color: rgba(255,255,255,0.5);">
                    👍 ${month.stats.likes} | 👎 ${month.stats.dislikes}
                </div>
            </div>
        `).join('');
    }
    
    function getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
        if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        return 'just now';
    }
    
    function showNoAnalyticsData() {
        const analyticsContainer = document.querySelector('.analytics-container');
        if (analyticsContainer) {
            analyticsContainer.innerHTML = `
                <div class="analytics-card full-width">
                    <h3><i class="fas fa-chart-line"></i> Analytics</h3>
                    <div style="text-align: center; padding: 3rem;">
                        <i class="fas fa-chart-bar" style="font-size: 4rem; color: var(--accent); opacity: 0.5; margin-bottom: 1rem;"></i>
                        <p style="color: rgba(255,255,255,0.6);">No analytics data available yet.</p>
                        <p style="color: rgba(255,255,255,0.4); font-size: 0.9rem; margin-top: 0.5rem;">
                            Upload your first course to see detailed analytics!
                        </p>
                    </div>
                </div>
            `;
        }
    }
    
    function setupRealTimeListeners() {
        // Listen for course updates
        db.collection('courses')
            .where('tutorId', '==', currentUser.uid)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified') {
                        if (document.getElementById('dashboard-section').classList.contains('active')) {
                            loadDashboardData();
                        }
                        if (document.getElementById('analytics-section').classList.contains('active')) {
                            loadAnalytics();
                        }
                    }
                });
            });
        
        // Listen for tutor updates
        db.collection('tutors').doc(currentUser.uid)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    currentTutor = doc.data();
                    updateDisplays();
                    updateUserDisplay();
                }
            });
        
        // Listen for new airdrops
        db.collection('airdrops')
            .where('createdAt', '>', new Date(new Date().getTime() - 2 * 60 * 60 * 1000))
            .onSnapshot((snapshot) => {
                if (document.getElementById('dashboard-section').classList.contains('active')) {
                    loadAirdrops();
                }
            });
    }
    
    // Course Search
    courseSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        filterCourses(searchTerm);
    });
    
    function filterCourses(searchTerm) {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Modal Controls
    function showSuccess(message) {
        successMessage.textContent = message;
        successModal.classList.add('active');
    }
    
    closeSuccessBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
    
    closeSuccessModal.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
    
    closeConversionBtn.addEventListener('click', () => {
        conversionModal.classList.remove('active');
    });
    
    closeConversionModal.addEventListener('click', () => {
        conversionModal.classList.remove('active');
    });
    
    closeIdcardModal.addEventListener('click', () => {
        idcardModal.classList.remove('active');
    });
    
    closeIdcardBtn.addEventListener('click', () => {
        idcardModal.classList.remove('active');
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
        if (e.target === conversionModal) {
            conversionModal.classList.remove('active');
        }
        if (e.target === idcardModal) {
            idcardModal.classList.remove('active');
        }
    });
});