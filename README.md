# CampusConnect - College Dating App

A modern, responsive college dating application with 3D animations and full authentication system.

## 🚀 Features

### Frontend
- **Modern 3D Design** - Beautiful animations and interactive elements
- **Responsive Layout** - Works perfectly on all devices
- **Multi-step Signup** - Complete profile creation with photos and interests
- **Authentication System** - Sign up, sign in, and session management
- **Interactive Swipe Interface** - Drag and drop card interactions
- **Real-time Validation** - Form validation with user feedback

### Backend
- **RESTful API** - Complete authentication and user management
- **JWT Authentication** - Secure token-based authentication
- **File Upload** - Photo upload with validation
- **Password Security** - Bcrypt password hashing
- **CORS Support** - Cross-origin resource sharing enabled

## 📋 Required Profile Fields

### Basic Information
- First Name & Last Name
- University Email (with validation)
- Password (minimum 8 characters)
- Age (18-30 years)
- Gender
- University/College
- Major/Field of Study
- Academic Year
- Bio (up to 500 characters)
- Location (City, State)

### Photos
- Minimum 3 photos required
- Maximum 6 photos
- File size limit: 5MB per photo
- Supported formats: JPG, PNG, GIF

### Interests
- Hobbies & Activities (Photography, Music, Art, Gaming, etc.)
- Sports & Fitness (Gym, Running, Yoga, Basketball, etc.)
- Lifestyle (Coffee, Travel, Movies, Netflix, etc.)
- Academic & Career (Research, Entrepreneurship, Study Groups, etc.)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project files**

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open the application**
   - Navigate to `http://localhost:3000` in your browser
   - The API will be available at `http://localhost:3000/api`

### File Structure
```
CampusConnect/
├── index.html          # Main landing page
├── signup.html         # Multi-step signup page
├── signin.html         # Sign in page
├── style.css           # Main styles with 3D animations
├── auth.css            # Authentication page styles
├── script.js           # Main page JavaScript
├── auth.js             # Authentication JavaScript
├── server.js           # Backend API server
├── package.json        # Node.js dependencies
└── README.md           # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/forgot-password` - Reset password

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/photos` - Upload photos

### Matching
- `GET /api/matches` - Get potential matches
- `POST /api/swipe` - Record swipe action

### Health Check
- `GET /api/health` - API status check

## 🎨 Design Features

### 3D Animations
- Floating particles in background
- 3D card rotations and transforms
- Smooth scroll animations
- Interactive hover effects
- Parallax scrolling

### User Experience
- Multi-step form with progress indicator
- Real-time form validation
- Photo upload with preview
- Interest selection with visual feedback
- Profile preview before submission

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Adaptive layouts

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- File upload validation
- CORS protection
- Input sanitization
- Session management

## 🚀 Getting Started

1. **Start the server** - Run `npm start` in the project directory
2. **Open the app** - Go to `http://localhost:3000`
3. **Create account** - Click "Get Started" to begin signup
4. **Complete profile** - Fill in all required information
5. **Upload photos** - Add at least 3 photos
6. **Select interests** - Choose your hobbies and preferences
7. **Review & submit** - Check your profile and create account

## 📱 Demo Features

- **Interactive Swipe Cards** - Drag cards left/right/up
- **Auto-swipe Demo** - Automatic card swiping for demonstration
- **3D Phone Mockups** - Realistic device previews
- **Smooth Animations** - Professional transitions and effects

## 🛡️ Production Considerations

For production deployment, consider:

- Replace in-memory storage with a database (MongoDB, PostgreSQL)
- Use environment variables for sensitive data
- Implement proper error logging
- Add rate limiting
- Use HTTPS
- Set up proper file storage (AWS S3, Cloudinary)
- Add email verification
- Implement proper session management
- Add comprehensive testing

## 📄 License

This project is for educational purposes. Please ensure you comply with all applicable laws and regulations when implementing dating applications.

## 🤝 Contributing

This is a college project demonstration. Feel free to use as a reference for your own projects!

---

**CampusConnect** - Connecting college students across campuses worldwide! 💕
