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
    const logoutBtn = document.getElementById('logout-btn');
    
    // Form elements
    const notificationForm = document.getElementById('notification-form');
    const announcementForm = document.getElementById('announcement-form');
    const broadcastForm = document.getElementById('broadcast-form');

    // Admin credentials
    const adminCredentials = [
        { email: 'legendtechlord@gmail.com', password: 'Clinton2007' },
        { email: 'admin@legendtech.com', password: 'Clinton2007' }
    ];

    // Global functions
    window.switchSection = function(section) {
        navBtns.forEach(btn => {
            if (btn.dataset.section === section) {
                btn.click();
            }
        });
    };

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
                    loadNotifications();
                    loadAnnouncements();
                    loadBroadcasts();
                    
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
                            loadNotifications();
                            loadAnnouncements();
                            loadBroadcasts();
                            
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
                } else if (section === 'notifications') {
                    loadNotifications();
                } else if (section === 'announcements') {
                    loadAnnouncements();
                } else if (section === 'broadcasts') {
                    loadBroadcasts();
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

    // Create Notification
    notificationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('notification-title').value;
        const message = document.getElementById('notification-message').value;
        const type = document.getElementById('notification-type').value;
        const icon = document.getElementById('notification-icon').value;
        
        try {
            // Add notification to Firestore
            await db.collection('notifications').add({
                title,
                message,
                type,
                icon,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                active: true
            });
            
            // Reset form
            notificationForm.reset();
            
            // Reload notifications
            loadNotifications();
            loadDashboardData();
            
            alert('Notification created successfully!');
        } catch (error) {
            alert('Error creating notification: ' + error.message);
        }
    });

    // Create Announcement
    announcementForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('announcement-title').value;
        const message = document.getElementById('announcement-message').value;
        const type = document.getElementById('announcement-type').value;
        const priority = document.getElementById('announcement-priority').value;
        const active = document.getElementById('announcement-active').checked;
        
        try {
            // Add announcement to Firestore
            await db.collection('announcements').add({
                title,
                message,
                type,
                priority,
                active,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Reset form
            announcementForm.reset();
            
            // Reload announcements
            loadAnnouncements();
            loadDashboardData();
            
            alert('Announcement created successfully!');
        } catch (error) {
            alert('Error creating announcement: ' + error.message);
        }
    });
    
    // Send Broadcast
    broadcastForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('broadcast-title').value;
        const message = document.getElementById('broadcast-message').value;
        const broadcastType = document.getElementById('broadcast-type').value;
        const method = document.getElementById('broadcast-method').value;
        
        try {
            // Add broadcast to Firestore
            await db.collection('broadcasts').add({
                title,
                message,
                broadcastType,
                method,
                sentAt: firebase.firestore.FieldValue.serverTimestamp(),
                sentBy: auth.currentUser.email
            });
            
            // Reset form
            broadcastForm.reset();
            
            // Reload broadcasts
            loadBroadcasts();
            loadDashboardData();
            
            alert('Broadcast sent successfully!');
        } catch (error) {
            alert('Error sending broadcast: ' + error.message);
        }
    });

    // Load Dashboard Data
    async function loadDashboardData() {
        try {
            // Get total notifications
            const notificationsSnapshot = await db.collection('notifications').get();
            const totalNotifications = notificationsSnapshot.size;
            document.getElementById('total-notifications').textContent = totalNotifications;
            
            // Get active announcements
            const announcementsSnapshot = await db.collection('announcements').where('active', '==', true).get();
            const totalAnnouncements = announcementsSnapshot.size;
            document.getElementById('total-announcements').textContent = totalAnnouncements;
            
            // Get total broadcasts
            const broadcastsSnapshot = await db.collection('broadcasts').get();
            const totalBroadcasts = broadcastsSnapshot.size;
            document.getElementById('total-broadcasts').textContent = totalBroadcasts;
            
            // Calculate unread users (simplified - you can implement proper tracking)
            const usersSnapshot = await db.collection('users').get();
            const unreadCount = usersSnapshot.size; // This would need proper tracking
            document.getElementById('unread-count').textContent = unreadCount;
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    // Load Notifications
    async function loadNotifications() {
        try {
            const notificationsSnapshot = await db.collection('notifications').orderBy('createdAt', 'desc').get();
            const notificationsList = document.getElementById('notifications-list');
            notificationsList.innerHTML = '';
            
            if (notificationsSnapshot.empty) {
                notificationsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-bell-slash"></i>
                        <p>No notifications found</p>
                    </div>
                `;
                return;
            }
            
            notificationsSnapshot.forEach(doc => {
                const notification = doc.data();
                const notificationElement = document.createElement('div');
                notificationElement.className = 'item-card';
                
                const typeBadges = {
                    'info': 'badge-info',
                    'warning': 'badge-warning',
                    'success': 'badge-success',
                    'error': 'badge-danger',
                    'update': 'badge-info',
                    'event': 'badge-success'
                };
                
                notificationElement.innerHTML = `
                    <div class="item-header">
                        <div>
                            <div class="item-title">${notification.icon} ${notification.title}</div>
                            <div class="item-meta">
                                <span class="badge ${typeBadges[notification.type] || 'badge-info'}">${notification.type}</span>
                                <span>${notification.createdAt ? new Date(notification.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="btn btn-danger delete-notification" data-id="${doc.id}">Delete</button>
                        </div>
                    </div>
                    <div class="item-content">${notification.message}</div>
                `;
                
                notificationsList.appendChild(notificationElement);
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-notification').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this notification?')) {
                        try {
                            await db.collection('notifications').doc(btn.dataset.id).delete();
                            loadNotifications();
                            loadDashboardData();
                        } catch (error) {
                            alert('Error deleting notification: ' + error.message);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    // Load Announcements
    async function loadAnnouncements() {
        try {
            const announcementsSnapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
            const announcementsList = document.getElementById('announcements-list');
            announcementsList.innerHTML = '';
            
            if (announcementsSnapshot.empty) {
                announcementsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-bullhorn"></i>
                        <p>No announcements found</p>
                    </div>
                `;
                return;
            }
            
            announcementsSnapshot.forEach(doc => {
                const announcement = doc.data();
                const announcementElement = document.createElement('div');
                announcementElement.className = 'item-card';
                
                const priorityBadges = {
                    'low': 'badge-info',
                    'medium': 'badge-warning',
                    'high': 'badge-danger'
                };
                
                const statusBadge = announcement.active ? 'badge-success' : 'badge-secondary';
                
                announcementElement.innerHTML = `
                    <div class="item-header">
                        <div>
                            <div class="item-title">${announcement.title}</div>
                            <div class="item-meta">
                                <span class="badge ${priorityBadges[announcement.priority] || 'badge-info'}">${announcement.priority}</span>
                                <span class="badge ${statusBadge}">${announcement.active ? 'Active' : 'Inactive'}</span>
                                <span>${announcement.createdAt ? new Date(announcement.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="btn btn-warning toggle-announcement" data-id="${doc.id}" data-active="${announcement.active}">
                                ${announcement.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button class="btn btn-danger delete-announcement" data-id="${doc.id}">Delete</button>
                        </div>
                    </div>
                    <div class="item-content">${announcement.message}</div>
                `;
                
                announcementsList.appendChild(announcementElement);
            });
            
            // Add event listeners
            document.querySelectorAll('.toggle-announcement').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const newActiveState = btn.dataset.active === 'true' ? false : true;
                    try {
                        await db.collection('announcements').doc(btn.dataset.id).update({
                            active: newActiveState
                        });
                        loadAnnouncements();
                        loadDashboardData();
                    } catch (error) {
                        alert('Error updating announcement: ' + error.message);
                    }
                });
            });
            
            document.querySelectorAll('.delete-announcement').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this announcement?')) {
                        try {
                            await db.collection('announcements').doc(btn.dataset.id).delete();
                            loadAnnouncements();
                            loadDashboardData();
                        } catch (error) {
                            alert('Error deleting announcement: ' + error.message);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    }
    
    // Load Broadcasts
    async function loadBroadcasts() {
        try {
            const broadcastsSnapshot = await db.collection('broadcasts').orderBy('sentAt', 'desc').get();
            const broadcastsList = document.getElementById('broadcasts-list');
            broadcastsList.innerHTML = '';
            
            if (broadcastsSnapshot.empty) {
                broadcastsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-broadcast-tower"></i>
                        <p>No broadcasts sent yet</p>
                    </div>
                `;
                return;
            }
            
            broadcastsSnapshot.forEach(doc => {
                const broadcast = doc.data();
                const broadcastElement = document.createElement('div');
                broadcastElement.className = 'item-card';
                
                broadcastElement.innerHTML = `
                    <div class="item-header">
                        <div>
                            <div class="item-title">${broadcast.title}</div>
                            <div class="item-meta">
                                <span class="badge badge-info">${broadcast.broadcastType}</span>
                                <span class="badge badge-warning">${broadcast.method}</span>
                                <span>${broadcast.sentAt ? new Date(broadcast.sentAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="btn btn-danger delete-broadcast" data-id="${doc.id}">Delete</button>
                        </div>
                    </div>
                    <div class="item-content">${broadcast.message}</div>
                    <div class="item-meta">
                        <small>Sent by: ${broadcast.sentBy || 'Admin'}</small>
                    </div>
                `;
                
                broadcastsList.appendChild(broadcastElement);
            });
            
            // Add event listeners to delete buttons for broadcasts
            document.querySelectorAll('.delete-broadcast').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this broadcast?')) {
                        try {
                            await db.collection('broadcasts').doc(btn.dataset.id).delete();
                            loadBroadcasts();
                            loadDashboardData();
                        } catch (error) {
                            alert('Error deleting broadcast: ' + error.message);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error loading broadcasts:', error);
        }
    }

    // Check if user is already logged in
    auth.onAuthStateChanged(async (user) => {
        if (user && adminCredentials.some(cred => cred.email === user.email)) {
            document.getElementById('loader').style.display = 'none';
            authContainer.style.display = 'none';
            adminContainer.style.display = 'block';
            loadDashboardData();
            loadNotifications();
            loadAnnouncements();
            loadBroadcasts();
        }
    });
}); // This closes the DOMContentLoaded event listener