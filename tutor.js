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

    // Snow Effect
    function createSnowflakes() {
        const snowflakesContainer = document.getElementById('snowflakes');
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.innerHTML = '❄';
            
            // Random properties
            const size = Math.random() * 15 + 10;
            const startX = Math.random() * 100;
            const duration = Math.random() * 5 + 5;
            const delay = Math.random() * 5;
            
            snowflake.style.cssText = `
                left: ${startX}vw;
                font-size: ${size}px;
                opacity: ${Math.random() * 0.5 + 0.5};
                animation: fall ${duration}s linear ${delay}s infinite;
            `;
            
            snowflakesContainer.appendChild(snowflake);
        }
    }

    // Initialize snowflakes
    createSnowflakes();

    // Simulate loading
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('auth-container').style.display = 'flex';
        checkAuthState();
    }, 2000);

    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const tutorContainer = document.getElementById('tutor-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const authTabs = document.querySelectorAll('.auth-tab');
    const logoutBtn = document.getElementById('logout-btn');
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
    
    // Stats
    const totalCoursesDisplay = document.getElementById('total-courses');
    const totalUnlocksDisplay = document.getElementById('total-unlocks');
    const totalLikesDisplay = document.getElementById('total-likes');
    const totalDislikesDisplay = document.getElementById('total-dislikes');
    const tutorPointsStatsDisplay = document.getElementById('tutor-points-display');
    const estimatedEarningsDisplay = document.getElementById('estimated-earnings');
    
    // Search and lists
    const myCoursesGrid = document.getElementById('my-courses');
    const courseSearch = document.getElementById('course-search');
    const airdropList = document.getElementById('airdrop-list');
    
    // Modals
    const successModal = document.getElementById('success-modal');
    const successMessage = document.getElementById('success-message');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    const closeSuccessModal = document.getElementById('close-success-modal');
    
    const conversionModal = document.getElementById('conversion-modal');
    const closeConversionBtn = document.getElementById('close-conversion-btn');
    const closeConversionModal = document.getElementById('close-conversion-modal');
    
    // Current user data
    let currentUser = null;
    let currentTutor = null;
    
    // Check authentication state
    function checkAuthState() {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
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
            // Create user in Firebase Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Create tutor document in Firestore
            await db.collection('tutors').doc(user.uid).set({
                username,
                email,
                country,
                tutorPoints: 0,
                totalUnlocks: 0,
                totalLikes: 0,
                totalDislikes: 0,
                lp: 100, // Starting LP
                totalCourses: 0,
                courses: [],
                conversions: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Set current tutor
            currentUser = user;
            currentTutor = {
                uid: user.uid,
                username,
                email,
                country,
                tutorPoints: 0,
                totalUnlocks: 0,
                totalLikes: 0,
                totalDislikes: 0,
                lp: 100,
                totalCourses: 0,
                courses: [],
                conversions: []
            };
            
            await initializeTutorApp();
            
            authContainer.style.display = 'none';
            tutorContainer.style.display = 'block';
            
            showSuccess('Registration successful! Welcome to Legend Tech Tutor Panel.');
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
            }
        });
    });
    
    // Initialize Tutor App
    async function initializeTutorApp() {
        // Update user info
        userAvatar.textContent = currentTutor.username.charAt(0).toUpperCase();
        updateDisplays();
        
        // Load initial data
        await loadDashboardData();
        loadMyCourses();
        
        // Set up real-time listeners
        setupRealTimeListeners();
    }
    
    function updateDisplays() {
        const tp = currentTutor.tutorPoints || 0;
        const lp = currentTutor.lp || 0;
        
        tutorPointsDisplay.textContent = `${tp} TP`;
        userLpDisplay.textContent = `${lp} LP`;
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
                    <p>${airdrop.description || 'Claim your free LP!'}</p>
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
    
    // Upload Course
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('course-title').value;
        const description = document.getElementById('course-description').value;
        const image = document.getElementById('course-image').value;
        const url = document.getElementById('course-url').value;
        const category = document.getElementById('course-category').value;
        
        try {
            // Get next course ID
            let nextId = 1;
            const coursesSnapshot = await db.collection('courses').orderBy('id', 'desc').limit(1).get();
            
            if (!coursesSnapshot.empty) {
                const lastCourse = coursesSnapshot.docs[0].data();
                nextId = lastCourse.id + 1;
            } else {
                // Start after hardcoded courses
                nextId = 27; // Since you have 26 hardcoded courses
            }
            
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
            <h4>${course.title}</h4>
            <p>${course.description}</p>
            <div class="course-meta">
                <span class="course-category">${course.category}</span>
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
                    <i class="fas fa-star" style="color: var(--christmas-gold);"></i>
                    <span>${course.tutorPointsEarned || 0} TP</span>
                </div>
            </div>
            <div class="course-status">
                <span class="badge ${course.status === 'active' ? 'active' : 'pending'}">
                    ${course.status}
                </span>
            </div>
        `;
        
        return courseElement;
    }
    
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
        
        try {
            // Create conversion request
            const conversionData = {
                tutorId: currentUser.uid,
                tutorName: currentTutor.username,
                tutorEmail: currentTutor.email,
                amount: amount,
                usdValue: amount / 100,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Add to conversions collection
            await db.collection('conversions').add(conversionData);
            
            // Update tutor's points
            const newPoints = currentTutor.tutorPoints - amount;
            await db.collection('tutors').doc(currentUser.uid).update({
                tutorPoints: newPoints
            });
            
            // Update current tutor
            currentTutor.tutorPoints = newPoints;
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
        }
    });
    
    function sendConversionEmail(amount) {
        const usdValue = amount / 100;
        const emailBody = `
Tutor Conversion Request
            
Tutor: ${currentTutor.username}
Email: ${currentTutor.email}
            
Amount: ${amount} TP
USD Value: $${usdValue.toFixed(2)}
            
Message: "I wish to convert my ${amount} TP to money."
            
Please process this payment within 24-48 hours.
        `;
        
        // In a real application, you would send this email
        console.log('Email sent to legendtechlord@gmail.com:', emailBody);
        
        // For demo purposes, we'll simulate email sending
        const mailtoLink = `mailto:legendtechlord@gmail.com?subject=Tutor%20Conversion%20Request&body=${encodeURIComponent(emailBody)}`;
        
        // Open email client
        window.open(mailtoLink, '_blank');
    }
    
    async function loadAnalytics() {
        try {
            // Get tutor's courses analytics
            const coursesSnapshot = await db.collection('courses')
                .where('tutorId', '==', currentUser.uid)
                .get();
            
            let totalUnlocks = 0;
            let totalLikes = 0;
            let totalDislikes = 0;
            let coursePerformance = [];
            
            coursesSnapshot.forEach(doc => {
                const course = doc.data();
                totalUnlocks += course.unlocks || 0;
                totalLikes += course.likes || 0;
                totalDislikes += course.dislikes || 0;
                
                coursePerformance.push({
                    title: course.title,
                    unlocks: course.unlocks || 0,
                    likes: course.likes || 0,
                    dislikes: course.dislikes || 0
                });
            });
            
            // Update analytics displays
            const activityList = document.getElementById('activity-list');
            activityList.innerHTML = coursePerformance.map(course => `
                <div class="activity-item">
                    <div class="activity-title">${course.title}</div>
                    <div class="activity-stats">
                        <span>👥 ${course.unlocks}</span>
                        <span>👍 ${course.likes}</span>
                        <span>👎 ${course.dislikes}</span>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }
    
    function setupRealTimeListeners() {
        // Listen for course updates
        db.collection('courses')
            .where('tutorId', '==', currentUser.uid)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified') {
                        // Update dashboard if on dashboard page
                        if (document.getElementById('dashboard-section').classList.contains('active')) {
                            loadDashboardData();
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
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
        if (e.target === conversionModal) {
            conversionModal.classList.remove('active');
        }
    });
});