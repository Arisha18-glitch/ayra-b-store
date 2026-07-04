const mongoose = require('mongoose');
const Slide = require('./models/Slide');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Slide.deleteMany({});
  await Slide.insertMany([
    {
      title: 'Lawn Suits Collection',
      desc: 'Discover our finest Pakistani lawn suits — crafted for elegance and comfort.',
      btn: 'Shop Lawn',
      catKey: 'Lawn Suits',
      tag: 'Summer 2025',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=90'
    },
    {
      title: 'Chiffon & Silk',
      desc: 'Feel the luxury of premium chiffon and silk suits.',
      btn: 'Shop Chiffon',
      catKey: 'Chiffon & Silk',
      tag: 'Premium Fabric',
      img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=1400&q=90'
    },
    {
      title: 'Embroidered Masterpieces',
      desc: 'Every stitch tells a story. Exclusive embroidered collections.',
      btn: 'Shop Embroidered',
      catKey: 'Embroidered',
      tag: 'Hand Crafted',
      img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1400&q=90'
    },
    {
      title: 'Formal & Party Wear',
      desc: 'From weddings to grand events — our party wear ensures you are elegant.',
      btn: 'Shop Party Wear',
      catKey: 'Formal & Party',
      tag: 'Wedding Edition',
      img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1400&q=90'
    }
  ]);
  console.log('Slides added successfully.');
  process.exit(0);
}
run().catch(err => {
  console.error(err);
  process.exit(1);
});
