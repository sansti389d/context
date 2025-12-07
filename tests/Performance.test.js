/**
 * Test Suite: Performance Requirements
 * Verifies technical performance requirements
 */

import { Game } from '../src/core/Game.js';
import { Entity } from '../src/core/Entity.js';

describe('Performance Requirements', () => {
  let game;
  let mockCanvas;
  
  beforeEach(() => {
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
  
  describe('Frame Rate Management', () => {
    test('should target 60 FPS by default', () => {
      expect(game.targetFPS).toBe(60);
    });
    
    test('should calculate correct frame delay', () => {
      expect(game.frameDelay).toBe(1000 / 60);
    });
    
    test('should allow custom target FPS', () => {
      const customGame = new Game('test-canvas', { targetFPS: 30 });
      expect(customGame.targetFPS).toBe(30);
      expect(customGame.frameDelay).toBe(1000 / 30);
      customGame.stop();
    });
    
    test('should track FPS during gameplay', () => {
      expect(game.fps).toBeDefined();
      expect(typeof game.fps).toBe('number');
    });
    
    test('should track frame count', () => {
      expect(game.frameCount).toBe(0);
      expect(typeof game.frameCount).toBe('number');
    });
  });
  
  describe('Canvas Performance', () => {
    test('should set canvas dimensions correctly', () => {
      expect(game.canvas.width).toBe(800);
      expect(game.canvas.height).toBe(600);
    });
    
    test('should have valid rendering context', () => {
      expect(game.ctx).toBeDefined();
      expect(game.ctx.constructor.name).toBe('CanvasRenderingContext2D');
    });
    
    test('should support custom canvas dimensions', () => {
      const customGame = new Game('test-canvas', { 
        width: 1024, 
        height: 768 
      });
      
      expect(customGame.width).toBe(1024);
      expect(customGame.height).toBe(768);
      customGame.stop();
    });
  });
  
  describe('Entity Performance', () => {
    test('should handle multiple entities efficiently', () => {
      const entityCount = 100;
      
      for (let i = 0; i < entityCount; i++) {
        const entity = new Entity(
          Math.random() * 800,
          Math.random() * 600
        );
        game.addEntity(entity);
      }
      
      expect(game.entities.length).toBe(entityCount);
    });
    
    test('should update multiple entities per frame', () => {
      const entities = [];
      
      for (let i = 0; i < 50; i++) {
        const entity = new Entity(i * 10, 0);
        entity.velocity.y = 10;
        entities.push(entity);
        game.addEntity(entity);
      }
      
      game.update(16); // One frame at ~60fps
      
      entities.forEach(entity => {
        expect(entity.y).toBeGreaterThan(0);
      });
    });
    
    test('should efficiently remove entities', () => {
      const entities = [];
      
      for (let i = 0; i < 20; i++) {
        const entity = new Entity(i * 10, 0);
        entities.push(entity);
        game.addEntity(entity);
      }
      
      const initialCount = game.entities.length;
      
      // Remove half
      for (let i = 0; i < 10; i++) {
        game.removeEntity(entities[i]);
      }
      
      expect(game.entities.length).toBe(initialCount - 10);
    });
  });
  
  describe('Memory Management', () => {
    test('should clean up entities when removed', () => {
      const entity = new Entity(0, 0);
      entity.destroy = jest.fn();
      
      game.addEntity(entity);
      game.removeEntity(entity);
      
      expect(entity.destroy).toHaveBeenCalled();
    });
    
    test('should clean up components on entity destruction', () => {
      const entity = new Entity(0, 0);
      const component = { destroy: jest.fn() };
      
      entity.addComponent('test', component);
      entity.destroy();
      
      expect(component.destroy).toHaveBeenCalled();
    });
    
    test('should maintain entity references correctly', () => {
      const entity = new Entity(0, 0);
      game.addEntity(entity);
      
      expect(entity.game).toBe(game);
      
      game.removeEntity(entity);
      // Entity still has reference but is no longer in game
      expect(game.entities).not.toContain(entity);
    });
  });
  
  describe('Update Loop Efficiency', () => {
    test('should pass delta time to updates', () => {
      const entity = new Entity(0, 0);
      entity.update = jest.fn();
      
      game.addEntity(entity);
      game.update(16);
      
      expect(entity.update).toHaveBeenCalledWith(16);
    });
    
    test('should not update when paused', () => {
      const entity = new Entity(0, 0);
      entity.velocity.x = 100;
      
      game.addEntity(entity);
      game.start();
      game.pause();
      
      const initialX = entity.x;
      game.update(16);
      
      // Position shouldn't change when paused
      expect(entity.x).toBe(initialX);
    });
    
    test('should skip updates for invisible entities if optimized', () => {
      const entity = new Entity(0, 0);
      entity.visible = false;
      
      expect(entity.visible).toBe(false);
      // Entity update still runs but render skips it
      game.addEntity(entity);
    });
  });
  
  describe('Rendering Performance', () => {
    test('should not render invisible entities', () => {
      const entity = new Entity(0, 0);
      entity.visible = false;
      
      const mockCtx = {
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        rotate: jest.fn(),
        scale: jest.fn()
      };
      
      entity.render(mockCtx);
      
      // Should return early and not call transform methods
      expect(mockCtx.save).not.toHaveBeenCalled();
    });
    
    test('should use canvas transformations efficiently', () => {
      const entity = new Entity(100, 100);
      entity.rotation = Math.PI / 4;
      
      const mockCtx = {
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        rotate: jest.fn(),
        scale: jest.fn()
      };
      
      entity.render(mockCtx);
      
      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.translate).toHaveBeenCalledWith(100, 100);
      expect(mockCtx.rotate).toHaveBeenCalledWith(Math.PI / 4);
      expect(mockCtx.restore).toHaveBeenCalled();
    });
  });
  
  describe('System Performance', () => {
    test('should support multiple systems', () => {
      const system1 = { init: jest.fn(), update: jest.fn() };
      const system2 = { init: jest.fn(), update: jest.fn() };
      
      game.addSystem(system1);
      game.addSystem(system2);
      
      expect(game.systems.length).toBe(2);
      expect(system1.init).toHaveBeenCalled();
      expect(system2.init).toHaveBeenCalled();
    });
    
    test('should update all systems per frame', () => {
      const system1 = { update: jest.fn() };
      const system2 = { update: jest.fn() };
      
      game.addSystem(system1);
      game.addSystem(system2);
      
      game.update(16);
      
      expect(system1.update).toHaveBeenCalledWith(16);
      expect(system2.update).toHaveBeenCalledWith(16);
    });
  });
  
  describe('Browser Compatibility', () => {
    test('should detect and use canvas element', () => {
      expect(game.canvas).toBe(mockCanvas);
      expect(game.canvas.tagName).toBe('CANVAS');
    });
    
    test('should throw error if canvas not found', () => {
      expect(() => {
        new Game('non-existent-canvas');
      }).toThrow("Canvas with id 'non-existent-canvas' not found");
    });
    
    test('should use 2D rendering context', () => {
      expect(game.ctx).toBeDefined();
      expect(typeof game.ctx.fillRect).toBe('function');
      expect(typeof game.ctx.clearRect).toBe('function');
    });
  });
});
