/**
 * Game Engine Core
 * Main game loop and state management
 */
export class Game {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas with id '${canvasId}' not found`);
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    // Game state
    this.isRunning = false;
    this.isPaused = false;
    this.lastTime = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.targetFPS = options.targetFPS || 60;
    this.frameDelay = 1000 / this.targetFPS;
    
    // Entity and system management
    this.entities = [];
    this.systems = [];
    this.scenes = new Map();
    this.currentScene = null;
    
    // Input handling
    this.input = {
      keys: {},
      mouse: { x: 0, y: 0, buttons: {} }
    };
    
    this._setupInputHandlers();
  }
  
  /**
   * Add an entity to the game
   */
  addEntity(entity) {
    this.entities.push(entity);
    entity.game = this;
    if (entity.init) entity.init();
    return entity;
  }
  
  /**
   * Remove an entity from the game
   */
  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
      if (entity.destroy) entity.destroy();
    }
  }
  
  /**
   * Add a system to the game
   */
  addSystem(system) {
    this.systems.push(system);
    system.game = this;
    if (system.init) system.init();
    return system;
  }
  
  /**
   * Add a scene
   */
  addScene(name, scene) {
    this.scenes.set(name, scene);
    scene.game = this;
  }
  
  /**
   * Switch to a different scene
   */
  setScene(name) {
    const scene = this.scenes.get(name);
    if (!scene) {
      console.error(`Scene '${name}' not found`);
      return;
    }
    
    if (this.currentScene && this.currentScene.exit) {
      this.currentScene.exit();
    }
    
    this.currentScene = scene;
    this.entities = [];
    this.systems = [];
    
    if (scene.enter) {
      scene.enter();
    }
  }
  
  /**
   * Main game loop
   */
  _gameLoop(currentTime) {
    if (!this.isRunning) return;
    
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime >= this.frameDelay) {
      // Calculate FPS
      this.frameCount++;
      if (currentTime - this.lastFPSUpdate >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastFPSUpdate = currentTime;
      }
      
      if (!this.isPaused) {
        // Update phase
        this.update(deltaTime / 1000); // Convert to seconds
        
        // Render phase
        this.render();
      }
      
      this.lastTime = currentTime;
    }
    
    requestAnimationFrame((time) => this._gameLoop(time));
  }
  
  /**
   * Update all entities and systems
   */
  update(deltaTime) {
    // Update systems
    for (const system of this.systems) {
      if (system.update) {
        system.update(deltaTime);
      }
    }
    
    // Update entities
    for (const entity of this.entities) {
      if (entity.update) {
        entity.update(deltaTime);
      }
    }
    
    // Remove dead entities
    this.entities = this.entities.filter(entity => !entity.dead);
  }
  
  /**
   * Render all entities
   */
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Render systems first (e.g., background)
    for (const system of this.systems) {
      if (system.render) {
        system.render(this.ctx);
      }
    }
    
    // Render entities
    for (const entity of this.entities) {
      if (entity.render) {
        entity.render(this.ctx);
      }
    }
    
    // Render debug info if enabled
    if (this.debug) {
      this._renderDebug();
    }
  }
  
  /**
   * Start the game
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.lastFPSUpdate = this.lastTime;
    requestAnimationFrame((time) => this._gameLoop(time));
  }
  
  /**
   * Pause the game
   */
  pause() {
    this.isPaused = true;
  }
  
  /**
   * Resume the game
   */
  resume() {
    this.isPaused = false;
  }
  
  /**
   * Stop the game
   */
  stop() {
    this.isRunning = false;
  }
  
  /**
   * Setup input event handlers
   */
  _setupInputHandlers() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.input.keys[e.key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.input.keys[e.key] = false;
    });
    
    // Mouse
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.input.mouse.x = e.clientX - rect.left;
      this.input.mouse.y = e.clientY - rect.top;
    });
    
    this.canvas.addEventListener('mousedown', (e) => {
      this.input.mouse.buttons[e.button] = true;
    });
    
    this.canvas.addEventListener('mouseup', (e) => {
      this.input.mouse.buttons[e.button] = false;
    });
  }
  
  /**
   * Render debug information
   */
  _renderDebug() {
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.font = '14px monospace';
    this.ctx.lineWidth = 3;
    
    const debugText = `FPS: ${this.fps} | Entities: ${this.entities.length}`;
    this.ctx.strokeText(debugText, 10, 20);
    this.ctx.fillText(debugText, 10, 20);
  }
  
  /**
   * Check if a key is pressed
   */
  isKeyPressed(key) {
    return this.input.keys[key] || false;
  }
  
  /**
   * Check if mouse button is pressed
   */
  isMousePressed(button = 0) {
    return this.input.mouse.buttons[button] || false;
  }
}
