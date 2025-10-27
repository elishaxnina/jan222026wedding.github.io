
// # Create the JavaScript file for smooth scrolling and interactivity
// js_content = '''// ===========================
// SMOOTH SCROLLING
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ===========================
// FADE-IN ANIMATION ON SCROLL
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Hero section should be visible immediately
document.querySelector('.hero').style.opacity = '1';
document.querySelector('.hero').style.transform = 'translateY(0)';

// ===========================
// RSVP FORM HANDLING (if you add a form)
// ===========================
// Example function for future RSVP form
function handleRSVP(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // You can integrate with Google Sheets API or a backend service
    console.log('RSVP submitted:', Object.fromEntries(formData));
    
    // Show confirmation message
    alert('Thank you for your RSVP!');
}



// ===========================
// PARALLAX EFFECT FOR HERO
// ===========================
// window.addEventListener('scroll', () => {
//     const hero = document.querySelector('.hero');
//     const scrolled = window.pageYOffset;
//     if (hero && scrolled < hero.offsetHeight) {
//         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// ===========================
// CAROUSEL
// ===========================
let currentSlide = 0;
const wrapper = document.getElementById('carouselWrapper');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = document.querySelectorAll('.carousel-slide').length;

function moveCarousel(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Auto-advance carousel
// setInterval(() => {
//     moveCarousel(1);
// }, 5000);
setInterval(moveCarousel,5000);
// ===========================
// COUNTDOWN TIMER
// ===========================
// ===========================
// COUNTDOWN TIMER - Mobile Compatible
// ===========================
function updateCountdown() {
    // Set the target date and time
    var weddingDate = new Date('2026-01-22T14:00:00+08:00').getTime();
    var now = new Date().getTime();
    var distance = weddingDate - now;

    if (distance > 0) {
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    } else {
        document.getElementById('countdown').innerHTML =
            '<span>💒</span> <span>We\'re Married!</span>';
    }
}

// document.addEventListener('DOMContentLoaded', function() {
//     updateCountdown();
//     setInterval(updateCountdown, 1000);
// });


// // Ensure DOM is loaded before starting countdown
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', function() {
//         updateCountdown();
//         setInterval(updateCountdown, 1000);
//     });
// } else {
//     updateCountdown();
//     setInterval(updateCountdown, 1000);
// }
setTimeout(updateCountdown,1000);
setInterval(updateCountdown, 1000);

/*
    RSVP
*/
document.getElementById('openRSVP').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('modalOverlay').classList.add('show');
});
// CONFIGURATION
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxYbAWjOEgKdNWGvS2lD_MYTfmd4cFBiEVT5_vzyG62nSSQda73nyKJgMKxbGnrNIWs/exec';
let selectedGuest = null;
// DOM Elements
const searchInput = document.getElementById('searchName');
const searchResults = document.getElementById('searchResults');
const guestDetails = document.getElementById('guestDetails');
const selectedGuestDiv = document.getElementById('selectedGuest');
const contactInput = document.getElementById('contactInput');
const attendanceSelect = document.getElementById('attendance');
const alertMessage = document.getElementById('alertMessage');
const rsvpFormFields = document.getElementById('rsvpFormFields');
const modalOverlay = document.getElementById('modalOverlay');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');

// Show alert message
function showAlert(message, type = 'error') {
    alertMessage.textContent = message;
    alertMessage.className = `alert-message ${type} show`;
    setTimeout(() => {
        alertMessage.classList.remove('show');
    }, 5000);
}

// Show modal
function showModal(icon, title, message) {
    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMessage.innerHTML = message;
    modalOverlay.classList.add('show');
}

// Close modal
function closeModal() {
    modalOverlay.classList.remove('show');
}

