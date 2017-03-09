/*
 * Menu state
 */

export default class Menu extends Phaser.State {

  create() {
    this.game.addBgImg('sprites', 'starfield');
    this.game.addBgImg('sprites', 'starfield2');

    this.game.state.start('Game', this.game.getRandomStateTransitionOut(), this.game.getRandomStateTransitionIn());
  }

  update() {
    // TODO: Stub
  }

}
