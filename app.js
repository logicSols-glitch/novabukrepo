//const API_URL = "http://localhost:5000/api";
const API_URL = "https://novabuk-backend.onrender.com/api";

const token = localStorage.getItem("novabuk_token");
if (!token) window.location.href = "./sign-in.html";

// ── DROPDOWN ──────────────────────────────────────────────
const userProfileBtn  = document.getElementById("userProfileBtn");
const settingsDropdown = document.getElementById("settingsDropdown");

userProfileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  settingsDropdown.classList.toggle("show");
});
window.addEventListener("click", () => settingsDropdown.classList.remove("show"));

function handleMenuSelect(value) {
  if (value === "logout") {
    document.getElementById("logout-modal").style.display = "flex";
  } else if (value === "profile") {
    showPage("profile");
  } else if (value === "settings") {
    showPage("privacy");
  }
}

function closeModal() {
  document.getElementById("logout-modal").style.display = "none";
}

// Logout button in modal
document.querySelector(".btn-logout").addEventListener("click", () => {
  localStorage.removeItem("novabuk_token");
  localStorage.removeItem("novabuk_user");
  localStorage.removeItem("selectedClinic");
  window.location.href = "./sign-in.html";
});

// ── PAGE SWITCHER ─────────────────────────────────────────
function showPage(pageKey) {
  const contentArea = document.getElementById("main-content-wrapper");
  contentArea.innerHTML = `<div style="text-align:center;padding:40px"><div class="spinner-inline"></div></div>`;

  // Update sidebar active
  document.querySelectorAll(".sidebar li").forEach(li => {
    li.classList.remove("active");
    if (li.textContent.toLowerCase().replace(/\s+/g, "") === pageKey) {
      li.classList.add("active");
    }
  });

  // Load the right page
  if (pageKey === "profile")         loadProfilePage(contentArea);
  else if (pageKey === "privacy")    loadPrivacyPage(contentArea);
  else if (pageKey === "notification") loadNotificationPage(contentArea);
  else if (pageKey === "changepassword") loadChangePasswordPage(contentArea);
}

// ── LOAD ON DOM READY ─────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetTab = urlParams.get("tab") || "profile";
  showPage(targetTab);

  // Sidebar click
  document.querySelectorAll(".sidebar li").forEach(item => {
    item.addEventListener("click", function() {
      const key = this.textContent.toLowerCase().replace(/\s+/g, "");
      if (key === "logout") {
        document.getElementById("logout-modal").style.display = "flex";
        return;
      }
      showPage(key);
    });
  });
});

// ── FEEDBACK HELPER ───────────────────────────────────────
function showFeedback(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  el.style.padding = "10px 14px";
  el.style.borderRadius = "6px";
  el.style.marginBottom = "12px";
  el.style.fontSize = "13px";
  el.style.fontFamily = "Poppins, sans-serif";
  el.style.background = type === "success" ? "#f0fff4" : "#fff5f5";
  el.style.color      = type === "success" ? "#276749" : "#e53e3e";
  el.style.border     = type === "success" ? "1px solid #9ae6b4" : "1px solid #fed7d7";
  setTimeout(() => { if (el) el.style.display = "none"; }, 4000);
}

