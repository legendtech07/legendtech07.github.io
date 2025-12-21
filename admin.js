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
        document.getElementById('auth-container').style.display = 'flex';
    }, 2000);

    // DOM Elements
    const adminLoginForm = document.getElementById('admin-login-form');
    const authContainer = document.getElementById('auth-container');
    const adminContainer = document.getElementById('admin-container');
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.admin-section');
    const courseForm = document.getElementById('course-form');
    const logoutBtn = document.getElementById('logout-btn');
    const usersTableBody = document.getElementById('users-table-body');
    const existingCourses = document.getElementById('existing-courses');
    const totalUsersDisplay = document.getElementById('total-users');
    const totalCoursesDisplay = document.getElementById('total-courses');
    const activeUsersDisplay = document.getElementById('active-users');
    const totalLpDisplay = document.getElementById('total-lp');

    // Admin credentials (Christmas Special)
    const adminCredentials = [
        { email: 'legendtechlord@gmail.com', password: 'Clinton2007' },
        { email: 'admin@legendtech.com', password: 'Clinton2007' }
    ];

    // Admin Login
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        
        try {
            const isAdmin = adminCredentials.some(cred => 
                cred.email === email && cred.password === password
            );

            if (isAdmin) {
                try {
                    const userCredential = await auth.signInWithEmailAndPassword(email, password);
                    
                    authContainer.style.display = 'none';
                    adminContainer.style.display = 'block';
                    
                    loadDashboardData();
                    loadUsers();
                    loadCourses();
                    loadAirdrops();
                    
                } catch (firebaseError) {
                    if (firebaseError.code === 'auth/user-not-found') {
                        try {
                            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                            const user = userCredential.user;
                            
                            await db.collection('users').doc(user.uid).set({
                                username: 'Admin',
                                email: email,
                                country: 'NG',
                                lp: 10000,
                                streak: 0,
                                lastClaimDate: null,
                                unlockedCourses: [],
                                usedBonusCodes: [],
                                isAdmin: true,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            });
                            
                            authContainer.style.display = 'none';
                            adminContainer.style.display = 'block';
                            
                            loadDashboardData();
                            loadUsers();
                            loadCourses();
                            loadAirdrops();
                            
                        } catch (createError) {
                            alert('Error creating admin account: ' + createError.message);
                        }
                    } else {
                        alert('Login failed: ' + firebaseError.message);
                    }
                }
            } else {
                alert('Access denied. Invalid admin credentials.');
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });

    // Navigation
    navBtns.forEach(btn => {
        if (btn.id !== 'logout-btn') {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                sections.forEach(sec => sec.style.display = 'none');
                document.getElementById(`${section}-section`).style.display = 'block';
                
                if (section === 'dashboard') {
                    loadDashboardData();
                } else if (section === 'users') {
                    loadUsers();
                } else if (section === 'courses') {
                    loadCourses();
                }
            });
        }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            adminContainer.style.display = 'none';
            authContainer.style.display = 'flex';
            adminLoginForm.reset();
        } catch (error) {
            alert('Logout failed: ' + error.message);
        }
    });

    // Add Course
    courseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('course-title').value;
        const description = document.getElementById('course-description').value;
        const image = document.getElementById('course-image').value;
        const url = document.getElementById('course-url').value;
        
        try {
            let nextId = 1;
            const coursesSnapshot = await db.collection('courses').orderBy('id', 'desc').limit(1).get();
            
            if (!coursesSnapshot.empty) {
                const lastCourse = coursesSnapshot.docs[0].data();
                nextId = lastCourse.id + 1;
            } else {
                nextId = 27;
            }
            
            await db.collection('courses').add({
                id: nextId,
                title,
                description,
                image,
                url,
                price: 100,
                source: 'admin-panel',
                unlocks: 0,
                likes: 0,
                dislikes: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            courseForm.reset();
            loadCourses();
            loadDashboardData();
            
            alert('🎄 Course added successfully!');
        } catch (error) {
            alert('Error adding course: ' + error.message);
        }
    });

    // Load Dashboard Data
    async function loadDashboardData() {
        try {
            // Get total users
            const usersSnapshot = await db.collection('users').get();
            const totalUsers = usersSnapshot.size;
            totalUsersDisplay.textContent = totalUsers;
            
            // Get total courses
            const coursesSnapshot = await db.collection('courses').get();
            const firestoreCourses = coursesSnapshot.size;
            const hardcodedCourses = 26;
            const totalCourses = firestoreCourses + hardcodedCourses;
            totalCoursesDisplay.textContent = totalCourses;
            
            // Calculate total LP and active users
            let totalLP = 0;
            let activeUsers = 0;
            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                totalLP += userData.lp || 0;
                
                // Check if user was active in last 7 days
                if (userData.lastLogin) {
                    const lastLogin = userData.lastLogin.toDate();
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    
                    if (lastLogin > sevenDaysAgo) {
                        activeUsers++;
                    }
                } else if (userData.lastClaimDate) {
                    const lastClaim = new Date(userData.lastClaimDate);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    
                    if (lastClaim > sevenDaysAgo) {
                        activeUsers++;
                    }
                }
            });
            
            totalLpDisplay.textContent = totalLP;
            activeUsersDisplay.textContent = activeUsers;
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    // Load Users
    async function loadUsers() {
        try {
            const usersSnapshot = await db.collection('users').get();
            usersTableBody.innerHTML = '';
            
            if (usersSnapshot.empty) {
                usersTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found</td></tr>';
                return;
            }
            
            usersSnapshot.forEach(doc => {
                const user = doc.data();
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${user.username || 'N/A'}</td>
                    <td>${user.email || 'N/A'}</td>
                    <td>${user.country || 'N/A'}</td>
                    <td>${user.lp || 0} LP</td>
                    <td>${user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}</td>
                `;
                
                usersTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    // Load Courses
    async function loadCourses() {
        try {
            const coursesSnapshot = await db.collection('courses').orderBy('id').get();
            existingCourses.innerHTML = '';
            
            if (coursesSnapshot.empty) {
                existingCourses.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.7);">No courses found</div>';
                return;
            }
            
            coursesSnapshot.forEach(doc => {
                const course = doc.data();
                const courseElement = document.createElement('div');
                courseElement.className = 'course-card';
                
                courseElement.innerHTML = `
                    <h4>${course.title}</h4>
                    <p>${course.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.8rem;">
                        <div>
                            <span style="color: var(--christmas-green);">👥 ${course.unlocks || 0}</span>
                            <span style="color: var(--christmas-green); margin-left: 1rem;">👍 ${course.likes || 0}</span>
                            <span style="color: var(--christmas-red); margin-left: 1rem;">👎 ${course.dislikes || 0}</span>
                        </div>
                        <span style="color: rgba(255,255,255,0.6);">ID: ${course.id}</span>
                    </div>
                    <p><small>Created: ${course.createdAt ? new Date(course.createdAt.toDate()).toLocaleDateString() : 'N/A'}</small></p>
                    <div class="course-actions">
                        <button class="btn btn-danger delete-course" data-id="${doc.id}">Delete</button>
                    </div>
                `;
                
                existingCourses.appendChild(courseElement);
            });
            
            document.querySelectorAll('.delete-course').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this course?')) {
                        try {
                            await db.collection('courses').doc(btn.dataset.id).delete();
                            loadCourses();
                            loadDashboardData();
                        } catch (error) {
                            alert('Error deleting course: ' + error.message);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    }

    // Load and display airdrops
    async function loadAirdrops() {
        try {
            const airdropsSnapshot = await db.collection('airdrops')
                .orderBy('createdAt', 'desc')
                .limit(10)
                .get();
            
            // Create airdrop section if it doesn't exist
            let airdropSection = document.getElementById('airdrop-section');
            if (!airdropSection) {
                airdropSection = document.createElement('div');
                airdropSection.id = 'airdrop-section';
                airdropSection.className = 'admin-section';
                airdropSection.style.display = 'none';
                airdropSection.innerHTML = `
                    <h2 class="section-title">🎄 Airdrops</h2>
                    <div class="airdrop-actions" style="margin-bottom: 1.5rem;">
                        <button class="btn" id="create-airdrop-btn" style="margin-right: 1rem;">
                            <i class="fas fa-gift"></i> Create Airdrop
                        </button>
                        <button class="btn" id="refresh-airdrops-btn">
                            <i class="fas fa-sync"></i> Refresh
                        </button>
                    </div>
                    <div id="airdrop-list" class="courses-grid">
                        <!-- Airdrops will be loaded here -->
                    </div>
                `;
                
                // Insert after courses section
                const coursesSection = document.getElementById('courses-section');
                coursesSection.parentNode.insertBefore(airdropSection, coursesSection.nextSibling);
                
                // Add event listeners
                document.getElementById('create-airdrop-btn').addEventListener('click', createAirdrop);
                document.getElementById('refresh-airdrops-btn').addEventListener('click', loadAirdrops);
            }
            
            const airdropList = document.getElementById('airdrop-list');
            airdropList.innerHTML = '';
            
            if (airdropsSnapshot.empty) {
                airdropList.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.7);">No airdrops found</div>';
                return;
            }
            
            airdropsSnapshot.forEach(doc => {
                const airdrop = doc.data();
                const airdropElement = document.createElement('div');
                airdropElement.className = 'course-card';
                
                const createdAt = airdrop.createdAt.toDate();
                const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);
                const now = new Date();
                const isExpired = now > expiresAt;
                
                const timeLeft = expiresAt - now;
                const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                
                airdropElement.innerHTML = `
                    <h4>${airdrop.amount} LP Airdrop</h4>
                    <p>${airdrop.description || 'Free LP Airdrop!'}</p>
                    <div style="margin-top: 0.5rem;">
                        <div style="color: ${isExpired ? 'var(--danger)' : 'var(--christmas-green)'}; font-size: 0.9rem;">
                            ${isExpired ? '❌ Expired' : `⏳ Expires in: ${hoursLeft}h ${minutesLeft}m`}
                        </div>
                        <div style="color: var(--christmas-gold); font-size: 0.9rem; margin-top: 0.5rem;">
                            👥 Claimed by: ${airdrop.claimedCount || 0} users
                        </div>
                    </div>
                    <p><small>Created: ${createdAt.toLocaleString()}</small></p>
                    <div class="course-actions">
                        <button class="btn delete-airdrop" data-id="${doc.id}">Delete</button>
                    </div>
                `;
                
                airdropList.appendChild(airdropElement);
            });
            
            // Add delete event listeners
            document.querySelectorAll('.delete-airdrop').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this airdrop?')) {
                        try {
                            await db.collection('airdrops').doc(btn.dataset.id).delete();
                            loadAirdrops();
                        } catch (error) {
                            alert('Error deleting airdrop: ' + error.message);
                        }
                    }
                });
            });
            
        } catch (error) {
            console.error('Error loading airdrops:', error);
        }
    }

    // Create new airdrop
    async function createAirdrop() {
        const amount = prompt('Enter LP amount for airdrop:');
        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        const description = prompt('Enter airdrop description (optional):') || 'Free LP Airdrop!';
        
        try {
            await db.collection('airdrops').add({
                amount: parseInt(amount),
                description: description,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                claimedBy: [],
                claimedCount: 0
            });
            
            alert('🎄 Airdrop created successfully! It will be available for 2 hours.');
            loadAirdrops();
        } catch (error) {
            alert('Error creating airdrop: ' + error.message);
        }
    }

    // Add airdrop navigation button
    function addAirdropNavButton() {
        const navContainer = document.querySelector('.admin-nav');
        if (!navContainer.querySelector('[data-section="airdrops"]')) {
            const airdropBtn = document.createElement('button');
            airdropBtn.className = 'nav-btn';
            airdropBtn.dataset.section = 'airdrops';
            airdropBtn.innerHTML = '<i class="fas fa-gift"></i> Airdrops';
            
            airdropBtn.addEventListener('click', () => {
                navBtns.forEach(b => b.classList.remove('active'));
                airdropBtn.classList.add('active');
                
                sections.forEach(sec => sec.style.display = 'none');
                const airdropSection = document.getElementById('airdrop-section');
                if (airdropSection) {
                    airdropSection.style.display = 'block';
                }
                
                loadAirdrops();
            });
            
            navContainer.insertBefore(airdropBtn, logoutBtn);
        }
    }

    // Check if user is already logged in
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const isAdmin = adminCredentials.some(cred => cred.email === user.email);
            
            if (isAdmin) {
                document.getElementById('loader').style.display = 'none';
                authContainer.style.display = 'none';
                adminContainer.style.display = 'block';
                
                // Add airdrop navigation button
                addAirdropNavButton();
                
                loadDashboardData();
                loadUsers();
                loadCourses();
                loadAirdrops();
            } else {
                await auth.signOut();
                alert('Access denied. Admin privileges required.');
            }
        }
    });
});