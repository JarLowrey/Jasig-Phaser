/*
 * GameOver state
 */

export default class GameOver extends Phaser.State {

  create() {
    this.bg = this.game.add.image(0, 0, 'background');
    this.bg.width = Math.max(this.game.width, this.bg.width);
    this.bg.height = Math.max(this.game.height, this.bg.height);

    this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', {
      'fill': '#ffffff'
    });
  }

  update() {
    // TODO: Stub
  }

}
