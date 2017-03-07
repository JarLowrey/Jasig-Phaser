/*
 * ArrayedShips
 * ====
 *
 */
import Ship from '../Parents/Ship';

export default class ArrayedShips extends Ship {
  static className() {
    return 'ArrayedShips';
  }

  constructor(game) {
    super(game);
  }

  reset(jsonName, isFriendly) {
    super.reset(jsonName || 'arrayedShip', isFriendly);
  }

}
