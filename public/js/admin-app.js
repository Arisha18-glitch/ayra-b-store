'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  if (sessionStorage.getItem('ayraAdminAuth') === 'true') {
    showPage('adminPage');
    await fetchLiveStoreData();
    initAdmin();
  } else {
    showPage('loginPage');
  }
});

// --- AUTH ---
async function chkPw() {
  const pw = document.getElementById('pwIn').value;
  try {
    const res = await fetch('/api/settings/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    }).then(r => r.json());
    
    if (res.success) {
      sessionStorage.setItem('ayraAdminAuth', 'true');
      showPage('adminPage');
      initAdmin();
    } else {
      document.getElementById('pwErr').style.display = 'block';
    }
  } catch (err) {
    document.getElementById('pwErr').textContent = 'Server error. Try again.';
    document.getElementById('pwErr').style.display = 'block';
  }
}

function logout() {
  sessionStorage.removeItem('ayraAdminAuth');
  showPage('loginPage');
  document.getElementById('pwIn').value = '';
  document.getElementById('pwErr').style.display = 'none';
}

function aTab(btn, id) {
  document.querySelectorAll('.a-nav').forEach(el => el.classList.remove('on'));
  document.querySelectorAll('.a-panel').forEach(el => el.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById(id).classList.add('on');
}

// --- ADMIN INIT ---
function initAdmin() {
  renderAdminProds();
  renderAdminCats();
  renderAdminSlides();
  renderCommunityAdmin();
  populateSettings();
}

function populateSettings() {
  document.getElementById('aPhone').value = waPhone;
  document.getElementById('aMsg').value = waMsg;
  document.getElementById('aOfferTxt').value = DATA.offerTxt;
  document.getElementById('aOfferClr').value = DATA.offerClr;
  
  var delEl = document.getElementById('aDelivery');
  if (delEl) delEl.value = deliveryCharge;

  if (socLinks) {
    document.getElementById('sInsta').value = socLinks.insta || '';
    document.getElementById('sFb').value = socLinks.fb || '';
    document.getElementById('sTt').value = socLinks.tiktok || '';
    document.getElementById('sSn').value = socLinks.snap || '';
  }
}

// --- API HELPERS ---
async function apiUpdateSetting(updates) {
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).then(r => r.json());
    if (res.success) notify('Saved successfully!', 'ok');
    else notify(res.error || 'Failed to save', 'err');
    return res;
  } catch(e) {
    notify('Network error', 'err');
  }
}

// --- SETTINGS SAVING ---
function savePhone() {
  apiUpdateSetting({ waPhone: document.getElementById('aPhone').value, waMsg: document.getElementById('aMsg').value });
}
function saveOffer() {
  apiUpdateSetting({ offerTxt: document.getElementById('aOfferTxt').value, offerClr: document.getElementById('aOfferClr').value });
}
function saveDelivery() {
  const val = parseInt(document.getElementById('aDelivery').value, 10);
  if (isNaN(val) || val < 0) { notify('Enter a valid delivery charge (0 or more)', 'err'); return; }
  deliveryCharge = val;
  apiUpdateSetting({ deliveryCharge: val }).then(() => { notify('Delivery charge saved: Rs. ' + val, 'ok'); });
}
function saveSoc() {
  apiUpdateSetting({
    socLinks: {
      insta: document.getElementById('sInsta').value,
      fb: document.getElementById('sFb').value,
      tiktok: document.getElementById('sTt').value,
      snap: document.getElementById('sSn').value
    }
  });
}
async function changePw() {
  const oldP = document.getElementById('oPw').value;
  const newP = document.getElementById('nPw1').value;
  const conf = document.getElementById('nPw2').value;
  if (newP !== conf) return notify('Passwords do not match', 'err');
  try {
    const res = await fetch('/api/settings/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword: oldP, newPassword: newP })
    }).then(r => r.json());
    if (res.success) {
      notify('Password changed!', 'ok');
      document.getElementById('oPw').value = '';
      document.getElementById('nPw1').value = '';
      document.getElementById('nPw2').value = '';
    } else {
      notify(res.error || 'Failed', 'err');
    }
  } catch (e) { notify('Network error', 'err'); }
}

