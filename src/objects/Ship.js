/*
 * Ship
 * ====
 *
 */

 import Gun from '../objects/Gun';

export default class Ship extends Phaser.Sprite {

  constructor(game, x, y, isFriendly){
    super(game,x,y);

    this.gun = new Gun(game);
    this.isFriendly = isFriendly;
  }

}
