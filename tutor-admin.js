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

    // Escape any value before it is placed into innerHTML or an attribute —
    // tutor profile fields are self-reported by tutors, so this prevents a
    // malicious name/username/etc. from injecting markup or scripts that run
    // in the admin's browser.
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text == null ? '' : String(text);
        return div.innerHTML;
    }

    const KNOWN_RANKS = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Ruby', 'Diamond', 'Elite'];
    function safeRank(rank) {
        return KNOWN_RANKS.includes(rank) ? rank : 'Iron';
    }

    // An account is an admin only if its own Firestore user document has
    // isAdmin: true — the same flag used by the main admin panels, so there
    // is one place to manage who has access instead of a hardcoded list here.
    async function checkIsAdmin(uid) {
        const doc = await db.collection('users').doc(uid).get();
        return doc.exists && doc.data().isAdmin === true;
    }

    // Chart instance
    let rankChart = null;

    // Simulate loading
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('auth-container').style.display = 'flex';
        checkAuthState();
    }, 2000);

    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const adminContainer = document.getElementById('admin-container');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const tutorSearch = document.getElementById('tutor-search');
    const rankFilter = document.getElementById('rank-filter');
    const verificationFilter = document.getElementById('verification-filter');
    const tutorsList = document.getElementById('tutors-list');
    
    // Modal elements
    const tutorModal = document.getElementById('tutor-modal');
    const closeTutorModal = document.getElementById('close-tutor-modal');
    const idcardModal = document.getElementById('idcard-modal');
    const closeIdcardModal = document.getElementById('close-idcard-modal');
    const downloadIdBtn = document.getElementById('download-id-btn');
    const printIdBtn = document.getElementById('print-id-btn');
    const saveTutorBtn = document.getElementById('save-tutor-btn');
    
    // Stats elements
    const totalTutorsDisplay = document.getElementById('total-tutors');
    const verifiedTutorsDisplay = document.getElementById('verified-tutors');
    const totalTpDisplay = document.getElementById('total-tp');
    const rankDistributionDisplay = document.getElementById('rank-distribution');

    // Current admin and selected tutor
    let currentAdmin = null;
    let selectedTutor = null;
    let allTutors = [];

    // Check authentication state
    function checkAuthState() {
        auth.onAuthStateChanged(async (user) => {
            if (user && await checkIsAdmin(user.uid)) {
                currentAdmin = user;
                authContainer.style.display = 'none';
                adminContainer.style.display = 'block';
                await loadAdminDashboard();
                setupRealTimeListeners();
            } else {
                if (user) await auth.signOut();
                showLoginForm();
            }
        });
    }

    function showLoginForm() {
        authContainer.style.display = 'flex';
        adminContainer.style.display = 'none';
    }

    // Login Form Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            if (!(await checkIsAdmin(user.uid))) {
                await auth.signOut();
                alert('You are not authorized as an admin.');
                return;
            }
            
            // Success - admin panel will show via auth state
        } catch (error) {
            alert(error.message);
        }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            currentAdmin = null;
            adminContainer.style.display = 'none';
            authContainer.style.display = 'flex';
            loginForm.reset();
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed: ' + error.message);
        }
    });

    // Load Admin Dashboard
    async function loadAdminDashboard() {
        try {
            const tutorsSnapshot = await db.collection('tutors').get();
            allTutors = [];
            
            tutorsSnapshot.forEach(doc => {
                const tutor = doc.data();
                tutor.uid = doc.id;
                allTutors.push(tutor);
            });
            
            // Update stats
            updateStats();
            
            // Render tutors
            renderTutors(allTutors);
            
            // Render rank chart
            renderRankChart();
            
        } catch (error) {
            console.error('Error loading admin dashboard:', error);
        }
    }

    function updateStats() {
        const totalTutors = allTutors.length;
        const verifiedTutors = allTutors.filter(t => t.idVerified).length;
        const totalTp = allTutors.reduce((sum, t) => sum + (t.tutorPoints || 0), 0);
        
        // Count unique ranks
        const ranks = new Set(allTutors.map(t => t.rank || 'Iron'));
        
        totalTutorsDisplay.textContent = totalTutors;
        verifiedTutorsDisplay.textContent = verifiedTutors;
        totalTpDisplay.textContent = totalTp;
        rankDistributionDisplay.textContent = ranks.size;
    }

    function renderRankChart() {
        const ctx = document.getElementById('rankChart').getContext('2d');
        
        // Count tutors by rank
        const rankCounts = {
            'Iron': 0,
            'Bronze': 0,
            'Silver': 0,
            'Gold': 0,
            'Platinum': 0,
            'Ruby': 0,
            'Diamond': 0,
            'Elite': 0
        };
        
        allTutors.forEach(tutor => {
            const rank = tutor.rank || 'Iron';
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        });
        
        const ranks = Object.keys(rankCounts).filter(r => rankCounts[r] > 0);
        const counts = ranks.map(r => rankCounts[r]);
        
        // Colors for ranks
        const colors = {
            'Iron': '#8a8a8a',
            'Bronze': '#cd7f32',
            'Silver': '#c0c0c0',
            'Gold': '#ffd700',
            'Platinum': '#e5e4e2',
            'Ruby': '#e0115f',
            'Diamond': '#b9f2ff',
            'Elite': '#9400d3'
        };
        
        const backgroundColors = ranks.map(r => colors[r] || '#8a8a8a');
        
        // Destroy previous chart if exists
        if (rankChart) {
            rankChart.destroy();
        }
        
        rankChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ranks,
                datasets: [{
                    data: counts,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(26, 26, 46, 0.8)',
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

    function renderTutors(tutors) {
        tutorsList.innerHTML = '';
        
        if (tutors.length === 0) {
            tutorsList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No tutors found</p>';
            return;
        }
        
        tutors.forEach(tutor => {
            const card = createTutorCard(tutor);
            tutorsList.appendChild(card);
        });
    }

    function createTutorCard(tutor) {
        const card = document.createElement('div');
        card.className = 'tutor-admin-card';
        card.dataset.uid = tutor.uid;
        
        const rank = safeRank(tutor.rank);
        const rankClass = `rank-${rank.toLowerCase()}`;
        const displayName = escapeHtml(tutor.fullName || tutor.username);
        
        card.innerHTML = `
            <div class="tutor-card-header">
                <div class="tutor-avatar">
                    <img src="${escapeHtml(tutor.photoUrl || 'https://via.placeholder.com/60')}" alt="${displayName}" onerror="this.src='https://via.placeholder.com/60'">
                </div>
                <div class="tutor-header-info">
                    <div class="tutor-name">
                        ${displayName}
                        <span class="tutor-badge ${tutor.idVerified ? 'badge-verified' : 'badge-pending'}">
                            ${tutor.idVerified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                    <div class="tutor-serial">${escapeHtml(tutor.serialNumber) || 'N/A'}</div>
                </div>
            </div>
            
            <div class="tutor-rank ${rankClass}">
                <i class="fas fa-star"></i> ${rank} Rank
            </div>
            
            <div class="tutor-stats">
                <div class="stat-item">
                    <div class="stat-value">${tutor.tutorPoints || 0}</div>
                    <div class="stat-label">TP</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${tutor.totalCourses || 0}</div>
                    <div class="stat-label">Courses</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${tutor.totalUnlocks || 0}</div>
                    <div class="stat-label">Unlocks</div>
                </div>
            </div>
            
            <div class="tutor-actions">
                <button class="btn btn-small view-tutor" data-uid="${tutor.uid}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-small view-id" data-uid="${tutor.uid}">
                    <i class="fas fa-id-card"></i> ID
                </button>
            </div>
        `;
        
        // Add event listeners
        card.querySelector('.view-tutor').addEventListener('click', (e) => {
            e.stopPropagation();
            showTutorDetails(tutor);
        });
        
        card.querySelector('.view-id').addEventListener('click', (e) => {
            e.stopPropagation();
            showTutorIdCard(tutor);
        });
        
        card.addEventListener('click', () => {
            showTutorDetails(tutor);
        });
        
        return card;
    }

    function showTutorDetails(tutor) {
        selectedTutor = tutor;
        
        const content = document.getElementById('tutor-details-content');
        
        content.innerHTML = `
            <form class="tutor-details-form" id="tutor-edit-form">
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-user"></i> Full Name</label>
                        <input type="text" id="edit-fullname" value="${escapeHtml(tutor.fullName || '')}" required>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-at"></i> Username</label>
                        <input type="text" id="edit-username" value="${escapeHtml(tutor.username || '')}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-envelope"></i> Email</label>
                        <input type="email" id="edit-email" value="${escapeHtml(tutor.email || '')}" required>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-globe"></i> Country</label>
                        <input type="text" id="edit-country" value="${escapeHtml(tutor.country || '')}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-calendar"></i> Date of Birth</label>
                        <input type="date" id="edit-dob" value="${escapeHtml(tutor.dateOfBirth || '')}" required>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-id-card"></i> Serial Number</label>
                        <input type="text" id="edit-serial" value="${escapeHtml(tutor.serialNumber || '')}" readonly>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-star"></i> Rank</label>
                        <select id="edit-rank">
                            <option value="Iron" ${tutor.rank === 'Iron' ? 'selected' : ''}>Iron</option>
                            <option value="Bronze" ${tutor.rank === 'Bronze' ? 'selected' : ''}>Bronze</option>
                            <option value="Silver" ${tutor.rank === 'Silver' ? 'selected' : ''}>Silver</option>
                            <option value="Gold" ${tutor.rank === 'Gold' ? 'selected' : ''}>Gold</option>
                            <option value="Platinum" ${tutor.rank === 'Platinum' ? 'selected' : ''}>Platinum</option>
                            <option value="Ruby" ${tutor.rank === 'Ruby' ? 'selected' : ''}>Ruby</option>
                            <option value="Diamond" ${tutor.rank === 'Diamond' ? 'selected' : ''}>Diamond</option>
                            <option value="Elite" ${tutor.rank === 'Elite' ? 'selected' : ''}>Elite</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-coins"></i> Tutor Points</label>
                        <input type="number" id="edit-points" value="${parseInt(tutor.tutorPoints) || 0}" min="0">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-check-circle"></i> Verification Status</label>
                        <select id="edit-verified">
                            <option value="true" ${tutor.idVerified ? 'selected' : ''}>Verified</option>
                            <option value="false" ${!tutor.idVerified ? 'selected' : ''}>Pending</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-image"></i> Photo URL</label>
                        <input type="url" id="edit-photo" value="${escapeHtml(tutor.photoUrl || '')}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-chart-line"></i> Statistics</label>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
                        <div style="text-align: center;">
                            <div style="color: var(--gold); font-weight: bold;">${tutor.totalCourses || 0}</div>
                            <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">Courses</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: var(--gold); font-weight: bold;">${tutor.totalUnlocks || 0}</div>
                            <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">Unlocks</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: var(--gold); font-weight: bold;">${tutor.totalLikes || 0}</div>
                            <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">Likes</div>
                        </div>
                    </div>
                </div>
            </form>
        `;
        
        tutorModal.classList.add('active');
    }

    function showTutorIdCard(tutor) {
        const content = document.getElementById('idcard-content');
        
        const rankColors = {
            'Iron': '#8a8a8a',
            'Bronze': '#cd7f32',
            'Silver': '#c0c0c0',
            'Gold': '#ffd700',
            'Platinum': '#e5e4e2',
            'Ruby': '#e0115f',
            'Diamond': '#b9f2ff',
            'Elite': '#9400d3'
        };
        
        const rank = safeRank(tutor.rank);
        const rankColor = rankColors[rank] || '#8a8a8a';
        
        content.innerHTML = `
            <div class="id-card" id="tutor-id-card">
                <div class="id-header">
                    <h3>LEGEND TECH ACADEMY</h3>
                    <p>Certified Tutor</p>
                </div>
                
                <div class="id-photo">
                    <img src="${escapeHtml(tutor.photoUrl || 'https://via.placeholder.com/120')}" alt="Tutor Photo" onerror="this.src='https://via.placeholder.com/120'">
                </div>
                
                <div class="id-details">
                    <div class="id-row">
                        <span class="id-label">Full Name</span>
                        <span class="id-value">${escapeHtml(tutor.fullName || tutor.username)}</span>
                    </div>
                    
                    <div class="id-row">
                        <span class="id-label">Serial No.</span>
                        <span class="id-value">${escapeHtml(tutor.serialNumber) || 'N/A'}</span>
                    </div>
                    
                    <div class="id-row">
                        <span class="id-label">Country</span>
                        <span class="id-value">${escapeHtml(tutor.country) || 'N/A'}</span>
                    </div>
                    
                    <div class="id-row">
                        <span class="id-label">Joined</span>
                        <span class="id-value">${tutor.createdAt ? new Date(tutor.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    
                    <div class="id-row">
                        <span class="id-label">Tutor Points</span>
                        <span class="id-value">${tutor.tutorPoints || 0} TP</span>
                    </div>
                </div>
                
                <div class="id-rank" style="background: ${rankColor}; color: ${rank === 'Silver' || rank === 'Gold' || rank === 'Platinum' || rank === 'Diamond' ? '#000' : '#fff'};">
                    <i class="fas fa-star"></i> ${rank} RANK
                </div>
                
                <div class="id-footer">
                    <i class="fas fa-shield-alt"></i> Official Legend Tech Academy Tutor
                </div>
            </div>
        `;
        
        idcardModal.classList.add('active');
    }

    // Save tutor changes
    saveTutorBtn.addEventListener('click', async () => {
        if (!selectedTutor) return;
        
        try {
            const updates = {
                fullName: document.getElementById('edit-fullname').value,
                username: document.getElementById('edit-username').value,
                email: document.getElementById('edit-email').value,
                country: document.getElementById('edit-country').value,
                dateOfBirth: document.getElementById('edit-dob').value,
                rank: document.getElementById('edit-rank').value,
                tutorPoints: parseInt(document.getElementById('edit-points').value),
                idVerified: document.getElementById('edit-verified').value === 'true',
                photoUrl: document.getElementById('edit-photo').value
            };
            
            await db.collection('tutors').doc(selectedTutor.uid).update(updates);
            
            // Update local data
            Object.assign(selectedTutor, updates);
            
            // Refresh display
            await loadAdminDashboard();
            
            tutorModal.classList.remove('active');
            
            alert('Tutor details updated successfully!');
            
        } catch (error) {
            console.error('Error updating tutor:', error);
            alert('Error updating tutor: ' + error.message);
        }
    });

    // Print ID card
    printIdBtn.addEventListener('click', () => {
        const idCard = document.getElementById('tutor-id-card');
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Tutor ID Card</title>
                    <style>
                        body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
                        .id-card { 
                            background: linear-gradient(135deg, #1a2a3a, #0f1a24);
                            border-radius: 15px;
                            padding: 2rem;
                            border: 2px solid #ffd700;
                            width: 350px;
                            color: white;
                        }
                        .id-header { text-align: center; border-bottom: 1px solid rgba(255,215,0,0.3); padding-bottom: 1rem; }
                        .id-header h3 { color: #ffd700; margin: 0; }
                        .id-photo { width: 120px; height: 120px; border-radius: 50%; margin: 1rem auto; border: 3px solid #ffd700; overflow: hidden; }
                        .id-photo img { width: 100%; height: 100%; object-fit: cover; }
                        .id-details { background: rgba(142, 45, 226,0.1); border-radius: 10px; padding: 1rem; }
                        .id-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
                        .id-label { color: #c4b5fd; }
                        .id-value { font-weight: bold; }
                        .id-rank { text-align: center; padding: 0.5rem; border-radius: 8px; margin-top: 1rem; }
                        .id-footer { text-align: center; margin-top: 1rem; font-size: 0.8rem; opacity: 0.8; }
                    </style>
                </head>
                <body>${idCard.outerHTML}</body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    });

    // Download ID card
    downloadIdBtn.addEventListener('click', function() {
        const idCard = document.getElementById('tutor-id-card');
        
        html2canvas(idCard, {
            scale: 2,
            backgroundColor: null,
            logging: false,
            allowTaint: true,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Tutor_ID_${selectedTutor?.serialNumber?.replace(/\//g, '_') || 'card'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    // Search and filter
    function filterTutors() {
        const searchTerm = tutorSearch.value.toLowerCase().trim();
        const rankValue = rankFilter.value;
        const verificationValue = verificationFilter.value;
        
        const filtered = allTutors.filter(tutor => {
            // Search filter
            const matchesSearch = searchTerm === '' || 
                (tutor.fullName && tutor.fullName.toLowerCase().includes(searchTerm)) ||
                (tutor.username && tutor.username.toLowerCase().includes(searchTerm)) ||
                (tutor.email && tutor.email.toLowerCase().includes(searchTerm)) ||
                (tutor.serialNumber && tutor.serialNumber.toLowerCase().includes(searchTerm));
            
            // Rank filter
            const matchesRank = rankValue === '' || (tutor.rank || 'Iron') === rankValue;
            
            // Verification filter
            const matchesVerification = verificationValue === '' || 
                (verificationValue === 'verified' && tutor.idVerified) ||
                (verificationValue === 'pending' && !tutor.idVerified);
            
            return matchesSearch && matchesRank && matchesVerification;
        });
        
        renderTutors(filtered);
    }

    tutorSearch.addEventListener('input', filterTutors);
    rankFilter.addEventListener('change', filterTutors);
    verificationFilter.addEventListener('change', filterTutors);

    // Close modals
    closeTutorModal.addEventListener('click', () => {
        tutorModal.classList.remove('active');
    });

    closeIdcardModal.addEventListener('click', () => {
        idcardModal.classList.remove('active');
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === tutorModal) {
            tutorModal.classList.remove('active');
        }
        if (e.target === idcardModal) {
            idcardModal.classList.remove('active');
        }
    });

    // Real-time updates
    function setupRealTimeListeners() {
        db.collection('tutors').onSnapshot(() => {
            loadAdminDashboard();
        });
    }
});