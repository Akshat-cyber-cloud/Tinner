document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and interactions
    initNavigation();
    initHeroAnimations();
    initCardInteractions();
    initScrollAnimations();
    initParticleSystem();
    init3DEffects();
    initButtonInteractions();
    checkDemoMode();
    checkAuthStatus();
});

// Check if user is in demo mode and show indicator
function checkDemoMode() {
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    const userToken = localStorage.getItem('userToken');
    
    if (isDemoMode && userToken) {
        showDemoModeIndicator();
    }
}

// Show demo mode indicator
function showDemoModeIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'demo-mode-indicator';
    indicator.innerHTML = `
        <div class="demo-indicator">
            <i class="fas fa-info-circle"></i>
            <span>Demo Mode - Backend not running</span>
            <button onclick="clearDemoMode()" class="demo-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #demo-mode-indicator {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 1001;
            animation: slideInRight 0.5s ease-out;
        }
        
        .demo-indicator {
            background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
            color: white;
            padding: 12px 16px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
            backdrop-filter: blur(10px);
        }
        
        .demo-indicator i {
            font-size: 1rem;
        }
        
        .demo-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .demo-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(indicator);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (indicator) {
            indicator.style.animation = 'slideInRight 0.5s ease-out reverse';
            setTimeout(() => indicator.remove(), 500);
        }
    }, 10000);
}

// Clear demo mode
function clearDemoMode() {
    localStorage.removeItem('demoMode');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    const indicator = document.getElementById('demo-mode-indicator');
    if (indicator) {
        indicator.remove();
    }
    
    // Reload page to reset state
    window.location.reload();
}

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const navbar = document.querySelector('.navbar');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active navigation link on scroll
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Navbar background change on scroll
    function updateNavbar() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 107, 157, 0.2)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 107, 157, 0.15)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    }
    
    window.addEventListener('scroll', () => {
        updateActiveNav();
        updateNavbar();
    });
}

// Hero section animations
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroStats = document.querySelector('.hero-stats');
    
    // Staggered animation for title lines
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.animation = 'titleReveal 1s ease-out forwards';
        }, index * 200);
    });
    
    // Animate other elements
    setTimeout(() => {
        heroSubtitle.style.animation = 'fadeInUp 1s ease-out forwards';
    }, 800);
    
    setTimeout(() => {
        heroButtons.style.animation = 'fadeInUp 1s ease-out forwards';
    }, 1000);
    
    setTimeout(() => {
        heroStats.style.animation = 'fadeInUp 1s ease-out forwards';
    }, 1200);
}

// Card interactions and 3D effects
function initCardInteractions() {
    const cards = document.querySelectorAll('.profile-card');
    const actionButtons = document.querySelectorAll('.action-btn');
    
    // Card hover effects
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Action button interactions
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }, 100);
            
            // Simulate card swipe
            const activeCard = document.querySelector('.card-1');
            if (activeCard) {
                const buttonType = this.classList.contains('dislike') ? 'left' : 
                                 this.classList.contains('like') ? 'right' : 'up';
                swipeCard(activeCard, buttonType);
            }
        });
    });
    
    // Card dragging functionality
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    
    cards.forEach(card => {
        card.addEventListener('mousedown', startDrag);
        card.addEventListener('touchstart', startDrag);
        
        function startDrag(e) {
            if (card.classList.contains('card-1')) {
                isDragging = true;
                startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                card.style.transition = 'none';
                document.addEventListener('mousemove', onDrag);
                document.addEventListener('mouseup', endDrag);
                document.addEventListener('touchmove', onDrag);
                document.addEventListener('touchend', endDrag);
            }
        }
        
        function onDrag(e) {
            if (!isDragging) return;
            currentX = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - startX;
            const rotation = currentX * 0.1;
            card.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
        }
        
        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            card.style.transition = 'transform 0.3s ease';
            
            if (currentX > 100) {
                swipeCard(card, 'right');
            } else if (currentX < -100) {
                swipeCard(card, 'left');
            } else {
                card.style.transform = '';
            }
            
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('touchend', endDrag);
        }
    });
}

// Card swipe animation
function swipeCard(card, direction) {
    const cardStack = document.querySelector('.card-stack');
    
    // Animate card out
    if (direction === 'right') {
        card.style.transform = 'translateX(100vw) rotate(30deg)';
    } else if (direction === 'left') {
        card.style.transform = 'translateX(-100vw) rotate(-30deg)';
    } else if (direction === 'up') {
        card.style.transform = 'translateY(-100vh) rotate(-10deg)';
    }
    
    card.style.opacity = '0';
    
    // Remove card and promote others
    setTimeout(() => {
        card.remove();
        promoteCards();
    }, 300);
    
    // Add new card at the back
    setTimeout(() => {
        addNewCard();
    }, 500);
}

// Promote cards in stack
function promoteCards() {
    const cards = document.querySelectorAll('.profile-card');
    cards.forEach((card, index) => {
        if (index === cards.length - 1) {
            card.classList.remove('card-2', 'card-3');
            card.classList.add('card-1');
            card.style.transform = 'translateY(0) scale(1)';
            card.style.opacity = '1';
            card.style.zIndex = '3';
        } else if (index === cards.length - 2) {
            card.classList.remove('card-3');
            card.classList.add('card-2');
            card.style.transform = 'translateY(10px) scale(0.95)';
            card.style.opacity = '0.8';
            card.style.zIndex = '2';
        } else if (index === cards.length - 3) {
            card.classList.add('card-3');
            card.style.transform = 'translateY(20px) scale(0.9)';
            card.style.opacity = '0.7';
            card.style.zIndex = '1';
        }
    });
}

// Add new card to stack
function addNewCard() {
    const cardStack = document.querySelector('.card-stack');
    const newCard = document.createElement('div');
    newCard.className = 'profile-card card-3';
    
    const profiles = [
        { name: 'Alex, 26', major: 'Computer Science', interests: ['Gaming', 'Coffee'] },
        { name: 'Sarah, 20', major: 'Psychology', interests: ['Art', 'Yoga'] },
        { name: 'Mike, 22', major: 'Business', interests: ['Music', 'Travel'] },
        { name: 'Emma, 21', major: 'Engineering', interests: ['Photography', 'Hiking'] },
        { name: 'David, 23', major: 'Medicine', interests: ['Sports', 'Reading'] },
        { name: 'Lisa, 19', major: 'Design', interests: ['Fashion', 'Dancing'] }
    ];
    
    const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
    
    newCard.innerHTML = `
        <div class="card-bg"></div>
        <div class="card-content">
            <div class="profile-info">
                <h3>${randomProfile.name}</h3>
                <p>${randomProfile.major}</p>
                <div class="interests">
                    ${randomProfile.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    cardStack.appendChild(newCard);
    
    // Add drag functionality to new card
    addDragFunctionality(newCard);
}

