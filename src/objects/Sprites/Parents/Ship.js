/* jshint esversion: 6 */

/*
 * Ship
 * ====
 *
 */

import Unit from './Unit';
import ProgressBar from 'phaser-ui';
import ParentSprite from './ParentSprite';
import Bullet from '../Bullet';

export default class Ship extends Unit {
  static className() {
    return 'Ship';
  }

  constructor(game) {
    super(game);

    this.healthbar = new ProgressBar(this.game);
    this.healthbar.visible = false; //since many sprites are preallocated in pools, you need to manually hide the healthbar upon creation

    this.weapons = [];
  }

  update() {
    if (!this.alive) return;

    super.update();

    if (!this.amPlayer()) {
      this.healthbar.alignTo(this, Phaser.TOP_CENTER, 0, -this.healthbar.height / 2);
    }
  }

  reset(shipName, isFriendly) {
    super.reset(shipName, isFriendly, 'ships');

    this.healthbar.setPercent(100);
    this.healthbar.setText(this.getHealthbarText());
    this.healthbar.setWidth(this.width);

    this.healthbar.visible = true;

    //add all the weapons from the json file
    this.weapons = [];

    const applyBulletJson = function(json) {
      return function(bullet) {
        console.log(bullet, json);
        //bullet.applyJsonInfo(json);
      };
    };

    for (var weaponName in this.jsonInfo.weapons) {
      const weaponInfo = this.jsonInfo.weapons[weaponName];
      const bulletType = weaponInfo.bulletType || 'default';
      const bulletInfo = this.game.bullets[bulletType];
      const ammo = (weaponInfo.ammo !== undefined) ? weaponInfo.ammo : -1; //has unlimited ammo unless set otherwise in JSON

      var weapon = this.game.add.weapon(30, bulletInfo.key, bulletInfo.frame);
      weapon.weaponName = weaponName;
      weapon.bulletType = bulletType;
      weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
      weapon.bulletSpeed = ParentSprite.dp(500);
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

  getHealthbarText() {
    return Math.max(this.health, 0);
  }

  arrivedAtYDestionation() {
    super.arrivedAtYDestionation();

    this.startShooting();
  }

  startShooting() {
    if (!this.isAlive()) return;

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

    this.setHealthBarPercentage();
    this.healthbar.setText(this.getHealthbarText());
  }

  heal(amount) {
    super.heal(amount);

    this.setHealthBarPercentage();
    this.healthbar.setText(this.getHealthbarText());
  }

  setHealthBarPercentage() {
    const healthPercentLeft = 100 * (this.health / this.maxHealth);
    this.healthbar.setPercent(healthPercentLeft);
  }

  kill() {
    if (this.isBeingKilled) return;

    this.stopShooting();
    this.healthbar.visible = false;

    super.kill();
  }

  //Overrides super method. this is called at the end of super.kill()
  showDeathAnimations() {
    //setup tween to be played upon this.kill()
    const xTweenLen = ParentSprite.dp(15) * Math.random() + ParentSprite.dp(15);
    const tweenAngle = 30 + 30 * Math.random();
    const tweenTime = 35;
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
    tween.onComplete.add(super.showDeathAnimations, this);
  }

  static bulletCollision(unit, bullet) {
    //if the parameters come out of order, ensure that unit is a Unit and bullet is a Phaser.Bullet
    //check if the bullet is actually a Unit by seeing if it has a property (function) that is defined for Unit
    if (bullet.isAlive) {
      const temp = unit;
      unit = bullet;
      bullet = temp;
    }

    const shootingWeapon = bullet.parent.myWeapon;
    if (unit.isAlive()) bullet.kill();
    if (unit.isAlive()) unit.damage(shootingWeapon.dmg);
  }

}
