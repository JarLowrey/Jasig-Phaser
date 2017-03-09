/*
 * Weapons
 * ====
 * Convenience class to manage having multiple weapons
 */
import DefaultBullet from '../Sprites/Bullets/DefaultBullet';

export default class Weapons {
  constructor(shooter) {
    this.game = shooter.game;
    this.shooter = shooter;

    this.weapons = [];
  }

  overlapBullets(receivers) {
    for (let weapon of this.weapons) {
      //receivers must be first param before bullets - http://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.html#overlap
      this.game.physics.arcade.overlap(receivers, weapon.bullets, Weapons.bulletCollision, null, this);
    }
  }

  startShooting() {
    if (!this.shooter.isAlive) return;

    this.weapons.forEach(function(weapon) {
      weapon.autofire = true;
    });
  }
  stopShooting() {
    this.weapons.forEach(function(weapon) {
      weapon.autofire = false;
    });
  }

  setupWeapons(leveledWeapon) {
    //add all the weapons from the json file
    for (var i in leveledWeapon) {
      const weaponInfo = leveledWeapon[i];
      const ammo = weaponInfo.preallocation || 20; //has unlimited ammo unless set otherwise in JSON

      var weapon = this.game.plugins.add(Phaser.Weapon);
      weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
      weapon.bulletSpeed = weaponInfo.bulletSpeed || 500;
      weapon.fireAngle = this._getWeaponAngle(weaponInfo.angle);

      weapon.bulletClass = Weapons._getBulletClass();
      weapon.createBullets(ammo);
      weapon.autoExpandBulletsGroup = true; //if ammo was defined, do not auto expand group

      weapon.fireRate = weaponInfo.fireRate || 500;
      weapon.dmg = 25; //this does nothing right now
      weapon.bullets.myWeapon = weapon;

      const percentOffset = (weaponInfo.xPercentOffset || 0) / 100;
      const xPixelOffset = Math.abs(this.shooter.width) * percentOffset;
      const yPixelOffset = -this.shooter.anchor.y * this.shooter.height + this.shooter.height / 2; //regardless of anchor, bullets start in middle Y of sprite
      weapon.trackSprite(this.shooter, xPixelOffset, yPixelOffset);

      this.weapons.push(weapon);
    }
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

  static cleanupAllWeapons(game) {
    //clean up all the weapons
    let destroyWeapons = function(sprite) {
      if (sprite.weapons) {
        for (let weapon of sprite.weapons.weapons) {
          weapon.destroy();
        }
      }
    };

    destroyWeapons(game.data.play.player);

    for (let poolName in game.spritePools.pools) {
      let pool = game.spritePools.pools[poolName];
      pool.forEachAlive(function(child) {
        destroyWeapons(child);
      }, this);
    }
  }

  static _getBulletClass(classKey) {
    let newClass = null;
    switch (classKey) {
      default: newClass = DefaultBullet;
    }
    return newClass;
  }

  static bulletCollision(unit, bullet) {
    const shootingWeapon = bullet.parent.myWeapon;
    if (unit.isAlive) bullet.kill();
    if (unit.isAlive) unit.damage(shootingWeapon.dmg, true);
  }

}
