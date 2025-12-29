# 🏕️ Campsite - Survival Game

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
- **HTML/CSS** - UI structure and styling
- **JavaScript** - Client-side game logic

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
- Downloaded project file (codebase)

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
   ```

4. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

5. **Configure environment variables**
   
   Create a `.env` file in the `server` directory and replace the name and password that was included in the submitted deliverables:
   ```env
   MONGO_URI=mongodb+srv://<name>:<password>@cluster0.hq6emk5.mongodb.net/gameDB
   JWT_SECRET=myjwtsecret
   FRONTEND_URL=http://localhost:5173
   ```

   Create a `.env` file in the `client` directory and replace the name and password that was included in the submitted deliverables:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application
6. **Add two terminals to run both the client and the server concurrently**

One terminal for server:
```bash
   cd server
   npm start
```

If there is an error regarding cors, type this and then type `npm start` again:
```bash
   npm install cors
```
it should now say that the server is now starting on the specific port.

One terminal for client:
```bash
   cd client
   npm run dev
```

### Access the Game

After running npm run dev in the client it should automatically open a new tab in your browser, if not, click the `local` link displayed in the terminal.

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
├── .gitignore
├── README.md
├── .vercel/                    # Vercel deployment configuration
│   ├── README.txt
│   └── project.json
│
├── client/                     # Frontend (Vite + Three.js)
│   ├── index.html              # Entry HTML file
│   ├── package.json            # Frontend dependencies
│   ├── package-lock.json
│   ├── vite.config.js          # Vite build configuration
│   ├── style.css               # Global styles
│   ├── public/                 # Static assets (textures, models)
│   │   ├── textures/
│   │   │   └── grass/          # Grass PBR textures
│   │   │       ├── ambientOcclusion.jpg
│   │   │       ├── color.jpg
│   │   │       ├── normal.jpg
│   │   │       └── roughness.jpg
│   │   └── wolf_model/
│   │       └── wolf.glb        # 3D Wolf Model
│   ├── sounds/                 # Audio files
│   │   ├── man_death.mp3
│   │   ├── win.mp3
│   │   └── wolf_howl.mp3
│   └── src/                    # Source code
│       ├── main.js             # Main entry point for the game logic
│       ├── style.css           # Component-level styles
│       ├── components/         # Game components/Logic
│       │   ├── boundary-checker.js
│       │   ├── fire-light.js
│       │   ├── flashlight.js
│       │   ├── game-manager.js
│       │   ├── mountain-boundary.js
│       │   ├── tree-generator.js
│       │   └── wolf-controller.js
│       └── services/           # API integration
│           └── apiServices.js
│
├── server/                     # Backend (Node.js + Express)
│   ├── package.json            # Backend dependencies
│   ├── package-lock.json
│   ├── railway.toml            # Railway deployment config
│   ├── server.js               # Main server entry point
│   ├── config/
│   │   └── db.js               # Database connection setup
│   ├── controllers/            # Logic for handling requests
│   │   ├── authController.js
│   │   └── gameController.js
│   ├── models/                 # Mongoose/Database models
│   │   ├── Score.js
│   │   └── user.js
│   └── routes/                 # API Route definitions
│       ├── authRoutes.js
│       └── gameRoutes.js
│
└── dist/                       # Production Build Output (Auto-generated)
    ├── index.html
    ├── assets/
    │   ├── index-[hash].css
    │   └── index-[hash].js
    └── textures/               # Copied assets in build
        └── grass/ ...
```

## 🤝 Contributing

This project was developed as a collaborative game development project. For questions, please reach out to the team members.



