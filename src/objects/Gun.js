/*
 * Gun
 * ====
 *
 */

import Bullet from '../objects/Bullet';

export default class Gun {

  constructor(game, shooter){
    this.game = game;
    this.initBulletPool();
    this.shooter = shooter;
  }

/*
  shoot(xPercentageOnShooter = 50, yPercentageOnShooter = 0){

  }
*/

  initBulletPool(game, preallocationNum = 50){
    if(!Gun.bulletPool){
      Gun.bulletPool = new Phaser.Group(game);
      Gun.bulletPool.classType = Bullet;
      Gun.bulletPool.createMultiple(preallocationNum);
    }
  }

  getBullet(){
    var bullet = Gun.bulletPool.getFirstDead();

    if(!bullet){
      bullet = new Bullet(this.game);
    }else{
      bullet.revive();
    }

    return bullet;
  }

}
