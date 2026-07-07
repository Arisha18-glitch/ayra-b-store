const fs = require('fs');

let code = fs.readFileSync('public/js/app.js', 'utf8');

const fix = `async function fetchLiveStoreData() {
  try {
    const [pRes, cRes, sRes, setRes] = await Promise.all([
      fetch('/api/products').then(r => r.json()).catch(() => null),
      fetch('/api/categories').then(r => r.json()).catch(() => null),
      fetch('/api/slides').then(r => r.json()).catch(() => null),
      fetch('/api/settings').then(r => r.json()).catch(() => null)
    ]);

    if (pRes && pRes.success) products = pRes.data.map(p => { p.id = p._id || p.id; return p; });
    if (cRes && cRes.success) categories = cRes.data;
    if (sRes && sRes.success) slides = sRes.data;
    if (setRes && setRes.success && setRes.data) {
      var set = setRes.data;
      waPhone = set.waPhone !== undefined ? set.waPhone : waPhone;
      waMsg = set.waMsg !== undefined ? set.waMsg : waMsg;
      socLinks = set.socLinks || socLinks;
      DATA.offerTxt = set.offerTxt !== undefined ? set.offerTxt : DATA.offerTxt;
      DATA.offerClr = set.offerClr !== undefined ? set.offerClr : DATA.offerClr;
      if (set.catImgs) catImgs = new Map(Object.entries(set.catImgs));
      if (set.deliveryCharge !== undefined) deliveryCharge = set.deliveryCharge;
    }
  } catch (err) {
    console.warn('Failed to load live data, using fallback.', err);
  }
}

async function init() {
  await fetchLiveStoreData();

  buildSlider();
  renderProds();
  renderCats();
  updCartBadge();`;

code = code.replace(/async function fetchLiveStoreData\(\) \{[\s\S]*?var fPhone = document.getElementById\('fPhone'\);/, fix + '\n\n  // Set phone numbers\n  var ctaPhone = document.getElementById(\'ctaPhone\');\n  if (ctaPhone) ctaPhone.textContent = \'+\' + waPhone.replace(/^\\+/, \'\');\n  var fPhone = document.getElementById(\'fPhone\');');

fs.writeFileSync('public/js/app.js', code);
console.log('Fixed app.js');
