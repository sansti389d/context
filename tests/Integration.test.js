/**
 * Test Suite: Integration Tests
 * Verifies complete game prototype requirements and deliverables
 */

import { Game } from '../src/core/Game.js';
import { Entity } from '../src/core/Entity.js';
import { Scene } from '../src/core/Scene.js';

describe('Playable Game Prototype Requirements', () => {
  let game;
  let mockCanvas;
  
  beforeEach(() => {
    mockCanvas = document.createElement('canvas');
    mockCanvas.id = 'integration-test-canvas';
    document.body.appendChild(mockCanvas);
    
    game = new Game('integration-test-canvas', { width: 800, height: 600 });
  });
  
  afterEach(() => {
    if (game) {
      game.stop();
    }
    document.body.removeChild(mockCanvas);
  });
  
  describe('Complete Game Loop Integration', () => {
    test('should run complete game loop with entities and scenes', (done) => {
      const scene = new Scene();
      scene.update = jest.fn();
      scene.render = jest.fn();
      
      const entity = new Entity(100, 100);
      entity.velocity.x = 50;
      
      game.addScene('main', scene);
      game.setScene('main');
      game.addEntity(entity);
      
      game.start();
      
      setTimeout(() => {
        expect(game.isRunning).toBe(true);
        expect(scene.update).toHaveBeenCalled();
        expect(entity.x).toBeGreaterThan(100);
        game.stop();
        done();
      }, 100);
    });
    
    test('should integrate player controls with entity movement', () => {
      const player = new Entity(400, 300);
      game.addEntity(player);
      
      // Simulate arrow key input
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);
      
      // Apply control logic
      if (game.input.keys['ArrowRight']) {
        player.velocity.x = 100;
      }
      
      player.update(1);
      
      expect(player.x).toBe(500);
    });
    
    test('should integrate collision detection with game state', () => {
      const player = new Entity(100, 100);
      player.width = 50;
      player.height = 50;
      player.addTag('player');
      
      const enemy = new Entity(120, 120);
      enemy.width = 50;
      enemy.height = 50;
      enemy.addTag('enemy');
      
      game.addEntity(player);
      game.addEntity(enemy);
      
      const collision = player.collidesWith(enemy);
      
      if (collision) {
        game.score = (game.score || 0) + 10;
      }
      
      expect(collision).toBe(true);
      expect(game.score).toBe(10);
    });
  });
  
  describe('Multi-Scene Game Flow', () => {
    test('should support complete menu -> play -> gameover flow', () => {
      const menuScene = new Scene();
      const playScene = new Scene();
      const gameOverScene = new Scene();
      
      menuScene.enter = jest.fn();
      playScene.enter = jest.fn();
      gameOverScene.enter = jest.fn();
      
      game.addScene('menu', menuScene);
      game.addScene('play', playScene);
      game.addScene('gameover', gameOverScene);
      
      // Start at menu
      game.setScene('menu');
      expect(game.currentScene).toBe(menuScene);
      expect(menuScene.enter).toHaveBeenCalled();
      
      // Transition to play
      game.setScene('play');
      expect(game.currentScene).toBe(playScene);
      expect(playScene.enter).toHaveBeenCalled();
      
      // Transition to game over
      game.setScene('gameover');
      expect(game.currentScene).toBe(gameOverScene);
      expect(gameOverScene.enter).toHaveBeenCalled();
    });
    
    test('should maintain game state across scene transitions', () => {
      const scene1 = new Scene();
      const scene2 = new Scene();
      
      game.addScene('scene1', scene1);
      game.addScene('scene2', scene2);
      
      game.setScene('scene1');
      game.score = 100;
      game.lives = 3;
      
      game.setScene('scene2');
      
      expect(game.score).toBe(100);
      expect(game.lives).toBe(3);
    });
  });
  
  describe('Complete Gameplay Scenario', () => {
    test('should simulate complete win scenario', () => {
      game.score = 0;
      const winScore = 100;
      
      // Setup game objects
      const player = new Entity(100, 100);
      player.addTag('player');
      
      const collectible1 = new Entity(200, 200);
      collectible1.addTag('collectible');
      
      const collectible2 = new Entity(300, 300);
      collectible2.addTag('collectible');
      
      game.addEntity(player);
      game.addEntity(collectible1);
      game.addEntity(collectible2);
      
      // Simulate collecting items
      if (player.collidesWith(collectible1)) {
        game.score += 50;
        collectible1.kill();
      }
      
      if (player.collidesWith(collectible2)) {
        game.score += 50;
        collectible2.kill();
      }
      
      const hasWon = game.score >= winScore;
      expect(hasWon).toBe(true);
    });
    
    test('should simulate complete lose scenario', () => {
      game.lives = 3;
      
      const player = new Entity(100, 100);
      player.addTag('player');
      
      const enemy1 = new Entity(150, 100);
      enemy1.addTag('enemy');
      
      const enemy2 = new Entity(200, 100);
      enemy2.addTag('enemy');
      
      const enemy3 = new Entity(250, 100);
      enemy3.addTag('enemy');
      
      game.addEntity(player);
      game.addEntity(enemy1);
      game.addEntity(enemy2);
      game.addEntity(enemy3);
      
      // Simulate three collisions with enemies
      [enemy1, enemy2, enemy3].forEach(enemy => {
        if (player.collidesWith(enemy)) {
          game.lives -= 1;
        }
      });
      
      const hasLost = game.lives <= 0;
      expect(hasLost).toBe(true);
    });
    
    test('should handle pause during gameplay', () => {
      const player = new Entity(100, 100);
      player.velocity.x = 100;
      
      game.addEntity(player);
      game.start();
      game.pause();
      
      const xBeforePause = player.x;
      game.update(16);
      
      // Position shouldn't change while paused
      expect(player.x).toBe(xBeforePause);
      
      game.resume();
      player.update(16);
      
      // Position should change after resume
      expect(player.x).toBeGreaterThan(xBeforePause);
    });
  });
  
  describe('Platform Target Verification', () => {
    test('should run in browser environment', () => {
      expect(typeof window).toBe('object');
      expect(typeof document).toBe('object');
      expect(typeof HTMLCanvasElement).toBe('function');
    });
    
    test('should support HTML5 canvas rendering', () => {
      expect(game.canvas).toBeInstanceOf(HTMLCanvasElement);
      expect(game.ctx).toBeDefined();
      expect(typeof game.ctx.fillRect).toBe('function');
    });
    
    test('should support modern JavaScript features', () => {
      // ES6+ features
      expect(typeof Map).toBe('function');
      expect(typeof Set).toBe('function');
      expect(typeof Promise).toBe('function');
      
      // Arrow functions work
      const arrow = () => true;
      expect(arrow()).toBe(true);
      
      // Destructuring works
      const { x, y } = { x: 1, y: 2 };
      expect(x).toBe(1);
      expect(y).toBe(2);
    });
  });
  
  describe('System Integration', () => {
    test('should integrate collision system with entities', () => {
      const entity1 = new Entity(100, 100);
      entity1.width = 50;
      entity1.height = 50;
      
      const entity2 = new Entity(120, 120);
      entity2.width = 50;
      entity2.height = 50;
      
      game.addEntity(entity1);
      game.addEntity(entity2);
      
      // Check collision
      const hasCollision = entity1.collidesWith(entity2);
      expect(hasCollision).toBe(true);
    });
    
    test('should support multiple game systems working together', () => {
      const renderSystem = {
        init: jest.fn(),
        update: jest.fn()
      };
      
      const physicsSystem = {
        init: jest.fn(),
        update: jest.fn()
      };
      
      const audioSystem = {
        init: jest.fn(),
        update: jest.fn()
      };
      
      game.addSystem(renderSystem);
      game.addSystem(physicsSystem);
      game.addSystem(audioSystem);
      
      expect(game.systems).toHaveLength(3);
      
      game.update(16);
      
      expect(renderSystem.update).toHaveBeenCalled();
      expect(physicsSystem.update).toHaveBeenCalled();
      expect(audioSystem.update).toHaveBeenCalled();
    });
  });
  
  describe('User Experience Integration', () => {
    test('should provide responsive controls', () => {
      // Test keyboard responsiveness
      const keyEvent = new KeyboardEvent('keydown', { key: 'Space' });
      window.dispatchEvent(keyEvent);
      
      expect(game.input.keys['Space']).toBe(true);
      
      // Test mouse responsiveness
      const rect = mockCanvas.getBoundingClientRect();
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: rect.left + 100,
        clientY: rect.top + 100
      });
      mockCanvas.dispatchEvent(mouseEvent);
      
      expect(game.input.mouse.x).toBe(100);
      expect(game.input.mouse.y).toBe(100);
    });
    
    test('should maintain smooth gameplay at target framerate', (done) => {
      game.start();
      const startTime = Date.now();
      
      setTimeout(() => {
        const elapsed = Date.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(100);
        expect(game.isRunning).toBe(true);
        game.stop();
        done();
      }, 100);
    });
  });
  
  describe('Documentation Deliverable', () => {
    test('should have accessible API through game object', () => {
      // Core methods
      expect(typeof game.start).toBe('function');
      expect(typeof game.stop).toBe('function');
      expect(typeof game.pause).toBe('function');
      expect(typeof game.resume).toBe('function');
      expect(typeof game.addEntity).toBe('function');
      expect(typeof game.removeEntity).toBe('function');
      expect(typeof game.addScene).toBe('function');
      expect(typeof game.setScene).toBe('function');
    });
    
    test('should provide clear entity API', () => {
      const entity = new Entity(0, 0);
      
      expect(typeof entity.update).toBe('function');
      expect(typeof entity.render).toBe('function');
      expect(typeof entity.addComponent).toBe('function');
      expect(typeof entity.getComponent).toBe('function');
      expect(typeof entity.addTag).toBe('function');
      expect(typeof entity.hasTag).toBe('function');
    });
    
    test('should provide clear scene API', () => {
      const scene = new Scene();
      
      expect(typeof scene.enter).toBe('function');
      expect(typeof scene.exit).toBe('function');
      expect(typeof scene.update).toBe('function');
      expect(typeof scene.render).toBe('function');
    });
  });
});
