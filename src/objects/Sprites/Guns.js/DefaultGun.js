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

}
