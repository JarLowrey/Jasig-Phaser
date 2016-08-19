/*
 * Store state
 */
 import UpgradableStoreItem from '../objects/UI/UpgradableStoreItem';
 import ProgressBar from '../objects/UI/ProgressBar';


export default class Store extends Phaser.State {

  create() {
    this.text = this.game.add.text(this.game.world.centerX,this.game.world.centerY,'Store',{'fill':'#ffffff'});

    var item = new UpgradableStoreItem(this.game, 75, 200, 6, 15, 'sprites', 'upgrade_inc_gun');
    item.x = this.game.world.centerX;
    item.y = this.game.world.centerY;
    item.setNumberUpgradeBullets(10,20);
    item.decrementUpgrade();

    const healthbarJson = this.game.dimen['game_health'];
    var bar = new ProgressBar(this.game);
    bar.x = this.game.world.centerX;
    bar.y = this.game.world.centerY;
    bar.setText('asd');
    //bar.setSize(healthbarJson.width, healthbarJson.height, healthbarJson.strokeLength);
    console.log(bar);
  }

  update() {
    // TODO: Stub
  }

}
