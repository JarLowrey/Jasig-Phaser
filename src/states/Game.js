/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Stars from '../objects/Stars';
import UiHandler from '../objects/UiHandler';
import IconText from '../objects/IconText';

export default class Game extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.UiHandler = new UiHandler(this.game);
  }

  update(){
    this.UiHandler.showGold(10,window.innerWidth * Math.random(),this.game.world.centerY);

  }

}
