import { Game } from './core/Game.js';
import { Entity } from './core/Entity.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { Vector2D } from './utils/Vector2D.js';

// Player ship
class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.width = 40;
    this.height = 40;
    this.speed = 300;
    this.health = 100;
    this.shootCooldown = 0;
    this.shootDelay = 0.2;
    this.addTag('player');
  }
  
  update(deltaTime) {
    // Movement
    this.velocity.x = 0;
    this.velocity.y = 0;
    
    if (this.game.isKeyPressed('ArrowLeft')) {
      this.velocity.x = -this.speed;
    }
    if (this.game.isKeyPressed('ArrowRight')) {
      this.velocity.x = this.speed;
    }
    if (this.game.isKeyPressed('ArrowUp')) {
      this.velocity.y = -this.speed;
    }
    if (this.game.isKeyPressed('ArrowDown')) {
      this.velocity.y = this.speed;
    }
    
    // Shooting
    if (this.game.isKeyPressed(' ') && this.shootCooldown <= 0) {
      this.shoot();
      this.shootCooldown = this.shootDelay;
    }
    
    this.shootCooldown -= deltaTime;
    
    super.update(deltaTime);
    
    // Keep in bounds
    this.x = Math.max(this.width / 2, Math.min(this.game.width - this.width / 2, this.x));
    this.y = Math.max(this.height / 2, Math.min(this.game.height - this.height / 2, this.y));
  }
  
  shoot() {
    const bullet = new Bullet(this.x, this.y - this.height / 2, 0, -600, 'player');
    this.game.addEntity(bullet);
  }
  
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.game.gameOver();
    }
    this.game.updateUI();
  }
  
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Draw ship
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 2);
    ctx.closePath();
    ctx.fill();
    
    // Draw engine glow
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(-5, this.height / 2, 10, 8);
    
    ctx.restore();
  }
  
  onCollision(other) {
    if (other.hasTag('enemy') || other.hasTag('enemyBullet')) {
      this.takeDamage(10);
      other.kill();
    }
  }
}

// Enemy ship
class Enemy extends Entity {
  constructor(x, y) {
    super(x, y);
    this.width = 35;
    this.height = 35;
    this.velocity.y = 100 + Math.random() * 50;
    this.shootTimer = Math.random() * 2;
    this.addTag('enemy');
  }
  
  update(deltaTime) {
    super.update(deltaTime);
    
    // Remove if off screen
    if (this.y > this.game.height + 50) {
      this.kill();
    }
    
    // Random shooting
    this.shootTimer -= deltaTime;
    if (this.shootTimer <= 0 && Math.random() < 0.02) {
      this.shoot();
      this.shootTimer = 1 + Math.random();
    }
  }
  
  shoot() {
    const bullet = new Bullet(this.x, this.y + this.height / 2, 0, 300, 'enemy');
    this.game.addEntity(bullet);
  }
  
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Draw enemy ship
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, -this.height / 2);
    ctx.lineTo(this.width / 2, -this.height / 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  onCollision(other) {
    if (other.hasTag('playerBullet')) {
      this.kill();
      other.kill();
      this.game.addScore(100);
    }
  }
}

// Bullet
class Bullet extends Entity {
  constructor(x, y, vx, vy, owner) {
    super(x, y);
    this.width = 4;
    this.height = 12;
    this.velocity.x = vx;
    this.velocity.y = vy;
    this.owner = owner;
    this.addTag(owner === 'player' ? 'playerBullet' : 'enemyBullet');
  }
  
  update(deltaTime) {
    super.update(deltaTime);
    
    // Remove if off screen
    if (this.y < -50 || this.y > this.game.height + 50) {
      this.kill();
    }
  }
  
  render(ctx) {
    ctx.fillStyle = this.owner === 'player' ? '#00ffff' : '#ff00ff';
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }
}

// Star background
class Star extends Entity {
  constructor(x, y) {
    super(x, y);
    this.velocity.y = 50 + Math.random() * 100;
    this.size = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.5 + 0.5;
  }
  
  update(deltaTime) {
    super.update(deltaTime);
    
    if (this.y > this.game.height) {
      this.y = 0;
      this.x = Math.random() * this.game.width;
    }
  }
  
  render(ctx) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// Game instance with custom methods
class SpaceShooter extends Game {
  constructor() {
    super('gameCanvas', { width: 800, height: 600, targetFPS: 60 });
    
    this.score = 0;
    this.wave = 1;
    this.enemySpawnTimer = 0;
    this.enemySpawnRate = 2;
    this.player = null;
    this.isGameOver = false;
    
    this.init();
  }
  
  init() {
    // Add collision system
    this.addSystem(new CollisionSystem());
    
    // Create star field
    for (let i = 0; i < 100; i++) {
      const star = new Star(
        Math.random() * this.width,
        Math.random() * this.height
      );
      this.addEntity(star);
    }
    
    // Create player
    this.player = new Player(this.width / 2, this.height - 80);
    this.addEntity(this.player);
    
    this.debug = true;
  }
  
  update(deltaTime) {
    if (this.isGameOver) return;
    
    super.update(deltaTime);
    
    // Spawn enemies
    this.enemySpawnTimer -= deltaTime;
    if (this.enemySpawnTimer <= 0) {
      this.spawnEnemy();
      this.enemySpawnTimer = this.enemySpawnRate;
    }
    
    // Check for wave completion
    const enemyCount = this.entities.filter(e => e.hasTag('enemy')).length;
    if (enemyCount === 0 && this.enemySpawnTimer > this.enemySpawnRate - 0.1) {
      this.nextWave();
    }
  }
  
  spawnEnemy() {
    const x = Math.random() * (this.width - 100) + 50;
    const enemy = new Enemy(x, -50);
    this.addEntity(enemy);
  }
  
  addScore(points) {
    this.score += points;
    this.updateUI();
  }
  
  nextWave() {
    this.wave++;
    this.enemySpawnRate = Math.max(0.5, this.enemySpawnRate - 0.1);
    this.updateUI();
  }
  
  updateUI() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('health').textContent = this.player ? this.player.health : 0;
    document.getElementById('wave').textContent = this.wave;
  }
  
  gameOver() {
    this.isGameOver = true;
    alert(`Game Over! Final Score: ${this.score}`);
    location.reload();
  }
}

// Start the game
const game = new SpaceShooter();
game.start();
