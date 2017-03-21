/*
 * Bullet
 * ====
 *
 */


export default class Bullet extends Phaser.Bullet {

  reset(x, y, health) {
    super.reset(x, y, health);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
  }

  //before calling this, it assumes the checkCollision method has passed
  static bulletCollision(unit, bullet) {
    const shootingWeapon = bullet.parent.myWeapon;
    if (unit.isAlive) bullet.kill();
    if (unit.isAlive) unit.damage(shootingWeapon.dmg, true);
  }

  static checkCollision(unit, bullet) {
    return bullet.alive && unit.isAlive && unit.isFriendly != bullet.gun.shooter.isFriendly;
  }

  update() {
    if (this.target && this.target.isAlive) {
      this.game.physics.arcade.moveToObject(this, this.target, this.body.velocity); //track towards object
      this.body.angle = this.game.physics.arcade.angleBetween(this, this.target); //set bullet rotation angle to point towards target
    } else { //target could be revived after awhile, and then bullet would track wrong thing.
      this.target = null;
    }
    //this.game.debug.body(this, 'rgba(255,0,0,0.8)');
  }

  static createCircleBmd(game, diameter) {
    const radius = diameter / 2;
    let key = game.add.bitmapData(diameter, diameter);
    key.circle(radius, radius, radius, '#ffffff');
    return key;
  }

  kill() {
    if (this.inWorld) {
      this.game.spritePools.getPool('Explosion').getFirstDead(true).reset(this);
    }

    super.kill();
  }
}
