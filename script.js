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
    
    // LP Packages in Naira
    const lpPackages = [
        { amount: 100, price: 500 },
        { amount: 500, price: 2500 },
        { amount: 1000, price: 4500 },
        { amount: 5000, price: 20000 },
        { amount: 15000, price: 50000 }
    ];

              // Courses data
const courses = [
    { 
        id: 1, 
        title: "Web Development Fundamentals", 
        description: "Learn HTML, CSS and JavaScript basics",
        url: "https://privatecourses.netlify.app/learn.html?id=crs1&token=tk_3tghhvcpn_mdulbd5i",
        image: "https://i.supaimg.com/3abc4676-98ab-49c4-89a0-c745525dbf71.jpg"
    },
    { 
        id: 2, 
        title: "Advanced JavaScript", 
        description: "Master modern JavaScript techniques",
        url: "https://privatecourses.netlify.app/learn.html?id=crs2&token=tk_h01y0muj7_mdyb01mn",
        image: "https://i.supaimg.com/8182e851-8791-4d76-ab6a-aa86904b6bc4.jpg"
    },
    { 
        id: 3, 
        title: "React.js Crash Course", 
        description: "Build modern web apps with React",
        url: "https://privatecourses.netlify.app/learn.html?id=crs3&token=tk_8e4d5jkxm_mdyb0uus",
        image: "https://i.supaimg.com/8bc76852-1787-4b02-9f4c-b6f93bdb4021.jpg"
    },
    { 
        id: 4, 
        title: "Node.js Backend Development", 
        description: "Create server-side applications",
        url: "https://privatecourses.netlify.app/learn.html?id=crs4&token=tk_jj0d60ydc_mdyb2bur",
        image: "https://i.supaimg.com/eec5944f-84b9-454d-93df-6f9196c58240.png"
    },
    { 
        id: 5, 
        title: "Python for Beginners", 
        description: "Learn Python programming basics",
        url: "https://privatecourses.netlify.app/learn.html?id=crs5&token=tk_hqa4bxuxo_mdz1mopu",
        image: "https://i.supaimg.com/f8b6b81d-1719-453f-ae92-0adc30b2a48d.jpg"
    },
    { 
        id: 6, 
        title: "Data Science Fundamentals", 
        description: "Introduction to data analysis",
        url: "https://example.com/data-science",
        image: "https://i.supaimg.com/3ba81f47-90e1-4a58-a7f6-2f267f8e0633.jpg"
    },
    { 
        id: 7, 
        title: "SEO mastery course", 
        description: "Boost your website's ranking on Google. Learn the secrets of Search Engine Optimization!",
        url: "https://privatecourses.netlify.app/learn.html?id=crs6&token=tk_p1h1bz0in_me0gqix3",
        image: "https://i.supaimg.com/a9f3afed-035c-4f8c-aeba-9b64cc1ff4a6.jpg"
    },
    {
        id: 8,
        title: "Master 3D Animation",
        description: "Bring your imagination to life, frame by frame. Jump into the world of 3D animation where your ideas turn into moving art! Whether you dream of making epic game characters, cinematic scenes, or animated short films — this course will teach you how to animate like a pro, even if you're starting from scratch.",
        url: "https://privatecourses.netlify.app/learn.html?id=crs7&token=tk_cukkxpowu_me1g1e9n",
        image: "https://i.supaimg.com/c421cee3-35c3-4626-9a18-ec8785c1ef10.jpg"
    },
    {
        id: 9,
        title: "Ai Mastery Course",
        description: "The world is being automated. Don’t get left behind.This isn’t just a course — it’s your shortcut to becoming an AI-powered creator, innovator, and money-maker. You’ll go from zero to savage as you master the tools, tricks, and mindset needed to turn AI into your personal assistant, business partner, and creative engine.From ChatGPT to Midjourney, from building smart bots to automating your hustle — this course gives you the real-world AI skills the schools forgot to teach.If you’ve got a brain and a device, you’re ready.",
        url: "https://privatecourses.netlify.app/learn.html?id=crs8&token=tk_amrxxvi19_me1xjs5y",
        image: "https://i.supaimg.com/c0eb774d-fd4f-4057-a802-aabbaa4eda90.jpg"
    },
    {
        id: 10,
        title: "A to Z Cracking Course",
        description: "💻 Cracking Course Full A To Z For Beginner's 💻. Access your course materials below. Happy learning! 🚀",
        url: "https://privatecourses.netlify.app/learn.html?id=crs9&token=tk_oizclwt4u_me4hid2v",
        image: "https://i.supaimg.com/5bd10eca-3ae4-4a70-b581-7d1fc820fe16.jpg"
    },
    {
        id: 11,
        title: "Object Oriented Programming in C++",
        description: "Object Oriented Programming in C++  &  Interview Preparation. 🧑‍🏫 Lectures: 2 📚 Category: Development 📖 Keywords: #Programming #Languages. Classroom like learning, Detailed Explanation of Question, Top Frequently Asked QuestionsConcepts of C++ programming are made very simple and easy.Curriculum:IntroductionWhy Object Oriented ProgrammingExample of OOPMember Function and Member VariableAccess SpecifiersCharacteristics  Of OOP Top Frequently Asked Interview Question - Part 1Top Frequently Asked Interview Question - Part 2Top Frequently Asked Interview Question - Part 3Topics Covered in QuestionsC++ Object Oriented Programming Q... 🆓 ENROLL NOW: LIMITED ENROLLMENTS ONLY!",
        url: "https://privatecourses.netlify.app/learn.html?id=crs10&token=tk_r0h3ofydu_me4taaed",
        image: "https://i.supaimg.com/e48bdbf9-a563-43a4-9678-b978dbc2bc45.jpg"
    },
    {
        id: 12,
        title: "Kali Linux Mastery",
        description: "Mastering Kali Linux for Ethical Hackers. Welcome to the exciting journey of Mastering Kali Linux for Ethical Hackers! In this immersive course, participants will unlock the full potential of Kali Linux—a powerhouse in the world of ethical hacking. Discover the art and science of ethical hacking as you progress through our meticulously designed curriculum. Begin by gaining a comprehensive understanding of the course objectives, setting the stage for the skills and knowledge you're about to acquire. Dive into the basics with",
        url: "https://privatecourses.netlify.app/learn.html?id=crs11&token=tk_c94qwhuwu_me9zxtb6",
        image: "https://i.supaimg.com/89439f66-7f7d-44ab-a506-a39690a75492.jpg"
    },
    {
        id: 13,
        title: "Ethical Hacking",
        description: "Learning Ethical hacking to hack, defend.",
        url: "https://privatecourses.netlify.app/learn.html?id=crs12&token=tk_kmvecrfx1_megrhkqv",
        image: "https://i.supaimg.com/e295b9ac-2535-4cb5-9cec-c04f878f77e1.jpg"
    },
    {
        id: 14,
        title: "Hack Android With TheFatRat",
        description: "Learn To Hack Android Phones With TheFatRat Virus. ⚠️ Note- For Educational And Ethical Purposes Only",
        url: "https://privatecourses.netlify.app/learn.html?id=crs13&token=tk_u3mx52x5r_memq7z4x",
        image: "https://i.supaimg.com/8c2fa12e-ab29-4654-b958-8e55cd9dfa9d.jpg"
    },
    {
        id: 25,
        title: "Mod Games With Lucky Patcher And Mt Manager",
        description: "In A Simple And Easy Way, Learn How To Mod Games Using Lucky Patcher And Mt Manager.",
        url: "https://privatecourses.netlify.app/learn.html?id=crs14&token=tk_fw1tfxp01_meph3vri",
        image: "https://i.supaimg.com/6620895c-c2b0-4a15-8228-115ad3b79660.jpg"
    }
    
]
    
    // Bonus Codes
    const bonusCodes = {
        '12AB61': 100,
        'WE49OP': 500,
        '73AS63': 1000,
        'PO48G5': 5000,
        'AZ31SG': 15000
    };
    
    // Chat messages (simulated)
    const chatMessages = [
        { username: "Admin", message: "Welcome to Legend Tech community chat!", time: "10:00 AM" },
        { username: "User123", message: "Hello everyone! How's the learning going?", time: "10:05 AM" },
        { username: "TechGuru", message: "Just completed the React course. It was amazing!", time: "10:15 AM" }
    ];
    
    // User data
    let currentUser = null;
    let currentStreak = 0;
    
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
    const userAvatar = document.getElementById('user-avatar');
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
            
            // Create user document in Firestore
            await db.collection('users').doc(user.uid).set({
                username,
                email,
                country,
                lp: 100, // Starting LP
                streak: 0,
                lastClaimDate: null,
                unlockedCourses: [],
                usedBonusCodes: []
            });
            
            // Set current user
            currentUser = {
                uid: user.uid,
                username,
                email,
                country,
                lp: 100,
                streak: 0,
                lastClaimDate: null,
                unlockedCourses: [],
                usedBonusCodes: []
            };
            
            initializeApp();
            
            // Hide auth, show app
            document.getElementById('auth-container').style.display = 'none';
            appContainer.style.display = 'grid';
            
            showSuccess('Registration successful! Welcome to Legend Tech Education.');
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
            // Sign in with Firebase Authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Get user data from Firestore
            const doc = await db.collection('users').doc(user.uid).get();
            
            if (doc.exists) {
                currentUser = {
                    uid: user.uid,
                    ...doc.data()
                };
                
                initializeApp();
                
                // Hide auth, show app
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
    function initializeApp() {
        // Update user info
        userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
        updateLpDisplay();
        
        // Initialize streak
        initializeStreak();
        
        // Initialize LP packages based on country
        initializeLpPackages();
        
        // Initialize courses
        initializeCourses();
        
        // Initialize chat
        initializeChat();
        
        // Set up page navigation
        setupNavigation();
    }
    
    function updateLpDisplay() {
        const lp = currentUser.lp || 0;
        lpBalanceDisplay.textContent = `${lp} LP`;
        userLpDisplay.textContent = `${lp} LP`;
        userLpModal.textContent = lp;
    }
    
    function initializeStreak() {
        streakContainer.innerHTML = '';
        
        const today = new Date().toDateString();
        const lastClaim = currentUser.lastClaimDate ? new Date(currentUser.lastClaimDate).toDateString() : null;
        
        if (lastClaim === today) {
            claimBtn.disabled = true;
            claimBtn.textContent = 'Already Claimed Today';
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
            showSuccess(`Congratulations! You completed a 7-day streak and earned 40 LP total!`);
        } else {
            showSuccess(`You claimed 10 LP! Come back tomorrow for more.`);
        }
        
        currentUser.lp = (currentUser.lp || 0) + lpEarned;
        currentUser.lastClaimDate = today.toISOString();
        
        await updateUserData();
        updateLpDisplay();
        initializeStreak();
    });
    
    // Redeem Promo Code
    redeemBtn.addEventListener('click', async () => {
        const code = promoCodeInput.value.trim();
        
        if (code.toUpperCase() === '') {
            currentUser.lp = (currentUser.lp || 0) + 1000;
            await updateUserData();
            updateLpDisplay();
            promoCodeInput.value = '';
            showSuccess('Promo code redeemed! You received 1000 LP.');
        } else {
            showSuccess('Invalid promo code. Please try again.', false);
        }
    });
          
    // Redeem Bonus Code
    bonusRedeemBtn.addEventListener('click', async () => {
        const code = bonusCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            bonusResult.textContent = 'Please enter a bonus code';
            bonusResult.style.color = 'var(--danger)';
            return;
        }
        
        // Check if code is valid
        if (bonusCodes[code]) {
            // Check if user already used this code
            if (currentUser.usedBonusCodes && currentUser.usedBonusCodes.includes(code)) {
                bonusResult.textContent = 'You have already used this bonus code';
                bonusResult.style.color = 'var(--danger)';
                return;
            }
            
            // Add LP to user
            const lpToAdd = bonusCodes[code];
            currentUser.lp = (currentUser.lp || 0) + lpToAdd;
            
            // Initialize usedBonusCodes array if it doesn't exist
            if (!currentUser.usedBonusCodes) {
                currentUser.usedBonusCodes = [];
            }
            
            currentUser.usedBonusCodes.push(code);
            
            // Update UI and storage
            await updateUserData();
            updateLpDisplay();
            bonusCodeInput.value = '';
            
            bonusResult.textContent = `Success! You received ${lpToAdd} LP`;
            bonusResult.style.color = 'var(--success)';
            
            showSuccess(`Bonus code redeemed! You received ${lpToAdd} LP.`);
        } else {
            bonusResult.textContent = 'Invalid bonus code';
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
                    'https://www.paypal.com/ncp/payment/LINK2',
                    'https://www.paypal.com/ncp/payment/LINK3',
                    'https://www.paypal.com/ncp/payment/LINK4',
                    'https://www.paypal.com/ncp/payment/LINK5',
                    'https://www.paypal.com/ncp/payment/LINK6'
                ];
                
                const paypalUrl = paypalLinks[index] || paypalLinks[0];
                window.open(paypalUrl, '_blank');
            });
        });
    }
    
    function initializeCourses() {
        coursesContainer.innerHTML = '';
        
        courses.forEach(course => {
            const isUnlocked = currentUser.unlockedCourses && currentUser.unlockedCourses.includes(course.id);
            const courseElement = document.createElement('div');
            courseElement.className = `course-card ${isUnlocked ? '' : 'locked'}`;
            
            if (isUnlocked) {
                courseElement.innerHTML = `
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-card">
                        <img src="${course.image}" alt="${course.title}" />
                    <div class="course-meta">
                        <div class="course-price">Unlocked</div>
                        <a href="${course.url}" target="_blank" class="btn">Start Learning</a>
                    </div>
                `;
            } else {
                courseElement.innerHTML = `
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-card">
                        <img src="${course.image}" alt="${course.title}" />
                        <h3>${course.title}</h3>
            <a href="https://youtube.com/@legendtechlord?si=Lh6P6QsjA48T9Jb_" target="_blank">𝑽𝒊𝒔𝒊𝒕 𝑪𝒉𝒂𝒏𝒏𝒆𝒍</a>
          </div>
                    <div class="course-meta">
                        <div class="course-price">50 LP</div>
                        <button class="btn" data-course-id="${course.id}">Unlock</button>
                    </div>
                `;
                
                const courseBtn = courseElement.querySelector('.btn');
                courseBtn.addEventListener('click', () => {
                    openCourseModal(course);
                });
            }
            
            coursesContainer.appendChild(courseElement);
        });
    }
    
    function openCourseModal(course) {
        courseCostDisplay.textContent = '50';
        userLpModal.textContent = currentUser.lp || 0;
        
        if ((currentUser.lp || 0) >= 50) {
            purchaseError.style.display = 'none';
            confirmPurchase.disabled = false;
        } else {
            purchaseError.style.display = 'block';
            confirmPurchase.disabled = true;
        }
        
        confirmPurchase.dataset.courseId = course.id;
        courseModal.classList.add('active');
    }
    
    function closeModals() {
        courseModal.classList.remove('active');
        successModal.classList.remove('active');
    }
    
    closeCourseModal.addEventListener('click', closeModals);
    cancelPurchase.addEventListener('click', closeModals);
    closeSuccessModal.addEventListener('click', closeModals);
    closeSuccessBtn.addEventListener('click', closeModals);
    
    // Confirm purchase handler
    confirmPurchase.addEventListener('click', async function() {
        const courseId = parseInt(this.dataset.courseId);
        const course = courses.find(c => c.id === courseId);
        
        if ((currentUser.lp || 0) >= 50) {
            currentUser.lp -= 50;
            
            // Initialize unlockedCourses array if it doesn't exist
            if (!currentUser.unlockedCourses) {
                currentUser.unlockedCourses = [];
            }
            
            // Add course to unlocked courses if not already there
            if (!currentUser.unlockedCourses.includes(courseId)) {
                currentUser.unlockedCourses.push(courseId);
            }
            
            await updateUserData();
            updateLpDisplay();
            closeModals();
            showSuccess(`Course unlocked: ${course.title}`);
            initializeCourses(); // Refresh the courses display
        } else {
            purchaseError.style.display = 'block';
        }
    });
    
    function showSuccess(message, isSuccess = true) {
        successMessage.textContent = message;
        successMessage.style.color = isSuccess ? 'var(--success)' : 'var(--danger)';
        successModal.classList.add('active');
    }
    
    async function initializeChat() {
        chatMessagesContainer.innerHTML = '';
        
        // Add initial chat messages
        chatMessages.forEach(msg => {
            addChatMessage(msg.username, msg.message, msg.time);
        });
        
        // Load user chat messages from Firestore
        const chatRef = db.collection('chats').doc(currentUser.uid);
        const doc = await chatRef.get();
        
        if (doc.exists) {
            const userChat = doc.data().messages || [];
            userChat.forEach(msg => {
                addChatMessage(msg.username, msg.message, msg.time);
            });
        }
    }
    
    function addChatMessage(username, message, time = null) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${username === currentUser.username ? 'user' : ''}`;
        
        if (!time) {
            const now = new Date();
            time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${username.charAt(0).toUpperCase()}</div>
                <div class="message-username">${username}</div>
                <div class="message-time">${time}</div>
            </div>
            <div class="message-content">${message}</div>
        `;
        
        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addChatMessage(currentUser.username, message);
            
            const chatRef = db.collection('chats').doc(currentUser.uid);
            const now = new Date();
            const newMessage = {
                username: currentUser.username,
                message,
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            // Update Firestore with the new message
            await chatRef.set({
                messages: firebase.firestore.FieldValue.arrayUnion(newMessage)
            }, { merge: true });
            
            chatInput.value = '';
        }
    }
    
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
    
    function setupNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                const pageId = `${item.dataset.page}-page`;
                pages.forEach(page => page.classList.remove('active'));
                document.getElementById(pageId).classList.add('active');
                
                // Refresh content if needed
                if (item.dataset.page === 'learn') {
                    initializeCourses();
                }
            });
        });
    }
    
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
                usedBonusCodes: currentUser.usedBonusCodes
            });
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === courseModal) {
            closeModals();
        }
        if (e.target === successModal) {
            closeModals();
        }
    });
});
