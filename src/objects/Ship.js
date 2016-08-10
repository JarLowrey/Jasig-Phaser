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

    this.gun = new Gun(this.game, this, 'angledTriShot', 'default');

    Ship.initShipPool(this.game);
  }

  static initShipPool(game, preallocationNum = 20){
    if(!Ship.friendlyShips && !Ship.enemyShips){
      Ship.friendlyShips = new Phaser.Group(game);
      Ship.enemyShips = new Phaser.Group(game);

      Ship.friendlyShips.classType = Ship;
      Ship.enemyShips.classType = Ship;

      Ship.friendlyShips.createMultiple(preallocationNum);
      Ship.enemyShips.createMultiple(preallocationNum);
    }
  }

  static getNewShip(newShipIsFriendly = false){
    var newShipPool = (newShipIsFriendly) ? Ship.friendlyShips : Ship.enemyShips;

    var newShip = newShipPool.getFirstDead(true);
    //all the sprites were already alive, so a new one was created via getFirstDead's createIfNull's parameter being set to true. Kill it
    //if(newShip.alive) newShip.kill();

    return newShip;
  }

  revive(x, y, isFriendly, key, frame){
    super.revive(x, y, isFriendly, key, frame);
  }


}