// --- PRODUCTS ---
function renderAdminProds() {
  const g = document.getElementById('adminProdGrid');
  if (!g) return;
  g.innerHTML = '';
  products.forEach(p => {
    const d = document.createElement('div');
    d.className = 'a-pcard';
    d.innerHTML = `
      <img src="${p.imgs[0]}" alt="${p.name}">
      <div>
        <strong>${p.name}</strong><br>
        <small>${p.cat} | ${p.price}</small>
      </div>
      <div style="display:flex;gap:5px;align-items:center;margin-left:auto">
         <button onclick="openEditProduct('${p._id}')" class="a-save" style="padding:4px 8px;font-size:12px">Edit</button>
         <button onclick="deleteProduct('${p._id}')" class="a-save-outline" style="padding:4px 8px;font-size:12px;color:red;border-color:red">Del</button>
      </div>
    `;
    g.appendChild(d);
  });
}

let editingApiId = null;
function openAddProduct() {
  editingApiId = null;
  document.getElementById('modalTitle').textContent = 'Add New Product';
  document.getElementById('mName').value = '';
  document.getElementById('mPrice').value = '';
  document.getElementById('mOld').value = '';
  document.getElementById('mDesc').value = '';
  tempImgs = [];
  renderTempImgs();
  
  const mCat = document.getElementById('mCat');
  mCat.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  
  document.getElementById('editModal').classList.add('open');
}

function openEditProduct(id) {
  const p = products.find(x => x._id === id);
  if (!p) return;
  editingApiId = id;
  document.getElementById('modalTitle').textContent = 'Edit Product';
  document.getElementById('mName').value = p.name;
  document.getElementById('mPrice').value = p.price;
  document.getElementById('mOld').value = p.old || '';
  document.getElementById('mDesc').value = p.desc;
  document.getElementById('mBadge').value = p.badge;
  
  const mCat = document.getElementById('mCat');
  mCat.innerHTML = categories.map(c => `<option value="${c.name}" ${c.name === p.cat ? 'selected' : ''}>${c.name}</option>`).join('');
  
  tempImgs = [...p.imgs];
  renderTempImgs();
  document.getElementById('editModal').classList.add('open');
}

function closeModal() {
  document.getElementById('editModal').classList.remove('open');
}

function handleImgUpload(e) {
  const files = e.target.files;
  if (!files) return;
  for (let i=0; i<files.length; i++) {
    const r = new FileReader();
    r.onload = ev => { tempImgs.push(ev.target.result); renderTempImgs(); };
    r.readAsDataURL(files[i]);
  }
}
function renderTempImgs() {
  const c = document.getElementById('mImgPrev');
  if(!c)return;
  c.innerHTML = tempImgs.map((img, i) => `
    <div style="position:relative;width:60px;height:60px;border-radius:4px;overflow:hidden;border:1px solid #ddd">
      <img src="${img}" style="width:100%;height:100%;object-fit:cover">
      <div onclick="tempImgs.splice(${i},1);renderTempImgs()" style="position:absolute;top:0;right:0;background:red;color:white;cursor:pointer;width:16px;height:16px;text-align:center;line-height:14px;font-size:10px">&times;</div>
    </div>
  `).join('');
}

