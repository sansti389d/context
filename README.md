# 🎮 Context Game Engine

A modern, lightweight HTML5 game engine built with vanilla JavaScript. Features a robust entity-component system, scene management, collision detection, and a powerful game loop architecture perfect for building 2D games.

## ✨ Features

- **Entity-Component System**: Flexible architecture for game objects
- **Scene Management**: Easy switching between game states (menu, gameplay, etc.)
- **Collision Detection**: Built-in AABB collision system
- **Game Loop**: Optimized game loop with fixed timestep and FPS control
- **Input Handling**: Keyboard and mouse input management
- **Asset Loading**: Async image and audio loading with progress tracking
- **Vector Math**: 2D vector utilities for physics and movement
- **Debug Mode**: Built-in FPS counter and entity tracking

## 🏗️ Architecture

```
context/
├── src/
│   ├── core/           # Core engine components
│   │   ├── Game.js     # Main game engine
│   │   ├── Entity.js   # Base entity class
│   │   └── Scene.js    # Scene management
│   ├── entities/       # Game-specific entities
│   ├── systems/        # Game systems
│   │   └── CollisionSystem.js
│   └── utils/          # Utility classes
│       ├── Vector2D.js
│       └── AssetLoader.js
├── assets/             # Game assets
│   ├── images/
│   ├── audio/
│   └── fonts/
├── tests/              # Unit tests
└── docs/               # Documentation
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Basic Usage

```javascript
import { Game } from './src/core/Game.js';
import { Entity } from './src/core/Entity.js';

// Create a game instance
const game = new Game('gameCanvas', {
  width: 800,
  height: 600,
  targetFPS: 60
});

// Create a simple player entity
class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.width = 50;
    this.height = 50;
    this.speed = 200;
  }
  
  update(deltaTime) {
    // Handle input
    if (this.game.isKeyPressed('ArrowLeft')) {
      this.velocity.x = -this.speed;
    } else if (this.game.isKeyPressed('ArrowRight')) {
      this.velocity.x = this.speed;
    } else {
      this.velocity.x = 0;
    }
    
    super.update(deltaTime);
  }
  
  render(ctx) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
  }
}

// Add player to game
const player = new Player(400, 300);
game.addEntity(player);

// Enable debug mode
game.debug = true;

// Start the game
game.start();
```

## 📖 Core Concepts

### Entities

Entities are game objects with position, velocity, and rendering capabilities. They support:
- Component-based architecture
- Collision detection
- Tag system for categorization
- Lifecycle methods (init, update, render, destroy)

### Systems

Systems handle cross-cutting concerns like collision detection, physics, rendering effects, etc. They operate on entities during the game loop.

### Scenes

Scenes represent different game states (main menu, gameplay, pause screen). They manage their own entities and systems, with smooth transitions between states.

### Game Loop

The engine uses a fixed timestep game loop that:
- Updates at consistent intervals (targetFPS)
- Separates update and render phases
- Tracks FPS and performance metrics
- Handles pause/resume functionality

## 🎨 Creating a Game

1. **Define your entities** by extending the `Entity` class
2. **Create scenes** for different game states
3. **Add systems** for shared functionality
4. **Load assets** using the `AssetLoader`
5. **Handle input** via the game's input API
6. **Start the game** and iterate!

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm test:watch
```

## 🛠️ Development

```bash
# Lint code
npm run lint

# Format code
npm run format

# Preview production build
npm run preview
```

## 📚 API Documentation

See the `/docs` folder for detailed API documentation.

### Key Classes

- **Game**: Main engine class managing game loop, entities, and systems
- **Entity**: Base class for all game objects
- **Scene**: Container for game states
- **CollisionSystem**: Handles entity collision detection
- **Vector2D**: 2D vector math utilities
- **AssetLoader**: Asset management and loading

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this in your own projects!

## 🎯 Roadmap

- [ ] Sprite animation system
- [ ] Particle effects
- [ ] Camera system with follow and zoom
- [ ] Tilemap support
- [ ] Advanced physics (gravity, friction)
- [ ] Audio manager with spatial sound
- [ ] Save/load game state
- [ ] Mobile touch controls

## 💡 Example Games

Check the `examples/` folder for complete game implementations:
- Platformer
- Space Shooter
- Puzzle Game

---

**Happy Game Development! 🚀**
