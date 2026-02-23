/* ============================================
   SAIPOOJA WAREHOUSE - ADVANCED SAAS JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize AOS Animation Library
    initAOS();
    
    // Header Scroll Effect
    initHeaderScroll();
    
    // Mobile Navigation Toggle
    initMobileNav();
    
    // Typing Effect
    initTypingEffect();
    
    // Partner Logo Slider
    initLogoSlider();
    
    // AI Chat Popup
    initAIChat();
    
    // Form Validation
    initFormValidation();
    
    // Smooth Scroll
    initSmoothScroll();
    
    // Navbar Active Link
    initActiveNavLink();
});

// ============================================
// AOS Animation Initialization
// ============================================
function initAOS() {
    // Check if AOS is loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// ============================================
// Header Scroll Effect
// ============================================
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
}

// ============================================
// Mobile Navigation Toggle
// ============================================
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.querySelector('.main-nav');
    
    if (!hamburger || !mainNav) return;

    hamburger.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        hamburger.classList.toggle('is-active');
        
        // Prevent body scroll when menu is open
        if (mainNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
            mainNav.classList.remove('active');
            hamburger.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            mainNav.classList.remove('active');
            hamburger.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// Typing Effect (Typed.js)
// ============================================
function initTypingEffect() {
    const typedElement = document.getElementById('typing-effect');
    if (!typedElement || typeof Typed === 'undefined') return;

    const strings = [
        'Welcome to Saipooja',
        'Your Trusted Partner in Warehouse & Logistics',
        'Advanced Cold Storage Solutions',
        'Pan-India Warehouse Network',
        'AI-Powered Inventory Management',
        'Secure & Reliable Storage'
    ];

    new Typed('#typing-effect', {
        strings: strings,
        typeSpeed: 60,
        backSpeed: 40,
        loop: true,
        showCursor: true,
        cursorChar: '|',
        smartBackspace: true,
        fadeOut: true,
        fadeOutDelay: 1000
    });
}

// ============================================
// Partner Logo Slider (Swiper.js)
// ============================================
function initLogoSlider() {
    const slider = document.querySelector('.logo-slider');
    if (!slider || typeof Swiper === 'undefined') return;

    new Swiper('.logo-slider', {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 40,
        speed: 5000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            480: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 40,
            },
            1024: {
                slidesPerView: 5,
                spaceBetween: 50,
            },
            1200: {
                slidesPerView: 6,
                spaceBetween: 60,
            }
        }
    });
}

// ============================================
// AI Chat Popup
// ============================================
function initAIChat() {
    const askAiButton = document.getElementById('ask-ai');
    if (!askAiButton) return;

    askAiButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Create chat modal
        const modal = createChatModal();
        document.body.appendChild(modal);
        
        // Add close functionality
        const closeBtn = modal.querySelector('.chat-close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Handle message send
        const sendBtn = modal.querySelector('.chat-send');
        const input = modal.querySelector('.chat-input');
        
        const handleSend = () => {
            const message = input.value.trim();
            if (message) {
                addChatMessage(modal, message, 'user');
                input.value = '';
                
                // Simulate AI response
                setTimeout(() => {
                    const responses = [
                        "I'd be happy to help you with warehouse solutions! Could you please provide more details about your storage requirements?",
                        "For cold storage, we offer temperatures ranging from -25°C to +25°C. What type of products do you need to store?",
                        "Our pricing starts at ₹15/sq. ft. per month. Would you like me to connect you with our sales team?",
                        "We have warehouses in Mumbai, Pune, Delhi, Bangalore, Chennai, and more. Which city are you interested in?",
                        "Yes, we provide end-to-end logistics services including transportation, handling, and last-mile delivery."
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addChatMessage(modal, randomResponse, 'ai');
                }, 1000);
            }
        };
        
        sendBtn.addEventListener('click', handleSend);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    });
}

function createChatModal() {
    const modal = document.createElement('div');
    modal.className = 'chat-modal';
    modal.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-info">
                <i class="fas fa-robot"></i>
                <div>
                    <h4>AI Assistant</h4>
                    <span>Online</span>
                </div>
            </div>
            <button class="chat-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="chat-messages">
            <div class="chat-message ai">
                <div class="message-content">
                    <i class="fas fa-robot"></i>
                    <p>Hello! I'm your AI assistant. How can I help you today with our warehouse and logistics services?</p>
                </div>
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" class="chat-input" placeholder="Type your message...">
            <button class="chat-send"><i class="fas fa-paper-plane"></i></button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .chat-modal {
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 380px;
            max-width: calc(100vw - 60px);
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 10000;
            overflow: hidden;
            animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .chat-header {
            background: linear-gradient(135deg, #0a4f9a, #073d73);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .chat-header-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .chat-header-info i {
            font-size: 1.5rem;
        }
        .chat-header-info h4 {
            margin: 0;
            font-size: 1rem;
        }
        .chat-header-info span {
            font-size: 0.75rem;
            color: #10b981;
        }
        .chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            padding: 5px;
        }
        .chat-messages {
            height: 300px;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .chat-message {
            margin-bottom: 15px;
        }
        .chat-message .message-content {
            display: flex;
            gap: 10px;
            max-width: 85%;
        }
        .chat-message.ai .message-content {
            margin-right: auto;
        }
        .chat-message.user .message-content {
            margin-left: auto;
            flex-direction: row-reverse;
        }
        .message-content i {
            width: 32px;
            height: 32px;
            background: #0a4f9a;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.85rem;
            flex-shrink: 0;
        }
        .message-content p {
            background: white;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 0.9rem;
            line-height: 1.5;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            margin: 0;
        }
        .chat-message.user .message-content p {
            background: #0a4f9a;
            color: white;
        }
        .chat-input-area {
            padding: 15px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 10px;
        }
        .chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 25px;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.3s;
        }
        .chat-input:focus {
            border-color: #0a4f9a;
        }
        .chat-send {
            width: 45px;
            height: 45px;
            background: #0a4f9a;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s, transform 0.2s;
        }
        .chat-send:hover {
            background: #073d73;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
    
    return modal;
}

function addChatMessage(modal, text, type) {
    const messagesContainer = modal.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            ${type === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
            <p>${text}</p>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ============================================
// Form Validation
// ============================================
function initFormValidation() {
    const forms = document.querySelectorAll('.service-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm(form)) {
                // Show success message
                showNotification('Quote request submitted successfully! We will contact you soon.', 'success');
                form.reset();
            }
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ef4444';
            
            // Reset border color on input
            input.addEventListener('input', () => {
                input.style.borderColor = '#e2e8f0';
            }, { once: true });
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            isValid = false;
            input.style.borderColor = '#ef4444';
            showNotification('Please enter a valid email address', 'error');
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
            isValid = false;
            input.style.borderColor = '#ef4444';
            showNotification('Please enter a valid phone number', 'error');
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[+]?[\d\s()-]{10,}$/.test(phone);
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 90px;
            right: 30px;
            padding: 15px 25px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .notification i {
            font-size: 1.25rem;
        }
        .notification-success i { color: #10b981; }
        .notification-error i { color: #ef4444; }
        .notification-info i { color: #3b82f6; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('main-header')?.offsetHeight || 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Active Navigation Link
// ============================================
function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// ============================================
// YouTube IFrame Player API
// ============================================
let player;

function onYouTubeIframeAPIReady() {
    const playerElement = document.getElementById('player');
    if (!playerElement) return;

    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'rBKLvdIeAfU',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'loop': 1,
            'mute': 1,
            'playlist': 'rBKLvdIeAfU',
            'playsinline': 1,
            'vq': 'hd1080'
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    const playerElement = document.getElementById('player');
    if (playerElement) {
        playerElement.style.opacity = '0.4';
    }
}

// ============================================
// Staggered Animation on Scroll
// ============================================
function initStaggeredAnimation() {
    const cards = document.querySelectorAll('.facility-card, .service-card, .team-card');
    
    if (!cards.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize staggered animation when DOM is loaded
document.addEventListener('DOMContentLoaded', initStaggeredAnimation);

// ============================================
// WhatsApp Click Tracking
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log('WhatsApp click tracked');
        });
    });
});
