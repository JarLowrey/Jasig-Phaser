/*
 * Bullet
 * ====
 *
 */

import ParentSprite from '../Parents/ParentSprite';

export default class Bullet extends Phaser.Bullet {

  reset(x, y, health) {
    super.reset(x, y, health);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
  }

  setGun(gun) {
    this.gun = gun;
    const info = this.game.cache.getJSON('bullets')[this.gun.info.bulletKey];

    this.loadTexture(info.image.key, this._processFrame(info.image.frame));
    ParentSprite.setSize(this, info.width, true);
    this.dmg = info.base_dmg;
  }

  _processFrame(frameName) {
    if (this.isFriendly) {
      frameName.replace('Red', 'Blue');
    } else {
      frameName.replace('Blue', 'Red');
    }
    return frameName
  }

  //before calling this, it assumes the checkCollision method has passed
  static bulletCollision(unit, bullet) {
    unit.damage(bullet.dmg, true);
    bullet.kill();
  }

  static checkCollision(unit, bullet) {
    return unit.isAlive && bullet.alive && bullet.gun && unit.isFriendly != bullet.gun.shooter.isFriendly;
  }

  update() {
    if (!this.alive) return;

    if (this.target && this.target.isAlive) {
      this.game.physics.arcade.moveToObject(this, this.target, this.body.velocity); //track towards object
      this.body.angle = this.game.physics.arcade.angleBetween(this, this.target); //set bullet rotation angle to point towards target
    } else { //target could be revived after awhile, and then bullet would track wrong thing.
      this.target = null;
    }
    //this.game.debug.body(this, 'rgba(255,0,0,0.8)');
  }

  static createCircleBmd(game, diameter) {
    const radius = diameter / 2;
    let key = game.add.bitmapData(diameter, diameter);
    key.circle(radius, radius, radius, '#ffffff');
    return key;
  }

  kill() {
    if (this.inWorld) {
      this.game.spritePools.getPool('Explosion').getFirstDead(true).reset(this);
    }
    this.gun = null;
    super.kill();
  }
}
