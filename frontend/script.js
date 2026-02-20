<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    if(header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Mobile Navigation Toggle ---
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.querySelector('.main-nav');
    if(hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburger.classList.toggle('is-active'); // For styling the hamburger icon (e.g., to a cross)
        });
    }

    // --- Typing Effect (Typed.js) ---
    if (typeof Typed !== 'undefined' && document.getElementById('typing-effect')) {
        new Typed('#typing-effect', {
            strings: ['Welcome to Saipooja: Your Trusted Partner in Warehouse, Logistics, and Cold Storage Solutions.'],
            typeSpeed: 50,
            backSpeed: 25,
            loop: false,
            showCursor: true,
            cursorChar: '_',
        });
    }

    // --- Partner Logo Slider (Swiper.js) ---
    if (typeof Swiper !== 'undefined' && document.querySelector('.logo-slider')) {
        new Swiper('.logo-slider', {
            loop: true,
            slidesPerView: 'auto',
            spaceBetween: 50,
            speed: 5000,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            breakpoints: {
                320: { slidesPerView: 2, spaceBetween: 40 },
                768: { slidesPerView: 4, spaceBetween: 50 },
                1024: { slidesPerView: 5, spaceBetween: 60 },
            }
        });
    }

    // --- AI Chat Popup ---
    const askAiButton = document.getElementById('ask-ai');
    if (askAiButton) {
        askAiButton.addEventListener('click', (e) => {
            e.preventDefault();
            alert('AI Assistant Feature: Coming Soon!');
        });
    }
});

// --- YouTube IFrame Player API (loads asynchronously) ---
let player;
function onYouTubeIframeAPIReady() {
    if(document.getElementById('player')) {
        player = new YT.Player('player', {
            height: '100%', 
            width: '100%',
            videoId: 'rBKLvdIeAfU', // Placeholder Video ID
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'showinfo': 0,
                'rel': 0,
                'loop': 1,
                'mute': 1,
                'playlist': 'rBKLvdIeAfU' // Required for loop
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    }
}

function onPlayerReady(event) {
    event.target.playVideo();
    if(document.getElementById('player')) {
      document.getElementById('player').style.opacity = 1;
    }
}
=======
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: 'rBKLvdIeAfU',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'mute': 1,
            'loop': 1,
            'playlist': 'rBKLvdIeAfU',
            'vq': 'hd1080'
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.mute();
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
    }
}

// Auto-scrolling advertisement slider
const slider = document.querySelector('.slider-container');
let scrollAmount = 0;

function autoScroll() {
    if (slider.scrollLeft < (slider.scrollWidth - slider.clientWidth)) {
        slider.scrollLeft += 1;
    } else {
        slider.scrollLeft = 0;
    }
}

setInterval(autoScroll, 20);

// Connect to backend on page load
document.addEventListener('DOMContentLoaded', () => {
  const backendUrl = 'https://warehouse-backend-cdka.onrender.com/';
  fetch(backendUrl)
    .then(response => response.text())
    .then(data => {
      console.log('Response from backend:', data);
    })
    .catch(error => {
      console.error('Error connecting to backend:', error);
    });
});
>>>>>>> 0f64b3d6604b52888d25a84ec74eb94ad7f7cff9
