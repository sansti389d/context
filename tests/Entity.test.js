import { Entity } from '../src/core/Entity.js';

describe('Entity', () => {
  let entity;
  
  beforeEach(() => {
    entity = new Entity(100, 200);
  });
  
  test('should initialize with correct position', () => {
    expect(entity.x).toBe(100);
    expect(entity.y).toBe(200);
  });
  
  test('should update position based on velocity', () => {
    entity.velocity.x = 50;
    entity.velocity.y = 30;
    entity.update(1); // 1 second
    
    expect(entity.x).toBe(150);
    expect(entity.y).toBe(230);
  });
  
  test('should apply acceleration to velocity', () => {
    entity.acceleration.x = 10;
    entity.update(1);
    
    expect(entity.velocity.x).toBe(10);
  });
  
  test('should detect collision with another entity', () => {
    entity.width = 50;
    entity.height = 50;
    
    const other = new Entity(120, 220);
    other.width = 50;
    other.height = 50;
    
    expect(entity.collidesWith(other)).toBe(true);
  });
  
  test('should not detect collision when entities do not overlap', () => {
    entity.width = 50;
    entity.height = 50;
    
    const other = new Entity(200, 300);
    other.width = 50;
    other.height = 50;
    
    expect(entity.collidesWith(other)).toBe(false);
  });
  
  test('should calculate distance to another entity', () => {
    const other = new Entity(103, 204);
    const distance = entity.distanceTo(other);
    
    expect(distance).toBe(5);
  });
  
  test('should add and retrieve components', () => {
    const component = { name: 'test' };
    entity.addComponent('test', component);
    
    expect(entity.getComponent('test')).toBe(component);
  });
  
  test('should manage tags', () => {
    entity.addTag('player');
    expect(entity.hasTag('player')).toBe(true);
    expect(entity.hasTag('enemy')).toBe(false);
  });
  
  test('should mark entity as dead when killed', () => {
    entity.kill();
    expect(entity.dead).toBe(true);
  });
});
