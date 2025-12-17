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

// Default Hash: admin123
const DEFAULT_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

// Initialize Admin Hash
if (!localStorage.getItem('adminHash')) {
    localStorage.setItem('adminHash', DEFAULT_HASH);
}

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
    if (window.lucide) {
        lucide.createIcons();
    }
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
    
    if (username !== 'admin') {
        showLoginError();
        return;
    }

    // Verify against stored hash
    const storedHash = localStorage.getItem('adminHash');
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === storedHash) {
        isAdminLoggedIn = true;
        sessionStorage.setItem('isAdmin', 'true');
        renderAdmin();
    } else {
        showLoginError();
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    const currentPass = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;

    if (newPass !== confirmPass) {
        showToast("New passwords do not match!");
        return;
    }

    // Verify current
    const storedHash = localStorage.getItem('adminHash');
    const encoder = new TextEncoder();
    const data = encoder.encode(currentPass);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex !== storedHash) {
        showToast("Current password is incorrect.");
        return;
    }

    // Hash new and save
    const newData = encoder.encode(newPass);
    const newHashBuffer = await crypto.subtle.digest('SHA-256', newData);
    const newHashHex = Array.from(new Uint8Array(newHashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    localStorage.setItem('adminHash', newHashHex);
    showToast("Password changed successfully!");
    e.target.reset();
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
    // Find button that triggered this, or find by id if called programmatically
    const btn = event?.target.tagName === 'BUTTON' ? event.target : document.querySelector(`button[onclick="switchAdminTab('${tab}')"]`);
    if(btn) btn.classList.add('active');
    
    // Content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');

    if (tab === 'list') renderAdminList();
    if (tab === 'create') resetForm(); // Clear form when switching to create
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
            <button onclick="editItinerary('${it.id}')" class="btn btn-outline btn-sm">Edit</button>
        `;
        list.appendChild(item);
    });
}

// Edit Itinerary Logic
function editItinerary(id) {
    const it = itineraries.find(i => i.id === id);
    if (!it) return;

    // Switch to create tab
    switchAdminTab('create');
    document.getElementById('tab-btn-create').classList.add('active'); // Ensure visual active state

    // Fill Form
    document.getElementById('form-title').innerText = 'Edit Itinerary';
    document.getElementById('submit-btn').innerText = 'Update Itinerary';
    document.getElementById('cancel-edit-btn').classList.remove('hidden');
    document.getElementById('edit-mode-id').value = it.id;
    
    const form = document.getElementById('itinerary-form');
    form.title.value = it.title;
    form.subtitle.value = it.subtitle;
    form.price.value = it.price;
    form.heroImage.value = it.heroImage;
    document.getElementById('heroImageUrl').value = it.heroImage.startsWith('data:') ? '' : it.heroImage;
    
    // Show preview
    updateImageInput('hero', it.heroImage, true);

    // Days
    const container = document.getElementById('days-container');
    container.innerHTML = '';
    it.days.forEach((day, index) => {
        addDayInput(day);
    });
}

function resetForm() {
    document.getElementById('form-title').innerText = 'Create New Itinerary';
    document.getElementById('submit-btn').innerText = 'Create Itinerary';
    document.getElementById('cancel-edit-btn').classList.add('hidden');
    document.getElementById('edit-mode-id').value = '';
    
    const form = document.getElementById('itinerary-form');
    if(form) form.reset();
    
    document.getElementById('days-container').innerHTML = '';
    clearImage('hero');
}

// Create/Update Logic
function addDayInput(data = null) {
    const container = document.getElementById('days-container');
    const dayCount = container.children.length + 1;
    const dayId = Date.now() + Math.random(); // unique id for inputs
    
    const div = document.createElement('div');
    div.className = 'day-input-group';
    
    const titleVal = data ? data.title : '';
    const descVal = data ? data.description : '';
    const imgVal = data ? data.image : '';

    div.innerHTML = `
        <button type="button" class="remove-day" onclick="this.parentElement.remove()">×</button>
        <h4>Day ${data ? data.day : dayCount}</h4>
        <div class="form-group">
            <input type="text" class="day-title" placeholder="Activity Title" value="${titleVal}" required>
        </div>
        <div class="form-group">
            <input type="hidden" class="day-image-hidden" value="${imgVal}">
            <div class="image-upload-wrapper">
                <input type="url" class="day-image-url url-input" placeholder="Image URL" value="${imgVal.startsWith('data:') ? '' : imgVal}" onchange="updateDayImage(this)">
                <span class="divider">OR</span>
                <label class="file-upload-btn">
                    <i data-lucide="upload"></i> Upload
                    <input type="file" accept="image/*" onchange="handleDayImageUpload(event, this)">
                </label>
            </div>
            <div class="image-preview ${imgVal ? '' : 'hidden'}">
                <img src="${imgVal}" alt="Preview">
                <button type="button" class="remove-img" onclick="clearDayImage(this)">×</button>
            </div>
        </div>
        <div class="form-group">
            <textarea class="day-desc" placeholder="Description" required>${descVal}</textarea>
        </div>
    `;
    container.appendChild(div);
    if(window.lucide) lucide.createIcons();
}

function handleCreateItinerary(e) {
    e.preventDefault();
    const form = e.target;
    const editId = document.getElementById('edit-mode-id').value;
    
    // Collect Days
    const dayElements = document.querySelectorAll('.day-input-group');
    const days = Array.from(dayElements).map((el, index) => ({
        day: index + 1,
        title: el.querySelector('.day-title').value,
        image: el.querySelector('.day-image-hidden').value,
        description: el.querySelector('.day-desc').value
    }));

    if (days.length === 0) {
        showToast("Please add at least one day!");
        return;
    }

    const itineraryData = {
        id: editId || form.title.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: form.title.value,
        subtitle: form.subtitle.value,
        price: form.price.value,
        heroImage: form.heroImage.value,
        days: days
    };

    if (editId) {
        // Update existing
        const index = itineraries.findIndex(i => i.id === editId);
        if (index !== -1) {
            itineraries[index] = itineraryData;
            showToast("Itinerary Updated!");
        }
    } else {
        // Create new
        itineraries.push(itineraryData);
        showToast("Itinerary Created Successfully!");
    }
    
    saveItineraries();
    resetForm();
    switchAdminTab('list');
}

// Image Handling Logic
function updateImageInput(type, value, forceShow = false) {
    if (type === 'hero') {
        document.getElementById('heroImageInput').value = value;
        const preview = document.getElementById('hero-preview');
        const img = preview.querySelector('img');
        if (value || forceShow) {
            img.src = value;
            preview.classList.remove('hidden');
        } else {
            preview.classList.add('hidden');
        }
    }
}

function clearImage(type) {
    if (type === 'hero') {
        document.getElementById('heroImageInput').value = '';
        document.getElementById('heroImageUrl').value = '';
        document.getElementById('hero-preview').classList.add('hidden');
    }
}

function handleImageUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        if (type === 'hero') {
            updateImageInput('hero', base64);
            document.getElementById('heroImageUrl').value = ''; // Clear URL input if upload is used
        }
    };
    reader.readAsDataURL(file);
}

// Day Image Logic (Dynamic Inputs)
function updateDayImage(input) {
    const wrapper = input.closest('.image-upload-wrapper');
    const hiddenInput = wrapper.parentElement.querySelector('.day-image-hidden');
    const preview = wrapper.parentElement.querySelector('.image-preview');
    const img = preview.querySelector('img');
    
    hiddenInput.value = input.value;
    if (input.value) {
        img.src = input.value;
        preview.classList.remove('hidden');
    } else {
        preview.classList.add('hidden');
    }
}

function handleDayImageUpload(event, input) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        const wrapper = input.closest('.image-upload-wrapper');
        const hiddenInput = wrapper.parentElement.querySelector('.day-image-hidden');
        const urlInput = wrapper.querySelector('.url-input');
        const preview = wrapper.parentElement.querySelector('.image-preview');
        const img = preview.querySelector('img');

        hiddenInput.value = base64;
        urlInput.value = ''; // Clear URL
        img.src = base64;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function clearDayImage(btn) {
    const preview = btn.parentElement;
    const parent = preview.parentElement;
    parent.querySelector('.day-image-hidden').value = '';
    parent.querySelector('.url-input').value = '';
    preview.classList.add('hidden');
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
