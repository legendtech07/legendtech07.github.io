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

    // Hardcoded admin credentials
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
            // Check if credentials match hardcoded admin accounts
            const isAdmin = adminCredentials.some(cred => 
                cred.email === email && cred.password === password
            );

            if (isAdmin) {
                // Try to sign in with Firebase
                try {
                    const userCredential = await auth.signInWithEmailAndPassword(email, password);
                    const user = userCredential.user;
                    
                    // Successfully logged in with Firebase
                    authContainer.style.display = 'none';
                    adminContainer.style.display = 'block';
                    
                    // Load admin data
                    loadDashboardData();
                    loadUsers();
                    loadCourses();
                    
                } catch (firebaseError) {
                    // If Firebase login fails, try to create the admin account first
                    if (firebaseError.code === 'auth/user-not-found') {
                        try {
                            // Create admin account in Firebase
                            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                            const user = userCredential.user;
                            
                            // Create user document in Firestore
                            await db.collection('users').doc(user.uid).set({
                                username: 'Admin',
                                email: email,
                                country: 'NG',
                                lp: 1000,
                                streak: 0,
                                lastClaimDate: null,
                                unlockedCourses: [],
                                usedBonusCodes: [],
                                isAdmin: true,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            });
                            
                            // Successfully created and logged in
                            authContainer.style.display = 'none';
                            adminContainer.style.display = 'block';
                            
                            // Load admin data
                            loadDashboardData();
                            loadUsers();
                            loadCourses();
                            
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
                
                // Refresh data when switching sections
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
            // Get the current highest course ID from both hardcoded and Firestore courses
            let nextId = 1;
            
            // Check Firestore for highest ID
            const coursesSnapshot = await db.collection('courses').orderBy('id', 'desc').limit(1).get();
            if (!coursesSnapshot.empty) {
                const lastCourse = coursesSnapshot.docs[0].data();
                nextId = lastCourse.id + 1;
            } else {
                // If no courses in Firestore, check hardcoded courses length
                // Assuming hardcoded courses go up to ID 25 as per your main app
                const hardcodedCoursesCount = 25; // Adjust this based on your actual hardcoded courses
                nextId = hardcodedCoursesCount + 1;
            }
            
            // Add course to Firestore
            await db.collection('courses').add({
                id: nextId,
                title,
                description,
                image,
                url,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                source: 'admin-panel'
            });
            
            // Reset form
            courseForm.reset();
            
            // Reload courses
            loadCourses();
            
            alert('Course added successfully!');
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
            document.getElementById('total-users').textContent = totalUsers;
            
            // Get total courses (Firestore courses only)
            const coursesSnapshot = await db.collection('courses').get();
            const firestoreCourses = coursesSnapshot.size;
            const hardcodedCourses = 25; // Your existing hardcoded courses
            const totalCourses = firestoreCourses + hardcodedCourses;
            
            document.getElementById('total-courses').textContent = totalCourses;
            
            // Calculate total LP and active users
            let totalLP = 0;
            let activeUsers = 0;
            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                totalLP += userData.lp || 0;
                if (userData.lastLogin || userData.lastClaimDate) {
                    activeUsers++;
                }
            });
            
            document.getElementById('total-lp').textContent = totalLP;
            document.getElementById('active-users').textContent = activeUsers;
            
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
                existingCourses.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.7);">No admin-created courses found</div>';
                return;
            }
            
            coursesSnapshot.forEach(doc => {
                const course = doc.data();
                const courseElement = document.createElement('div');
                courseElement.className = 'course-card';
                
                courseElement.innerHTML = `
                    <h4>${course.title}</h4>
                    <p>${course.description}</p>
                    <p><small>ID: ${course.id} | Created: ${course.createdAt ? new Date(course.createdAt.toDate()).toLocaleDateString() : 'N/A'}</small></p>
                    <div class="course-actions">
                        <button class="btn btn-danger delete-course" data-id="${doc.id}">Delete</button>
                    </div>
                `;
                
                existingCourses.appendChild(courseElement);
            });
            
            // Add event listeners to delete buttons
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

    // Check if user is already logged in
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // Check if logged in user is an admin
            const isAdmin = adminCredentials.some(cred => cred.email === user.email);
            
            if (isAdmin) {
                document.getElementById('loader').style.display = 'none';
                authContainer.style.display = 'none';
                adminContainer.style.display = 'block';
                loadDashboardData();
                loadUsers();
                loadCourses();
            } else {
                // Not an admin, sign them out
                await auth.signOut();
                alert('Access denied. Admin privileges required.');
            }
        }
    });
});