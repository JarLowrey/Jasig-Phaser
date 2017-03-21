/*
 * InfoWeapon
 * ====
 */
import DefaultBullet from '../Bullets/DefaultBullet';

export default class InfoWeapon extends Phaser.Weapon {

  get alive() {
    return this.trackedSprite !== null;
  }
  kill() {
    this.trackedSprite = null;
  }

  fire(from, x, y, offsetX, offsetY) {
    let bullet = super.fire(from, x, y, offsetX, offsetY);
    if (bullet == null) {
      return null;
    }
    console.log(bullet)
    bullet.setGun(this.trackedSprite);
    return bullet;
  }

  static _getBulletClass(className) {
    switch (className) {
      default: return DefaultBullet;
    }
  }

  setupWeapon(weaponInfo, trackedSprite) {
    this.info = weaponInfo;

    //setup bullets group
    let bulletClass = InfoWeapon._getBulletClass(weaponInfo.bulletClass);
    this.bulletClass = bulletClass;
    this.createBullets(weaponInfo.preallocationAmount || 20);

    this.autoExpandBulletsGroup = weaponInfo.autoExpandBulletsGroup || true; //if ammo was defined, do not auto expand group

    this.bulletSpeed = weaponInfo.bulletSpeed || 500;
    this.fireRate = weaponInfo.fireRate || 500;
    this.dmg = 25; //this does nothing right now

    const percentOffset = (weaponInfo.xPercentOffset || 0) / 100;
    const xPixelOffset = Math.abs(trackedSprite.width) * percentOffset;
    const yPixelOffset = -trackedSprite.anchor.y * trackedSprite.height + trackedSprite.height / 2; //regardless of anchor, bullets start in middle Y of sprite
    this.trackSprite(trackedSprite, xPixelOffset, yPixelOffset, true); //track rotation too
  }
}
