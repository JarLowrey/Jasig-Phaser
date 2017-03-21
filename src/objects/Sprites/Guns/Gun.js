/*
 * Gun
 * ====
 * Sprite with an attached Phaser.Weapon that has a specific Bullet Class
 */
import ParentSprite from '../Parents/ParentSprite';

export default class Gun extends ParentSprite {

  reset(shooter, gunInfo) {
    super.reset(null, null, gunInfo);

    this.shooter = shooter;
    this.shooter.addChild(this);

    this.weapon = this.game.spritePools.getWeapon();
    this.weapon.setupWeapon(this.info, this);
  }

  startShooting() {
    if (!this.shooter.isAlive) return;
    this.weapon.autofire = true;
  }

  stopShooting() {
    this.weapon.autofire = false;
  }

  kill() {
    super.kill();
    this.weapon.kill(); //FUCK I NEED TO POOL WEAPONS (+ bullets) NOW TOO!
  }

}
