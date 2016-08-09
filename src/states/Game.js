/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Stars from '../objects/Stars';
import Ship from '../objects/Ship';
import UiHandler from '../objects/UiHandler';

export default class Game extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.UiHandler = new UiHandler(this.game);

    Ship.initShipPool(this.game);
    this.protagonist = Ship.getNewShip();
    this.protagonist.revive(this.game.world.centerX, this.game.world.centerY, true, 'sprites',this.game.ships.protagonist.frame );
  }

  update(){
    //this.UiHandler.showGold(10,window.innerWidth * Math.random(),this.game.world.centerY);

  }

}
