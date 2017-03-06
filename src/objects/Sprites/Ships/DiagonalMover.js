/* jshint esversion: 6 */

/*
 * DiagonalMover
 * ====
 *
 */
import Ship from '../Parents/Ship';

export default class DiagonalMover extends Ship {
  static className() {
    return 'DiagonalMover';
  }

  constructor(game) {
    super(game);
  }

  reset(jsonName, isFriendly) {
    super.reset(jsonName || 'diagonal', isFriendly);
    if (Math.random() < 0.5) {
      this.body.velocity.x *= -1;
    }
  }

  update() {
    this.reverseXonEdges();
  }

  reverseXonEdges() {
    const vx = Math.abs(this.body.velocity.x);
    if (this.left < 0) {
      this.body.velocity.x = vx;
    } else if (this.right > this.game.world.width) {
      this.body.velocity.x = -vx;
    }
  }

}
