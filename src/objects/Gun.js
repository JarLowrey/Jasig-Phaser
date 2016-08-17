/*
 * Gun
 * ====
 *
 */

import Bullet from '../objects/Sprites/Bullet';
import ParentSprite from '../objects/Sprites/ParentSprite';
import JsonInfo from '../objects/JsonInfo';

export default class Gun {

  constructor(game, shooter, gunName, bulletName){
    this.game = game;
    this.jsonInfo = JsonInfo.getInfo(this.game, 'guns', gunName);

    this.bulletName = bulletName;

    this.canShoot = true;
    this.shooter = shooter;
    this.fireRate = game.time.create(false);
  }

  changeGun(gunName, bulletName){
    this.jsonInfo = JsonInfo.getInfo(this.game, 'guns', gunName);
    this.bulletName = bulletName || this.bulletName;
  }

  startShooting(xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget = null){
    if(!this.canShoot) return;
    this.canShoot = false;

    this.target = trackingTarget;
    this.shoot(xPercentageOnShooter, yPercentageOnShooter);

    this.fireRate.add(this.jsonInfo.fireRate, this.canShootAgain, this, true, xPercentageOnShooter, yPercentageOnShooter, trackingTarget);
    this.fireRate.start();

  }

  stopShooting(){
    //const remainingTime = this.fireRate.duration;

    this.fireRate.stop();
    this.fireRate.add(this.jsonInfo.fireRate, this.canShootAgain, this);
    this.fireRate.start();
  }

  canShootAgain(fireShot = false, xPercentageOnShooter = 50, yPercentageOnShooter = 0, trackingTarget){
    this.canShoot = true;

    if(fireShot){
      this.startShooting(xPercentageOnShooter, yPercentageOnShooter, trackingTarget);
    }
  }

  shoot(xPercentageOnShooter = 50, yPercentageOnShooter = 0){
    for(var shotName in this.jsonInfo.shots){
      const shot = this.jsonInfo.shots[shotName];

      var bullet = ParentSprite.getNewSprite(Bullet, this.shooter.isFriendly);

      bullet.reset(this.bulletName, this.shooter, this.target, xPercentageOnShooter + shot['x%Diff'], yPercentageOnShooter, shot['angle']);
    }
  }

}
