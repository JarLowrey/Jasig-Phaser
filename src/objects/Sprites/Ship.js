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

  reset(shipType, x, y, isFriendly){
    this.shipInfo = this.game.ships[shipType];
    super.reset(x, y, this.shipInfo.health, this.shipInfo.width, 'sprites', this.shipInfo.frame, isFriendly, this.shipInfo.explosionFrame);
  }

}
