/**
 * Base Entity class
 * All game objects inherit from this
 */
export class Entity {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
    this.scale = { x: 1, y: 1 };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.dead = false;
    this.visible = true;
    this.tags = new Set();
    this.game = null;
    this.components = new Map();
  }
  
  /**
   * Initialize entity (called when added to game)
   */
  init() {
    // Override in subclasses
  }
  
  /**
   * Update entity logic
   */
  update(deltaTime) {
    // Apply acceleration
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;
    
    // Apply velocity
    this.x += this.velocity.x * deltaTime;
    this.y += this.velocity.y * deltaTime;
    
    // Update components
    for (const component of this.components.values()) {
      if (component.update) {
        component.update(deltaTime);
      }
    }
  }
  
  /**
   * Render entity
   */
  render(ctx) {
    if (!this.visible) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale.x, this.scale.y);
    
    // Render components
    for (const component of this.components.values()) {
      if (component.render) {
        component.render(ctx);
      }
    }
    
    ctx.restore();
  }
  
  /**
   * Clean up entity
   */
  destroy() {
    // Override in subclasses
    for (const component of this.components.values()) {
      if (component.destroy) {
        component.destroy();
      }
    }
  }
  
  /**
   * Add a component to this entity
   */
  addComponent(name, component) {
    component.entity = this;
    this.components.set(name, component);
    if (component.init) component.init();
    return component;
  }
  
  /**
   * Get a component by name
   */
  getComponent(name) {
    return this.components.get(name);
  }
  
  /**
   * Remove a component
   */
  removeComponent(name) {
    const component = this.components.get(name);
    if (component) {
      if (component.destroy) component.destroy();
      this.components.delete(name);
    }
  }
  
  /**
   * Add a tag to this entity
   */
  addTag(tag) {
    this.tags.add(tag);
  }
  
  /**
   * Check if entity has a tag
   */
  hasTag(tag) {
    return this.tags.has(tag);
  }
  
  /**
   * Check collision with another entity (AABB)
   */
  collidesWith(other) {
    return this.x < other.x + other.width &&
           this.x + this.width > other.x &&
           this.y < other.y + other.height &&
           this.y + this.height > other.y;
  }
  
  /**
   * Get center position
   */
  getCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }
  
  /**
   * Calculate distance to another entity
   */
  distanceTo(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * Mark entity for removal
   */
  kill() {
    this.dead = true;
  }
}
