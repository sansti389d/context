/**
 * Asset Loader
 * Handles loading of images, audio, and other assets
 */
export class AssetLoader {
  constructor() {
    this.images = new Map();
    this.audio = new Map();
    this.loadedCount = 0;
    this.totalCount = 0;
  }
  
  /**
   * Load an image
   */
  loadImage(name, path) {
    this.totalCount++;
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(name, img);
        this.loadedCount++;
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${path}`));
      };
      img.src = path;
    });
  }
  
  /**
   * Load multiple images
   */
  async loadImages(imageMap) {
    const promises = [];
    for (const [name, path] of Object.entries(imageMap)) {
      promises.push(this.loadImage(name, path));
    }
    return Promise.all(promises);
  }
  
  /**
   * Load an audio file
   */
  loadAudio(name, path) {
    this.totalCount++;
    
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.audio.set(name, audio);
        this.loadedCount++;
        resolve(audio);
      };
      audio.onerror = () => {
        reject(new Error(`Failed to load audio: ${path}`));
      };
      audio.src = path;
    });
  }
  
  /**
   * Load multiple audio files
   */
  async loadAudioFiles(audioMap) {
    const promises = [];
    for (const [name, path] of Object.entries(audioMap)) {
      promises.push(this.loadAudio(name, path));
    }
    return Promise.all(promises);
  }
  
  /**
   * Get a loaded image
   */
  getImage(name) {
    return this.images.get(name);
  }
  
  /**
   * Get a loaded audio
   */
  getAudio(name) {
    return this.audio.get(name);
  }
  
  /**
   * Play an audio file
   */
  playAudio(name, loop = false) {
    const audio = this.audio.get(name);
    if (audio) {
      audio.loop = loop;
      audio.currentTime = 0;
      audio.play();
    }
  }
  
  /**
   * Stop an audio file
   */
  stopAudio(name) {
    const audio = this.audio.get(name);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
  
  /**
   * Get loading progress (0-1)
   */
  getProgress() {
    if (this.totalCount === 0) return 1;
    return this.loadedCount / this.totalCount;
  }
  
  /**
   * Check if all assets are loaded
   */
  isComplete() {
    return this.loadedCount === this.totalCount;
  }
}
