/*
 * Ship
 * ====
 *
 */

import Gun from '../../objects/Gun';
import Unit from '../Sprites/Unit';

export default class Ship extends Unit {

  constructor(game){
    super(game);

    this.gun = new Gun(this.game, this, 'straightShot', 'default');
  }

}
