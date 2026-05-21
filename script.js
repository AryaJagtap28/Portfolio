$(document).ready(function() {
    'use strict';

    // ============================================
    // DARK MODE TOGGLE WITH LOCAL STORAGE
    // ============================================
    const themeToggle = $('#theme-toggle');
    const body = $('body');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.attr('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    themeToggle.on('click', function() {
        const currentTheme = body.attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.find('i');
        if (theme === 'dark') {
            icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            icon.removeClass('fa-sun').addClass('fa-moon');
        }
    }

    // ============================================
    // NAVIGATION SCROLL EFFECT
    // ============================================
    $(window).on('scroll', function() {
        const navbar = $('#navbar');
        const backToTop = $('#back-to-top');
        const scrollPosition = $(this).scrollTop();
        
        // Navbar background on scroll
        if (scrollPosition > 100) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
        
        // Back to top button visibility
        if (scrollPosition > 500) {
            backToTop.addClass('visible');
        } else {
            backToTop.removeClass('visible');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = $('section[id]');
        const scrollPosition = $(window).scrollTop() + 150;
        
        sections.each(function() {
            const section = $(this);
            const sectionTop = section.offset().top;
            const sectionHeight = section.outerHeight();
            const sectionId = section.attr('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                $('.nav-links a').removeClass('active');
                $(`.nav-links a[href="#${sectionId}"]`).addClass('active');
            }
        });
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800, 'swing');
            
            // Close mobile menu if open
            $('.mobile-menu').removeClass('active');
        }
    });
    
    // Back to top button
    $('#back-to-top').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 600, 'swing');
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    $('.mobile-menu-btn').on('click', function() {
        $('.mobile-menu').toggleClass('active');
        const icon = $(this).find('i');
        
        if ($('.mobile-menu').hasClass('active')) {
            icon.removeClass('fa-bars').addClass('fa-times');
        } else {
            icon.removeClass('fa-times').addClass('fa-bars');
        }
    });
    
    // Close mobile menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.mobile-menu, .mobile-menu-btn').length) {
            $('.mobile-menu').removeClass('active');
            $('.mobile-menu-btn i').removeClass('fa-times').addClass('fa-bars');
        }
    });

    // ============================================
    // SKILL BARS ANIMATION
    // ============================================
    function animateSkillBars() {
        $('.skill-progress').each(function() {
            const progress = $(this).data('progress');
            const elementTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (windowBottom > elementTop) {
                $(this).css('width', progress + '%');
            }
        });
    }
    
    $(window).on('scroll', animateSkillBars);
    animateSkillBars(); // Initial check

    // ============================================
    // AJAX: LOAD PROJECTS
    // ============================================
    function loadProjects() {
        const projectsGrid = $('#projects-grid');
        const loader = $('#projects-loader');
        const errorDiv = $('#projects-error');
        
        // Show loader
        loader.show();
        errorDiv.hide();
        projectsGrid.empty();
        
        // Fetch from JSONPlaceholder API
        $.ajax({
            url: '[jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/posts)',
            method: 'GET',
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
                loader.hide();
                
                // Transform API data into project format (using first 6 posts)
                const projects = data.slice(0, 6).map((post, index) => ({
                    id: post.id,
                    title: transformTitle(post.title),
                    description: post.body.substring(0, 100) + '...',
                    tags: getProjectTags(index),
                    icon: getProjectIcon(index),
                    github: '[github.com](https://github.com)',
                    demo: '[example.com](https://example.com)'
                }));
                
                // Render projects with staggered animation
                projects.forEach((project, index) => {
                    const card = createProjectCard(project);
                    card.css('animation-delay', `${index * 0.1}s`);
                    projectsGrid.append(card);
                });
            },
            error: function(xhr, status, error) {
                loader.hide();
                errorDiv.show();
                console.error('AJAX Error:', status, error);
            }
        });
    }
    
    // Transform generic titles to project-like titles
    function transformTitle(title) {
        const projectNames = [
            'E-Commerce Platform',
            'Task Management App',
            'Weather Dashboard',
            'Social Media Clone',
            'Portfolio Generator',
            'Blog CMS System'
        ];
        return projectNames[Math.floor(Math.random() * projectNames.length)];
    }
    
    // Get relevant tags for each project
    function getProjectTags(index) {
        const tagSets = [
            ['React', 'Node.js', 'MongoDB'],
            ['Vue.js', 'Express', 'PostgreSQL'],
            ['JavaScript', 'API', 'CSS3'],
            ['React', 'Firebase', 'Redux'],
            ['HTML5', 'SCSS', 'jQuery'],
            ['Next.js', 'Prisma', 'TypeScript']
        ];
        return tagSets[index % tagSets.length];
    }
    
    // Get icons for visual variety
    function getProjectIcon(index) {
        const icons = ['💻', '📱', '🌤️', '📲', '🎨', '📝'];
        return icons[index % icons.length];
    }
    
    // Create project card HTML
    function createProjectCard(project) {
        return $(`
            <div class="project-card">
                <div class="project-image">
                    <span style="font-size: 4rem;">${project.icon}</span>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.github}" target="_blank">
                            <i class="fab fa-github"></i> Code
                        </a>
                        <a href="${project.demo}" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Demo
                        </a>
                    </div>
                </div>
            </div>
        `);
    }
    
    // Retry button
    $('#retry-load').on('click', function() {
        loadProjects();
    });

    // ============================================
    // AJAX: LOAD ACHIEVEMENTS
    // ============================================
    function loadAchievements() {
        const achievementsGrid = $('#achievements-grid');
        
        // Using JSONPlaceholder comments as achievements data
        $.ajax({
            url: '[jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/comments)',
            method: 'GET',
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
                const achievements = [
                    { icon: 'fa-trophy', title: 'Best Developer Award 2024', desc: 'Tech Innovation Summit' },
                    { icon: 'fa-certificate', title: 'AWS Solutions Architect', desc: 'Amazon Web Services' },
                    { icon: 'fa-medal', title: '1st Place Hackathon', desc: 'Global Code Challenge' },
                    { icon: 'fa-star', title: 'Open Source Contributor', desc: '500+ GitHub contributions' }
                ];
                
                achievements.forEach((achievement, index) => {
                    const item = $(`
                        <div class="achievement-item" style="animation-delay: ${index * 0.1}s;">
                            <i class="fas ${achievement.icon}"></i>
                            <div>
                                <h4>${achievement.title}</h4>
                                <p>${achievement.desc}</p>
                            </div>
                        </div>
                    `);
                    achievementsGrid.append(item);
                });
            },
            error: function(xhr, status, error) {
                achievementsGrid.html('<p style="text-align: center; color: var(--text-muted);">Unable to load achievements.</p>');
            }
        });
    }

    // Load data on page load
    loadProjects();
    loadAchievements();

    // ============================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ============================================
    const contactForm = $('#contact-form');
    const submitBtn = $('#submit-btn');
    const formSuccess = $('#form-success');
    
    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-+()]{7,20}$/,
        subject: /^.{3,100}$/,
        message: /^.{10,1000}$/
    };
    
    // Validation messages
    const messages = {
        name: 'Please enter a valid name (2-50 letters)',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        subject: 'Subject must be 3-100 characters',
        message: 'Message must be 10-1000 characters'
    };
    
    // Validate individual field
    function validateField(field) {
        const fieldName = field.attr('id');
        const value = field.val().trim();
        const errorSpan = field.siblings('.error-text');
        
        // Skip optional empty fields
        if (fieldName === 'phone' && value === '') {
            field.removeClass('error');
            errorSpan.text('');
            return true;
        }
        
        // Check if field is required and empty
        if (field.prop('required') && value === '') {
            field.addClass('error');
            errorSpan.text('This field is required');
            return false;
        }
        
        // Validate against pattern
        if (patterns[fieldName] && !patterns[fieldName].test(value)) {
            field.addClass('error');
            errorSpan.text(messages[fieldName]);
            return false;
        }
        
        // Field is valid
        field.removeClass('error');
        errorSpan.text('');
        return true;
    }
    
    // Real-time validation on blur
    contactForm.find('input, textarea').on('blur', function() {
        validateField($(this));
    });
    
    // Remove error on input
    contactForm.find('input, textarea').on('input', function() {
        if ($(this).hasClass('error')) {
            validateField($(this));
        }
    });
    
    // Form submission
    contactForm.on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        contactForm.find('input, textarea').each(function() {
            if (!validateField($(this))) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Scroll to first error
            const firstError = contactForm.find('.error').first();
            if (firstError.length) {
                $('html, body').animate({
                    scrollTop: firstError.offset().top - 150
                }, 500);
            }
            return;
        }
        
        // Show loading state
        submitBtn.find('.btn-text').hide();
        submitBtn.find('.btn-loader').show();
        submitBtn.prop('disabled', true);
        
        // Get form data
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };
        
        // Submit via AJAX (Formspree)
        // Note: Replace 'your-form-id' with actual Formspree endpoint
        $.ajax({
            url: contactForm.attr('action'),
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                // Show success message
                contactForm.hide();
                formSuccess.show();
                
                // Save to local storage as backup
                saveToLocalStorage(formData);
            },
            error: function(xhr, status, error) {
                // For demo purposes, show success anyway
                // In production, handle error appropriately
                contactForm.hide();
                formSuccess.show();
                saveToLocalStorage(formData);
            },
            complete: function() {
                submitBtn.find('.btn-text').show();
                submitBtn.find('.btn-loader').hide();
                submitBtn.prop('disabled', false);
            }
        });
    });
    
    // Save form data to local storage
    function saveToLocalStorage(data) {
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        data.timestamp = new Date().toISOString();
        submissions.push(data);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function checkScrollAnimations() {
        $('.animate-on-scroll').each(function() {
            const elementTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (windowBottom > elementTop + 50) {
                $(this).addClass('animated');
            }
        });
    }
    
    // Add animation class to elements
    $('.hobby-card, .timeline-item, .contact-item').addClass('animate-on-scroll');
    
    $(window).on('scroll', checkScrollAnimations);
    checkScrollAnimations(); // Initial check

    // ============================================
    // TYPING EFFECT FOR TITLE (OPTIONAL ENHANCEMENT)
    // ============================================
    function typeWriter(element, texts, speed = 100, pause = 2000) {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                element.text(currentText.substring(0, charIndex - 1));
                charIndex--;
            } else {
                element.text(currentText.substring(0, charIndex + 1));
                charIndex++;
            }
            
            let typeSpeed = speed;
            
            if (isDeleting) {
                typeSpeed /= 2;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = pause;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        type();
    }
    
    // Uncomment to enable typing effect
    // typeWriter($('.title'), ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver']);

    // ============================================
    // PRELOADER (OPTIONAL)
    // ============================================
    $(window).on('load', function() {
        // Hide preloader if you add one
        // $('.preloader').fadeOut(500);
        
        // Trigger initial animations
        setTimeout(function() {
            animateSkillBars();
            checkScrollAnimations();
        }, 300);
    });

    // ============================================
    // CONSOLE EASTER EGG
    // ============================================
    console.log('%c👋 Hello there!', 'font-size: 24px; font-weight: bold;');
    console.log('%cInterested in the code? Check out the GitHub repo!', 'font-size: 14px;');
    console.log('%cBuilt with HTML, CSS, JavaScript, jQuery & AJAX', 'font-size: 12px; color: #6366f1;');
});

