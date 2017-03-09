/*
 * BulletExplosion
 * ====
 *
 */
import ParentSprite from '../Parents/ParentSprite';


export default class BulletExplosion extends Phaser.Particle {

  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame);

    this.explosions = [
      this.game.animations.laserRedExplosion,
      this.game.animations.laserBlueExplosion,
      this.game.animations.laserGreenExplosion
    ];
    ParentSprite.setupAnimations(this, this.explosions);
  }

  reset(x, y, health) {
    super.reset(x, y, health);

    const emitter = this.parent;
    const spriteExplodingFrom = emitter.spriteExplodingFrom;

    let explosionFrames = null;
    if (spriteExplodingFrom.frameName.includes('Red')) {
      explosionFrames = this.game.animations.laserRedExplosion;
    } else if (spriteExplodingFrom.frameName.includes('Blue')) {
      explosionFrames = this.game.animations.laserBlueExplosion;
    } else if (spriteExplodingFrom.frameName.includes('Green')) {
      explosionFrames = this.game.animations.laserGreenExplosion;
    }
    this.play(explosionFrames, null, null, true);
  }
}
