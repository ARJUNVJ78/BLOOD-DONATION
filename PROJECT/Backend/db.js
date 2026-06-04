import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Donor } from './models.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI is not defined in the environment variables!');
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB Atlas.');
    await seedDatabase();
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error.message);
    process.exit(1);
  }
};

async function seedDatabase() {
  try {
    // Seed default admin if not exists
    const adminEmail = 'admin@bloodbank.com';
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      await User.create({
        name: 'System Admin',
        age: 35,
        email: adminEmail,
        phone: '999-999-9999',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Default admin seeded successfully: admin@bloodbank.com / adminpassword');
    }

    // Seed initial donors if empty
    const donorCount = await Donor.countDocuments();
    if (donorCount === 0) {
      const initialDonors = [
        { name: 'Alice Smith', age: 28, email: 'alice@example.com', phone: '123-456-7890', bloodGroup: 'O+', ailments: 'None' },
        { name: 'Bob Johnson', age: 34, email: 'bob@example.com', phone: '234-567-8901', bloodGroup: 'A-', ailments: 'None' },
        { name: 'Charlie Brown', age: 22, email: 'charlie@example.com', phone: '345-678-9012', bloodGroup: 'B+', ailments: 'Seasonal Allergies' }
      ];
      await Donor.insertMany(initialDonors);
      console.log('Initial donors seeded successfully into MongoDB Atlas.');
    }
  } catch (error) {
    console.error('Error seeding MongoDB database:', error);
  }
}
