/*
 * Unit
 * ====
 *
 */

import ParentSprite from '../Sprites/ParentSprite';
import Bonus from '../Sprites/Bonus';


export default class Unit extends ParentSprite {

  constructor(game){
    super(game);

    Unit.initClass(game);
  }

  static initClass(game){
    if(!Unit.explosionGroups){
      Unit.explosionGroups = {};
      Unit.addExplosionEmitter('explosion1', game);
    }
  }

  reset(x, y, health, width, key, frame, isFriendly, explosionFrame){
    super.reset(x, y, health, width, key, frame); //reset the physics body in addition to reviving the sprite. Otherwise collisions could be messed up
    this.maxHealth = health;

    Unit.addExplosionEmitter(explosionFrame, this.game);

    this.isFriendly = isFriendly;

    this.speed = 300;

    this.setAnchor(isFriendly);
  }

  kill(){
    super.kill();

    ParentSprite.getNewSprite(Bonus).reset('heal', this);

    this.showExplosion();
  }

  setAnchor(isFriendly){
    const yAnchor = (isFriendly) ? 1 : 0.5;
    this.anchor.setTo(0.5,yAnchor);
  }

  static unitCollision(friendlyUnit, enemyUnit){
    friendlyUnit.damage(15);
    enemyUnit.damage(10);
  }

  showExplosion(frame = 'explosion1'){
    var emitter = Unit.getExplosionEmitter(frame);
    const fastSpeed = ParentSprite.dp(400);
    const slowSpeed = fastSpeed * 0.75;
    const particleLifeSpan = 400;
    const numParticlesEmittedPerDirection = 3;

    //put the emitter on top of the thing that is exploding
    emitter.width = this.width ;
    emitter.height = this.height ;
    emitter.x = this.x;
    emitter.y = this.y;
    emitter.minParticleScale = this.getParticleScale(frame);
    emitter.maxParticleScale = this.getParticleScale(frame);

    //explode stationary
    //emitter.minParticleSpeed.set(-slowSpeed, -slowSpeed);
    //emitter.maxParticleSpeed.set(slowSpeed, slowSpeed);
    //emitter.start(true, 500, null, 2);

    //explode down
    emitter.minParticleSpeed.set(-slowSpeed, slowSpeed);
    emitter.maxParticleSpeed.set(slowSpeed, fastSpeed);
    emitter.start(true, particleLifeSpan, null, numParticlesEmittedPerDirection);
    //explode up
    emitter.minParticleSpeed.set(-slowSpeed, -fastSpeed);
    emitter.maxParticleSpeed.set(slowSpeed, -slowSpeed);
    emitter.start(true, particleLifeSpan, null, numParticlesEmittedPerDirection);

    //explode left
    emitter.minParticleSpeed.set(-fastSpeed, -slowSpeed);
    emitter.maxParticleSpeed.set(-slowSpeed, slowSpeed);
    emitter.start(true, particleLifeSpan, null, numParticlesEmittedPerDirection);
    //explode right
    emitter.minParticleSpeed.set(slowSpeed, -slowSpeed);
    emitter.maxParticleSpeed.set(fastSpeed, slowSpeed);
    emitter.start(true, particleLifeSpan, null, numParticlesEmittedPerDirection);
  }

  getParticleScale(particleFrame){
    const particleWidth = this.game.cache.getImage('sprites',particleFrame).base.width;

    const ratioDefaultParticleWidthToCurrentSpriteWidth = this.width / particleWidth;
    return ratioDefaultParticleWidthToCurrentSpriteWidth;
  }

  static getExplosionEmitter(frame = 'explosion1'){
    return Unit.explosionGroups[frame];
  }

  static addExplosionEmitter(frame = 'explosion1', game){
    if(frame in Unit.explosionGroups) return; //frame can not yet be added to the emitter hash

    //Emit an explosion upon death
    var emitter = game.add.emitter(0,0, 25);

    emitter.makeParticles('sprites',frame); //cannot change texture on the fly. Prob would be better to define an emitter per explosion texture desired (with lots of particles), and emit only a few of the particles upon death

    emitter.gravity = 0;

    emitter.setRotation(0, 0);
    emitter.setAlpha(0.75, 1);

    Unit.explosionGroups[frame] = emitter;
  }

}
