'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Slide = require('./models/Slide');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  // Clear existing products and categories
  await Product.deleteMany({});
  await Category.deleteMany({});
  
  console.log('Cleared existing data. Seeding new data...');

  // Seed Categories
  await Category.insertMany([
    { name: 'Lawn Suits', count: 3 },
    { name: 'Chiffon & Silk', count: 2 },
    { name: 'Embroidered', count: 3 },
    { name: 'Formal & Party', count: 2 }
  ]);

  // Seed exactly 10 beautiful products divided across the categories
  await Product.insertMany([
    // Lawn Suits
    { name:'Pink Floral Lawn 3-Piece', cat:'Lawn Suits', imgs:['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=90'], badge:'sale', price:'Rs. 2,800', old:'Rs. 3,500', rating:4.8, reviews:32, desc:'A stunning pink floral lawn 3-piece suit.', features:['Premium Cotton Lawn','Digital Floral Print','Includes Dupatta','Unstitched 3-Piece'] },
    { name:'Sage Green Digital Lawn', cat:'Lawn Suits', imgs:['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&q=90'], badge:'new', price:'Rs. 2,200', old:'Rs. 2,800', rating:4.5, reviews:41, desc:'Fresh sage green digital print lawn \u2014 modern and trendy.', features:['Soft Cotton Lawn','Digital Print','Chiffon Dupatta','Daily Wear'] },
    { name:'Crimson Red Summer Lawn', cat:'Lawn Suits', imgs:['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700&q=90'], badge:'sale', price:'Rs. 2,500', old:'Rs. 3,000', rating:4.6, reviews:12, desc:'Vibrant crimson red lawn suit for summer days.', features:['Lightweight Lawn','Vibrant Print','Soft Finish','Unstitched'] },
    
    // Chiffon & Silk
    { name:'Ivory Silk Dupatta Set', cat:'Chiffon & Silk', imgs:['https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=700&q=90'], badge:'new', price:'Rs. 3,800', old:'', rating:4.6, reviews:14, desc:'Timeless ivory silk collection.', features:['Pure Silk Fabric','Printed Dupatta','Light & Breathable','Versatile Style'] },
    { name:'Lavender Chiffon Drape', cat:'Chiffon & Silk', imgs:['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=700&q=90'], badge:'sale', price:'Rs. 4,000', old:'Rs. 4,500', rating:4.7, reviews:22, desc:'Elegant lavender chiffon perfect for evenings.', features:['Premium Chiffon','Pearl Embellishments','Wedding Perfect','3-Piece Set'] },
    
    // Embroidered
    { name:'Royal Blue Embroidered Suit', cat:'Embroidered', imgs:['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=700&q=90'], badge:'new', price:'Rs. 5,500', old:'', rating:4.9, reviews:18, desc:'Stunning royal blue embroidered suit.', features:['Heavy Thread Embroidery','Chiffon Dupatta','Embroidered Trouser','Hand Finished'] },
    { name:'Emerald Gold Zari Suit', cat:'Embroidered', imgs:['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=90'], badge:'new', price:'Rs. 6,200', old:'', rating:5.0, reviews:8, desc:'Rich emerald green with stunning gold zari work.', features:['Gold Zari Embroidery','Festive Wear','Premium Net','3-Piece'] },
    { name:'Rose Pink Threadwork', cat:'Embroidered', imgs:['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700&q=90'], badge:'sale', price:'Rs. 4,800', old:'Rs. 5,200', rating:4.7, reviews:15, desc:'Delicate rose pink thread embroidery.', features:['Fine Threadwork','Organza Dupatta','Elegant Design'] },
    
    // Formal & Party
    { name:'Mauve Party Chiffon', cat:'Formal & Party', imgs:['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&q=90'], badge:'sale', price:'Rs. 4,200', old:'Rs. 5,000', rating:4.7, reviews:27, desc:'Gorgeous mauve chiffon party suit.', features:['Premium Chiffon','Pearl Embellishments','Wedding Perfect','3-Piece Set'] },
    { name:'Black Velvet Formal Gala', cat:'Formal & Party', imgs:['https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=700&q=90'], badge:'new', price:'Rs. 7,500', old:'', rating:4.9, reviews:5, desc:'The ultimate black velvet suit for formal galas.', features:['Pure Velvet','Diamante Detailing','Winter Formal','Exquisite Fit'] }
  ]);

  console.log('Successfully seeded exactly 10 beautiful products.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
