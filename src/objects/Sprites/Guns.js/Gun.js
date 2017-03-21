/*
 * Gun
 * ====
 * Sprite with an attached Phaser.Weapon that has a specific Bullet Class
 */
import Bullet from '../Sprites/Bullets/Bullet';
import DefaultBullet from '../Sprites/Bullets/DefaultBullet';

export default class Gun extends Phaser.Sprite {

  constructor(shooter, weaponInfo) {
    super(shooter.game, weaponInfo.x, weaponInfo.y, weaponInfo.key, weaponInfo.frame);

    this.shooter = shooter;
    this.shooter.addChild(this);

    this.info = weaponInfo;

    this._setupWeapon(weaponInfo);
  }

  static overlapBullets(receivers) {
    for (let weapon of this.weapons) {
      //receivers must be first param before bullets - http://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.html#overlap
      this.game.physics.arcade.overlap(receivers, this.weapon.bullets, Bullet.bulletCollision, null, this);
    }
  }

  _setupWeapon(weaponInfo) {
    const ammo = weaponInfo.preallocation || 30; //has unlimited ammo unless set otherwise in JSON

    var weapon = this.game.spritePools.getWeapon(weaponInfo.weaponName);
    weapon.autoExpandBulletsGroup = true; //if ammo was defined, do not auto expand group

    weapon.bulletSpeed = weaponInfo.bulletSpeed || 500;
    weapon.fireAngle = this._getWeaponAngle(weaponInfo.angle);


    weapon.fireRate = weaponInfo.fireRate || 500;
    weapon.dmg = 25; //this does nothing right now
    weapon.bullets.myWeapon = weapon;

    const percentOffset = (weaponInfo.xPercentOffset || 0) / 100;
    const xPixelOffset = Math.abs(this.shooter.width) * percentOffset;
    const yPixelOffset = -this.shooter.anchor.y * this.shooter.height + this.shooter.height / 2; //regardless of anchor, bullets start in middle Y of sprite
    weapon.trackSprite(this.shooter, xPixelOffset, yPixelOffset);

    this.weapon = weapon;
  }


  startShooting() {
    if (!this.shooter.isAlive) return;
    weapon.autofire = true;
  }

  stopShooting() {
    weapon.autofire = false;
  }

  kill() {
    super.kill();
    this.weapon.destroy(); //FUCK I NEED TO POOL WEAPONS (+ bullets) NOW TOO!
  }

  _getWeaponAngle(angle) {
    let newAngle = 0;
    if (angle === undefined) {
      newAngle = (this.shooter.isFriendly) ? Phaser.ANGLE_UP : Phaser.ANGLE_DOWN;
    } else {
      newAngle = (this.shooter.isFriendly) ? 360 - angle : angle;
    }
    return newAngle;
  }

  static _getBulletClass(classKey) {
    let newClass = null;
    switch (classKey) {
      default: newClass = DefaultBullet;
    }
    return newClass;
  }

}
