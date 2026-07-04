import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import User from '../models/User.model.js';
import Department from '../models/Department.model.js';
import Category from '../models/Category.model.js';
import Complaint from '../models/Complaint.model.js';
import Message from '../models/Message.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Department.deleteMany();
    await Category.deleteMany();
    await Complaint.deleteMany();
    await Message.deleteMany();

    console.log('Creating departments...');
    const itDept = await Department.create({
      name: 'Information Technology',
      code: 'IT',
      description: 'Handles software, hardware, and network issues.',
    });

    const facilityDept = await Department.create({
      name: 'Facilities Management',
      code: 'FM',
      description: 'Handles building maintenance, cleaning, and repairs.',
    });

    const academicDept = await Department.create({
      name: 'Academic Affairs',
      code: 'ACAD',
      description: 'Handles course registration, grades, and academic disputes.',
    });

    console.log('Creating categories...');
    await Category.create([
      { name: 'WiFi & Network', department: itDept._id },
      { name: 'Hardware Repair', department: itDept._id },
      { name: 'Plumbing Issue', department: facilityDept._id },
      { name: 'Cleanliness', department: facilityDept._id },
      { name: 'Grade Dispute', department: academicDept._id },
      { name: 'Timetable Clash', department: academicDept._id },
    ]);

    console.log('Creating admin users...');
    await User.create([
      {
        name: 'Super Admin',
        email: 'superadmin@university.edu',
        password: 'password123',
        role: 'superadmin',
      },
      {
        name: 'IT Admin',
        email: 'itadmin@university.edu',
        password: 'password123',
        role: 'admin',
        department: itDept._id,
      },
      {
        name: 'Facilities Admin',
        email: 'fmadmin@university.edu',
        password: 'password123',
        role: 'admin',
        department: facilityDept._id,
      },
    ]);

    console.log('Creating student users...');
    await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice.student@university.edu',
        password: 'password123',
        role: 'student',
        studentId: '2023CS001',
      },
      {
        name: 'Bob Smith',
        email: 'bob.student@university.edu',
        password: 'password123',
        role: 'student',
        studentId: '2023ME002',
      },
    ]);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  await seedData();
};

run();
