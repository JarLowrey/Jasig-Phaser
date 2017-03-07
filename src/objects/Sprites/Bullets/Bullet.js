/*
 * Bullet
 * ====
 *
 */


export default class Bullet extends Phaser.Bullet {

  reset(x, y, health) {
    super.reset(x, y, health);

    this.shooter = this.parent.myWeapon.trackedSprite;
  }

  update() {
    if (this.target && this.target.isAlive) {
      this.game.physics.arcade.moveToObject(this, this.target, this.body.velocity); //track towards object
      this.body.angle = this.game.physics.arcade.angleBetween(this, this.target); //set bullet rotation angle to point towards target
    } else { //target could be revived after awhile, and then bullet would track wrong thing.
      this.target = null;
    }
  }

  static createCircleBmd(game, diameter) {
    const radius = diameter / 2;
    let key = game.add.bitmapData(diameter, diameter);
    key.circle(radius, radius, radius, '#ffffff');
    return key;
  }

  setFriendlinessTint() {
    this.tint = (this.shooter.isFriendly) ? '0x00ff00' : '0xff0000'; //friendly is green, enemy is red
  }

}
