/*
 * Menu state
 */

export default class Menu extends Phaser.State {

  create() {
    this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height,'background');
    this.starfield = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');
    this.starfield2 = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield2');

    this.game.state.start('Store', this.game.getRandomStateTransitionOut(), this.game.getRandomStateTransitionIn());
  }

  update() {
    // TODO: Stub
  }

}
