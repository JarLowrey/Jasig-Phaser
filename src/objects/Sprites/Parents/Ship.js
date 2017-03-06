/* jshint esversion: 6 */

/*
 * Ship
 * ====
 *
 */

import Unit from './Unit';
import * as PhaserUi from 'phaser-ui';
import ParentSprite from './ParentSprite';
import Bullet from '../Bullet';

export default class Ship extends Unit {
  static className() {
    return 'Ship';
  }

  constructor(game) {
    super(game);

    this.healthbar = new PhaserUi.ProgressBar(this.game, this.width, 10, null, 2);
    this.healthbar.visible = false; //since many sprites are preallocated in pools, you need to manually hide the healthbar upon creation

    this.weapons = [];
  }

  update() {
    if (!this.isAlive) return;

    super.update();

    if (!this.amPlayer()) {
      this.healthbar.alignTo(this, Phaser.TOP_CENTER, 0, -this.healthbar.height / 2);
    }
  }

  reset(shipName, isFriendly) {
    super.reset(shipName, isFriendly, 'ships');

    this.healthbar.width = (this.width);
    this.updateHealthbar();
    this.healthbar.visible = true;

    //add all the weapons from the json file
    this.weapons = [];

    const applyBulletJson = function(json) {
      return function(bullet) {
        //console.log(bullet, json);
      };
    };

    for (var weaponName in this.info.weapons) {
      const weaponInfo = this.info.weapons[weaponName];
      const bulletType = weaponInfo.bulletType || 'default';
      const bulletInfo = this.game.entities.bullets[bulletType];
      const ammo = (weaponInfo.ammo !== undefined) ? weaponInfo.ammo : -1; //has unlimited ammo unless set otherwise in JSON

      var weapon = this.game.add.weapon(30, bulletInfo.key, bulletInfo.frame);
      weapon.weaponName = weaponName;
      weapon.bulletType = bulletType;
      weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
      weapon.bulletSpeed = 500;
      weapon.fireAngle = (this.isFriendly) ? Phaser.ANGLE_UP : Phaser.ANGLE_DOWN;

      weapon.bulletClass = Bullet;
      weapon.createBullets(ammo);

      weapon.bullets.forEach(applyBulletJson(bulletInfo));

      weapon.fireRate = 50; //this.getFireRate();
      //weapon.dmg = this.getDamage();

      weapon.dmg = 25; //this does nothing right now
      weapon.bullets.myWeapon = weapon;

      const percentOffset = (weaponInfo.xPercentOffset || 0) / 100;
      const bulletMidpoint = bulletInfo.width / 2;
      const xPixelOffset = this.width * percentOffset;
      const yPixelOffset = -this.anchor.y * this.height + this.height / 2; //regardless of anchor, bullets start in middle Y of sprite
      weapon.trackSprite(this, xPixelOffset, yPixelOffset);

      this.weapons.push(weapon);
    }
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

  static bulletCollision(unit, bullet) {
    //if the parameters come out of order, ensure that unit is a Unit and bullet is a Phaser.Bullet
    //check if the bullet is actually a Unit by seeing if it has a property (function) that is defined for Unit
    if (bullet.alive) {
      const temp = unit;
      unit = bullet;
      bullet = temp;
    }

    const shootingWeapon = bullet.parent.myWeapon;
    if (unit.isAlive) bullet.kill();
    if (unit.isAlive) unit.damage(shootingWeapon.dmg);
  }

}
