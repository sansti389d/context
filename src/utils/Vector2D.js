/**
 * 2D Vector utility class
 */
export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  /**
   * Add another vector
   */
  add(v) {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }
  
  /**
   * Subtract another vector
   */
  subtract(v) {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }
  
  /**
   * Multiply by scalar
   */
  multiply(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }
  
  /**
   * Divide by scalar
   */
  divide(scalar) {
    if (scalar === 0) throw new Error('Division by zero');
    return new Vector2D(this.x / scalar, this.y / scalar);
  }
  
  /**
   * Get magnitude (length)
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  /**
   * Normalize vector (make length 1)
   */
  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D(0, 0);
    return this.divide(mag);
  }
  
  /**
   * Dot product
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  
  /**
   * Get distance to another vector
   */
  distanceTo(v) {
    return this.subtract(v).magnitude();
  }
  
  /**
   * Get angle in radians
   */
  angle() {
    return Math.atan2(this.y, this.x);
  }
  
  /**
   * Rotate by angle (in radians)
   */
  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }
  
  /**
   * Clone this vector
   */
  clone() {
    return new Vector2D(this.x, this.y);
  }
  
  /**
   * Create from angle and magnitude
   */
  static fromAngle(angle, magnitude = 1) {
    return new Vector2D(
      Math.cos(angle) * magnitude,
      Math.sin(angle) * magnitude
    );
  }
}
