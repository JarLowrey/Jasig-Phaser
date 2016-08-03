/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Stars from '../objects/Stars';

export default class Game extends Phaser.State {

  create() {
    Stars.getStarManager(this.game).showStars();

  }

}