// ── PROFILE PAGE ──────────────────────────────────────────
async function loadProfilePage(area) {
  try {
    const res  = await fetch(`${API_URL}/users/settings`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const u    = data.success ? data.data.profile : {};
    const hp   = u.healthProfile || {};
    const ec   = u.emergencyContact || {};
    const name = u.fullName || "";
    const [firstName, ...rest] = name.split(" ");
    const lastName = rest.join(" ");

    area.innerHTML = `
      <div id="profileFeedback" style="display:none"></div>
      <button class="edit-btn" id="editProfileBtn" onclick="toggleProfileEdit()">✏️ Edit profile</button>
      <h1>Profile Information</h1>
      <div class="profile-grid">
        <div class="input-group"><label>First Name</label><input type="text" id="pFirstName" value="${firstName}" disabled /></div>
        <div class="input-group"><label>Last Name</label><input type="text" id="pLastName" value="${lastName}" disabled /></div>
        <div class="input-group"><label>Email Address</label><input type="email" id="pEmail" value="${u.email || ""}" disabled /></div>
        <div class="input-group"><label>Phone Number</label><input type="text" id="pPhone" value="${u.phone || ""}" disabled placeholder="+234 803 000 0000" /></div>
        <div class="input-group"><label>Date of Birth</label><input type="text" id="pDob" value="${u.dateOfBirth || ""}" disabled placeholder="DD/MM/YYYY" /></div>
        <div class="input-group"><label>Gender</label>
          <select id="pGender" disabled>
            <option value="">Select</option>
            ${["Male","Female","Non-binary","Prefer not to say"].map(g =>
              `<option value="${g}" ${(hp.gender === g || u.gender === g) ? "selected" : ""}>${g}</option>`
            ).join("")}
          </select>
        </div>
        <div class="input-group full-width"><label>Address</label><input type="text" id="pAddress" value="${u.address || ""}" disabled placeholder="123 Health Street" /></div>
        <div class="input-group"><label>City</label><input type="text" id="pCity" value="${u.city || ""}" disabled placeholder="Ikeja" /></div>
        <div class="input-group"><label>State</label><input type="text" id="pState" value="${u.state || ""}" disabled placeholder="Lagos" /></div>
        <div class="line full-width"></div>
        <h3 class="full-width">Emergency Contact</h3>
        <div class="input-group"><label>Emergency Name</label><input type="text" id="pEcName" value="${ec.name || ""}" disabled placeholder="Jane Dorcas" /></div>
        <div class="input-group"><label>Contact Phone</label><input type="text" id="pEcPhone" value="${ec.phone || ""}" disabled placeholder="+234 123 123 4567" /></div>
        <div class="input-group full-width" id="saveProfileRow" style="display:none">
          <button class="edit-btn" onclick="saveProfile()" style="float:none;background:var(--primary-teal);color:white;padding:10px 24px;">Save Changes</button>
        </div>
      </div>`;
  } catch (err) {
    area.innerHTML = `<p style="color:#e53e3e;padding:20px">Failed to load profile.</p>`;
  }
}

function toggleProfileEdit() {
  const fields = ["pFirstName","pLastName","pEmail","pPhone","pDob","pGender","pAddress","pCity","pState","pEcName","pEcPhone"];
  const isDisabled = document.getElementById("pFirstName").disabled;
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !isDisabled;
  });
  document.getElementById("saveProfileRow").style.display = isDisabled ? "block" : "none";
  document.getElementById("editProfileBtn").textContent = isDisabled ? "✕ Cancel" : "✏️ Edit profile";
}

