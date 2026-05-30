import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import { User, Donor, Request } from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_blood_life_key_123_456_789';

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

// Serve static files from React build directory
const distPath = path.resolve(__dirname, '../bloodlife/dist');
app.use(express.static(distPath));

// Token Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// Admin Guard Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin role required' });
  }
  next();
};

// --- AUTHENTICATION ROUTES ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, age, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in MongoDB
    const user = await User.create({
      name,
      age: age ? parseInt(age) : null,
      email,
      phone: phone || null,
      password: hashedPassword,
      role: 'user'
    });

    const userProfile = {
      id: user.id,
      name: user.name,
      age: user.age,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    const token = jwt.sign(userProfile, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, token, user: userProfile });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error during signup' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Retrieve user from MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userProfile = {
      id: user.id,
      name: user.name,
      age: user.age,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    const token = jwt.sign(userProfile, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user: userProfile });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Me (Current User)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ message: 'Internal server error retrieving user profile' });
  }
});


// --- DONOR ROUTES ---

// Get all donors
app.get('/api/donors', authenticateToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    let donors;
    if (search) {
      donors = await Donor.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { bloodGroup: { $regex: search, $options: 'i' } }
        ]
      });
    } else {
      donors = await Donor.find();
    }
    res.json(donors);
  } catch (error) {
    console.error('Get donors error:', error);
    res.status(500).json({ message: 'Error retrieving donors list' });
  }
});

// Add a donor (Admin only)
app.post('/api/donors', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, age, email, phone, bloodGroup, ailments } = req.body;

    if (!name || !email || !phone || !bloodGroup) {
      return res.status(400).json({ message: 'Name, email, phone, and blood group are required' });
    }

    const newDonor = await Donor.create({
      name,
      age: age ? parseInt(age) : null,
      email,
      phone,
      bloodGroup,
      ailments: ailments || 'None'
    });

    res.status(201).json(newDonor);
  } catch (error) {
    console.error('Add donor error:', error);
    res.status(500).json({ message: 'Error adding donor' });
  }
});

// Update donor (Admin only)
app.put('/api/donors/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, email, phone, bloodGroup, ailments } = req.body;

    if (!name || !email || !phone || !bloodGroup) {
      return res.status(400).json({ message: 'Name, email, phone, and blood group are required' });
    }

    const updatedDonor = await Donor.findByIdAndUpdate(
      id,
      { name, age: age ? parseInt(age) : null, email, phone, bloodGroup, ailments },
      { new: true }
    );

    if (!updatedDonor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(updatedDonor);
  } catch (error) {
    console.error('Update donor error:', error);
    res.status(500).json({ message: 'Error updating donor information' });
  }
});

// Delete donor (Admin only)
app.delete('/api/donors/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDonor = await Donor.findByIdAndDelete(id);
    
    if (!deletedDonor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json({ message: 'Donor deleted successfully', id });
  } catch (error) {
    console.error('Delete donor error:', error);
    res.status(500).json({ message: 'Error deleting donor' });
  }
});


// --- REQUEST ROUTES ---

// Get all requests (Admin gets all, standard users get only theirs)
app.get('/api/requests', authenticateToken, async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'admin') {
      requests = await Request.find();
    } else {
      requests = await Request.find({ userId: req.user.email });
    }
    res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Error retrieving blood requests' });
  }
});

// Create a new request (Donor or Receiver)
app.post('/api/requests', authenticateToken, async (req, res) => {
  try {
    const { name, age, email, phone, bloodType, category, ailments, units } = req.body;

    if (!name || !email || !phone || !bloodType || !category) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const timestamp = new Date().toISOString();
    
    const newRequest = await Request.create({
      name,
      age: age ? parseInt(age) : null,
      email,
      phone,
      bloodType,
      category,
      ailments: ailments || 'None',
      units: units ? parseInt(units) : 1,
      status: 'pending',
      timestamp,
      userId: req.user.email
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Error creating blood request' });
  }
});

// Update request status (Admin only)
app.patch('/api/requests/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Error updating request status' });
  }
});

// Wildcard Fallback Route for Single-Page Application (React Router)
app.get('*', (req, res, next) => {
  // Pass API requests to let them resolve normally or return 404
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`BloodLife backend API running at http://localhost:${PORT}`);
});

