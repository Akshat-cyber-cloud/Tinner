const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase JSON payload limit for photo uploads
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase URL encoded limit
app.use(express.static('.'));

// In-memory storage for demo (use database in production)
const users = [];
const sessions = [];

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Utility functions
function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

function findUserByEmail(email) {
    return users.find(user => user.email === email);
}

function findUserById(id) {
    return users.find(user => user.id === id);
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'CampusConnect API is running' });
});

// Sign up
app.post('/api/auth/signup', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            age,
            gender,
            university,
            major,
            year,
            bio,
            location,
            interests,
            photos
        } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        if (!age || age < 18 || age > 30) {
            return res.status(400).json({ message: 'Age must be between 18 and 30' });
        }

        if (!gender) {
            return res.status(400).json({ message: 'Gender is required' });
        }

        if (!university) {
            return res.status(400).json({ message: 'University is required' });
        }

        if (!major) {
            return res.status(400).json({ message: 'Major is required' });
        }

        if (!year) {
            return res.status(400).json({ message: 'Academic year is required' });
        }

        if (!bio) {
            return res.status(400).json({ message: 'Bio is required' });
        }

        if (!location) {
            return res.status(400).json({ message: 'Location is required' });
        }

        // Check if user already exists
        if (findUserByEmail(email)) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userId = Date.now().toString();
        const newUser = {
            id: userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age: parseInt(age),
            gender,
            university,
            major,
            year,
            bio,
            location,
            interests: interests || [],
            photos: photos || [],
            profileComplete: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        users.push(newUser);

        // Generate token
        const token = generateToken(userId);

        // Remove password from response
        const { password: _, ...userResponse } = newUser;

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Signup error:', error);
        console.error('Request body:', req.body);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Sign in
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update last login
        user.lastLogin = new Date().toISOString();

        // Generate token
        const token = generateToken(user.id);

        // Remove password from response
        const { password: _, ...userResponse } = user;

        res.json({
            message: 'Sign in successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Forgot password
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = findUserByEmail(email);
        if (!user) {
            // Don't reveal if email exists or not
            return res.json({ message: 'If the email exists, a reset link has been sent' });
        }

        // In a real app, you would:
        // 1. Generate a reset token
        // 2. Store it in database with expiration
        // 3. Send email with reset link

        res.json({ message: 'If the email exists, a reset link has been sent' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user profile
app.get('/api/user/profile', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = findUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove password from response
        const { password: _, ...userResponse } = user;

        res.json({ user: userResponse });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user profile
app.put('/api/user/profile', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = findUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user data
        const allowedFields = ['firstName', 'lastName', 'age', 'gender', 'university', 'major', 'year', 'bio', 'location', 'interests'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        user.updatedAt = new Date().toISOString();

        // Remove password from response
        const { password: _, ...userResponse } = user;

        res.json({
            message: 'Profile updated successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Upload photos
app.post('/api/user/photos', upload.array('photos', 6), (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = findUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No photos uploaded' });
        }

        // Update user photos
        const photoUrls = req.files.map(file => `/uploads/${file.filename}`);
        user.photos = photoUrls;
        user.updatedAt = new Date().toISOString();

        res.json({
            message: 'Photos uploaded successfully',
            photos: photoUrls
        });

    } catch (error) {
        console.error('Upload photos error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get potential matches
app.get('/api/matches', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const currentUser = findUserById(decoded.userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get potential matches (exclude current user and filter by gender preference)
        const matches = users
            .filter(user => {
                // Exclude current user
                if (user.id === currentUser.id) return false;
                
                // Gender-based matching: males see females, females see males
                if (currentUser.gender === 'male' && user.gender !== 'female') return false;
                if (currentUser.gender === 'female' && user.gender !== 'male') return false;
                
                return true;
            })
            .map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

        res.json({ matches });

    } catch (error) {
        console.error('Get matches error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Swipe action
app.post('/api/swipe', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const { targetUserId, action } = req.body; // action: 'like', 'dislike', 'superlike'

        if (!targetUserId || !action) {
            return res.status(400).json({ message: 'Target user ID and action are required' });
        }

        const targetUser = findUserById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }

        // In a real app, you would store swipe data in database
        // For demo, we'll just return success

        res.json({
            message: 'Swipe recorded successfully',
            action,
            targetUser: {
                id: targetUser.id,
                firstName: targetUser.firstName,
                lastName: targetUser.lastName,
                age: targetUser.age,
                photos: targetUser.photos
            }
        });

    } catch (error) {
        console.error('Swipe error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Serve the main application
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
    }
    
    res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 CampusConnect server running on port ${PORT}`);
    console.log(`🌐 Main App: http://localhost:${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 API endpoints:`);
    console.log(`   POST /api/auth/signup - Create new account`);
    console.log(`   POST /api/auth/signin - Sign in`);
    console.log(`   POST /api/auth/forgot-password - Reset password`);
    console.log(`   GET  /api/user/profile - Get user profile`);
    console.log(`   PUT  /api/user/profile - Update user profile`);
    console.log(`   POST /api/user/photos - Upload photos`);
    console.log(`   GET  /api/matches - Get potential matches`);
    console.log(`   POST /api/swipe - Record swipe action`);
});

module.exports = app;
