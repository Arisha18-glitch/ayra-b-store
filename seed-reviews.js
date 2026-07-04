'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');
const Review   = require('./models/Review');

const reviewPool = [
  { name: 'Sana K.',     rating: 5, text: 'Absolutely gorgeous quality! The fabric is so soft and the embroidery is stunning. I got so many compliments at the wedding.' },
  { name: 'Maryam A.',   rating: 5, text: 'Ordered for Eid and it arrived beautifully. The colours are even more vibrant in person. Will definitely order again!' },
  { name: 'Fatima R.',   rating: 4, text: 'Very nice suit, the lawn quality is premium. Took a few days to arrive but totally worth the wait. Packaging was also lovely.' },
  { name: 'Hira M.',     rating: 5, text: 'Best purchase I have made online! The stitching is impeccable and the size guide was very accurate. Highly recommended.' },
  { name: 'Nadia S.',    rating: 4, text: 'Beautiful collection. The chiffon dupatta is so elegant. I styled it for a dinner party and everyone wanted to know where I got it from.' },
  { name: 'Zara T.',     rating: 5, text: 'Such premium quality at an amazing price. I have shopped from many brands but Ayra B. is genuinely top notch. Keep it up!' },
  { name: 'Ayesha B.',   rating: 5, text: 'The colours are exactly as shown in the pictures which is rare for online shopping. Fast delivery and great customer service.' },
  { name: 'Rida F.',     rating: 4, text: 'Very satisfied with my purchase. The fabric feels luxurious and the design is very unique. Would love to see more winter designs.' },
  { name: 'Amna Q.',     rating: 5, text: 'I ordered the embroidered suit and it is simply breathtaking. Perfect for formal events. Will be recommending to all my friends.' },
  { name: 'Sadaf J.',    rating: 5, text: 'Fantastic experience from start to finish. The suit looks exactly like the photos and the quality exceeded my expectations.' },
  { name: 'Lubna H.',    rating: 4, text: 'Love this brand! The unstitched fabric is premium quality. Got it stitched locally and it looks exactly like a designer boutique piece.' },
  { name: 'Mahnoor I.',  rating: 5, text: 'WhatsApp ordering was so easy and the team was super helpful with sizing. The suit arrived quickly and safely packed.' },
];

async function seedReviews() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to database...');

  await Review.deleteMany({});
  const products = await Product.find({});

  if (products.length === 0) {
    console.log('No products found. Run seed.js first!');
    process.exit(1);
  }

  for (const product of products) {
    // Give each product 2-4 random reviews
    const count = 2 + Math.floor(Math.random() * 3);
    const shuffled = [...reviewPool].sort(() => 0.5 - Math.random()).slice(0, count);

    const reviewDocs = shuffled.map(r => ({
      productId: product._id,
      name: r.name,
      rating: r.rating,
      text: r.text,
    }));

    await Review.insertMany(reviewDocs);

    // Calculate and update product rating
    const total = shuffled.reduce((s, r) => s + r.rating, 0);
    const avg   = (total / shuffled.length).toFixed(1);
    await Product.findByIdAndUpdate(product._id, {
      rating: Number(avg),
      reviews: shuffled.length
    });

    console.log(`  ✓ Seeded ${shuffled.length} reviews for "${product.name}" (avg: ${avg}★)`);
  }

  console.log('\n✅ All reviews seeded successfully!');
  process.exit(0);
}

seedReviews().catch(err => { console.error(err); process.exit(1); });
