/*
 * GameOver state
 */

export default class GameOver extends Phaser.State {

  create() {
    this.text = this.game.add.text(this.game.world.centerX,this.game.world.centerY,'Game Over',{'fill':'#ffffff'});
  }

  update() {
    // TODO: Stub
  }

}