async function saveProfile() {
  const firstName  = document.getElementById("pFirstName").value.trim();
  const lastName   = document.getElementById("pLastName").value.trim();
  const fullName   = `${firstName} ${lastName}`.trim();
  const email      = document.getElementById("pEmail").value.trim();
  const phone      = document.getElementById("pPhone").value.trim();
  const dateOfBirth= document.getElementById("pDob").value.trim();
  const gender     = document.getElementById("pGender").value;
  const address    = document.getElementById("pAddress").value.trim();
  const city       = document.getElementById("pCity").value.trim();
  const state      = document.getElementById("pState").value.trim();
  const ecName     = document.getElementById("pEcName").value.trim();
  const ecPhone    = document.getElementById("pEcPhone").value.trim();

  // ── Validate all required fields ─────────────────────
  const required = [
    { val: firstName,   label: "First Name" },
    { val: lastName,    label: "Last Name" },
    { val: email,       label: "Email Address" },
    { val: phone,       label: "Phone Number" },
    { val: dateOfBirth, label: "Date of Birth" },
    { val: gender,      label: "Gender" },
    { val: address,     label: "Address" },
    { val: city,        label: "City" },
    { val: state,       label: "State" },
    { val: ecName,      label: "Emergency Contact Name" },
    { val: ecPhone,     label: "Emergency Contact Phone" },
  ];
  const missing = required.filter(f => !f.val).map(f => f.label);
  if (missing.length > 0) {
    showFeedback("profileFeedback", `Please fill in: ${missing.join(", ")}`, "error");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/users/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        fullName, email, phone, dateOfBirth, address, city, state,
        emergencyContact: { name: ecName, phone: ecPhone },
      }),
    });
    const data = await res.json();

    if (data.success) {
      // Fetch existing health profile to preserve ageRange, conditions, allergies
      const meRes  = await fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
      const meData = await meRes.json();
      const existingHp = meData.success ? (meData.user.healthProfile || {}) : {};

      // Merge gender in — preserve everything else
      await fetch(`${API_URL}/users/health-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ageRange:           existingHp.ageRange           || "",
          existingConditions: existingHp.existingConditions || [],
          allergies:          existingHp.allergies          || [],
          gender,
        }),
      });
      const stored = JSON.parse(localStorage.getItem("novabuk_user") || "{}");
      stored.fullName = fullName;
      localStorage.setItem("novabuk_user", JSON.stringify(stored));
      showFeedback("profileFeedback", "Profile saved successfully!", "success");
      setTimeout(() => loadProfilePage(document.getElementById("main-content-wrapper")), 1000);
    } else {
      showFeedback("profileFeedback", data.message || "Could not save.", "error");
    }
  } catch (err) {
    showFeedback("profileFeedback", "Network error. Please try again.", "error");
  }
}

// ── PRIVACY PAGE ──────────────────────────────────────────
async function loadPrivacyPage(area) {
  try {
    const res  = await fetch(`${API_URL}/users/settings`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const ps   = data.success ? (data.data.privacySettings || {}) : {};

    area.innerHTML = `
      <div id="privacyFeedback" style="display:none"></div>
      <h1>Privacy Settings</h1>
      ${[
        { key: "shareDataWithProviders",  label: "Share Data with Healthcare Providers", desc: "Allow doctors to access your health data" },
        { key: "marketingCommunications", label: "Marketing Communications", desc: "Receiving marketing emails and promotional content" },
        { key: "dataAnalytics",           label: "Data Analytics", desc: "Allow anonymous usage data to improve services" },
        { key: "thirdPartyDataSharing",   label: "Third-party Data Sharing", desc: "Allowing sharing of aggregated data with research partners" },
      ].map(item => `
        <div class="setting-item">
          <div class="text"><h3>${item.label}</h3><p>${item.desc}</p></div>
          <label class="switch">
            <input type="checkbox" id="ps_${item.key}" ${ps[item.key] ? "checked" : ""} onchange="savePrivacy('${item.key}', this.checked)">
            <span class="slider"></span>
          </label>
        </div>`).join("")}
      <div class="visibility-section" style="margin-top:20px">
        <h3>Profile Visibility</h3>
        <select class="dropdown" id="ps_profileVisibility" onchange="savePrivacy('profileVisibility', this.value)">
          <option value="Private - Only me"        ${ps.profileVisibility === "Private - Only me"        ? "selected" : ""}>Private - Only me</option>
          <option value="Healthcare providers only" ${ps.profileVisibility === "Healthcare providers only"? "selected" : ""}>Healthcare providers only</option>
          <option value="Private - Anyone"         ${ps.profileVisibility === "Private - Anyone"         ? "selected" : ""}>Private - Anyone</option>
        </select>
      </div>`;
  } catch (err) {
    area.innerHTML = `<p style="color:#e53e3e;padding:20px">Failed to load privacy settings.</p>`;
  }
}

async function savePrivacy(key, value) {
  try {
    await fetch(`${API_URL}/users/privacy-settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [key]: value }),
    });
    showFeedback("privacyFeedback", "Privacy settings updated.", "success");
  } catch (err) {
    showFeedback("privacyFeedback", "Could not save. Try again.", "error");
  }
}

