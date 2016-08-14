/*
 * GameOver state
 */

export default class GameOver extends Phaser.State {

  create() {
    this.text = this.game.add.text(this.game.world.centerX,this.game.world.centerY,'Game Over',{'fill':'#ffffff'});
    console.log(this.text)
  }

  update() {
    // TODO: Stub
  }

}
