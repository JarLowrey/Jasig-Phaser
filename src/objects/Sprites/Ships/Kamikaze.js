/* jshint esversion: 6 */

/*
 * Kamikaze
 * ====
 *
 */
import Ship from '../Parents/Ship';

export default class Kamikaze extends Ship {
  static className() {
    return 'Kamikaze';
  }

  constructor(game) {
    super(game);
  }

  update() {
    if (!this.alive) return;
    super.update();

    if (this.y < this.trackingObject.y) {
      this.game.physics.arcade.moveToObject(this, this.trackingObject, this.speed);
    }
  }

  reset(jsonName, isFriendly, objectToTrack) {
    super.reset(jsonName || 'kamikaze', isFriendly);

    this.trackingObject = objectToTrack;
    this.speed = 400;
  }

}
