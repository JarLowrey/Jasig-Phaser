/*
 * Bullet
 * ====
 *
 */

export default class Bullet extends Phaser.Sprite{

  constructor(game, x, y){
    super(game,x,y);

    this.anchor.setTo(0.5,0.5);

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

  revive(bulletType, shooter, target, xPercentageOnShooter, yPercentageOnShooter, shootingAngle = 90){
    this.reset(); //reset the physics body in addition to reviving the sprite. Otherwise collision could be messed up
    super.revive();

    this.shooter = shooter;
    this.target = target;

    this.bulletInfo = this.game.bullets[bulletType];

    this.loadTexture(this.bulletInfo.key, this.bulletInfo.frame);
    if(this.bulletInfo.isTinted){
      this.tint = (this.shooter.isFriendly) ? '0x00ff00' : '0xff0000'; //friendly is green, enemy is red
    }

    this.width = this.bulletInfo.width;
    this.scale.y = this.scale.x;

    shootingAngle = (this.shooter.isFriendly) ? 360 - shootingAngle : shootingAngle; //correct angle in bulletInfo for friendliness
    this.game.physics.arcade.velocityFromAngle(shootingAngle, this.bulletInfo.speed, this.body.velocity); //set x,y speed to coordinate with angle traveling

    this.setXPos(xPercentageOnShooter);
    this.setYPos(yPercentageOnShooter);

    this.dmg = 25;

    this.body.setSize(this.width,this.height); //set body to new sprite size, otherwise collisions (and other physics actions) will be messed up
  }

  //assume that shooter and bullet will have an anchor of 0.5x
  setXPos(xPercentageOnShooter = 50){
    xPercentageOnShooter -= 50;
    xPercentageOnShooter /= 100;

    this.x = this.shooter.x + xPercentageOnShooter * this.shooter.width;
  }

  //assume that shooter and bullet will have an anchor of 0.5y
  setYPos(yPercentageOnShooter = 50){
    yPercentageOnShooter -= 50;
    yPercentageOnShooter /= 100;
    //console.log(yPercentageOnShooter)

    this.y = this.shooter.y + yPercentageOnShooter * this.shooter.height;
  }

}
