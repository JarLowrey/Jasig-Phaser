/*
 * Bullet
 * ====
 *
 */

export default class Bullet extends Phaser.Sprite{

  constructor(game, x, y){
    super(game,x,y);

    this.anchor.setTo(0.5,0.5);
    this.ySpd = 800;

    this.game.physics.arcade.enableBody(this);

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

  revive(key = 'sprites', frame = 'circle', shooter, target, xPercentageOnShooter, yPercentageOnShooter, shootingAngle = 90){
    super.revive();

    this.shooter = shooter;
    this.target = target;

    this.loadTexture(key, frame);
    this.tint = (this.shooter.isFriendly && frame == 'circle') ? '0x00ff00' : '0xff0000'; //friendly is green, enemy is red
    this.width = 20;
    this.scale.y = this.scale.x;

    this.game.physics.arcade.velocityFromAngle(shootingAngle, this.ySpd, this.body.velocity); //set x,y speed to coordinate with angle traveling

    this.setXPos(xPercentageOnShooter);
    this.setYPos(yPercentageOnShooter);
  }

  //assume that shooter and bullet will have an anchor of 0.5x
  setXPos(xPercentageOnShooter = 50){
    xPercentageOnShooter -= 50;
    xPercentageOnShooter /= 100;

    this.x = this.shooter.x + xPercentageOnShooter * this.shooter.width * 2;
  }

  //assume that shooter and bullet will have an anchor of 0.5y
  setYPos(yPercentageOnShooter = 50){
    yPercentageOnShooter -= 50;
    yPercentageOnShooter /= 100;

    this.y = this.shooter.y + yPercentageOnShooter * this.shooter.height * 2;
  }

  static straightShotAngle(shooter){
    return (shooter.isFriendly) ? 270 : 90;
  }

  static rightShotAngle(shooter){
    return (shooter.isFriendly) ? 270 + Bullet.shotAngle : 90 - Bullet.shotAngle;
  }

  static leftShotAngle(shooter){
    return (shooter.isFriendly) ? 270 - Bullet.shotAngle : 90 + Bullet.shotAngle;
  }

}
