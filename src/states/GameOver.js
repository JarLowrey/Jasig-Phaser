/*
 * GameOver state
 */

export default class GameOver extends Phaser.State {

  create() {
    this.game.addBgImg('sprites', 'starfield');
    this.game.addBgImg('sprites', 'starfield2');

    this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', {
      'fill': '#ffffff'
    });
  }

  update() {
    // TODO: Stub
  }

}