// Add drag functionality to new card
function addDragFunctionality(card) {
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
        if (card.classList.contains('card-1')) {
            isDragging = true;
            startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            card.style.transition = 'none';
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchmove', onDrag);
            document.addEventListener('touchend', endDrag);
        }
    }
    
    function onDrag(e) {
        if (!isDragging) return;
        currentX = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - startX;
        const rotation = currentX * 0.1;
        card.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
    }
    
    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        card.style.transition = 'transform 0.3s ease';
        
        if (currentX > 100) {
            swipeCard(card, 'right');
        } else if (currentX < -100) {
            swipeCard(card, 'left');
        } else {
            card.style.transform = '';
        }
        
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', endDrag);
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation for feature cards
                if (entry.target.classList.contains('feature-card')) {
                    const cards = document.querySelectorAll('.feature-card');
                    cards.forEach((card, index) => {
                        if (card === entry.target) {
                            setTimeout(() => {
                                card.style.animation = 'fadeInUp 0.6s ease-out forwards';
                            }, index * 100);
                        }
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Particle system
function initParticleSystem() {
    const particleContainer = document.querySelector('.bg-3d-container');
    
    function createParticle() {
        const particle = document.createElement('div');
        const types = ['💖', '💕', '💗', '⭐', '✨', '🌟'];
        particle.textContent = types[Math.floor(Math.random() * types.length)];
        
        particle.style.position = 'absolute';
        particle.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '100vh';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        
        const animationDuration = Math.random() * 20 + 15;
        particle.style.animation = `float3D ${animationDuration}s linear infinite`;
        
        particleContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, animationDuration * 1000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 2000);
}

// 3D Effects
function init3DEffects() {
    const phoneMockup = document.querySelector('.phone-mockup');
    const phoneMockup2 = document.querySelector('.phone-mockup-2');
    
    // Mouse move 3D effect for phone mockups
    function add3DEffect(element) {
        element.addEventListener('mousemove', function(e) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        element.addEventListener('mouseleave', function() {
            element.style.transform = 'perspective(1000px) rotateY(-15deg) rotateX(5deg)';
        });
    }
    
    if (phoneMockup) add3DEffect(phoneMockup);
    if (phoneMockup2) add3DEffect(phoneMockup2);
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (heroSection && heroVisual) {
            const rate = scrolled * -0.5;
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Button interactions
function initButtonInteractions() {
    const getStartedBtn = document.getElementById('get-started');
    const watchDemoBtn = document.getElementById('watch-demo');
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            // Add ripple effect
            createRipple(this, e);
            
            // Prevent default and navigate manually to ensure it works
            e.preventDefault();
            window.location.href = 'signup.html';
        });
    }
    
    if (watchDemoBtn) {
        watchDemoBtn.addEventListener('click', function() {
            // Add ripple effect
            createRipple(this, event);
            
            // Show demo modal or scroll to swipe section
            setTimeout(() => {
                document.getElementById('swipe').scrollIntoView({
                    behavior: 'smooth'
                });
            }, 300);
        });
    }
    
    // Add ripple effect to all buttons
    const buttons = document.querySelectorAll('.btn, .action-btn, .download-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRipple(this, e);
        });
    });
}

// Ripple effect function
function createRipple(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple CSS
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Auto-swipe cards for demo effect
function startAutoSwipe() {
    setInterval(() => {
        const activeCard = document.querySelector('.card-1');
        if (activeCard && Math.random() > 0.7) {
            const directions = ['left', 'right', 'up'];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            swipeCard(activeCard, randomDirection);
        }
    }, 5000);
}

// Start auto-swipe after 10 seconds
setTimeout(startAutoSwipe, 10000);

// Add loading animation
// Check authentication status and update navigation
function checkAuthStatus() {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    const authLink = document.getElementById('auth-link');
    
    console.log('Auth check - Token:', token ? 'exists' : 'missing');
    console.log('Auth check - UserData:', userData ? 'exists' : 'missing');
    
    if (token && userData) {
        const user = JSON.parse(userData);
        console.log('User logged in:', user.firstName);
        
        // Auto-redirect to matches page if user is logged in
        console.log('User is logged in, redirecting to matches page...');
        window.location.href = 'matches.html';
        return;
    } else {
        console.log('User not logged in, showing Sign In');
        authLink.textContent = 'Sign In';
        authLink.href = 'signin.html';
        
        // Add click handler for sign in
        authLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Sign In clicked, navigating to signin.html');
            window.location.href = 'signin.html';
        });
    }
}

window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});