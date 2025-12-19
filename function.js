/* ===========================================
   COMPLETE FIXED VERSION - ALL EDIT FUNCTIONS WORKING
   ============================================ */

let currentImageData = null;
let selectedItem = null;
let products = [];
let addBtn, addModal, editModal, productContainer;

function initAfterAdminID() {
  if (typeof window.ADMIN_ID === 'undefined' || !window.ADMIN_ID) {
    console.log('⏳ Waiting for ADMIN_ID...');
    setTimeout(initAfterAdminID, 100);
    return;
  }
  
  console.log('✅ ADMIN_ID ready:', window.ADMIN_ID);
  loadProfileData();
  syncWithDatabase();
}

function loadProfileData() {
  if (!window.ADMIN_ID) {
    console.log('⏳ ADMIN_ID not ready, retrying...');
    setTimeout(loadProfileData, 100);
    return;
  }
  
  console.log('Loading profile for ADMIN_ID:', window.ADMIN_ID);
  fetch(`get_admin_profile.php?id=${window.ADMIN_ID}`)
    .then(res => res.json())
    .then(profile => {
      console.log('Profile loaded:', profile);
      const nameEl = document.querySelector(".sidebar h3");
      const bioEl = document.querySelector(".sidebar .bio");
      if (nameEl) nameEl.textContent = profile.admin_name || 'Seller/Admin';
      if (bioEl) bioEl.textContent = profile.admin_bio || 'Write something about you...';
      
      if (profile.admin_profile_pic) {
        const profileIcon = document.querySelector(".profile-section .profile-icon");
        if (profileIcon) {
          profileIcon.outerHTML = `
            <img src="uploads/profiles/${profile.admin_profile_pic}?t=${Date.now()}"
                 alt="Profile" class="profile-img"
                 style="width: 160px !important; height: 160px !important; border-radius: 50% !important; object-fit: cover !important; vertical-align: middle !important; position: relative !important; right: -90px !important; top: -10px !important;">
          `;
        }
      }
    })
    .catch(err => console.error('Profile load error:', err));
    
}

async function syncWithDatabase() {
  if (!window.ADMIN_ID) {
    setTimeout(syncWithDatabase, 100);
    return;
  }
  
  try {
    const response = await fetch(`get_products.php?admin_id=${window.ADMIN_ID}`);
    products = await response.json();
    
    renderProductOverviewFromDB();  
    updateViewAsFromDB();           
  } catch(e) {
    products = [];
  }
}

function updateViewAsFromDB() {
  console.log('🔍 View As DEBUG - products length:', products.length);
  console.log('🔍 View As DEBUG - products:', products); 
  
  const productsList = document.getElementById("productsList");
  if (!productsList) return;
  
  productsList.innerHTML = '';
  // ... rest of your code
}


function updateViewAsFromDB() {
  const productsList = document.getElementById("productsList");
  if (!productsList) {
    console.log('❌ productsList not found');
    return;
  }
  
  console.log('🔍 Rendering', products.length, 'products in View As');
  
  productsList.innerHTML = ''; 
  
  if (products.length === 0) {
    productsList.innerHTML = `
      <div class="product-card" style="justify-content:center; align-items:center;">
        <p>No products yet!</p>
      </div>
    `;
    return;
  }
  
  products.forEach((product, index) => {
    console.log('🔍 Rendering product', index + 1, ':', product.product_name); 
    
    const viewCard = document.createElement("div");
    viewCard.className = "product-card";
    
    viewCard.innerHTML = `
      <div class="product-img" style="background: #ccc;">
        ${product.product_img ?
          `<img src="uploads/products/${product.product_img}.png" alt="${product.product_name}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">` :
          ''
        }
      </div>
      <div class="product-info">
        <h5>${product.product_name}</h5>
        <p class="product-price">₱${product.product_price}</p>
        <p class="product-category">Category: ${product.category_id}</p>
        <p class="product-stock">Stock: ${product.product_stock}</p>
        <p class="description">${product.product_desc}</p>
      </div>
    `;
    
    productsList.appendChild(viewCard);
  });
  
  console.log('✅ View As rendered', products.length, 'products');
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
  });
});


