/*
 * Bullet
 * ====
 *
 */
import ParentSprite from '../Sprites/ParentSprite';

export default class Bullet extends ParentSprite{

  constructor(game, x, y){
    super(game,x,y);

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

  reset(bulletName, shooter, target, xPercentageOnShooter, yPercentageOnShooter, shootingAngle = 90){
    super.reset('bullets', bulletName, Bullet.getXPos(xPercentageOnShooter, shooter), Bullet.getYPos(yPercentageOnShooter, shooter));

    this.shooter = shooter;
    this.target = target;

    if(this.jsonInfo.isTinted){
      this.tint = (this.shooter.isFriendly) ? '0x00ff00' : '0xff0000'; //friendly is green, enemy is red
    }

    shootingAngle = (this.shooter.isFriendly) ? 360 - shootingAngle : shootingAngle; //correct angle in bulletInfo for friendliness
    this.game.physics.arcade.velocityFromAngle(shootingAngle, this.jsonInfo.speed, this.body.velocity); //set x,y speed to coordinate with angle traveling

    this.dmg = 25;
  }

  //assume that shooter and bullet will have an anchor of 0.5x
  static getXPos(xPercentageOnShooter = 50, shooter){
    xPercentageOnShooter -= 50;
    xPercentageOnShooter /= 100;

    return shooter.x + xPercentageOnShooter * shooter.width;
  }

  //assume that shooter and bullet will have an anchor of 0.5y
  static getYPos(yPercentageOnShooter = 50, shooter){
    yPercentageOnShooter -= 50;
    yPercentageOnShooter /= 100;
    //console.log(yPercentageOnShooter)

    return shooter.y + yPercentageOnShooter * shooter.height;
  }

  static bulletCollision(bullet, unit){
    bullet.kill();
    unit.damage(bullet.dmg);
  }

}
