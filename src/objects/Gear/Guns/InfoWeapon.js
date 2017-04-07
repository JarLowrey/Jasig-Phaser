/*
 * InfoWeapon
 * ====
 * Responsible for the actual shooting. Has "Info" because it is poolable and loads details from JSON
 */
import Bullet from '../Bullets/Bullet';

export default class InfoWeapon extends Phaser.Weapon {

  createClassBullets(bulletClassName, numBullets) {
    //setup bullets group
    let bulletClass = InfoWeapon._getBulletClass(bulletClassName);
    this.bulletClass = bulletClass;
    this.createBullets(numBullets);
    this.autoExpandBulletsGroup = true; //if ammo was defined, do not auto expand group
  }

  get alive() {
    return this.trackedSprite !== null;
  }
  kill() {
    this.autofire = false;
    this.trackedSprite = null;
  }
  get gun() { //convenience method for accessing the gun sprite that shoots this weapon
    return this.trackedSprite;
  }

  fire(from, x, y, offsetX, offsetY) {
    let bullet = super.fire(from, x, y, offsetX, offsetY);
    if (bullet == null) {
      return null;
    }

    bullet.setGun(this.gun);
    bullet.rotation = this.gun.worldRotation;
    this.game.physics.arcade.velocityFromRotation(bullet.rotation, this.bulletSpeed, bullet.body.velocity);
    return bullet;
  }

  static _getBulletClass(className) {
    switch (className) {
      default: return Bullet;
    }
  }

  setupWeapon(weaponInfo, trackedSprite) {
    this.info = weaponInfo;

    this.bulletSpeed = weaponInfo.bulletSpeed || 800;
    this.fireRate = weaponInfo.fireRate || 500;

    const percentOffset = (weaponInfo.xPercentOffset || 0) / 100;
    const xPixelOffset = Math.abs(trackedSprite.width) * percentOffset;
    const yPixelOffset = -trackedSprite.anchor.y * trackedSprite.height + trackedSprite.height / 2; //regardless of anchor, bullets start in middle Y of sprite
    this.trackSprite(trackedSprite, xPixelOffset, yPixelOffset, true);

    this.fireFrom.width = this.info.fireFromWidth || 3;
  }
}
