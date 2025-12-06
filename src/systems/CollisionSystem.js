/**
 * Collision Detection System
 * Handles collision detection between entities
 */
export class CollisionSystem {
  constructor() {
    this.game = null;
    this.collisionPairs = [];
  }
  
  init() {
    // Setup
  }
  
  update(deltaTime) {
    this.collisionPairs = [];
    const entities = this.game.entities;
    
    // Broad phase - check all pairs
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entityA = entities[i];
        const entityB = entities[j];
        
        if (this._shouldCheck(entityA, entityB) && entityA.collidesWith(entityB)) {
          this.collisionPairs.push({ a: entityA, b: entityB });
          
          // Notify entities of collision
          if (entityA.onCollision) {
            entityA.onCollision(entityB);
          }
          if (entityB.onCollision) {
            entityB.onCollision(entityA);
          }
        }
      }
    }
  }
  
  /**
   * Check if two entities should be tested for collision
   */
  _shouldCheck(entityA, entityB) {
    // Skip if either entity doesn't have collision enabled
    return entityA.width > 0 && entityA.height > 0 &&
           entityB.width > 0 && entityB.height > 0;
  }
  
  /**
   * Get all collision pairs from last update
   */
  getCollisionPairs() {
    return this.collisionPairs;
  }
}
