/**
 * Test Suite: Game Controls
 * Verifies control system requirements
 */

import { Game } from '../src/core/Game.js';

describe('Game Controls Requirements', () => {
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
  
  describe('Keyboard Controls', () => {
    test('should detect arrow key up', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      window.dispatchEvent(event);
      
      expect(game.input.keys['ArrowUp']).toBe(true);
    });
    
    test('should detect arrow key down', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      window.dispatchEvent(event);
      
      expect(game.input.keys['ArrowDown']).toBe(true);
    });
    
    test('should detect arrow key left', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(event);
      
      expect(game.input.keys['ArrowLeft']).toBe(true);
    });
    
    test('should detect arrow key right', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);
      
      expect(game.input.keys['ArrowRight']).toBe(true);
    });
    
    test('should detect WASD keys for alternative movement', () => {
      const w = new KeyboardEvent('keydown', { key: 'w' });
      const a = new KeyboardEvent('keydown', { key: 'a' });
      const s = new KeyboardEvent('keydown', { key: 's' });
      const d = new KeyboardEvent('keydown', { key: 'd' });
      
      window.dispatchEvent(w);
      window.dispatchEvent(a);
      window.dispatchEvent(s);
      window.dispatchEvent(d);
      
      expect(game.input.keys['w']).toBe(true);
      expect(game.input.keys['a']).toBe(true);
      expect(game.input.keys['s']).toBe(true);
      expect(game.input.keys['d']).toBe(true);
    });
    
    test('should detect action keys (Space, Enter)', () => {
      const space = new KeyboardEvent('keydown', { key: ' ' });
      const enter = new KeyboardEvent('keydown', { key: 'Enter' });
      
      window.dispatchEvent(space);
      window.dispatchEvent(enter);
      
      expect(game.input.keys[' ']).toBe(true);
      expect(game.input.keys['Enter']).toBe(true);
    });
    
    test('should detect escape key for pause/menu', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);
      
      expect(game.input.keys['Escape']).toBe(true);
    });
    
    test('should handle simultaneous key presses', () => {
      const up = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const right = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const space = new KeyboardEvent('keydown', { key: ' ' });
      
      window.dispatchEvent(up);
      window.dispatchEvent(right);
      window.dispatchEvent(space);
      
      expect(game.input.keys['ArrowUp']).toBe(true);
      expect(game.input.keys['ArrowRight']).toBe(true);
      expect(game.input.keys[' ']).toBe(true);
    });
  });
  
  describe('Mouse Controls', () => {
    test('should track mouse position in canvas coordinates', () => {
      const rect = mockCanvas.getBoundingClientRect();
      const event = new MouseEvent('mousemove', {
        clientX: rect.left + 250,
        clientY: rect.top + 300
      });
      
      mockCanvas.dispatchEvent(event);
      
      expect(game.input.mouse.x).toBe(250);
      expect(game.input.mouse.y).toBe(300);
    });
    
    test('should detect left mouse button', () => {
      const event = new MouseEvent('mousedown', { button: 0 });
      mockCanvas.dispatchEvent(event);
      
      expect(game.input.mouse.buttons[0]).toBe(true);
    });
    
    test('should detect right mouse button', () => {
      const event = new MouseEvent('mousedown', { button: 2 });
      mockCanvas.dispatchEvent(event);
      
      expect(game.input.mouse.buttons[2]).toBe(true);
    });
    
    test('should detect middle mouse button', () => {
      const event = new MouseEvent('mousedown', { button: 1 });
      mockCanvas.dispatchEvent(event);
      
      expect(game.input.mouse.buttons[1]).toBe(true);
    });
    
    test('should update mouse position continuously', () => {
      const rect = mockCanvas.getBoundingClientRect();
      
      const event1 = new MouseEvent('mousemove', {
        clientX: rect.left + 100,
        clientY: rect.top + 100
      });
      mockCanvas.dispatchEvent(event1);
      expect(game.input.mouse.x).toBe(100);
      
      const event2 = new MouseEvent('mousemove', {
        clientX: rect.left + 200,
        clientY: rect.top + 150
      });
      mockCanvas.dispatchEvent(event2);
      expect(game.input.mouse.x).toBe(200);
      expect(game.input.mouse.y).toBe(150);
    });
  });
  
  describe('Control State Management', () => {
    test('should maintain key state until released', () => {
      const down = new KeyboardEvent('keydown', { key: 'Space' });
      window.dispatchEvent(down);
      
      expect(game.input.keys['Space']).toBe(true);
      
      // State persists
      expect(game.input.keys['Space']).toBe(true);
      
      const up = new KeyboardEvent('keyup', { key: 'Space' });
      window.dispatchEvent(up);
      
      expect(game.input.keys['Space']).toBe(false);
    });
    
    test('should maintain mouse button state until released', () => {
      const down = new MouseEvent('mousedown', { button: 0 });
      mockCanvas.dispatchEvent(down);
      
      expect(game.input.mouse.buttons[0]).toBe(true);
      
      const up = new MouseEvent('mouseup', { button: 0 });
      mockCanvas.dispatchEvent(up);
      
      expect(game.input.mouse.buttons[0]).toBe(false);
    });
    
    test('should handle rapid key press and release', () => {
      for (let i = 0; i < 5; i++) {
        const down = new KeyboardEvent('keydown', { key: 'Space' });
        const up = new KeyboardEvent('keyup', { key: 'Space' });
        
        window.dispatchEvent(down);
        expect(game.input.keys['Space']).toBe(true);
        
        window.dispatchEvent(up);
        expect(game.input.keys['Space']).toBe(false);
      }
    });
  });
  
  describe('Game Pause Control', () => {
    test('should pause game when requested', () => {
      game.start();
      expect(game.isPaused).toBe(false);
      
      game.pause();
      expect(game.isPaused).toBe(true);
    });
    
    test('should resume game from pause', () => {
      game.start();
      game.pause();
      
      expect(game.isPaused).toBe(true);
      
      game.resume();
      expect(game.isPaused).toBe(false);
    });
    
    test('should toggle pause state', () => {
      game.start();
      
      const initialState = game.isPaused;
      
      if (game.isPaused) {
        game.resume();
      } else {
        game.pause();
      }
      
      expect(game.isPaused).toBe(!initialState);
    });
  });
  
  describe('Control Accessibility', () => {
    test('should provide input state object', () => {
      expect(game.input).toBeDefined();
      expect(game.input.keys).toBeDefined();
      expect(game.input.mouse).toBeDefined();
    });
    
    test('should allow querying any key state', () => {
      const anyKey = 'k';
      const event = new KeyboardEvent('keydown', { key: anyKey });
      window.dispatchEvent(event);
      
      expect(game.input.keys[anyKey]).toBe(true);
    });
    
    test('should provide mouse coordinate access', () => {
      expect(typeof game.input.mouse.x).toBe('number');
      expect(typeof game.input.mouse.y).toBe('number');
    });
    
    test('should provide mouse button state access', () => {
      expect(game.input.mouse.buttons).toBeDefined();
      expect(typeof game.input.mouse.buttons).toBe('object');
    });
  });
});
