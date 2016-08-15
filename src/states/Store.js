/*
 * Store state
 */

export default class Store extends Phaser.State {

  create() {
    this.text = this.game.add.text(this.game.world.centerX,this.game.world.centerY,'Store',{'fill':'#ffffff'});
  }

  update() {
    // TODO: Stub
  }

}
