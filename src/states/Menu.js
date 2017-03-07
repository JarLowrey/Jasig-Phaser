/*
 * Menu state
 */

export default class Menu extends Phaser.State {

  create() {
    this.bg = this.game.add.image(0, 0, 'background');
    this.bg.width = Math.max(this.game.width, this.bg.width);
    this.bg.height = Math.max(this.game.height, this.bg.height);

    this.game.state.start('Game', this.game.getRandomStateTransitionOut(), this.game.getRandomStateTransitionIn());
  }

  update() {
    // TODO: Stub
  }

}
