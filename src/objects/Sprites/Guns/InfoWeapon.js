/*
 * InfoWeapon
 * ====
 */

export default class InfoWeapon extends Phaser.Weapon {

  get alive() {
    return this.trackedSprite !== null;
  }
  kill() {
    this.trackedSprite = null;
  }

  fire() {
    console.log(this.info, this.trackedSprite);
    let bullet = super.fire();
    bullet.gun = this.trackedSprite;
    return bullet;
  }

  _reuseBullets(bulletClassName = 'DefaultBullet') {
    let bulletGroup = this.game.spritePools.getPool(bulletClassName);
    console.log(bulletClassName, bulletGroup)
    let bulletClass = bulletGroup.getChildAt(0).constructor;
    console.log(bulletClass);

    this.bulletClass = bulletClass;
    this.bullets = bulletGroup;
  }

  setupWeapon(weaponInfo, trackedSprite) {
    this.autoExpandBulletsGroup = weaponInfo.autoExpandBulletsGroup || true; //if ammo was defined, do not auto expand group
    this._reuseBullets(weaponInfo.bulletClassName);

    this.bulletSpeed = weaponInfo.bulletSpeed || 500;
    this.fireRate = weaponInfo.fireRate || 500;
    this.dmg = 25; //this does nothing right now

    const percentOffset = (weaponInfo.xPercentOffset || 0) / 100;
    const xPixelOffset = Math.abs(trackedSprite.width) * percentOffset;
    const yPixelOffset = -trackedSprite.anchor.y * trackedSprite.height + trackedSprite.height / 2; //regardless of anchor, bullets start in middle Y of sprite
    this.trackSprite(trackedSprite, xPixelOffset, yPixelOffset, true); //track rotation too
  }
}