// Close modal when clicking overlay
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Search functionality with debounce
let searchTimeout;
searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    const searchTerm = this.value.trim();

    if (searchTerm.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
    }

    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    action: 'searchGuests',
                    searchTerm: searchTerm
                })
            });

            const data = await response.json();

            if (data.status === 'success' && data.results && data.results.length > 0) {
                searchResults.innerHTML = data.results.map(guest => `
                    <div class="search-result-item" data-guest='${JSON.stringify(guest).replace(/'/g, "&apos;")}'>
                        <strong>${escapeHtml(guest.name)}</strong><br>
                        <small>${escapeHtml(guest.address || '')}</small>
                    </div>
                `).join('');
                searchResults.style.display = 'block';

                // Add click handlers
                document.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', function() {
                        const guestData = JSON.parse(this.getAttribute('data-guest'));
                        selectGuest(guestData);
                    });
                });
            } else {
                searchResults.innerHTML = '<div class="no-results">No guests found matching your search</div>';
                searchResults.style.display = 'block';
            }
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = '<div class="error-message">Error searching. Please try again.</div>';
            searchResults.style.display = 'block';
        }
    }, 300);
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Select guest from search results
function selectGuest(guest) {
    selectedGuest = guest;
    searchResults.style.display = 'none';
    searchInput.value = guest.name;

    // Check if guest has already responded
    const hasResponded = guest.rsvp && (guest.rsvp.toLowerCase() === 'yes' || guest.rsvp.toLowerCase() === 'no');

    if (hasResponded) {
        // Guest already responded - show thank you message
        const attendingMessage = guest.rsvp.toLowerCase() === 'yes' 
            ? `<div class="celebration-icon">🎊</div>
                <h3>Thank You, ${escapeHtml(guest.name)}!</h3>
                <p>You've already confirmed your attendance.</p>
                <p><strong>We can't wait to celebrate with you on January 22, 2026! ✨</strong></p>`
            : `<div class="celebration-icon">💝</div>
                <h3>Thank You, ${escapeHtml(guest.name)}</h3>
                <p>You've already responded to our invitation.</p>
                <p>You will be missed on our special day. ❤️</p>`;

        selectedGuestDiv.innerHTML = `<div class="already-responded">${attendingMessage}</div>`;
        rsvpFormFields.style.display = 'none';
    } else {
        // Guest hasn't responded - show form
        selectedGuestDiv.innerHTML = `
            <div class="guest-info-card">
                <h3>✨ ${escapeHtml(guest.name)}</h3>
                <p><strong>Address:</strong> ${escapeHtml(guest.address || 'Not provided')}</p>
                ${guest.contact ? `<p><strong>Contact:</strong> ${escapeHtml(guest.contact)}</p>` : ''}
            </div>
        `;

        // Pre-fill contact if available
        if (guest.contact) {
            contactInput.value = guest.contact;
        } else {
            contactInput.value = '';
        }

        // Reset attendance
        attendanceSelect.value = '';

        // Show form fields
        rsvpFormFields.style.display = 'block';
    }

    // Show guest details section
    guestDetails.classList.add('show');
}

// Close search results when clicking outside
document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});

// Form submission
document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate guest selection
    if (!selectedGuest) {
        showAlert('Please search and select your name from the guest list first.', 'error');
        searchInput.focus();
        return;
    }

    // Validate attendance
    const attendance = attendanceSelect.value;
    if (!attendance) {
        showAlert('Please select whether you will be attending.', 'error');
        attendanceSelect.focus();
        return;
    }

    // Validate contact
    const contact = contactInput.value.trim();
    if (!contact) {
        showAlert('Please provide your contact information.', 'error');
        contactInput.focus();
        return;
    }

    // Show loading state
    const submitBtn = this.querySelector('.rsvp-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                action: 'updateRSVP',
                name: selectedGuest.name,
                contact: contact,
                rsvp: attendance === 'yes' ? 'Yes' : 'No',
                timestamp: new Date().toISOString()
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            // Show success modal
            if (attendance === 'yes') {
                showModal(
                    '🎉',
                    `Thank you, ${selectedGuest.name}!`,
                    `<p>We're so excited to celebrate with you on <strong>January 22, 2026!</strong></p>
                        <p>You will receive more details soon.</p>`
                );
            } else {
                showModal(
                    '💝',
                    'Thank you for letting us know',
                    `<p>You will be missed on our special day, ${selectedGuest.name}. ❤️</p>`
                );
            }

            // Reset form
            setTimeout(() => {
                this.reset();
                guestDetails.classList.remove('show');
                selectedGuest = null;
                selectedGuestDiv.innerHTML = '';
                searchInput.value = '';
                rsvpFormFields.style.display = 'block';
            }, 500);
        } else {
            showAlert('Error: ' + (data.message || 'Unknown error occurred'), 'error');
        }
    } catch (error) {
        console.error('Submission error:', error);
        showAlert('There was an error submitting your RSVP. Please try again or contact us directly.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});


/* Floating Elements */
document.addEventListener('DOMContentLoaded', function() {
        // Parallax effect for floating elements
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const elements = document.querySelectorAll('.floating-element');
            elements.forEach((element, index) => {
                const speed = 0.3 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
});
    

/*
        MUSIC
*/

const playlist = [
    { title: '✦ ♡ ✦', src: 'music/dancingonmyown.mp3' },
    { title: '✦ ♡ ✦', src: 'music/iloveyou.mp3' },
    { title: '✦ ♡ ✦', src: 'music/newlyweds.mp3' },
    { title: '✦ ♡ ✦', src: 'music/yellow.mp3' },
    { title: '✦ ♡ ✦', src: 'music/youbelongwithme.mp3' }
];

const audio = document.getElementById('bgMusic');
let currentIndex = 0;

// Start playing the first song
function startPlaylist() {
    audio.src = playlist[currentIndex].src;
    audio.play();
}

// When a song ends, play the next one
audio.addEventListener('ended', function() {
    currentIndex++;
    
    // Loop back to the first song when playlist ends
    if (currentIndex >= playlist.length) {
        currentIndex = 0;
    }
    
    audio.src = playlist[currentIndex].src;
    audio.play();
});

// Start on user interaction (due to browser autoplay restrictions)
window.addEventListener('click', function() {
    startPlaylist();
}, { once: true });
