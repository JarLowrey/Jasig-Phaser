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
    this.weapons.startShooting();
  }

  update() {
    if (!this.isAlive) return;
    super.update();

    this.reverseXonEdges();
  }

}
