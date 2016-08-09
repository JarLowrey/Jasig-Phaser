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
    this.shooter = shooter;
  }

  static initBulletPool(game, preallocationNum = 50){
    if(!Gun.bulletPool){
      Gun.bulletPool = new Phaser.Group(game);
      Gun.bulletPool.classType = Bullet;
      Gun.bulletPool.createMultiple(preallocationNum);

      Gun.shotAngle = 10;
    }
  }

  static straightShotAngle(shooter){
    return (shooter.isFriendly) ? 0 : 180;
  }

  static rightShotAngle(shooter){
    return (shooter.isFriendly) ? 90 - Gun.shotAngle : 270 + Gun.shotAngle;
  }

  static leftShotAngle(shooter){
    return (shooter.isFriendly) ? 90 + Gun.shotAngle : 270 - Gun.shotAngle;
  }

  shootStraight(xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget){
    this.createBullet(xPercentageOnShooter, yPercentageOnShooter, trackingTarget);

  }

  createBullet(xPercentageOnShooter, yPercentageOnShooter, angle, trackingTarget, angleFunction){
    var bullet = Gun.bulletPool.getFirstDead(true);
    if(bullet.alive) bullet.kill(); //all the bullets were already alive, so a new one was created via getFirstDead's createIfNull's parameter being set to true

    bullet.revive(this.shooter, trackingTarget, xPercentageOnShooter, yPercentageOnShooter, angleFunction(this.shooter) );
  }

}
