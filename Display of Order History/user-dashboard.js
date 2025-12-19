/* ------------------ COMPLETE WORKING USER DASHBOARD + ORDERS ------------------ */

let currentImageData = null;
sessionStorage.clear();
localStorage.removeItem('profileName');
localStorage.removeItem('profileBio'); 
localStorage.removeItem('profilePicture');
let windowUSER_ID = null;

/* ------------------ SESSION + STARTUP ------------------ */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('get_session.php');
    const sessionData = await response.json();
    
    if (sessionData.user_id) {
      windowUSER_ID = sessionData.user_id;
      sessionStorage.setItem('user_id', sessionData.user_id);
      await loadProfileData(sessionData.user_id);
      loadOrderHistory();    
      loadOrderTracking();   
    } else {
      await loadProfileData();
    }
  } catch(e) {
    console.error('Session error:', e);
    await loadProfileData();
  }
});

async function loadProfileData(userId = null) {
  try {
    const url = userId ? `get_profile.php?user_id=${userId}` : 'get_profile.php?user_id=1';
    const response = await fetch(url);
    const data = await response.json();
    
    const nameEl = document.querySelector(".sidebar h3");
    const bioEl = document.querySelector(".sidebar .bio");
    if (nameEl) nameEl.textContent = data.user_name || 'User';
    if (bioEl) bioEl.textContent = data.user_bio || 'Write something about you...';
    
    if (data.user_profile_pic) {
      const profileIcon = document.querySelector(".profile-section .profile-icon");
      if (profileIcon) {
        profileIcon.outerHTML = `
          <img src="uploads/profiles/${data.user_profile_pic}?t=${Date.now()}"
          alt="Profile"
          class="profile-img"
          style="width:150px;height:150px;border-radius:50%;object-fit:cover;">`;
      }
    }
  } catch(e) {
    console.error('Profile load error:', e);
    const savedName = localStorage.getItem('profileName') || 'User';
    const savedBio = localStorage.getItem('profileBio') || 'Write something about you...';
    const nameEl = document.querySelector(".sidebar h3");
    const bioEl = document.querySelector(".sidebar .bio");
    if (nameEl) nameEl.textContent = savedName;
    if (bioEl) bioEl.textContent = savedBio;
  }
}

function saveProfileData(name, bio, profilePicUrl = null) {
  localStorage.setItem('profileName', name || 'User');
  localStorage.setItem('profileBio', bio || '');
  if (profilePicUrl) localStorage.setItem('profilePicture', profilePicUrl);
}

/* ------------------ TABS ------------------ */
const tabs = document.querySelectorAll('[data-tab-value]');
const panes = document.querySelectorAll('.tabs-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const selector = tab.dataset.tabValue;
    const target = document.querySelector(selector);
    if (!target) return;

    panes.forEach(p => p.classList.remove('active'));
    target.classList.add('active');

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    if (selector === '#order_history') loadOrderHistory();
    if (selector === '#order_tracking') loadOrderTracking();
  });
});

/* ------------------ ORDER FUNCTIONS (WORKING VERSION) ------------------ */
async function loadOrderTracking() {
  if (!windowUSER_ID) {
    document.getElementById('orderTrackingContainer').innerHTML = '<p>Please login</p>';
    return;
  }
  
  try {
    const response = await fetch(`get_user_orders.php?user_id=${windowUSER_ID}&status=tracking`);
    const orders = await response.json();
    
    const container = document.getElementById('orderTrackingContainer');
    const noOrders = document.getElementById('noOrderTracking');
    
    if (orders.length) {
      container.innerHTML = orders.map(order => `
        <div class="order-card" style="padding:15px;border:1px solid #ddd;margin:10px 0;border-radius:8px;background:#f8f9fa;">
          <h4 style="color:#007bff;margin:0 0 10px 0;">Order #${order.order_id}</h4>
          <div style="margin:15px 0;padding:10px;background:#e7f3ff;border-radius:5px;">
            <strong>Total: ₱${parseFloat(order.order_total || 0).toLocaleString()}</strong><br>
            <span style="color:#666;">${new Date(order.order_date).toLocaleDateString()}</span>
          </div>
          <p><strong>Status:</strong> <span style="padding:4px 8px;background:#ffc107;color:#856404;border-radius:4px;font-weight:bold;">TRACKING</span></p>
          <button onclick="markReceived(${order.order_id})" 
                  style="background:#28a745;color:white;padding:12px 24px;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:16px;width:100%;margin-top:10px;">
            ✅ Mark as Received
          </button>
        </div>
      `).join('');
      noOrders.style.display = 'none';
    } else {
      container.innerHTML = '';
      noOrders.style.display = 'block';
    }
  } catch(e) {
    console.error('Tracking load error:', e);
    document.getElementById('orderTrackingContainer').innerHTML = '<p>Error loading tracking orders</p>';
  }
}

async function loadOrderHistory() {
  if (!windowUSER_ID) {
    document.getElementById('orderHistoryContainer').innerHTML = '<p>Please login</p>';
    return;
  }
  
  try {
    const response = await fetch(`get_user_orders.php?user_id=${windowUSER_ID}&status=received`);
    const orders = await response.json();
    
    const container = document.getElementById('orderHistoryContainer');
    const noOrders = document.getElementById('noOrderHistory');
    
    if (orders.length) {
      container.innerHTML = orders.map(order => `
        <div class="order-card completed" style="padding:15px;border:1px solid #ddd;margin:10px 0;border-radius:8px;background:#f8fff8;">
          <h4 style="color:#28a745;margin:0 0 10px 0;">✓ Order #${order.order_id} - RECEIVED</h4>
          <div style="margin:15px 0;padding:10px;background:#d4edda;border-radius:5px;border-left:4px solid #28a745;">
            <strong>Total: ₱${parseFloat(order.order_total || 0).toLocaleString()}</strong><br>
            <span>Received: ${order.received_date ? new Date(order.received_date).toLocaleDateString() : new Date(order.order_date).toLocaleDateString()}</span>
          </div>
        </div>
      `).join('');
      noOrders.style.display = 'none';
    } else {
      container.innerHTML = '';
      noOrders.style.display = 'block';
    }
  } catch(e) {
    console.error('History load error:', e);
    document.getElementById('orderHistoryContainer').innerHTML = '<p>Error loading history</p>';
  }
}

