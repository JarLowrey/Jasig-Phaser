/*
 * Meteor
 * ====
 *
 */
import Unit from '../Unit';

export default class Meteor extends Unit {
  static getClassName(){ return 'Meteor'; }

  constructor(game){
    super(game);
  }

  reset(jsonName, isFriendly){
    super.reset(jsonName || 'meteor', isFriendly);

    this.body.velocity.y = 200;
    this.body.velocity.x = Math.random() * 50 - 50;
  }

}
