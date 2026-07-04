'use strict';

function exportBackup() {
  var snap = {
    _backupType: 'AyraB_Store_Backup',
    _exportedAt: new Date().toISOString(),
    adminPw: adminPw,
    waPhone: waPhone,
    waMsg: waMsg,
    socLinks: socLinks,
    offerTxt: document.getElementById('offerTxt').innerHTML,
    offerClr: document.querySelector('.offer-bar').style.background || DATA.offerClr,
    categories: categories,
    slides: slides,
    products: products,
    allRevs: allRevs,
    catImgs: catImgs
  };
  var blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  var dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = 'ayra-b-backup-' + dateStr + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  notify('Backup file downloaded!', 'ok');
}

function importBackup(e) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (ev) {
    try {
      var parsed = JSON.parse(ev.target.result);
      if (!parsed || !parsed.products || !parsed.categories) {
        notify('Invalid backup file format!', 'err');
        return;
      }

      adminPw = parsed.adminPw || adminPw;
      waPhone = parsed.waPhone || waPhone;
      waMsg = parsed.waMsg || waMsg;
      socLinks = parsed.socLinks || socLinks;
      categories = parsed.categories || categories;
      slides = parsed.slides || slides;
      products = parsed.products || products;
      allRevs = parsed.allRevs || allRevs;
      catImgs = parsed.catImgs || catImgs;

      buildSlider();
      renderProds();
      renderCats();
      renderAdminProds();
      renderAdminCats();
      renderSlideAdmin();

      if (parsed.waPhone) {
        document.getElementById('ctaPhone').textContent = '+' + parsed.waPhone;
        document.getElementById('fPhone').textContent = '+' + parsed.waPhone;
      }
      if (parsed.offerTxt) document.getElementById('offerTxt').innerHTML = parsed.offerTxt;
      if (parsed.offerClr) document.querySelector('.offer-bar').style.background = parsed.offerClr;

      loadAdminFormValues();
      persist();
      notify('Backup restored successfully!', 'ok');
    } catch (err) {
      notify('Could not read backup file. Please check the file.', 'err');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}
