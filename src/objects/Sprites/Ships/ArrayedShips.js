/* jshint esversion: 6 */

/*
 * ArrayedShips
 * ====
 *
 */
import Ship from '../Ship';

export default class ArrayedShips extends Ship {
  static getClassName() {
    return 'ArrayedShips';
  }

  constructor(game) {
    super(game);
  }

  reset(jsonName, isFriendly) {
    super.reset(jsonName || 'arrayedShip', isFriendly);
  }

}
