/*
 * Gun
 * ====
 *
 */

import Bullet from '../objects/Bullet';

export default class Gun {

  constructor(game, shooter){
    this.game = game;

    Gun.initBulletPool(game);

    this.canShoot = true;
    this.shooter = shooter;
    this.cooldownTimer = game.time.create(false);
    this.freq = 500;
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

  startShooting(shootFn, xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget = null){
    if(!this.canShoot) return;
    this.canShoot = false;

    shootFn = shootFn.bind(this);
    shootFn({xPercentageOnShooter, yPercentageOnShooter, trackingTarget});

    this.cooldownTimer.add(this.freq, this.canShootAgain, this, true, shootFn, xPercentageOnShooter, yPercentageOnShooter, trackingTarget);
    this.cooldownTimer.start();

  }

  stopShooting(){
    const remainingTime = this.cooldownTimer.duration;

    this.cooldownTimer.stop();
    this.cooldownTimer.add(this.freq, this.canShootAgain, this);
    this.cooldownTimer.start();
  }

  canShootAgain(fireShot = false, shootFn, xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget){
    this.canShoot = true;

    if(fireShot){
      this.startShooting(shootFn, xPercentageOnShooter, yPercentageOnShooter, trackingTarget);
    }
  }

  createBullet(key, frame, xPercentageOnShooter, yPercentageOnShooter, trackingTarget, angleFunction){
    var bulletPool = (this.shooter.isFriendly) ? Gun.friendlyBullets : Gun.enemyBullets;

    var bullet = bulletPool.getFirstDead(true);
    if(bullet.alive) bullet.kill(); //all the bullets were already alive, so a new one was created via getFirstDead's createIfNull's parameter being set to true

    bullet.revive(key, frame, this.shooter, trackingTarget, xPercentageOnShooter, yPercentageOnShooter, angleFunction(this.shooter) );
  }

  /*
    TYPES OF GUNS
    Below are functions that define different types of guns. Use these functions are the 'shootFn' parameter when calling 'startShooting'
  */

  straightShot({key, frame, xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget = null}){
    this.createBullet(key, frame, xPercentageOnShooter, yPercentageOnShooter, trackingTarget, Bullet.straightShotAngle);
  }
  straightDualShot({key, frame, xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget = null}){
    this.createBullet(key, frame, xPercentageOnShooter - 10, yPercentageOnShooter, trackingTarget, Bullet.straightShotAngle);
    this.createBullet(key, frame, xPercentageOnShooter + 10, yPercentageOnShooter, trackingTarget, Bullet.straightShotAngle);
  }
  straightTriShot({key, frame, xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget = null}){
    this.createBullet(key, frame, xPercentageOnShooter - 15, yPercentageOnShooter, trackingTarget, Bullet.straightShotAngle);
    this.createBullet(key, frame, xPercentageOnShooter, yPercentageOnShooter, trackingTarget, Bullet.straightShotAngle);
    this.createBullet(key, frame, xPercentageOnShooter + 15, yPercentageOnShooter, trackingTarget, Bullet.straightShotAngle);
  }
  triAngledShot({key, frame, xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget = null}){
    this.createBullet(key, frame, xPercentageOnShooter, yPercentageOnShooter, trackingTarget, Bullet.straightShotAngle);
    this.createBullet(key, frame, xPercentageOnShooter, yPercentageOnShooter, trackingTarget, Bullet.rightShotAngle);
    this.createBullet(key, frame, xPercentageOnShooter, yPercentageOnShooter, trackingTarget, Bullet.leftShotAngle);
  }
  dualAngledShot({key, frame, xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget = null}){
    this.createBullet(key, frame, xPercentageOnShooter, yPercentageOnShooter, trackingTarget, Bullet.rightShotAngle);
    this.createBullet(key, frame, xPercentageOnShooter, yPercentageOnShooter, trackingTarget, Bullet.leftShotAngle);
  }

}