async function saveProduct() {
  const data = {
    name: document.getElementById('mName').value,
    cat: document.getElementById('mCat').value,
    price: document.getElementById('mPrice').value,
    old: document.getElementById('mOld').value,
    badge: document.getElementById('mBadge').value,
    desc: document.getElementById('mDesc').value,
    imgs: tempImgs
  };
  
  const url = editingApiId ? `/api/products/${editingApiId}` : '/api/products';
  const method = editingApiId ? 'PUT' : 'POST';
  
  try {
    const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r=>r.json());
    if (res.success) {
      notify('Product saved!', 'ok');
      closeModal();
      await fetchLiveStoreData(); // Refresh global state
      renderAdminProds();
    } else notify(res.error, 'err');
  } catch(e) { notify('Error saving', 'err'); }
}

async function deleteProduct(id) {
  if(!confirm('Delete this product?')) return;
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' }).then(r=>r.json());
    if (res.success) {
      notify('Deleted', 'ok');
      await fetchLiveStoreData();
      renderAdminProds();
    }
  } catch(e) { notify('Error deleting', 'err'); }
}

// --- CATEGORIES ---
function renderAdminCats() {
  const g = document.getElementById('aCatList');
  if (!g) return;
  g.innerHTML = categories.map(c => `
    <div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid var(--brd);align-items:center">
      <div style="display:flex;gap:10px;align-items:center">
        <img src="${catImgs[c.name] || 'https://placehold.co/50x50'}" style="width:40px;height:40px;object-fit:cover;border-radius:4px" onerror="this.src='https://placehold.co/50x50'">
        <strong>${c.name}</strong>
      </div>
      <div style="display:flex;gap:5px;">
        <button onclick="editCatImg('${c.name}')" class="a-save-outline" style="padding:4px 8px;font-size:12px">Edit Cover</button>
        <button onclick="deleteCat('${c._id}')" class="a-save-outline" style="color:red;border-color:red;padding:4px 8px;font-size:12px">Del</button>
      </div>
    </div>
  `).join('');
}

function editCatImg(catName) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = async (ev) => {
      const base64 = ev.target.result;
      catImgs[catName] = base64;
      await apiUpdateSetting({ catImgs: catImgs });
      renderAdminCats();
    };
    r.readAsDataURL(f);
  };
  input.click();
}
async function addCat() {
  const name = document.getElementById('nCatName').value;
  if (!name) return;
  try {
    const res = await fetch('/api/categories', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name}) }).then(r=>r.json());
    if (res.success) { notify('Category added', 'ok'); document.getElementById('nCatName').value=''; await fetchLiveStoreData(); renderAdminCats(); }
  } catch(e) { notify('Error', 'err'); }
}
async function deleteCat(id) {
  if(!confirm('Delete this category?')) return;
  try {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' }).then(r=>r.json());
    if (res.success) { notify('Deleted', 'ok'); await fetchLiveStoreData(); renderAdminCats(); }
  } catch(e) { notify('Error', 'err'); }
}

// --- SLIDESHOW ---
function renderAdminSlides() {
  const g = document.getElementById('slideAdminList');
  if (!g) return;
  g.innerHTML = slides.map((s, i) => `
    <div style="display:flex;gap:15px;padding:15px;border:1px solid var(--brd);margin-bottom:10px;border-radius:6px">
      <img src="${s.img}" style="width:100px;height:60px;object-fit:cover;border-radius:4px">
      <div style="flex:1"><strong>${s.title}</strong><br><small>${s.desc}</small></div>
      <button onclick="openSlideModal('${s._id}')" class="a-save-outline">Edit</button>
      <button onclick="deleteSlide('${s._id}')" style="color:red;background:none;border:none;cursor:pointer">Del</button>
    </div>
  `).join('');
}

let editingSlideApiId = null;
let tempSlideImg = '';

function openAddSlide() {
  editingSlideApiId = null;
  document.getElementById('sTitle').value = '';
  document.getElementById('sDesc').value = '';
  document.getElementById('sBtnTxt').value = 'Shop Now';
  
  const mCat = document.getElementById('sCatLink');
  mCat.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  
  tempSlideImg = '';
  document.getElementById('sCurImg').innerHTML = '';
  document.getElementById('slideModal').classList.add('open');
}

