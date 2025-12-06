/**
 * Scene class
 * Manages different game states/levels
 */
export class Scene {
  constructor() {
    this.game = null;
  }
  
  /**
   * Called when entering this scene
   */
  enter() {
    // Override in subclasses
  }
  
  /**
   * Called when exiting this scene
   */
  exit() {
    // Override in subclasses
  }
  
  /**
   * Update scene logic
   */
  update(deltaTime) {
    // Override in subclasses
  }
  
  /**
   * Render scene
   */
  render(ctx) {
    // Override in subclasses
  }
}
