/*
 * Bullet
 * ====
 *
 */


export default class Bullet extends Phaser.Bullet {

  reset(x, y, health) {
    super.reset(x, y, health);

    this.shooter = this.parent.myWeapon.trackedSprite;
    this.setFriendlinessAngle();
  }
  update() {
    if (this.target && this.target.isAlive) {
      this.game.physics.arcade.moveToObject(this, this.target, this.body.velocity); //track towards object
      this.body.angle = this.game.physics.arcade.angleBetween(this, this.target); //set bullet rotation angle to point towards target
    } else { //target could be revived after awhile, and then bullet would track wrong thing.
      this.target = null;
    }

    /*
    this.game.debug.geom(this.getBounds());
    this.game.debug.body(this, 'rgba(255,0,0,0.8)');
    */
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
  setFriendlinessAngle() {
    this.angle = (this.shooter.isFriendly) ? 360 - 0 : 0; //correct angle in bulletInfo for friendliness
  }
  setFriendlinessTint() {
    this.tint = (this.shooter.isFriendly) ? '0x00ff00' : '0xff0000'; //friendly is green, enemy is red
  }

}
