/* jshint esversion: 6 */

/*
 * Meteor
 * ====
 *
 */
import Unit from '../Parents/Unit';

export default class Meteor extends Unit {
  static className() {
    return 'Meteor';
  }

  constructor(game) {
    super(game);
  }

  reset(entityName) {
    super.reset(entityName || 'meteor', false);
  }

}
