/*
 * Explosion
 * ====
 *
 */
import ParentSprite from './Parents/ParentSprite';
import Ship from './Parents/Ship';
import Bullet from '../Gear/Bullets/Bullet';

export default class Explosion extends Phaser.Sprite {

  constructor(game) {
    super(game);

    //this.game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    this.loadTexture('sprites');

    this.shipExplosions = [
      this.game.animations.sonicExplosion,
      this.game.animations.regularExplosion
    ];
    ParentSprite.setupAnimations(this, this.shipExplosions);

    this.bulletExplosions = [
      this.game.animations.laserRedExplosion,
      this.game.animations.laserBlueExplosion,
      this.game.animations.laserGreenExplosion
    ];
    ParentSprite.setupAnimations(this, this.bulletExplosions);
  }

  reset(spriteExplodingFrom, width) {
    super.reset(spriteExplodingFrom.x, spriteExplodingFrom.y);
    this.spriteExplodingFrom = spriteExplodingFrom;

    const explosion = this._getExplosionKey();
    this.animations.play(explosion.key, null, null, true);

    this.width = width || explosion.width || spriteExplodingFrom.width;
    this.scale.y = Math.abs(this.scale.x);
    this.angle = Math.random() * 360;
  }

  _getExplosionKey() {
    let explosion = null;
    if (this.spriteExplodingFrom instanceof Ship) {
      explosion = this._getShipExplosion();
    } else if (this.spriteExplodingFrom instanceof Bullet) {
      explosion = this._getBulletExplosion();
    }
    return explosion;
  }
  _getShipExplosion() {
    const explosions = this.shipExplosions;
    const randShipExplosion = explosions[Math.floor(Math.random() * explosions.length)];
    return randShipExplosion;
  }

  _getBulletExplosion() {
    let explosion = null;

    const frame = this.spriteExplodingFrom.frameName;
    const tint = this.spriteExplodingFrom.tint;
    const shooter = this.spriteExplodingFrom.gun.shooter;

    if (tint == 0xff0000 || frame.includes('Red') || !shooter.isFriendly) {
      explosion = this.game.animations.laserRedExplosion;
    } else if (tint == 0x0000ff || frame.includes('Blue') || shooter.isFriendly) {
      explosion = this.game.animations.laserBlueExplosion;
    } else if (tint == 0x00ff00 || frame.includes('Green')) {
      explosion = this.game.animations.laserGreenExplosion;
    }

    return explosion;
  }

}
