/*
 * Gun
 * ====
 * Sprite with an attached Phaser.Weapon that has a specific Bullet Class
 */
import ParentSprite from '../../Sprites/Parents/ParentSprite';
import InfoWeapon from './InfoWeapon';

export default class Gun extends ParentSprite {

  reset(shooter, shipWeaponInfo) {
    super.reset(null, null, Gun._gunInfo(this.game, shipWeaponInfo));

    this.info = shipWeaponInfo; //overwrite the gun info that was passed up to parents
    this.gunInfo = Gun._gunInfo(this.game, shipWeaponInfo);

    this.shooter = shooter;
    this.shooter.addChild(this);
    this.sendToBack();

    const scaledWidth = Math.abs(this.shooter.width / this.shooter.scale.x);
    const scaledHeight = Math.abs(this.shooter.height / this.shooter.scale.y);
    this.x = scaledWidth * shipWeaponInfo.percentOffsetFromCenter.x / 100;
    this.y = scaledHeight * shipWeaponInfo.percentOffsetFromCenter.y / 100;

    if (this.shooter.isFriendly) {
      this.angle = Phaser.ANGLE_UP;
    } else {
      this.angle = Phaser.ANGLE_DOWN;
    }

    //use ships bullet key, or the guns bullet key, or the default one
    const bulletKey = shipWeaponInfo.bulletKey || this.gunInfo.bulletKey || 'default';
    const bulletClassName = this.game.cache.getJSON('bullets')[bulletKey];
    this.weapon = this.game.spritePools.getWeapon(this.info.bulletClassName || 'Bullet', this.info.ammo);
    this.weapon.setupWeapon(this.info, this);
  }

  static _gunInfo(game, shipWeaponInfo) {
    const gunKey = shipWeaponInfo.gunKey || 'default';
    return game.cache.getJSON('guns')[gunKey];
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
    this.weapon.kill();
  }

}
