/* jshint esversion: 6 */

/*
 * Bullet
 * ====
 *
 */

export default class Bullet extends Phaser.Bullet {

  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame);
  }
  update() {
    if (this.target && this.target.alive) {
      this.game.physics.arcade.moveToObject(this, this.target, this.body.velocity); //track towards object
      this.body.angle = this.game.physics.arcade.angleBetween(this, this.target); //set bullet rotation angle to point towards target
    } else { //target could be revived after awhile, and then bullet would track wrong thing.
      this.target = null;
    }
  }

  reset(x, y, health) {
    super.reset(x, y, health);

    //this.applyInfo();
  }

  applyInfo(info = this.info) {
    this.info = info;

    const bulletTint = (this.isFriendly) ? '0x00ff00' : '0xff0000'; //friendly is green, enemy is red
    if (this.info.isTinted) this.tint = bulletTint;

    //update sprite dimensions & its body dimensions
    this.width = this.info.width;
    this.scale.y = this.scale.x;
    this.body.setSize(this.info.width, this.info.height);
  }

  /*
  reset(bulletName, shooter, target, xPercentageOnShooter, yPercentageOnShooter, shootingAngle = 90){
    super.reset('bullets', bulletName, Bullet.getXPos(xPercentageOnShooter, shooter), Bullet.getYPos(yPercentageOnShooter, shooter));

    this.shooter = shooter;
    this.target = target;

    if(info.isTinted){
      this.tint = (this.shooter.isFriendly) ? '0x00ff00' : '0xff0000'; //friendly is green, enemy is red
    }

    shootingAngle = (this.shooter.isFriendly) ? 360 - shootingAngle : shootingAngle; //correct angle in bulletInfo for friendliness
    this.game.physics.arcade.velocityFromAngle(shootingAngle, info.speed, this.body.velocity); //set x,y speed to coordinate with angle traveling

    this.dmg = 25;
  }
*/

}