function openSlideModal(id) {
  const s = slides.find(x => x._id === id);
  if (!s) return;
  editingSlideApiId = id;
  document.getElementById('sTitle').value = s.title;
  document.getElementById('sDesc').value = s.desc;
  document.getElementById('sBtnTxt').value = s.btn;
  
  const mCat = document.getElementById('sCatLink');
  mCat.innerHTML = categories.map(c => `<option value="${c.name}" ${c.name === s.catKey ? 'selected' : ''}>${c.name}</option>`).join('');
  
  tempSlideImg = s.img;
  document.getElementById('sCurImg').innerHTML = `<img src="${s.img}" style="width:100%;height:100px;object-fit:cover">`;
  document.getElementById('slideModal').classList.add('open');
}
function closeSlideModal() { document.getElementById('slideModal').classList.remove('open'); }
function handleSlideImg(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => { tempSlideImg = ev.target.result; document.getElementById('sCurImg').innerHTML = `<img src="${tempSlideImg}" style="width:100%;height:100px;object-fit:cover">`; };
  r.readAsDataURL(f);
}
async function saveSlide() {
  const data = {
    title: document.getElementById('sTitle').value,
    desc: document.getElementById('sDesc').value,
    btn: document.getElementById('sBtnTxt').value,
    catKey: document.getElementById('sCatLink').value,
    img: tempSlideImg
  };
  
  const url = editingSlideApiId ? `/api/slides/${editingSlideApiId}` : '/api/slides';
  const method = editingSlideApiId ? 'PUT' : 'POST';
  
  try {
    const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r=>r.json());
    if (res.success) { notify('Slide saved!', 'ok'); closeSlideModal(); await fetchLiveStoreData(); renderAdminSlides(); }
  } catch(e) { notify('Error', 'err'); }
}
async function deleteSlide(id) {
  if(!confirm('Delete slide?')) return;
  try {
    const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' }).then(r=>r.json());
    if (res.success) { notify('Deleted', 'ok'); await fetchLiveStoreData(); renderAdminSlides(); }
  } catch(e) { notify('Error', 'err'); }
}

function exportBackup() { notify('Backup functionality uses database dumps in this version.', 'info'); }
function importBackup() { notify('Restore functionality uses database dumps in this version.', 'info'); }

// --- COMMUNITY PHOTOS ---
function renderCommunityAdmin() {
  const grid = document.getElementById('communityPhotoGrid');
  if (!grid) return;
  const imgs = communityImgs && communityImgs.length > 0 ? communityImgs : [];
  if (imgs.length === 0) {
    grid.innerHTML = '<p style="color:var(--mut);font-size:13px">No photos added yet. Click "Add Photo" to upload your first community photo.</p>';
    return;
  }
  grid.innerHTML = imgs.map((src, i) => `
    <div style="position:relative;border-radius:8px;overflow:hidden">
      <img src="${src}" style="width:100%;aspect-ratio:1/1;object-fit:cover" onerror="this.src='https://placehold.co/150x150'">
      <button onclick="deleteCommunityPhoto(${i})" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.6);color:#fff;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-size:14px;line-height:24px">×</button>
    </div>
  `).join('');
}

function addCommunityPhoto() {
  if (communityImgs && communityImgs.length >= 5) { notify('Max 5 photos allowed. Delete one first.', 'err'); return; }
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = async (ev) => {
      if (!communityImgs) communityImgs = [];
      communityImgs.push(ev.target.result);
      await apiUpdateSetting({ communityImgs: communityImgs });
      renderCommunityAdmin();
    };
    r.readAsDataURL(f);
  };
  input.click();
}

async function deleteCommunityPhoto(index) {
  if (!confirm('Remove this photo?')) return;
  communityImgs.splice(index, 1);
  await apiUpdateSetting({ communityImgs: communityImgs });
  renderCommunityAdmin();
  notify('Photo removed', 'ok');
}
