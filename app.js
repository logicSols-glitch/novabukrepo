// Toggle Dropdown Visibility
const profileBtn = document.getElementById('userProfileBtn');
const dropdownMenu = document.getElementById('settingsDropdown');

profileBtn.addEventListener('click', (e) => {
    // Prevent the click from immediately bubbling to the window
    e.stopPropagation(); 
    dropdownMenu.classList.toggle('show');
});

// Close dropdown if user clicks outside of it
window.addEventListener('click', () => {
    if (dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.remove('show');
    }
});

// Your existing handleMenuSelect function remains here
function handleMenuSelect(value) {
    if (value === "logout") {
        localStorage.removeItem("novabuk_token");
        window.location.href = "./sign-in.html";
    } else if (value === "settings") {
        // Since we are already on the settings page, just switch the tab
        showPage('privacy'); 
    } else if (value === "profile") {
        // Since we are already on the settings page, just switch the tab
        showPage('profile');
    }
}


const contentArea = document.getElementById('main-content-wrapper');

const pages = {
    profile: `
        <button class="edit-btn">✏️ Edit profile</button>
        <h1>Profile Information</h1>
        <div class="profile-grid">
            <div class="input-group"><label>First Name</label><input type="text" value="Bala"></div>
            <div class="input-group"><label>Last Name</label><input type="text" value="Ahmed"></div>
            <div class="input-group full-width"><label>Email Address</label><input type="email" value="bala.ahmed@example.com"></div>
            <div class="input-group"><label>Phone Number</label><input type="text" value="+234 813 344 5511"></div>
            <div class="input-group"><label>Date of Birth</label><input type="text" value="12/05/1992"></div>
            <div class="input-group"><label>Gender</label><select><option>Male</option><option>Female</option></select></div>
            <div class="input-group full-width"><label>Address</label><input type="text" value="123 Health Street"></div>
        </div>`,

    privacy: `
        <h1>Privacy Settings</h1>
        <div class="setting-item">
            <div class="text"><h3>Share Data with Healthcare Providers</h3><p>Allow doctors to access your health data</p></div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
        </div>
        <div class="setting-item">
            <div class="text"><h3>Data Analytics</h3><p>Allow anonymous usage data to improve services</p></div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
        </div>
        <div class="visibility-section" style="margin-top:20px">
            <h3>Profile Visibility</h3>
            <select class="dropdown"><option>Private - Only me</option><option>Public</option></select>
        </div>`,

    notification: `
        <h1>Notification Settings</h1>
        <div class="setting-item">
            <div class="text"><h3>Email Notifications</h3><p>Receive notifications via email</p></div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
        </div>
        <div class="setting-item">
            <div class="text"><h3>Push Notifications</h3><p>Receive notifications in your browser</p></div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
        </div>
        <div class="setting-item">
            <div class="text"><h3>Health Tips</h3><p>Receive weekly health and wellness advice</p></div>
            <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
        </div>`,

    changepassword: `
        <h1>Change Password</h1>
        <div class="input-group" style="margin-bottom:15px"><label>Current Password</label><input type="password" placeholder="Enter current password"></div>
        <div class="input-group" style="margin-bottom:15px"><label>New Password</label><input type="password" placeholder="Enter new password"></div>
        <div class="input-group" style="margin-bottom:15px"><label>Confirm New Password</label><input type="password" placeholder="Confirm new password"></div>
        <button class="edit-btn" style="float:none; background:var(--primary-teal); color:white; padding: 10px 20px;">Update Password</button>
        <h2 style="margin-top:30px">Login Sessions</h2>
        <div class="session-item">💻 <div><strong>Chrome on Windows</strong><br><small>Lagos, Nigeria • Active now</small></div> <span class="status-badge status-active">Active</span></div>
        <div class="session-item">📱 <div><strong>Safari on iPhone</strong><br><small>Lagos, Nigeria • 2 hours ago</small></div> <span class="status-badge status-end">End Session</span></div>`
};

// Selection Logic
document.querySelectorAll('.sidebar li').forEach(item => {
    item.addEventListener('click', function() {
        // Create a key by removing spaces and making lowercase (e.g., "Change Password" -> "changepassword")
        const pageKey = this.textContent.toLowerCase().replace(/\s+/g, '');
        
        if (pageKey === 'logout') {
            document.getElementById('logout-modal').style.display = 'flex';
            return;
        }

        // Update active UI state
        document.querySelector('.sidebar li.active').classList.remove('active');
        this.classList.add('active');

        // Inject content
        contentArea.innerHTML = pages[pageKey] || `<h1>${this.textContent}</h1><p>Content coming soon...</p>`;
    });
});