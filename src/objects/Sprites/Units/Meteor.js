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
    let emitterKey = 'meter_small_brown';
    if (this.frameName.includes('Grey')) {
      emitterKey = 'meter_small_grey';
    }

    this.game.spritePools.explode(emitterKey, 'default', this);
  }

  reset(entityName) {
    super.reset(entityName || 'meteor', false);
    this.angle = Math.random() * 360;
  }
}
