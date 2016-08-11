/*
 * Gun
 * ====
 *
 */

import Bullet from '../objects/Sprites/Bullet';
import ParentSprite from '../objects/Sprites/ParentSprite';

export default class Gun {

  constructor(game, shooter, gunType, bulletType){
    this.game = game;

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

  startShooting(xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget = null){
    if(!this.canShoot) return;
    this.canShoot = false;
    
    this.target = trackingTarget;
    this.shoot(xPercentageOnShooter, yPercentageOnShooter);

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

  shoot(xPercentageOnShooter = 50, yPercentageOnShooter = 0){
    for(var shotName in this.gunInfo.shots){
      const shot = this.gunInfo.shots[shotName];

      var bullet = ParentSprite.getNewSprite(Bullet, this.shooter.isFriendly);

      bullet.reset(this.bulletType, this.shooter, this.target, xPercentageOnShooter + shot['x%Diff'], yPercentageOnShooter, shot['angle']);
    }
  }

}
