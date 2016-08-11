/*
 * Bullet
 * ====
 *
 */

import ParentSprite from '../objects/ParentSprite';

export default class Bullet extends ParentSprite{

  constructor(game, x, y){
    super(game,x,y);

    this.anchor.setTo(0.5,0.5);

    //kill sprite if it moves out of bounds of game screen
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    Bullet.shotAngle = 10;
  }

  update(){
    if(this.target && this.target.alive){
      this.game.physics.arcade.moveToObject(this, this.target, this.body.velocity); //track towards object
      this.body.angle = this.game.physics.arcade.angleBetween(this, this.target);//set bullet rotation angle to point towards target
    }else{ //target could be revived after awhile, and then bullet would track wrong thing.
      this.target = null;
    }
  }

  reset(bulletType, shooter, target, xPercentageOnShooter, yPercentageOnShooter, shootingAngle = 90){
    this.bulletInfo = this.game.bullets[bulletType];

    this.shooter = shooter;//set shooter before calling getX/YPos functions
    super.reset(this.getXPos(xPercentageOnShooter), this.getYPos(yPercentageOnShooter), 1,
      this.bulletInfo.width, this.bulletInfo.key, this.bulletInfo.frame); //reset the physics body in addition to reviving the sprite. Otherwise collision could be messed up

    this.target = target;

    if(this.bulletInfo.isTinted){
      this.tint = (this.shooter.isFriendly) ? '0x00ff00' : '0xff0000'; //friendly is green, enemy is red
    }

    shootingAngle = (this.shooter.isFriendly) ? 360 - shootingAngle : shootingAngle; //correct angle in bulletInfo for friendliness
    this.game.physics.arcade.velocityFromAngle(shootingAngle, this.bulletInfo.speed, this.body.velocity); //set x,y speed to coordinate with angle traveling

    this.dmg = 25;
  }

  //assume that shooter and bullet will have an anchor of 0.5x
  getXPos(xPercentageOnShooter = 50){
    xPercentageOnShooter -= 50;
    xPercentageOnShooter /= 100;

    return this.shooter.x + xPercentageOnShooter * this.shooter.width;
  }

  //assume that shooter and bullet will have an anchor of 0.5y
  getYPos(yPercentageOnShooter = 50){
    yPercentageOnShooter -= 50;
    yPercentageOnShooter /= 100;
    //console.log(yPercentageOnShooter)

    return this.shooter.y + yPercentageOnShooter * this.shooter.height;
  }

}
