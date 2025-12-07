/**
 * Test Suite: Game Mechanics
 * Verifies core game mechanics as per requirements
 */

import { Game } from '../src/core/Game.js';
import { Entity } from '../src/core/Entity.js';
import { Scene } from '../src/core/Scene.js';

describe('Game Mechanics Requirements', () => {
  let game;
  let mockCanvas;
  
  beforeEach(() => {
    // Create mock canvas element
    mockCanvas = document.createElement('canvas');
    mockCanvas.id = 'test-canvas';
    document.body.appendChild(mockCanvas);
    
    game = new Game('test-canvas', { width: 800, height: 600 });
  });
  
  afterEach(() => {
    if (game) {
      game.stop();
    }
    document.body.removeChild(mockCanvas);
  });
  
  describe('Core Game Loop', () => {
    test('should start and stop game loop', () => {
      expect(game.isRunning).toBe(false);
      game.start();
      expect(game.isRunning).toBe(true);
      game.stop();
      expect(game.isRunning).toBe(false);
    });
    
    test('should pause and resume game', () => {
      game.start();
      game.pause();
      expect(game.isPaused).toBe(true);
      game.resume();
      expect(game.isPaused).toBe(false);
    });
    
    test('should maintain target frame rate', () => {
      expect(game.targetFPS).toBe(60);
      expect(game.frameDelay).toBe(1000 / 60);
    });
    
    test('should update entities each frame', (done) => {
      const entity = new Entity(0, 0);
      entity.velocity.x = 100;
      game.addEntity(entity);
      
      game.start();
      
      setTimeout(() => {
        expect(entity.x).toBeGreaterThan(0);
        game.stop();
        done();
      }, 100);
    });
  });
  
  describe('Entity Management', () => {
    test('should add entities to game', () => {
      const entity = new Entity(100, 100);
      game.addEntity(entity);
      
      expect(game.entities).toContain(entity);
      expect(entity.game).toBe(game);
    });
    
    test('should remove entities from game', () => {
      const entity = new Entity(100, 100);
      game.addEntity(entity);
      game.removeEntity(entity);
      
      expect(game.entities).not.toContain(entity);
    });
    
    test('should initialize entities when added', () => {
      const entity = new Entity(100, 100);
      entity.init = jest.fn();
      
      game.addEntity(entity);
      expect(entity.init).toHaveBeenCalled();
    });
    
    test('should clean up entities when removed', () => {
      const entity = new Entity(100, 100);
      entity.destroy = jest.fn();
      
      game.addEntity(entity);
      game.removeEntity(entity);
      
      expect(entity.destroy).toHaveBeenCalled();
    });
  });
  
  describe('Scene Management', () => {
    test('should add scenes to game', () => {
      const scene = new Scene();
      game.addScene('menu', scene);
      
      expect(game.scenes.get('menu')).toBe(scene);
      expect(scene.game).toBe(game);
    });
    
    test('should switch between scenes', () => {
      const scene1 = new Scene();
      const scene2 = new Scene();
      
      scene1.exit = jest.fn();
      scene2.enter = jest.fn();
      
      game.addScene('scene1', scene1);
      game.addScene('scene2', scene2);
      
      game.setScene('scene1');
      expect(game.currentScene).toBe(scene1);
      
      game.setScene('scene2');
      expect(scene1.exit).toHaveBeenCalled();
      expect(scene2.enter).toHaveBeenCalled();
      expect(game.currentScene).toBe(scene2);
    });
    
    test('should update current scene', () => {
      const scene = new Scene();
      scene.update = jest.fn();
      
      game.addScene('test', scene);
      game.setScene('test');
      
      game.update(16);
      expect(scene.update).toHaveBeenCalledWith(16);
    });
  });
  
  describe('Physics and Movement', () => {
    test('should apply velocity to entity position', () => {
      const entity = new Entity(0, 0);
      entity.velocity.x = 100;
      entity.velocity.y = 50;
      
      entity.update(1); // 1 second
      
      expect(entity.x).toBe(100);
      expect(entity.y).toBe(50);
    });
    
    test('should apply acceleration to velocity', () => {
      const entity = new Entity(0, 0);
      entity.acceleration.x = 10;
      entity.acceleration.y = 5;
      
      entity.update(2); // 2 seconds
      
      expect(entity.velocity.x).toBe(20);
      expect(entity.velocity.y).toBe(10);
    });
    
    test('should respect scale transformation', () => {
      const entity = new Entity(0, 0);
      entity.scale.x = 2;
      entity.scale.y = 2;
      
      expect(entity.scale.x).toBe(2);
      expect(entity.scale.y).toBe(2);
    });
    
    test('should support rotation', () => {
      const entity = new Entity(0, 0);
      entity.rotation = Math.PI / 4;
      
      expect(entity.rotation).toBe(Math.PI / 4);
    });
  });
  
  describe('Component System', () => {
    test('should add components to entities', () => {
      const entity = new Entity(0, 0);
      const component = { name: 'testComponent' };
      
      entity.addComponent('test', component);
      
      expect(entity.components.get('test')).toBe(component);
      expect(component.entity).toBe(entity);
    });
    
    test('should initialize components when added', () => {
      const entity = new Entity(0, 0);
      const component = { init: jest.fn() };
      
      entity.addComponent('test', component);
      
      expect(component.init).toHaveBeenCalled();
    });
    
    test('should update components during entity update', () => {
      const entity = new Entity(0, 0);
      const component = { update: jest.fn() };
      
      entity.addComponent('test', component);
      entity.update(16);
      
      expect(component.update).toHaveBeenCalledWith(16);
    });
    
    test('should remove components from entities', () => {
      const entity = new Entity(0, 0);
      const component = { name: 'testComponent' };
      
      entity.addComponent('test', component);
      entity.removeComponent('test');
      
      expect(entity.components.has('test')).toBe(false);
    });
  });
});
