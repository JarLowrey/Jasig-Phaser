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

  reset(entityName) {
    super.reset(entityName || 'meteor', false);
    this.angle = Math.random() * 360;
  }
}
