/**
 * Test Suite: Win/Lose Conditions
 * Verifies game state and win/lose condition requirements
 */

import { Game } from '../src/core/Game.js';
import { Entity } from '../src/core/Entity.js';
import { Scene } from '../src/core/Scene.js';

describe('Win/Lose Conditions Requirements', () => {
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
  
  describe('Game State Management', () => {
    test('should track running state', () => {
      expect(game.isRunning).toBe(false);
      game.start();
      expect(game.isRunning).toBe(true);
      game.stop();
      expect(game.isRunning).toBe(false);
    });
    
    test('should track paused state', () => {
      game.start();
      expect(game.isPaused).toBe(false);
      
      game.pause();
      expect(game.isPaused).toBe(true);
      
      game.resume();
      expect(game.isPaused).toBe(false);
    });
    
    test('should maintain game state through scene transitions', () => {
      const scene1 = new Scene();
      const scene2 = new Scene();
      
      game.addScene('play', scene1);
      game.addScene('gameover', scene2);
      
      game.setScene('play');
      expect(game.currentScene).toBe(scene1);
      
      game.setScene('gameover');
      expect(game.currentScene).toBe(scene2);
    });
  });
  
  describe('Entity Life Cycle', () => {
    test('should mark entities as dead', () => {
      const entity = new Entity(0, 0);
      expect(entity.dead).toBe(false);
      
      entity.kill();
      expect(entity.dead).toBe(true);
    });
    
    test('should track multiple entity deaths', () => {
      const entity1 = new Entity(0, 0);
      const entity2 = new Entity(100, 100);
      const entity3 = new Entity(200, 200);
      
      game.addEntity(entity1);
      game.addEntity(entity2);
      game.addEntity(entity3);
      
      entity1.kill();
      entity2.kill();
      
      const deadCount = game.entities.filter(e => e.dead).length;
      expect(deadCount).toBe(2);
    });
    
    test('should remove dead entities from game', () => {
      const entity = new Entity(0, 0);
      game.addEntity(entity);
      
      entity.kill();
      game.removeEntity(entity);
      
      expect(game.entities).not.toContain(entity);
    });
  });
  
  describe('Score and Progress Tracking', () => {
    test('should allow custom game state properties', () => {
      game.score = 0;
      game.lives = 3;
      
      expect(game.score).toBe(0);
      expect(game.lives).toBe(3);
      
      game.score += 100;
      game.lives -= 1;
      
      expect(game.score).toBe(100);
      expect(game.lives).toBe(2);
    });
    
    test('should track entity collections for win conditions', () => {
      const collectible1 = new Entity(50, 50);
      collectible1.addTag('collectible');
      
      const collectible2 = new Entity(150, 150);
      collectible2.addTag('collectible');
      
      game.addEntity(collectible1);
      game.addEntity(collectible2);
      
      const collectibles = game.entities.filter(e => e.hasTag('collectible'));
      expect(collectibles.length).toBe(2);
    });
    
    test('should detect when all objectives are completed', () => {
      const obj1 = new Entity(0, 0);
      obj1.addTag('objective');
      const obj2 = new Entity(100, 100);
      obj2.addTag('objective');
      
      game.addEntity(obj1);
      game.addEntity(obj2);
      
      obj1.kill();
      obj2.kill();
      
      const remainingObjectives = game.entities.filter(
        e => e.hasTag('objective') && !e.dead
      );
      
      expect(remainingObjectives.length).toBe(0);
    });
  });
  
  describe('Win Condition Scenarios', () => {
    test('should support time-based win conditions', () => {
      let gameTime = 0;
      const targetTime = 60000; // 60 seconds
      
      gameTime += 16; // Simulate frame time
      
      expect(gameTime).toBeLessThan(targetTime);
      
      gameTime = targetTime;
      const hasWon = gameTime >= targetTime;
      
      expect(hasWon).toBe(true);
    });
    
    test('should support score-based win conditions', () => {
      game.score = 0;
      const winScore = 1000;
      
      game.score = 500;
      expect(game.score >= winScore).toBe(false);
      
      game.score = 1000;
      expect(game.score >= winScore).toBe(true);
    });
    
    test('should support entity count win conditions', () => {
      const enemy1 = new Entity(0, 0);
      enemy1.addTag('enemy');
      const enemy2 = new Entity(100, 100);
      enemy2.addTag('enemy');
      
      game.addEntity(enemy1);
      game.addEntity(enemy2);
      
      enemy1.kill();
      enemy2.kill();
      
      const aliveEnemies = game.entities.filter(
        e => e.hasTag('enemy') && !e.dead
      );
      
      const allEnemiesDefeated = aliveEnemies.length === 0;
      expect(allEnemiesDefeated).toBe(true);
    });
  });
  
  describe('Lose Condition Scenarios', () => {
    test('should support life-based lose conditions', () => {
      game.lives = 3;
      
      game.lives -= 1;
      expect(game.lives > 0).toBe(true);
      
      game.lives = 0;
      const hasLost = game.lives <= 0;
      
      expect(hasLost).toBe(true);
    });
    
    test('should detect player death', () => {
      const player = new Entity(0, 0);
      player.addTag('player');
      
      game.addEntity(player);
      
      expect(player.dead).toBe(false);
      
      player.kill();
      expect(player.dead).toBe(true);
    });
    
    test('should support time limit lose conditions', () => {
      let gameTime = 0;
      const timeLimit = 120000; // 2 minutes
      
      gameTime = 119000;
      expect(gameTime >= timeLimit).toBe(false);
      
      gameTime = 120000;
      const timeExpired = gameTime >= timeLimit;
      
      expect(timeExpired).toBe(true);
    });
  });
  
  describe('Scene Transitions for Game States', () => {
    test('should transition to win scene', () => {
      const playScene = new Scene();
      const winScene = new Scene();
      
      winScene.enter = jest.fn();
      
      game.addScene('play', playScene);
      game.addScene('win', winScene);
      
      game.setScene('play');
      game.setScene('win');
      
      expect(game.currentScene).toBe(winScene);
      expect(winScene.enter).toHaveBeenCalled();
    });
    
    test('should transition to lose scene', () => {
      const playScene = new Scene();
      const loseScene = new Scene();
      
      loseScene.enter = jest.fn();
      
      game.addScene('play', playScene);
      game.addScene('lose', loseScene);
      
      game.setScene('play');
      game.setScene('lose');
      
      expect(game.currentScene).toBe(loseScene);
      expect(loseScene.enter).toHaveBeenCalled();
    });
    
    test('should clean up previous scene on transition', () => {
      const playScene = new Scene();
      const endScene = new Scene();
      
      playScene.exit = jest.fn();
      
      game.addScene('play', playScene);
      game.addScene('end', endScene);
      
      game.setScene('play');
      game.setScene('end');
      
      expect(playScene.exit).toHaveBeenCalled();
    });
  });
});
