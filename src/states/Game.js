/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Stars from '../objects/Stars';
import Ship from '../objects/Ship';
import Protagonist from '../objects/Protagonist';
import UiHandler from '../objects/UiHandler';

export default class Game extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.UiHandler = new UiHandler(this.game);

    Ship.initShipPool(this.game);
    
    this.hero = new Protagonist(this.game);
    this.hero.revive(this.game.world.centerX, this.game.world.centerY );

  }

  update(){
    //this.UiHandler.showGold(10,window.innerWidth * Math.random(),this.game.world.centerY);

  }

}