// ── NOTIFICATION PAGE ─────────────────────────────────────
async function loadNotificationPage(area) {
  try {
    const res  = await fetch(`${API_URL}/users/settings`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const ns   = data.success ? (data.data.notificationSettings || {}) : {};

    area.innerHTML = `
      <div id="notifFeedback" style="display:none"></div>
      <h1>Notification Settings</h1>
      ${[
        { key: "emailNotifications",   label: "Email Notifications",  desc: "Receive notifications via email" },
        { key: "smsNotifications",     label: "SMS Notifications",    desc: "Receive important alerts via text message" },
        { key: "appointmentReminders", label: "Appointment Reminders",desc: "Get reminded about upcoming appointments" },
        { key: "healthTips",           label: "Health Tips",          desc: "Receive weekly health and wellness advice" },
        { key: "clinicUpdates",        label: "System Updates",       desc: "Get notified about system maintenance and updates" },
      ].map(item => `
        <div class="setting-item">
          <div class="text"><h3>${item.label}</h3><p>${item.desc}</p></div>
          <label class="switch">
            <input type="checkbox" id="ns_${item.key}" ${ns[item.key] ? "checked" : ""} onchange="saveNotification('${item.key}', this.checked)">
            <span class="slider"></span>
          </label>
        </div>`).join("")}`;
  } catch (err) {
    area.innerHTML = `<p style="color:#e53e3e;padding:20px">Failed to load notification settings.</p>`;
  }
}

async function saveNotification(key, value) {
  try {
    await fetch(`${API_URL}/users/notification-settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [key]: value }),
    });
    showFeedback("notifFeedback", "Notification settings updated.", "success");
  } catch (err) {
    showFeedback("notifFeedback", "Could not save. Try again.", "error");
  }
}

// ── CHANGE PASSWORD PAGE ──────────────────────────────────
function loadChangePasswordPage(area) {
  area.innerHTML = `
    <div id="pwFeedback" style="display:none"></div>
    <h1>Change Password</h1>
    <div class="input-group" style="margin-bottom:15px">
      <label>Current Password</label>
      <input type="password" id="currentPw" placeholder="Enter current password" />
    </div>
    <div class="input-group" style="margin-bottom:15px">
      <label>New Password</label>
      <input type="password" id="newPw" placeholder="Enter new password (min 6 characters)" />
    </div>
    <div class="input-group" style="margin-bottom:20px">
      <label>Confirm New Password</label>
      <input type="password" id="confirmPw" placeholder="Confirm new password" />
    </div>
    <button class="edit-btn" onclick="changePassword()" style="float:none;background:var(--primary-teal);color:white;padding:10px 24px;" id="changePwBtn">
      Update Password
    </button>`;
}

async function changePassword() {
  const currentPassword = document.getElementById("currentPw").value;
  const newPassword     = document.getElementById("newPw").value;
  const confirmPassword = document.getElementById("confirmPw").value;
  const btn             = document.getElementById("changePwBtn");

  if (!currentPassword || !newPassword) {
    showFeedback("pwFeedback", "All fields are required.", "error"); return;
  }
  if (newPassword.length < 6) {
    showFeedback("pwFeedback", "New password must be at least 6 characters.", "error"); return;
  }
  if (newPassword !== confirmPassword) {
    showFeedback("pwFeedback", "Passwords do not match.", "error"); return;
  }

  btn.disabled    = true;
  btn.textContent = "Updating...";

  try {
    const res  = await fetch(`${API_URL}/users/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (data.success) {
      showFeedback("pwFeedback", "Password changed successfully!", "success");
      ["currentPw","newPw","confirmPw"].forEach(id => document.getElementById(id).value = "");
    } else {
      showFeedback("pwFeedback", data.message || "Could not update password.", "error");
    }
  } catch (err) {
    showFeedback("pwFeedback", "Network error. Please try again.", "error");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Update Password";
  }
}