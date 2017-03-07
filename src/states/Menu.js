/*
 * Menu state
 */

import Stars from '../objects/UI/Stars';

export default class Menu extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.game.state.start('Game', this.game.getRandomStateTransitionOut(), this.game.getRandomStateTransitionIn());
  }

  update() {
    // TODO: Stub
  }

}
