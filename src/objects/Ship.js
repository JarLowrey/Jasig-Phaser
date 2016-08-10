/*
 * Ship
 * ====
 *
 */

import Gun from '../objects/Gun';
import Unit from '../objects/Unit';

export default class Ship extends Unit {

  constructor(game){
    super(game);

    this.gun = new Gun(this.game, this, 'angledDualShot', 'default');
  }

  static initShipPool(game, preallocationNum = 20){
    if(!Ship.pool){
      Ship.pool = new Phaser.Group(game);
      Ship.pool.classType = Ship;
      Ship.pool.createMultiple(preallocationNum);
    }
  }

  static getNewShip(){
    var newShip = Ship.pool.getFirstDead(true);
    //all the sprites were already alive, so a new one was created via getFirstDead's createIfNull's parameter being set to true. Kill it
    if(newShip.alive) newShip.kill();

    return newShip;
  }

  revive(x, y, isFriendly, key, frame){
    super.revive(x, y, isFriendly, key, frame);
  }


}
