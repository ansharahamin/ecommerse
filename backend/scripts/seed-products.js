import 'dotenv/config'
import mongoose from 'mongoose'
import productModel from '../src/models/products.model.js'
import userModel from '../src/models/users.models.js'

const demoProducts = [
  {
    name: 'Stoneware Morning Mug',
    des: 'A tactile, everyday mug with a soft glaze and an easy-to-hold shape.',
    category: 'Home',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Linen Cushion Cover',
    des: 'Relaxed natural linen that brings a little softness to your favorite corner.',
    category: 'Home',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Sculpted Candle Holder',
    des: 'A simple sculptural accent for slow evenings and dinner with friends.',
    category: 'Lifestyle',
    price: 2450,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Everyday Serving Tray',
    des: 'A warm-toned wooden tray for morning tea, little rituals, and easy hosting.',
    category: 'Home',
    price: 3900,
    image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Woven Storage Basket',
    des: 'Handwoven texture that keeps everyday essentials tidy and close at hand.',
    category: 'Home',
    price: 4600,
    image: 'https://images.unsplash.com/photo-1593085260707-5377ba37f868?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Soft Glow Table Lamp',
    des: 'A gentle glow and considered silhouette for a calmer corner at home.',
    category: 'Home',
    price: 7800,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Quiet Form Ceramic Vase',
    des: 'An understated ceramic shape, lovely with fresh stems or on its own.',
    category: 'Home',
    price: 2850,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Cloud Soft Throw',
    des: 'A cozy layer for a reading chair, a slow morning, or an extra-comfy sofa.',
    category: 'Lifestyle',
    price: 6950,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
  },
]

const legacyPrices = [
  { name: 'flags', price: 2200, category: 'Accessories' },
  { name: 'card', price: 650, category: 'Accessories' },
  { name: 'random', price: 1400, category: 'Accessories' },
]

async function seedProducts() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be configured before seeding products.')
  }

  await mongoose.connect(process.env.MONGO_URI)
  const admin = await userModel.findOne({ role: 'admin' }).select('_id')
  if (!admin) {
    throw new Error('Create an admin account before seeding the demo products.')
  }

  for (const product of demoProducts) {
    const { category, ...productData } = product
    await productModel.updateOne(
      { name: product.name, admin: admin._id },
      { $set: { category }, $setOnInsert: { ...productData, currency: 'PKR', admin: admin._id } },
      { upsert: true, runValidators: true },
    )
  }

  for (const product of legacyPrices) {
    await productModel.updateMany(
      { name: product.name },
      { $set: { category: product.category } },
      { runValidators: true },
    )
    await productModel.updateMany(
      {
        name: product.name,
        $or: [{ price: { $exists: false } }, { price: null }],
      },
      { $set: { price: product.price, currency: 'PKR' } },
      { runValidators: true },
    )
  }

  console.log(`Seeded ${demoProducts.length} demo products and priced matching legacy products.`)
}

seedProducts()
  .catch((error) => {
    console.error('Product seeding failed:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
