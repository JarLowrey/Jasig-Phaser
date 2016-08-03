/*
 * Menu state
 */

import Stars from '../objects/Stars';

export default class Menu extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.state.start('Game');
  }

  update() {
    // TODO: Stub
  }

}