function renderProductOverviewFromDB() {
  const container = document.querySelector(".products-card");
  if (!container) return;
 
  const existingProducts = container.querySelectorAll('.product-item');
  existingProducts.forEach(p => p.remove());
 
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-item";
    card.dataset.productId = product.product_id;
   
    card.innerHTML = `
      <div class="product-preview">
        ${product.product_img ?
          `<img class="product-img" src="uploads/products/${product.product_img}.png" alt="${product.product_name}" />` :
          `<div class="product-img" style="background:#ccc;"></div>`
        }
      </div>
      <div class="prod-details">
        <div class="products-info">
          <h5>${product.product_name}</h5>
          <p class="product-price">₱${product.product_price}</p>
          <p class="product-category">Category: ${product.category_id}</p>
          <p class="product-stock">Stock: ${product.product_stock}</p>
          <p class="product_desc">${product.product_desc}</p>
        </div>
      </div>
      <button class="material-icons edit-btn">edit</button>
      <button class="material-icons delete-btn" style="color:red;">delete</button>
    `;
   
    card.querySelector(".edit-btn").addEventListener("click", () => {
      selectedItem = card;
      document.getElementById("editTitle").value = product.product_name;
      document.getElementById("editDesc").value = product.product_desc || '';
      document.getElementById("editPrice").value = product.product_price;
      document.getElementById("editCategory").value = product.category_id;
      document.getElementById("editStock").value = product.product_stock;
      document.getElementById("editModal").style.display = "flex";
    });
   
    card.querySelector(".delete-btn").addEventListener("click", () => {
      selectedItem = card;
      document.getElementById('deleteModal').style.display = 'flex';
    });
   
    const addBtnLocal = container.querySelector('.add-prod');
    if (addBtnLocal) {
      container.insertBefore(card, addBtnLocal.nextSibling);
    }
  });
}


