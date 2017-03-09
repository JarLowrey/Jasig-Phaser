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

  showDamagedParticles() {

  }

  reset(entityName) {
    super.reset(entityName || 'meteor', false);
    this.angle = Math.random() * 360;
  }
}
