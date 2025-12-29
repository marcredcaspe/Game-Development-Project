# 🏕️ Back to Camp - Survival Game

## 📖 Project Story

Lost in the wilderness at nightfall, a lone adventurer must navigate through dangerous terrain filled with a vicious wolf and treacherous mountains. Your only goal: survive the night and make it back to your campfire. With just a flashlight to guide your way, every step could be your last. Will you find your way home, or will the darkness claim you?

## 💡 Concept

**Back to Camp** is an immersive 3D survival game that combines atmospheric horror elements with strategic gameplay. Players must navigate through a procedurally generated forest environment while avoiding the hostile wolf and staying within the mountain boundaries. The game features realistic lighting effects, including a dynamic campfire and player-controlled flashlight, creating a tense and engaging survival experience.

### Key Features:
- 🌲 **Procedurally Generated Environment**: Each playthrough features dynamically placed trees and obstacles
- 🐺 **Wolf AI**: Intelligent wolf enemy that patrol and hunt the player
- 🔦 **Dynamic Lighting**: Realistic flashlight mechanics and campfire illumination
- ⛰️ **Boundary System**: Mountain barriers that define the playable area
- 🎮 **Survival Mechanics**: Strategic gameplay requiring careful navigation and resource management
- 📊 **Score Tracking**: Persistent leaderboard system with user authentication
- 🌙 **Atmospheric Design**: Night-time setting with immersive 3D graphics using Three.js

## 🛠️ Development Stack

### Frontend
- **Three.js** - 3D graphics rendering and scene management
- **Vite** - Fast build tool and development server
- **HTML5/CSS3** - UI structure and styling
- **JavaScript (ES6+)** - Client-side game logic

### Backend
- **Node.js** - Server runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for user data and scores
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **JWT (JSON Web Tokens)** - Secure user authentication
- **bcryptjs** - Password hashing and encryption

### Development Tools
- **Nodemon** - Auto-restart development server
- **Concurrently** - Run multiple npm scripts simultaneously
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB (local installation or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/marcredcaspe/Game-Development-Project.git
   cd Game-Development-Project
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

5. **Configure environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/backtocampgame
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

6. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For Linux/Mac with systemd
   sudo systemctl start mongod
   
   # Or if using MongoDB directly
   mongod
   ```

### Running the Application

#### Development Mode (Recommended)

Run both client and server concurrently:
```bash
npm run dev
```

This will start:
- Client development server on `http://localhost:5173`
- Backend API server on `http://localhost:5173`

#### Individual Services

**Client only:**
```bash
npm run client:dev
```

**Server only:**
```bash
npm run server:dev
```

#### Production Build

1. Build the client:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Access the Game

Open your browser and navigate to:
```
http://localhost:5173
```

## 👥 Team Roles

### Member 1: Caspe
**Role:** Full-Stack Developer & Project Lead
- 🎯 Project architecture and design
- 🎮 Core game mechanics implementation
- 🐺 Wolf AI and controller systems
- 🌲 Environment generation (tree-generator, boundary-checker)
- 🔧 Backend API development and database integration
- 📡 Git repository management and deployment

### Member 2: Auditor
**Role:** Graphics & Gameplay Developer
- ✨ Lighting systems (fire-light, flashlight mechanics)
- 🎨 3D scene setup and rendering optimization
- 🎮 Game manager and state management
- 🗺️ Mountain boundary system implementation
- 🧪 Quality assurance and gameplay testing
- 📊 Performance optimization

### Member 3: Sanico
**Role:** Backend Developer & Systems Integration
- 🔐 Authentication system (JWT, bcryptjs)
- 💾 Database models and schema design
- 🛣️ API routes and controllers
- 🔄 Client-server communication and API services
- 🐛 Debugging and error handling
- 📄 Documentation and code comments

## 🎮 Game Controls

- **WASD / Arrow Keys** - Move character
- **Mouse** - Look around
- **F** - Toggle flashlight
- **ESC** - Pause menu

## 📁 Project Structure

```
Game-Development-Project/
├── client/               # Frontend application
│   ├── public/          # Static assets
│   │   ├── textures/   # Game textures
│   │   └── wolf_model/ # 3D models
│   └── src/
│       ├── components/  # Game components
│       └── services/    # API communication
├── server/              # Backend application
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── models/         # Database schemas
│   └── routes/         # API endpoints
└── package.json        # Root dependencies
```

## 🤝 Contributing

This project was developed as a collaborative game development project. For contributions or questions, please reach out to the team members.



This project is developed for educational purposes.