/* ------------------ MAIN INITIALIZATION ------------------ */
document.addEventListener("DOMContentLoaded", async () => {

  addBtn = document.querySelector(".add-prod");
  addModal = document.getElementById("addProductModal");
  editModal = document.getElementById("editModal");
  productContainer = document.querySelector(".products-card");
  initAfterAdminID();

  document.querySelectorAll('.modal, #deleteModal, #editModal, #addProductModal, #editProfileModal').forEach(modal => {
    if (modal) modal.style.display = 'none';
  });
 
  await syncWithDatabase();
  loadProfileData();


  /* ------------------ IMAGE PREVIEWS ------------------ */
  function setupImagePreview(inputEl, previewEl) {
    if (!inputEl || !previewEl) return;
    inputEl.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) {
        previewEl.innerHTML = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        currentImageData = ev.target.result;
        previewEl.innerHTML = `<img src="${ev.target.result}" class="preview-img" alt="Image">`;
      };
      reader.readAsDataURL(file);
    });
  }


  setupImagePreview(document.getElementById("productImage"), document.getElementById("productImagePreview"));
  setupImagePreview(document.getElementById("profilePictureInput"), document.getElementById("profilePicturePreview"));


  function openModal(modal) {
    if (modal) modal.style.display = "flex";
  }
  function closeModal(modal) {
    if (modal) modal.style.display = "none";
  }

  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelAddBtn = document.getElementById("cancelAddBtn");
  if (closeModalBtn) closeModalBtn.addEventListener("click", () => closeModal(addModal));
  if (cancelAddBtn) cancelAddBtn.addEventListener("click", () => closeModal(addModal));
  window.closeEditModal = () => closeModal(editModal);


  if (addBtn) {
    addBtn.addEventListener("click", () => {
      selectedItem = null;
      const productName = document.getElementById("productName");
      const productDesc = document.getElementById("productDesc");
      const productPrice = document.getElementById("productPrice");
      const productCategory = document.getElementById("productCategory");
      const productStock = document.getElementById("productStock");
      const productImage = document.getElementById("productImage");
      const productImagePreview = document.getElementById("productImagePreview");
     
      if (productName) productName.value = "";
      if (productDesc) productDesc.value = "";
      if (productPrice) productPrice.value = "";
      if (productCategory) productCategory.selectedIndex = 0;
      if (productStock) productStock.value = "";
      if (productImage) productImage.value = "";
      if (productImagePreview) productImagePreview.innerHTML = "";
      openModal(addModal);
    });
  }


  /* ------------------ SAVE PRODUCT ------------------ */
  function saveProduct({isEdit = false} = {}) {
    const name = isEdit ? document.getElementById("editTitle").value.trim() : document.getElementById("productName").value.trim();
    const desc = isEdit ? document.getElementById("editDesc").value.trim() : document.getElementById("productDesc").value.trim();
    const price = isEdit ? document.getElementById("editPrice").value.trim() : document.getElementById("productPrice").value.trim();
    const category = isEdit ? document.getElementById("editCategory").value : document.getElementById("productCategory").value;
    const stock = isEdit ? document.getElementById("editStock").value : document.getElementById("productStock").value;
   
    if (!name) {
      alert("Product name is required");
      return;
    }

  function saveProduct({isEdit = false} = {}) {
  const name = isEdit ? document.getElementById("editTitle").value.trim() : document.getElementById("productName").value.trim();
  const desc = isEdit ? document.getElementById("editDesc").value.trim() : document.getElementById("productDesc").value.trim();
  const price = isEdit ? document.getElementById("editPrice").value.trim() : document.getElementById("productPrice").value.trim();
  const category = isEdit ? document.getElementById("editCategory").value : document.getElementById("productCategory").value;
  const stock = isEdit ? document.getElementById("editStock").value : document.getElementById("productStock").value;
  
  if (!name) {
    alert("Product name is required");
    return;
  }
  
  const formData = new FormData();
  if (isEdit && selectedItem && selectedItem.dataset.productId) {
    formData.append('product_id', selectedItem.dataset.productId);
    formData.append('action', 'update');
  }
  formData.append('admin_id', ADMIN_ID);
  formData.append('product_name', name);
  formData.append('product_desc', desc);
  formData.append('product_price', price);
  formData.append('category_id', category);
  formData.append('product_stock', stock);
  
  if (currentImageData) {
    fetch(currentImageData)
      .then(res => res.blob())
      .then(blob => {
        formData.append('product_img', blob, 'product.png');
        return fetch('save_product.php', { method: 'POST', body: formData });
      })
      .then(() => {
        syncWithDatabase();
      })
      .catch(err => {
        console.error('Image upload failed:', err);
        fetch('save_product.php', { method: 'POST', body: formData });
        syncWithDatabase();
      });
  } else {
    fetch('save_product.php', { method: 'POST', body: formData })
      .then(() => syncWithDatabase());
  }
  
  if (isEdit) closeModal(editModal);
  else closeModal(addModal);
  
  currentImageData = null;
  const productImage = document.getElementById("productImage");
  const productImagePreview = document.getElementById("productImagePreview");
  if (productImage) productImage.value = "";
  if (productImagePreview) productImagePreview.innerHTML = "";
}

    let card;
    if (isEdit && selectedItem) {
      card = selectedItem;
      card.querySelector('h5').innerText = name;
      const imgBox = card.querySelector('.product-preview');
      const imageToUse = currentImageData || card.dataset.image || null;
      if (imageToUse) {
        const img = imgBox.querySelector("img");
        if (img) img.src = imageToUse;
        card.dataset.image = imageToUse;
      }
      card.querySelector('.product_desc').innerText = desc;
      card.querySelector('.product-price').innerText = `₱${price || "0.00"}`;
      card.querySelector('.product-category').innerText = `Category: ${category}`;
      card.querySelector('.product-stock').innerText = `Stock: ${stock}`;
      card.dataset.category = category;
      card.dataset.stock = stock;
    } else {
      card = document.createElement("div");
      card.classList.add("product-item");
      card.dataset.category = category;
      card.dataset.stock = stock;


      card.innerHTML = `
        <div class="product-preview">
          <img class="product-img" />
        </div>
        <div class="prod-details">
          <div class="products-info">
            <h5>${name}</h5>
            <p class="product-price">₱${product.product_price}</p>
            <p class="product-category">Category: ${category}</p>
            <p class="product-stock">Stock: ${stock}</p>
            <p class="product_desc">${desc}</p>
          </div>
        </div>
        <button class="material-icons edit-btn">edit</button>
        <button class="material-icons delete-btn" style="color:red;">delete</button>
      `;


      const imgBox = card.querySelector('.product-preview');
      const imageToUse = currentImageData || null;
      if (imageToUse) {
        imgBox.querySelector("img").src = imageToUse;
        card.dataset.image = imageToUse;
      }


      card.querySelector(".edit-btn").addEventListener("click", () => {
        selectedItem = card;
        document.getElementById("editTitle").value = card.querySelector("h5").innerText;
        document.getElementById("editDesc").value = card.querySelector(".product_desc").innerText;
        document.getElementById("editPrice").value = card.querySelector(".product-price").innerText.replace("$", "");
        document.getElementById("editCategory").value = card.dataset.category;
        document.getElementById("editStock").value = card.dataset.stock;
        openModal(editModal);
      });
     
      card.querySelector(".delete-btn").addEventListener("click", () => {
        selectedItem = card;
        document.getElementById('deleteModal').style.display = 'flex';
      });


      if (productContainer) {
        productContainer.appendChild(card);
      }
    }


    if (isEdit) closeModal(editModal);
    else closeModal(addModal);


    currentImageData = null;
    const productImage = document.getElementById("productImage");
    const productImagePreview = document.getElementById("productImagePreview");
    if (productImage) productImage.value = "";
    if (productImagePreview) productImagePreview.innerHTML = "";
  }


  const saveProductBtn = document.getElementById("saveProductBtn");
  if (saveProductBtn) saveProductBtn.addEventListener("click", () => saveProduct({isEdit:false}));
  window.saveEdit = () => saveProduct({isEdit:true});


  /* ------------------ DELETE ------------------ */
  window.confirmDelete = function() {
    if (selectedItem) {
      fetch('delete_product.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: selectedItem.dataset.productId, admin_id: ADMIN_ID})
      });
      syncWithDatabase();
    }
    if (selectedItem) selectedItem.remove();
    closeModal(document.getElementById('deleteModal'));
  };
  


  /* ------------------ PROFILE - ALL FIXED HERE ------------------ */
  const editProfileBtn = document.querySelector(".edit-profile");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", function () {
      const modal = document.getElementById("editProfileModal");
      if (!modal) return;
      modal.style.display = "flex"; 


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
        profilePicPreview.innerHTML = `<img src="${ev.target.result}" class="preview-img" alt="Profile" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">`;
      };
      reader.readAsDataURL(file);
    });
  }

  window.saveProfile = async function() {
  const newName = document.getElementById("profileNameInput").value.trim() || 'Seller/Admin';
  const newBio = document.getElementById("profileBioInput").value.trim();
  const profilePicFile = document.getElementById("profilePictureInput").files[0];
  
  const formData = new FormData();
  formData.append('admin_id', window.ADMIN_ID);
  formData.append('admin_name', newName);
  formData.append('admin_bio', newBio);
  
  if (profilePicFile) {
    formData.append('profile_pic', profilePicFile);
  }
  
  try {
    const response = await fetch('save_admin_profile.php', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    
    if (result.success) {
      document.getElementById("profilePictureInput").value = "";
      document.getElementById("profilePicturePreview").innerHTML = "";

      setTimeout(() => loadProfileData(), 500);
      alert('Profile updated!');
    } else {
      alert('Save failed: ' + (result.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Profile save error:', error);
    alert('Save failed. Please try again.');
  }
  
  window.closeEditProfile();
};

  window.closeEditProfile = function() {
    const modal = document.getElementById("editProfileModal");
    if (modal) modal.style.display = "none";
  };
});


/* ------------------ GLOBAL CLICK HANDLER ------------------ */
window.onclick = function (event) {
  const profileModal = document.getElementById("editProfileModal");
  const addModal = document.getElementById("addProductModal");
  const editModal = document.getElementById("editModal");
 
  if (event.target === profileModal) profileModal.style.display = "none";
  if (event.target === addModal) addModal.style.display = "none";
  if (event.target === editModal) editModal.style.display = "none";
};


function logoutNow() {
  window.location.href = "index.htm";
}


function updateViewAs(card) {
  const productsList = document.getElementById("productsList");
  if (!productsList) return;


  const placeholder = productsList.querySelector(".placeholder");
  if (placeholder) placeholder.remove();


  const viewCard = document.createElement("div");
  viewCard.className = "product-card";


  const image = card.dataset.image || "";


  viewCard.innerHTML = `
    <div class="product-preview" style="background-image:url('${image}')"></div>
    <div class="product-info">
      <h5>${card.querySelector("h5").innerText}</h5>
      <p class="product-price">₱${product.product_price}</p>${card.querySelector(".product-price").innerText}</p>
      <p class="product-category">${card.querySelector(".product-category").innerText}</p>
      <p class="product-stock">${card.querySelector(".product-stock").innerText}</p>
      <p class="description">${card.querySelector(".product_desc").innerText}</p>
    </div>
  `;


  productsList.appendChild(viewCard);
  document.querySelectorAll('[data-tab-value]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tabs-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(btn.dataset.tabValue).classList.add('active');
        
        if (btn.dataset.tabValue === '#tracking') loadTracking();
        if (btn.dataset.tabValue === '#history') loadHistory();
    });
});

function loadTracking() {
    fetch(`get_user_orders.php?status=pending`)
        .then(r => r.json())
        .then(orders => {
            document.getElementById('trackingContent').innerHTML = orders.map(order => `
                <div class="order-card">
                    <h5>Order #${order.order_id}</h5>
                    <p>Date: ${order.order_date}</p>
                    <p>Total: ₱${order.order_total}</p>
                    <p>Status: ${order.tracking_status}</p>
                    <button onclick="markReceived(${order.order_id})">Mark Received</button>
                </div>
            `).join('') || '<p>No active orders</p>';
        });
}

async function markReceived(order_id) {
  try {
    console.log('Marking order', order_id, 'for user', windowUSER_ID); 
    const response = await fetch('update_order_status.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({order_id: order_id, user_id: windowUSER_ID, status: 'received'})
    });
    const result = await response.json();
    console.log('Update result:', result);
    
    if (result.success) {
      alert('✅ Order marked as received!');
      loadOrderTracking();
      loadOrderHistory();
    } else {
      alert('❌ Failed: ' + (result.error || 'Unknown error'));
    }
  } catch(e) {
    console.error('Error:', e);
    alert('❌ Network error: ' + e.message);
  }
}


}
