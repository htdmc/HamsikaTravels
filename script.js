// --- 1. Data Store & Initialization ---

// Initial Data
const INITIAL_ITINERARIES = [
    {
        id: 'thailand-2026',
        title: 'Thailand Group Tour – Feb 2026',
        subtitle: '50 Members | All Inclusive Package',
        price: '₹20,000',
        heroImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80',
        days: [
            { day: 1, title: 'Arrival & Hotel Check-in', description: 'Arrive at Bangkok Suvarnabhumi Airport. Transfer to Pattaya.', image: 'https://images.unsplash.com/photo-1595661671978-5917411ce492?w=800&q=80' },
            { day: 2, title: 'Coral Island Tour', description: 'Morning trip to Coral Island (Koh Larn) by speedboat with water sports.', image: 'https://images.unsplash.com/photo-1545638274-1b544b76a084?w=800&q=80' },
            { day: 3, title: 'Nong Nooch Tropical Garden', description: 'Visit the world-class Nong Nooch Tropical Garden and Thai Cultural Show.', image: 'https://images.unsplash.com/photo-1590600588626-4b953457d079?w=800&q=80' },
            { day: 4, title: 'Safari World & Marine Park', description: 'Full day excursion to Safari World and Marine Park.', image: 'https://images.unsplash.com/photo-1534069818856-42d87e07b8b7?w=800&q=80' },
            { day: 5, title: 'Shopping & Departure', description: 'Free time for shopping at Indra Square. Transfer to airport.', image: 'https://images.unsplash.com/photo-1563765416049-598f8602b9f6?w=800&q=80' }
        ]
    },
    {
        id: 'dubai-2026',
        title: 'Dubai Extravaganza – Mar 2026',
        subtitle: 'Luxury Stay | Desert Safari | Burj Khalifa',
        price: '₹45,000',
        heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea90b7cadc9?w=1920&q=80',
        days: [
            { day: 1, title: 'Arrival in Dubai', description: 'Welcome to Dubai! Transfer to your 4-star hotel. Evening Dhow Cruise.', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80' },
            { day: 2, title: 'City Tour & Burj Khalifa', description: 'Half-day city tour followed by a visit to the 124th floor of Burj Khalifa.', image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&q=80' }
        ]
    }
];

// Security: SHA-256 Hash of "admin123"
// Generated via: crypto.subtle.digest('SHA-256', new TextEncoder().encode('admin123')).then(b => console.log(Array.from(new Uint8Array(b)).map(b => b.toString(16).padStart(2,'0')).join('')))
const ADMIN_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

// State
let itineraries = JSON.parse(localStorage.getItem('itineraries')) || INITIAL_ITINERARIES;
let isAdminLoggedIn = sessionStorage.getItem('isAdmin') === 'true';

// Helper: Save to LocalStorage
function saveItineraries() {
    localStorage.setItem('itineraries', JSON.stringify(itineraries));
}

// --- 2. Routing System ---

function handleRoute() {
    const hash = window.location.hash || '#home';
    const app = document.getElementById('app');
    app.innerHTML = ''; // Clear current view
    window.scrollTo(0, 0);

    // Close mobile menu if open
    document.getElementById('mobileMenu').classList.remove('active');

    if (hash === '#home' || hash === '') {
        renderHome();
    } else if (hash === '#gallery') {
        renderHome();
        setTimeout(() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (hash === '#admin') {
        renderAdmin();
    } else if (hash.startsWith('#itinerary/')) {
        const id = hash.split('/')[1];
        renderItinerary(id);
    } else {
        renderHome(); // Fallback
    }
    
    // Re-initialize icons
    lucide.createIcons();
}

// Listen for hash changes
window.addEventListener('hashchange', handleRoute);
// Initial load
window.addEventListener('DOMContentLoaded', handleRoute);


// --- 3. View Renderers ---

function renderHome() {
    const template = document.getElementById('template-home');
    const clone = template.content.cloneNode(true);
    const app = document.getElementById('app');
    
    // Render Gallery Grid
    const grid = clone.getElementById('gallery-grid');
    itineraries.forEach(it => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => window.location.hash = `#itinerary/${it.id}`;
        card.innerHTML = `
            <div class="card-img">
                <img src="${it.heroImage}" alt="${it.title}">
                <div class="price-badge">${it.price}</div>
            </div>
            <div class="card-content">
                <div class="card-meta"><i data-lucide="map-pin" width="14"></i> ${it.days.length} Days</div>
                <h3 class="card-title">${it.title}</h3>
                <p class="card-desc">${it.subtitle}</p>
                <div class="card-footer">
                    View Itinerary <i data-lucide="arrow-right" width="16"></i>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    app.appendChild(clone);
}

function renderItinerary(id) {
    const itinerary = itineraries.find(it => it.id === id);
    if (!itinerary) {
        window.location.hash = '#home';
        return;
    }

    const template = document.getElementById('template-itinerary');
    const clone = template.content.cloneNode(true);
    const app = document.getElementById('app');

    // Fill Details
    clone.getElementById('detail-hero-img').src = itinerary.heroImage;
    clone.getElementById('detail-title').innerText = itinerary.title;
    clone.getElementById('detail-subtitle').innerText = itinerary.subtitle;
    clone.getElementById('detail-price').innerText = itinerary.price;
    clone.getElementById('detail-days-count').innerText = `${itinerary.days.length} Days of Adventure`;
    clone.getElementById('booking-price').innerText = itinerary.price;

    // Fill Timeline
    const timeline = clone.getElementById('detail-timeline');
    itinerary.days.forEach(day => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-img">
                <img src="${day.image}" alt="${day.title}">
                <div class="day-badge">Day ${day.day}</div>
            </div>
            <div class="timeline-content">
                <h3>${day.title}</h3>
                <p>${day.description}</p>
            </div>
        `;
        timeline.appendChild(item);
    });

    app.appendChild(clone);
}

function renderAdmin() {
    const template = document.getElementById('template-admin');
    const clone = template.content.cloneNode(true);
    const app = document.getElementById('app');
    app.appendChild(clone);

    // Toggle Login vs Dashboard
    if (isAdminLoggedIn) {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        renderAdminList();
    } else {
        document.getElementById('admin-login').classList.remove('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
    }
}

// --- 4. Logic & Interactions ---

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

// Admin Logic
async function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Simple username check
    if (username !== 'admin') {
        showLoginError();
        return;
    }

    // Secure Password Check (Client-side Hashing)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === ADMIN_HASH) {
        isAdminLoggedIn = true;
        sessionStorage.setItem('isAdmin', 'true');
        renderAdmin(); // Re-render to show dashboard
    } else {
        showLoginError();
    }
}

function showLoginError() {
    const errorMsg = document.getElementById('login-error');
    errorMsg.classList.remove('hidden');
    setTimeout(() => errorMsg.classList.add('hidden'), 3000);
}

function logout() {
    isAdminLoggedIn = false;
    sessionStorage.removeItem('isAdmin');
    renderAdmin();
}

function switchAdminTab(tab) {
    // Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');

    if (tab === 'list') renderAdminList();
}

function renderAdminList() {
    const list = document.getElementById('admin-itinerary-list');
    list.innerHTML = '';
    
    itineraries.forEach(it => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        item.innerHTML = `
            <img src="${it.heroImage}" class="admin-list-img" alt="thumb">
            <div class="admin-list-info">
                <h3>${it.title}</h3>
                <p class="text-gray">${it.subtitle}</p>
                <div class="text-primary font-bold">${it.price}</div>
            </div>
            <button onclick="alert('Edit feature coming soon!')" class="btn btn-outline btn-sm">Edit</button>
        `;
        list.appendChild(item);
    });
}

// Create Itinerary Logic
function addDayInput() {
    const container = document.getElementById('days-container');
    const dayCount = container.children.length + 1;
    
    const div = document.createElement('div');
    div.className = 'day-input-group';
    div.innerHTML = `
        <button type="button" class="remove-day" onclick="this.parentElement.remove()">×</button>
        <h4>Day ${dayCount}</h4>
        <div class="form-group">
            <input type="text" class="day-title" placeholder="Activity Title" required>
        </div>
        <div class="form-group">
            <input type="url" class="day-image" placeholder="Image URL" required>
        </div>
        <div class="form-group">
            <textarea class="day-desc" placeholder="Description" required></textarea>
        </div>
    `;
    container.appendChild(div);
}

function handleCreateItinerary(e) {
    e.preventDefault();
    const form = e.target;
    
    // Collect Days
    const dayElements = document.querySelectorAll('.day-input-group');
    const days = Array.from(dayElements).map((el, index) => ({
        day: index + 1,
        title: el.querySelector('.day-title').value,
        image: el.querySelector('.day-image').value,
        description: el.querySelector('.day-desc').value
    }));

    if (days.length === 0) {
        showToast("Please add at least one day!");
        return;
    }

    const newItinerary = {
        id: form.title.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: form.title.value,
        subtitle: form.subtitle.value,
        price: form.price.value,
        heroImage: form.heroImage.value,
        days: days
    };

    itineraries.push(newItinerary);
    saveItineraries();
    
    showToast("Itinerary Created Successfully!");
    form.reset();
    document.getElementById('days-container').innerHTML = ''; // Clear days
    switchAdminTab('list');
}

// Booking Logic
function handleBooking(e) {
    e.preventDefault();
    // In a real app, validation would happen here
    const price = document.getElementById('booking-price').innerText;
    document.getElementById('modal-amount').innerText = price;
    
    document.getElementById('payment-modal').classList.remove('hidden');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.add('hidden');
}

function confirmPayment() {
    closePaymentModal();
    showToast("Booking Submitted Successfully!");
    document.getElementById('booking-form').reset();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Initial Call to setup create form day 1
window.addEventListener('load', () => {
   // Only if we are on admin create tab, but since it's dynamic, we handle it in render
});
