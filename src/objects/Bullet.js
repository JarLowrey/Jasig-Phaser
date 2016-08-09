/*
 * Bullet
 * ====
 *
 */

export default class Bullet extends Phaser.Sprite{

  constructor(game, x, y){
    super(game,x,y);

    this.anchor.setTo(0.5,0.5);
    this.ySpd = 1000;

    this.game.physics.arcade.enableBody(this);

    //kill sprite if it moves out of bounds of game screen
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
  }

  revive(shooter, target, xPercentageOnShooter, yPercentageOnShooter, shootingAngle = 0){
    super.revive();

    this.shooter = shooter;
    this.target = target;

    this.game.physics.arcade.velocityFromAngle(shootingAngle, this.ySpd, this.body.velocity); //set x,y speed to coordinate with angle traveling

    this.setXPos(xPercentageOnShooter);
    this.setYPos(yPercentageOnShooter);
  }

  //assume that shooter and bullet will have an anchor of 0.5x
  setXPos(xPercentageOnShooter = 50){
    xPercentageOnShooter -= 50;
    xPercentageOnShooter /= 100;

    bullet.x = this.shooter.x + xPercentageOnShooter * this.shooter.width * 2;
  }

  //assume that shooter and bullet will have an anchor of 0.5y
  setYPos(yPercentageOnShooter = 50){
    yPercentageOnShooter -= 50;
    yPercentageOnShooter /= 100;

    bullet.y = this.shooter.y + yPercentageOnShooter * this.shooter.height * 2;
  }

  update(){
    if(this.target && this.target.alive){
      this.game.physics.arcade.moveToObject(this, this.target, this.body.velocity); //track towards object
      this.body.angle = this.game.physics.arcade.angleBetween(this, this.target);//set bullet rotation angle to point towards target
    }else{ //target could be revived after awhile, and then bullet would track wrong thing.
      this.target = null;
    }
  }

}
