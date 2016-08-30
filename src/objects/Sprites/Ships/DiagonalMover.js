/* jshint esversion: 6 */

/*
 * DiagonalMover
 * ====
 *
 */
import Ship from '../Ship';

export default class DiagonalMover extends Ship {
  static getClassName() {
    return 'DiagonalMover';
  }

  constructor(game) {
    super(game);
  }

  reset(jsonName, isFriendly) {
    super.reset(jsonName || 'diagonal', isFriendly);
  }

}
