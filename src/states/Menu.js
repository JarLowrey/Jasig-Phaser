/*
 * Menu state
 */

import Stars from '../objects/Stars';

export default class Menu extends Phaser.State {

  create() {
    Stars.getStarManager(this.game).showStars();
  }

  update() {
    // TODO: Stub
  }

}
