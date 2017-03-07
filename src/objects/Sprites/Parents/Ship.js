/*
 * Ship
 * ====
 *
 */

import Unit from './Unit';
import * as PhaserUi from 'phaser-ui';

import DefaultBullet from '../Bullets/DefaultBullet';

export default class Ship extends Unit {
  static className() {
    return 'Ship';
  }

  constructor(game) {
    super(game);

    this.healthbar = new PhaserUi.ProgressBar(this.game, 100, 15, null, 2);
    this.addChild(this.healthbar);
    this.healthbar.visible = false; //since many sprites are preallocated in pools, you need to manually hide the healthbar upon creation
  }

  update() {
    if (!this.isAlive) return;

    super.update();
  }

  reset(shipName, isFriendly) {
    super.reset(shipName, isFriendly, 'ships');

    this.healthbar.width = this.width / this.scale.x;
    this.healthbar.scale.y = Math.abs(this.healthbar.scale.x);
    this.healthbar.y = -(10 + this.height / 2) / Math.abs(this.scale.y);
    this.healthbar.setText('', Object.assign({}, this.game.fonts.text));
    this.updateHealthbar();
    this.healthbar.visible = true;

    this._setupWeapons();
  }

  _setupWeapons() {
    //add all the weapons from the json file
    this.weapons = [];
    const leveledWeapon = this.info.weapons['low_level'];
    for (var i in leveledWeapon) {
      const weaponInfo = leveledWeapon[i];
      const ammo = weaponInfo.preallocation || 40; //has unlimited ammo unless set otherwise in JSON

      var weapon = this.game.plugins.add(Phaser.Weapon);
      weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
      weapon.bulletSpeed = weaponInfo.bulletSpeed || 500;
      weapon.fireAngle = this._getWeaponAngle(weaponInfo.angle);

      weapon.bulletClass = Ship._getBulletClass();
      weapon.createBullets(ammo);
      weapon.autoExpandBulletsGroup = true; //if ammo was defined, do not auto expand group

      weapon.fireRate = weaponInfo.fireRate || 200;
      //weapon.dmg = this.getDamage();
      weapon.dmg = 25; //this does nothing right now
      weapon.bullets.myWeapon = weapon;

      const percentOffset = (weaponInfo.xPercentOffset || 0) / 100;
      const xPixelOffset = Math.abs(this.width) * percentOffset;
      const yPixelOffset = -this.anchor.y * this.height + this.height / 2; //regardless of anchor, bullets start in middle Y of sprite
      weapon.trackSprite(this, xPixelOffset, yPixelOffset);

      this.weapons.push(weapon);
    }
  }

  _getWeaponAngle(angle) {
    let newAngle = 0;
    if (angle === undefined) {
      newAngle = (this.isFriendly) ? Phaser.ANGLE_UP : Phaser.ANGLE_DOWN;
    } else {
      newAngle = (this.isFriendly) ? 360 - angle : angle;
    }
    return newAngle;
  }

  static cleanupAllWeapons(game) {
    //clean up all the weapons
    let destroyWeapons = function(sprite) {
      if (sprite.weapons) {
        for (let weapon of sprite.weapons) {
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

  arrivedAtYDestionation() {
    super.arrivedAtYDestionation();
    this.startShooting();
  }

  startShooting() {
    if (!this.isAlive) return;

    this.weapons.forEach(function(weapon) {
      weapon.autofire = true;
    });
  }
  stopShooting() {
    this.weapons.forEach(function(weapon) {
      weapon.autofire = false;
    });
  }

  damage(amount) {
    super.damage(amount);

    //little tween to show damage occurred
    //const tempAngle = this.angle;
    const resetAngle = function() {
      this.angle = 0;
    }.bind(this);
    const tweenAngle = 10 + 10 * Math.random();
    const tweenTime = 4;
    var tween = this.game.add.tween(this)
      .to({
        angle: -tweenAngle
      }, tweenTime, Phaser.Easing.Linear.In)
      .to({
        angle: tweenAngle
      }, tweenTime, Phaser.Easing.Linear.In)
      .repeatAll(1);
    tween.onComplete.add(resetAngle, this);
    tween.start();

    this.updateHealthbar();
  }

  heal(amount) {
    super.heal(amount);

    this.updateHealthbar();
  }

  updateHealthbar() {
    const healthPercentLeft = (this.health / this.maxHealth);
    this.healthbar.progress = healthPercentLeft;
    this.healthbar.setText(Math.max(this.health, 0));
  }

  kill() {
    if (this.isBeingKilled) return;

    if (this.inWorld) {
      this.game.spritePools.explode('explosion1', this);
    }
    this.stopShooting();
    this.healthbar.visible = false;
    super.kill();
  }
  finishKill() {
    this.isBeingKilled = false;
    super.kill();
  }
  //Overrides super method. this is called at the end of super.kill()
  showDeathAnimationsThenKill() {
    this.isBeingKilled = true;

    //setup tween to be played upon this.kill()
    const xTweenLen = 10 * Math.random() + 10;
    const tweenAngle = 20 + 20 * Math.random();
    const tweenTime = 30;
    var tween = this.game.add.tween(this)
      .to({
        x: '-' + xTweenLen
      }, tweenTime, Phaser.Easing.Linear.In) //tween it relative to the current position. Needs to be a string
      .to({
        x: '+' + xTweenLen
      }, tweenTime, Phaser.Easing.Linear.In)
      .to({
        angle: -tweenAngle
      }, tweenTime, Phaser.Easing.Linear.In)
      .to({
        angle: tweenAngle
      }, tweenTime, Phaser.Easing.Linear.In)
      .repeatAll(1);
    tween.start();
    tween.onComplete.add(this.finishKill, this);
  }

  reverseXonEdges() {
    const vx = Math.abs(this.body.velocity.x);
    if (this.left < 0) {
      this.body.velocity.x = vx;
    } else if (this.right > this.game.world.width) {
      this.body.velocity.x = -vx;
    }
  }

  static bulletCollision(unit, bullet) {
    const shootingWeapon = bullet.parent.myWeapon;
    if (unit.isAlive) bullet.kill();
    if (unit.isAlive) unit.damage(shootingWeapon.dmg);
  }

}
