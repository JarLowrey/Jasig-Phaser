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
    const diameter = 50;
    this.loadTexture(this.gun.info.key, this.gun.info.frame);
    ParentSprite.setSize(this, diameter, true);
  }

  //before calling this, it assumes the checkCollision method has passed
  static bulletCollision(unit, bullet) {
    console.log('collide', bullet.gun)

    const shootingWeapon = bullet.gun.shooter;
    bullet.kill();
    unit.damage(shootingWeapon.dmg, true);
  }

  static checkCollision(unit, bullet) {
    console.log('check', bullet.gun, bullet.alive && bullet.gun && unit.isAlive && unit.isFriendly != bullet.gun.shooter.isFriendly)
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