async function markReceived(order_id) {
  try {
    const response = await fetch('update_order_status.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({order_id: order_id})
    });
    const result = await response.json();
    
    if (result.success !== false) {
      alert('✅ Order marked as received!');
      loadOrderTracking();
      loadOrderHistory();
    } else {
      alert('❌ Update failed');
    }
  } catch(e) {
    console.error('Mark received error:', e);
    alert('❌ Error: ' + e.message);
  }
}

/* ------------------ EXPOSE GLOBAL FUNCTIONS ------------------ */
window.loadOrderHistory = loadOrderHistory;
window.loadOrderTracking = loadOrderTracking;
window.markReceived = markReceived;

/* ------------------ PROFILE MODAL ------------------ */
const editProfileBtn = document.querySelector(".edit-profile");
const modalOverlay = document.getElementById("modalOverlay");
const editProfileModal = document.getElementById("editProfileModal");

if (editProfileBtn && modalOverlay && editProfileModal) {
  editProfileBtn.addEventListener("click", function () {
    modalOverlay.style.display = "flex";
    editProfileModal.style.display = "block";

    const nameEl = document.querySelector(".sidebar h3");
    const bioEl = document.querySelector(".sidebar .bio");
    if (nameEl && bioEl) {
      document.getElementById("profileNameInput").value = nameEl.innerText;
      document.getElementById("profileBioInput").value = bioEl.innerText;
    }
  });
}

const profilePicInput = document.getElementById("profilePictureInput");
const profilePicPreview = document.getElementById("profilePicturePreview");

if (profilePicInput && profilePicPreview) {
  profilePicInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) {
      profilePicPreview.innerHTML = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      currentImageData = ev.target.result;
      profilePicPreview.innerHTML = `
        <img src="${ev.target.result}" class="preview-img" alt="Profile"
         style="width:100px;height:100px;border-radius:50%;object-fit:cover;">`;
    };
    reader.readAsDataURL(file);
  });
}

function closeEditProfile() {
  if (editProfileModal) editProfileModal.style.display = "none";

  const anyOpen = Array.from(document.querySelectorAll(".modal"))
    .some(m => m !== editProfileModal && m.style.display === "block");

  if (!anyOpen && modalOverlay) {
    modalOverlay.style.display = "none";
  }
}

async function saveProfile() {
  const newName = document.getElementById("profileNameInput").value.trim();
  const newBio = document.getElementById("profileBioInput").value.trim();
  const profilePicFile = profilePicInput ? profilePicInput.files[0] : null;

  const nameEl = document.querySelector(".sidebar h3");
  const bioEl = document.querySelector(".sidebar .bio");
  if (nameEl) nameEl.innerText = newName || "User";
  if (bioEl) bioEl.innerText = newBio;

  const formData = new FormData();
  formData.append('user_name', newName);
  formData.append('user_bio', newBio);
  if (profilePicFile) formData.append('profile_pic', profilePicFile);
  
  try {
    const response = await fetch('save_user_profile.php', { method: 'POST', body: formData });
    const result = await response.json();
    
    if (result.success) {
      if (result.filename) {
        const profileIcon = document.querySelector(".profile-section .profile-icon, .profile-img");
        if (profileIcon) {
          profileIcon.outerHTML = `
            <img src="uploads/profiles/${result.filename}?t=${Date.now()}"
                 alt="Profile"
                 class="profile-img"
                 style="width:60px;height:60px;border-radius:50%;object-fit:cover;">`;
        }
      }
      alert('Profile updated successfully!');
      const userId = sessionStorage.getItem('user_id');
      if (userId) await loadProfileData(userId);
    } else {
      alert('Save failed: ' + (result.error || 'Unknown error'));
    }
  } catch(e) {
    console.error('Save error:', e);
    alert('Save failed. Please try again.');
  }

  if (profilePicInput) profilePicInput.value = "";
  if (profilePicPreview) profilePicPreview.innerHTML = "";
  closeEditProfile();
}

window.closeEditProfile = closeEditProfile;
window.saveProfile = saveProfile;

/* ------------------ LOGOUT ------------------ */
function logoutNow() {
  const logoutModal = document.getElementById("logoutModal");
  if (modalOverlay && logoutModal) {
    modalOverlay.style.display = "flex";
    logoutModal.style.display = "block";
  } else {
    window.location.href = "index.htm";
  }
}

function confirmLogout() {
  window.location.href = "index.htm";
}

function closeLogoutModal() {
  const logoutModal = document.getElementById("logoutModal");
  if (logoutModal) logoutModal.style.display = "none";

  const anyOpen = Array.from(document.querySelectorAll(".modal"))
    .some(m => m !== logoutModal && m.style.display === "block");

  if (!anyOpen && modalOverlay) {
    modalOverlay.style.display = "none";
  }
}

window.logoutNow = logoutNow;
window.confirmLogout = confirmLogout;
window.closeLogoutModal = closeLogoutModal;

window.onclick = function (event) {
  if (!modalOverlay) return;
  if (event.target === modalOverlay) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(m => m.style.display = "none");
    modalOverlay.style.display = "none";
  }
};
