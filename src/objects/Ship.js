/*
 * Ship
 * ====
 *
 */

import Gun from '../objects/Gun';

export default class Ship extends Phaser.Sprite {

  constructor(game){
    super(game);

    this.game.physics.arcade.enableBody(this);
  }

  update(){
    if(this.isFriendly){
      this.game.physics.arcade.moveToPointer(this, 200);
    }
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
    super.revive();

    this.loadTexture(key, frame);

    this.gun = new Gun(this.game);
    this.isFriendly = isFriendly;

    this.x = x;
    this.y = y;

    this.setAnchor(isFriendly);
  }

  setAnchor(isFriendly){
    const yAnchor = (isFriendly) ? 1 : 0.5;
    this.anchor.setTo(0.5,yAnchor);
  }

}
