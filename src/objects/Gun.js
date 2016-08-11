/*
 * Gun
 * ====
 *
 */

import Bullet from '../objects/Bullet';

export default class Gun {

  constructor(game, shooter, gunType, bulletType){
    this.game = game;

    Gun.initBulletPool(game);

    this.gunInfo = this.game.guns[gunType];
    this.bulletType = bulletType;

    this.canShoot = true;
    this.shooter = shooter;
    this.cooldownTimer = game.time.create(false);
  }

  changeGun(gunType, bulletType){
    this.gunInfo = this.game.guns[gunType];
    this.bulletType = bulletType || this.bulletType;
  }

  static initBulletPool(game, preallocationNum = 50){
    if(!Gun.bulletPool){
      Gun.friendlyBullets = new Phaser.Group(game);
      Gun.enemyBullets = new Phaser.Group(game);

      Gun.friendlyBullets.classType = Bullet;
      Gun.enemyBullets.classType = Bullet;

      Gun.friendlyBullets.createMultiple(preallocationNum);
      Gun.enemyBullets.createMultiple(preallocationNum);
    }
  }

  static bulletCollision(bullet, unit){
    console.log('Bullet hit');
    bullet.kill();
    unit.damage(bullet.dmg);
  }

  startShooting(xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget = null){
    if(!this.canShoot) return;
    this.canShoot = false;

    this.shoot(xPercentageOnShooter, yPercentageOnShooter, trackingTarget);

    this.cooldownTimer.add(this.gunInfo.cooldown, this.canShootAgain, this, true, xPercentageOnShooter, yPercentageOnShooter, trackingTarget);
    this.cooldownTimer.start();

  }

  stopShooting(){
    //const remainingTime = this.cooldownTimer.duration;

    this.cooldownTimer.stop();
    this.cooldownTimer.add(this.gunInfo.cooldown, this.canShootAgain, this);
    this.cooldownTimer.start();
  }

  canShootAgain(fireShot = false, xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget){
    this.canShoot = true;

    if(fireShot){
      this.startShooting(xPercentageOnShooter, yPercentageOnShooter, trackingTarget);
    }
  }

  createBullet(bulletType, xPercentageOnShooter, yPercentageOnShooter, trackingTarget, angle){
    var bulletPool = (this.shooter.isFriendly) ? Gun.friendlyBullets : Gun.enemyBullets;

    var bullet = bulletPool.getFirstDead(true);
    if(bullet.alive) bullet.kill(); //all the bullets were already alive, so a new one was created via getFirstDead's createIfNull's parameter being set to true

    bullet.reset(bulletType, this.shooter, trackingTarget, xPercentageOnShooter, yPercentageOnShooter, angle );
  }

  shoot(xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget){
    for(var shotName in this.gunInfo.shots){
      var shot = this.gunInfo.shots[shotName];
      this.createBullet(this.bulletType, xPercentageOnShooter + shot['x%Diff'], yPercentageOnShooter, trackingTarget, shot['angle']);
    }
  }

}
