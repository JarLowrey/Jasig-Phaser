/* jshint esversion: 6 */

/*
 * GameOver state
 */
import Stars from '../objects/UI/Stars';

export default class GameOver extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', {
      'fill': '#ffffff'
    });

    this.game.resetConfig();
  }

  update() {
    // TODO: Stub
  }

}
