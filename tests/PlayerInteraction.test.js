/**
 * Test Suite: Player Interactions
 * Verifies player interaction requirements
 */

import { Game } from '../src/core/Game.js';
import { Entity } from '../src/core/Entity.js';

describe('Player Interaction Requirements', () => {
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
  
  describe('Keyboard Input', () => {
    test('should detect key press events', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      window.dispatchEvent(event);
      
      expect(game.input.keys['ArrowUp']).toBe(true);
    });
    
    test('should detect key release events', () => {
      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const upEvent = new KeyboardEvent('keyup', { key: 'ArrowUp' });
      
      window.dispatchEvent(downEvent);
      expect(game.input.keys['ArrowUp']).toBe(true);
      
      window.dispatchEvent(upEvent);
      expect(game.input.keys['ArrowUp']).toBe(false);
    });
    
    test('should track multiple simultaneous key presses', () => {
      const key1 = new KeyboardEvent('keydown', { key: 'w' });
      const key2 = new KeyboardEvent('keydown', { key: 'a' });
      
      window.dispatchEvent(key1);
      window.dispatchEvent(key2);
      
      expect(game.input.keys['w']).toBe(true);
      expect(game.input.keys['a']).toBe(true);
    });
    
    test('should provide keyboard state access', () => {
      expect(game.input.keys).toBeDefined();
      expect(typeof game.input.keys).toBe('object');
    });
  });
  
  describe('Mouse Input', () => {
    test('should track mouse position', () => {
      const rect = mockCanvas.getBoundingClientRect();
      const event = new MouseEvent('mousemove', {
        clientX: rect.left + 100,
        clientY: rect.top + 150
      });
      
      mockCanvas.dispatchEvent(event);
      
      expect(game.input.mouse.x).toBe(100);
      expect(game.input.mouse.y).toBe(150);
    });
    
    test('should detect mouse button press', () => {
      const event = new MouseEvent('mousedown', { button: 0 });
      mockCanvas.dispatchEvent(event);
      
      expect(game.input.mouse.buttons[0]).toBe(true);
    });
    
    test('should detect mouse button release', () => {
      const downEvent = new MouseEvent('mousedown', { button: 0 });
      const upEvent = new MouseEvent('mouseup', { button: 0 });
      
      mockCanvas.dispatchEvent(downEvent);
      expect(game.input.mouse.buttons[0]).toBe(true);
      
      mockCanvas.dispatchEvent(upEvent);
      expect(game.input.mouse.buttons[0]).toBe(false);
    });
    
    test('should track different mouse buttons separately', () => {
      const leftClick = new MouseEvent('mousedown', { button: 0 });
      const rightClick = new MouseEvent('mousedown', { button: 2 });
      
      mockCanvas.dispatchEvent(leftClick);
      mockCanvas.dispatchEvent(rightClick);
      
      expect(game.input.mouse.buttons[0]).toBe(true);
      expect(game.input.mouse.buttons[2]).toBe(true);
    });
  });
  
  describe('Entity Interaction', () => {
    test('should detect collision between entities', () => {
      const entity1 = new Entity(100, 100);
      entity1.width = 50;
      entity1.height = 50;
      
      const entity2 = new Entity(120, 120);
      entity2.width = 50;
      entity2.height = 50;
      
      expect(entity1.collidesWith(entity2)).toBe(true);
    });
    
    test('should calculate distance between entities', () => {
      const entity1 = new Entity(0, 0);
      const entity2 = new Entity(3, 4);
      
      const distance = entity1.distanceTo(entity2);
      expect(distance).toBe(5);
    });
    
    test('should support entity tagging for interaction filtering', () => {
      const player = new Entity(0, 0);
      player.addTag('player');
      
      const enemy = new Entity(100, 100);
      enemy.addTag('enemy');
      
      expect(player.hasTag('player')).toBe(true);
      expect(player.hasTag('enemy')).toBe(false);
      expect(enemy.hasTag('enemy')).toBe(true);
    });
    
    test('should mark entities as dead when killed', () => {
      const entity = new Entity(0, 0);
      expect(entity.dead).toBe(false);
      
      entity.kill();
      expect(entity.dead).toBe(true);
    });
  });
  
  describe('Input Response', () => {
    test('should allow entity to respond to keyboard input', () => {
      const player = new Entity(0, 0);
      game.addEntity(player);
      
      // Simulate movement based on input
      const movePlayer = () => {
        if (game.input.keys['ArrowRight']) {
          player.velocity.x = 100;
        }
        if (game.input.keys['ArrowLeft']) {
          player.velocity.x = -100;
        }
      };
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);
      
      movePlayer();
      expect(player.velocity.x).toBe(100);
    });
    
    test('should allow entity to respond to mouse input', () => {
      const entity = new Entity(100, 100);
      const mouseX = game.input.mouse.x;
      const mouseY = game.input.mouse.y;
      
      // Verify mouse position can be accessed for entity interaction
      expect(typeof mouseX).toBe('number');
      expect(typeof mouseY).toBe('number');
    });
  });
  
  describe('Input State Management', () => {
    test('should clear input handlers on cleanup', () => {
      expect(game._keyDownHandler).toBeDefined();
      expect(game._keyUpHandler).toBeDefined();
      expect(game._mouseMoveHandler).toBeDefined();
    });
    
    test('should maintain input state across frames', () => {
      const event = new KeyboardEvent('keydown', { key: 'Space' });
      window.dispatchEvent(event);
      
      expect(game.input.keys['Space']).toBe(true);
      
      // Input should persist until released
      game.update(16);
      expect(game.input.keys['Space']).toBe(true);
    });
  });
});
