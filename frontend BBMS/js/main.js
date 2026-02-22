// main.js - LifeLink Blood Bank Management System

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Mobile Navigation Toggle =====
    const createMobileNav = () => {
        const header = document.querySelector('.header .container');
        const nav = document.querySelector('.nav-menu');
        const authButtons = document.querySelector('.auth-buttons');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle Menu');
        
        // Insert button after logo
        const logo = document.querySelector('.logo');
        if (logo && window.innerWidth <= 768) {
            logo.parentNode.insertBefore(mobileMenuBtn, logo.nextSibling);
        }
        
        // Toggle menu on click
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            authButtons.classList.toggle('active');
            this.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-menu') && 
                !event.target.closest('.auth-buttons') && 
                !event.target.closest('.mobile-menu-btn')) {
                nav.classList.remove('active');
                authButtons.classList.remove('active');
                mobileMenuBtn.innerHTML = '☰';
            }
        });
    };
    
    // ===== Smooth Scrolling for Navigation Links =====
    const setupSmoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    const nav = document.querySelector('.nav-menu');
                    const authButtons = document.querySelector('.auth-buttons');
                    const mobileBtn = document.querySelector('.mobile-menu-btn');
                    
                    if (nav && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        authButtons.classList.remove('active');
                        if (mobileBtn) mobileBtn.innerHTML = '☰';
                    }
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active link
                    updateActiveLink(targetId);
                }
            });
        });
    };
    
    // ===== Update Active Navigation Link =====
    const updateActiveLink = (activeId) => {
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    };
    
    // ===== Highlight Active Section on Scroll =====
    const setupScrollSpy = () => {
        const sections = document.querySelectorAll('section[id], header[id], footer[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100; // Offset for header
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            if (current) {
                updateActiveLink(`#${current}`);
            }
        });
    };
    
    // ===== Counter Animation for Impact Section =====
    const animateCounters = () => {
        const counters = [
            { element: document.querySelector('.impact-card.left h3'), target: 8000, current: 0 },
            { element: document.querySelector('.impact-card.right h3'), target: 3200, current: 0 },
            { element: document.getElementById('hospital-count'), target: 120, current: 0, suffix: '+' }
        ];
        
        // Check if elements exist
        if (!counters[0].element || !counters[1].element || !counters[2].element) return;
        
        let animated = false;
        
        const startCounting = () => {
            if (animated) return;
            
            const impactSection = document.querySelector('.impact');
            const sectionPosition = impactSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (sectionPosition < screenPosition) {
                animated = true;
                
                counters.forEach(counter => {
                    const updateCounter = () => {
                        const increment = Math.ceil(counter.target / 50); // Smooth increment
                        
                        if (counter.current < counter.target) {
                            counter.current += increment;
                            if (counter.current > counter.target) {
                                counter.current = counter.target;
                            }
                            
                            if (counter.suffix) {
                                counter.element.textContent = counter.current + counter.suffix;
                            } else {
                                counter.element.textContent = counter.current + '+';
                            }
                            
                            setTimeout(updateCounter, 20);
                        }
                    };
                    
                    updateCounter();
                });
            }
        };
        
        window.addEventListener('scroll', startCounting);
        window.addEventListener('load', startCounting);
    };
    
    // ===== Form Validation for Contact Form =====
    const setupFormValidation = () => {
        const contactForm = document.querySelector('.contact-form form');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameInput = this.querySelector('input[placeholder="Name"]');
            const emailInput = this.querySelector('input[placeholder="Email"]');
            const phoneInput = this.querySelector('input[placeholder="Phone"]');
            const messageInput = this.querySelector('textarea');
            
            let isValid = true;
            let errorMessage = '';
            
            // Validate Name
            if (!nameInput.value.trim()) {
                isValid = false;
                errorMessage += 'Name is required.\n';
                highlightField(nameInput, false);
            } else {
                highlightField(nameInput, true);
            }
            
            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                isValid = false;
                errorMessage += 'Email is required.\n';
                highlightField(emailInput, false);
            } else if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
                highlightField(emailInput, false);
            } else {
                highlightField(emailInput, true);
            }
            
            // Validate Phone
            const phoneRegex = /^\d{10}$/;
            if (!phoneInput.value.trim()) {
                isValid = false;
                errorMessage += 'Phone number is required.\n';
                highlightField(phoneInput, false);
            } else if (!phoneRegex.test(phoneInput.value.replace(/\D/g, ''))) {
                isValid = false;
                errorMessage += 'Please enter a valid 10-digit phone number.\n';
                highlightField(phoneInput, false);
            } else {
                highlightField(phoneInput, true);
            }
            
            // Validate Message (optional)
            if (messageInput && !messageInput.value.trim()) {
                // Message is optional, just highlight
                highlightField(messageInput, true);
            }
            
            if (isValid) {
                // Show success message
                showNotification('Form submitted successfully! We\'ll contact you soon.', 'success');
                this.reset(); // Reset form
            } else {
                // Show error message
                showNotification(errorMessage || 'Please fill all required fields correctly.', 'error');
            }
        });
    };
    
    // Helper function to highlight fields
    const highlightField = (field, isValid) => {
        if (isValid) {
            field.style.borderColor = '#eef2f6';
            field.style.backgroundColor = '#fff';
        } else {
            field.style.borderColor = '#dc2430';
            field.style.backgroundColor = '#fff8f8';
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                field.style.borderColor = '#eef2f6';
                field.style.backgroundColor = '#fff';
            }, 3000);
        }
    };
    
    // ===== Show Notification =====
    const showNotification = (message, type = 'info') => {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.classList.add('notification-container');
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('notification-close');
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function() {
            notification.remove();
        };
        notification.appendChild(closeBtn);
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    };
    
    // ===== Button Click Handlers =====
    const setupButtonHandlers = () => {
        // Register as Donor
        const donorBtn = document.querySelector('a[href="#register-donor"]');
        if (donorBtn) {
            donorBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Redirecting to Donor Registration Form...', 'info');
                // Redirect to donor registration page after 1 second
                setTimeout(() => {
                    window.location.href = 'donor-register.html';
                }, 1000);
            });
        }
        
        // Hospital Login
        const hospitalBtn = document.querySelector('a[href="#hospital-login"]');
        if (hospitalBtn) {
            hospitalBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Redirecting to Hospital Login Portal...', 'info');
                // Redirect to hospital login page after 1 second
                setTimeout(() => {
                    window.location.href = 'hospital-login.html';
                }, 1000);
            });
        }
        
        // Request Blood
        const requestBtn = document.querySelector('a[href="#request-blood"]');
        if (requestBtn) {
            requestBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Opening Blood Request Form...', 'info');
                // Redirect to blood request page after 1 second
                setTimeout(() => {
                    window.location.href = 'blood-request.html';
                }, 1000);
            });
        }
        
        // Apply Now buttons in Role Cards
        const applyButtons = document.querySelectorAll('.apply');
        applyButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const role = this.closest('.card').querySelector('h3').textContent;
                showNotification(`Opening ${role} Application Form...`, 'info');
                
                // Redirect based on role
                setTimeout(() => {
                    if (role.includes('Donor')) {
                        window.location.href = 'donor-register.html';
                    } else if (role.includes('Patient')) {
                        window.location.href = 'patient-register.html';
                    } else if (role.includes('Hospital')) {
                        window.location.href = 'hospital-register.html';
                    } else {
                        window.location.href = 'signup.html';
                    }
                }, 1000);
            });
        });
        
        // ===== LOGIN BUTTON - UPDATED WITH REDIRECT =====
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();  // Prevent default anchor behavior
                showNotification('Redirecting to Login Page...', 'info');
                
                // Redirect to login.html after 1 second
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            });
        }
        
        // ===== SIGNUP BUTTON - UPDATED WITH REDIRECT =====
        const signupBtn = document.querySelector('.btn-signup');
        if (signupBtn) {
            signupBtn.addEventListener('click', function(e) {
                e.preventDefault();  // Prevent default anchor behavior
                showNotification('Redirecting to Sign Up Page...', 'info');
                
                // Redirect to signup.html after 1 second
                setTimeout(() => {
                    window.location.href = 'signup.html';
                }, 1000);
            });
        }
    };
    
    // ===== ALTERNATIVE: Direct Redirect Without Notification =====
    // Agar aapko direct redirect chahiye bina notification ke, to ye use karo:
    /*
    const setupDirectRedirect = () => {
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                window.location.href = 'login.html';  // Direct redirect
            });
        }
        
        const signupBtn = document.querySelector('.btn-signup');
        if (signupBtn) {
            signupBtn.addEventListener('click', function(e) {
                window.location.href = 'signup.html';  // Direct redirect
            });
        }
    };
    */
    
    // ===== Parallax Effect for Blood Cells =====
    const setupParallax = () => {
        const cells = document.querySelectorAll('.blood-cell');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            
            cells.forEach((cell, index) => {
                // Different speed for each cell
                const speed = 0.1 + (index * 0.05);
                const yOffset = scrollPosition * speed;
                
                if (index % 2 === 0) {
                    cell.style.transform = `translateY(${yOffset}px) rotate(${yOffset * 0.1}deg)`;
                } else {
                    cell.style.transform = `translateY(-${yOffset * 0.5}px) rotate(-${yOffset * 0.1}deg)`;
                }
            });
        });
    };
    
    // ===== Lazy Load Images =====
    const setupLazyLoading = () => {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    };
    
    // ===== Add CSS for notifications and mobile menu =====
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* Notification Container */
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            /* Notification Styles */
            .notification {
                min-width: 300px;
                padding: 15px 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                font-size: 14px;
                position: relative;
                animation: slideIn 0.3s ease;
                border-left: 4px solid;
            }
            
            .notification-success {
                border-left-color: #10b981;
                background: #f0fdf4;
                color: #065f46;
            }
            
            .notification-error {
                border-left-color: #dc2430;
                background: #fef2f2;
                color: #991b1b;
            }
            
            .notification-info {
                border-left-color: #3b82f6;
                background: #eff6ff;
                color: #1e3a8a;
            }
            
            .notification-close {
                position: absolute;
                top: 5px;
                right: 10px;
                cursor: pointer;
                font-size: 20px;
                opacity: 0.5;
                transition: opacity 0.3s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            /* Mobile Menu Button */
            .mobile-menu-btn {
                display: none;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #333;
                z-index: 1000;
            }
            
            @media (max-width: 768px) {
                .mobile-menu-btn {
                    display: block;
                }
                
                .nav-menu {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 70%;
                    height: 100vh;
                    background: white;
                    padding: 80px 20px 20px;
                    transition: right 0.3s ease;
                    z-index: 999;
                    box-shadow: -5px 0 20px rgba(0,0,0,0.1);
                }
                
                .nav-menu.active {
                    right: 0;
                }
                
                .nav-menu ul {
                    flex-direction: column;
                    gap: 20px;
                }
                
                .auth-buttons {
                    position: fixed;
                    bottom: 20px;
                    right: -100%;
                    width: 70%;
                    padding: 20px;
                    background: white;
                    transition: right 0.3s ease;
                    z-index: 999;
                    justify-content: center;
                }
                
                .auth-buttons.active {
                    right: 0;
                }
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            /* Loading Animation for Images */
            img[data-src] {
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            img[data-src].loaded {
                opacity: 1;
            }
            
            /* Smooth Scroll Behavior */
            html {
                scroll-behavior: smooth;
            }
        `;
        
        document.head.appendChild(style);
    };
    
    // ===== Initialize all functions =====
    const init = () => {
        addStyles();
        createMobileNav();
        setupSmoothScroll();
        setupScrollSpy();
        animateCounters();
        setupFormValidation();
        setupButtonHandlers();  // Updated with login/signup redirect
        setupParallax();
        setupLazyLoading();
        
        // Add resize listener
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                const nav = document.querySelector('.nav-menu');
                const authButtons = document.querySelector('.auth-buttons');
                const mobileBtn = document.querySelector('.mobile-menu-btn');
                
                if (nav) nav.classList.remove('active');
                if (authButtons) authButtons.classList.remove('active');
                if (mobileBtn) mobileBtn.innerHTML = '☰';
            }
        });
    };
    
    // Start everything
    init();
    
});

// ===== Additional Helper Functions =====

// Format phone number as user types
document.addEventListener('input', function(e) {
    if (e.target.matches('input[placeholder="Phone"]')) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        
        // Format as XXX-XXX-XXXX
        if (value.length > 6) {
            value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
        } else if (value.length > 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        
        e.target.value = value;
    }
});

// Add year to copyright automatically
document.addEventListener('DOMContentLoaded', function() {
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        const year = new Date().getFullYear();
        copyright.textContent = copyright.textContent.replace('2025', year);
    }
});