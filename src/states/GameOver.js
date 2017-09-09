/*
 * GameOver state
 */

export default class GameOver extends Phaser.State {

  create() {
    this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height,'background');
    this.starfield = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');
    this.starfield2 = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield2');

    this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', {
      'fill': '#ffffff'
    });
  }

  update() {
    // TODO: Stub
  }

}
