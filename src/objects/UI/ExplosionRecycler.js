/*
 * ExplosionRecycler
 * ====
 * Handles the explosion particle effects for recycled sprites. When recycled, a sprite may have a new particle frame. It would be inefficient to
 * constantly recreate a new emitter/re-assign texture to all particles at spawn time. Instead, this class creates an emitter per frame/Image
 * with enough particles for multiple simulateous explosions. Then, when the item needs to explode/recycle it can use existing particles
 * (or create a new one for itself and friends if it has not been created yet).
 */

export default class ExplosionRecycler {

  constructor(game, explodingSprite){
    this.game = game;
    this.explodingSprite = explodingSprite;

    if(!ExplosionRecycler.explosionGroups){
      ExplosionRecycler.explosionGroups = {};
    }
  }

  showExplosion(key = 'sprites', frame = 'explosion1', explosionParticleLifeSpan = 400, explosionSpeed = 400, numParticlesEmittedPerDirection = 2){
    this.addExplosionEmitter(key, frame); //checks to see if the emitter has been added yet. If not, it does so.

    var emitter = this.getExplosionEmitter(key,frame);
    const fastSpeed = explosionSpeed;
    const slowSpeed = explosionSpeed * 0.75;

    //put the emitter on top of the thing that is exploding
    emitter.width = this.explodingSprite.width ;
    emitter.height = this.explodingSprite.height ;
    emitter.x = this.explodingSprite.x;
    emitter.y = this.explodingSprite.y;
    emitter.minParticleScale = this.getParticleScale(frame);
    emitter.maxParticleScale = this.getParticleScale(frame);

    //explode stationary
    //emitter.minParticleSpeed.set(-slowSpeed, -slowSpeed);
    //emitter.maxParticleSpeed.set(slowSpeed, slowSpeed);
    //emitter.start(true, 500, null, 2);

    //explode down
    emitter.minParticleSpeed.set(-slowSpeed, slowSpeed);
    emitter.maxParticleSpeed.set(slowSpeed, fastSpeed);
    emitter.start(true, explosionParticleLifeSpan, null, numParticlesEmittedPerDirection);
    //explode up
    emitter.minParticleSpeed.set(-slowSpeed, -fastSpeed);
    emitter.maxParticleSpeed.set(slowSpeed, -slowSpeed);
    emitter.start(true, explosionParticleLifeSpan, null, numParticlesEmittedPerDirection);

    //explode left
    emitter.minParticleSpeed.set(-fastSpeed, -slowSpeed);
    emitter.maxParticleSpeed.set(-slowSpeed, slowSpeed);
    emitter.start(true, explosionParticleLifeSpan, null, numParticlesEmittedPerDirection);
    //explode right
    emitter.minParticleSpeed.set(slowSpeed, -slowSpeed);
    emitter.maxParticleSpeed.set(fastSpeed, slowSpeed);
    emitter.start(true, explosionParticleLifeSpan, null, numParticlesEmittedPerDirection);
  }

  getParticleScale(particleFrame){
    const particleWidth = this.game.cache.getFrameByName('sprites',particleFrame).width;
    const desiredWidth = 20;
    return  desiredWidth / particleWidth;
  }

  static _getHashKey(explosionImageKey,explosionImageFrame){
    return explosionImageKey+'_'+explosionImageFrame;
  }

  getExplosionEmitter(key = 'sprites', frame = 'explosion1'){
    return ExplosionRecycler.explosionGroups[ ExplosionRecycler._getHashKey(key, frame) ];
  }

  addExplosionEmitter(key = 'sprites', frame = 'explosion1'){
    const emitterAlreadyCreated = this.getExplosionEmitter(key, frame) != null;
    const stateChangeNukedParticles = emitterAlreadyCreated && this.getExplosionEmitter(key, frame).game != null;
    if(emitterAlreadyCreated && !stateChangeNukedParticles) return;

    //Emit an explosion upon death
    var emitter = this.game.add.emitter(0,0, 25);

    emitter.makeParticles(key,frame);

    emitter.gravity = 0;

    emitter.setRotation(0, 0);
    emitter.setAlpha(0.75, 1);

    ExplosionRecycler.explosionGroups[ ExplosionRecycler._getHashKey(key, frame) ] = emitter;
  }

}
