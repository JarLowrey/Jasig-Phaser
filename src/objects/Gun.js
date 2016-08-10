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
      Gun.bulletPool = new Phaser.Group(game);
      Gun.bulletPool.classType = Bullet;
      Gun.bulletPool.createMultiple(preallocationNum);

      Gun.shotAngle = 10;
    }
  }

  shootStraight({key, frame, xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget = null}){
    this.createBullet(key, frame, xPercentageOnShooter, yPercentageOnShooter, trackingTarget, Bullet.straightShotAngle);
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
    var bullet = Gun.bulletPool.getFirstDead(true);
    if(bullet.alive) bullet.kill(); //all the bullets were already alive, so a new one was created via getFirstDead's createIfNull's parameter being set to true

    bullet.revive(key, frame, this.shooter, trackingTarget, xPercentageOnShooter, yPercentageOnShooter, angleFunction(this.shooter) );
  }

}
