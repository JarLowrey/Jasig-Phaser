/*
 * Store state
 */
import UpgradableStoreItem from '../objects/UI/UpgradableStoreItem';
import ProgressBar from '../objects/UI/ProgressBar';

export default class Store extends Phaser.State {

  create() {
    this.upgradeInfo = this.game.cache.getJSON('upgrades');

    this.text = this.game.add.text(this.game.world.centerX,this.game.world.centerY,'Store',{'fill':'#ffffff'});

    const upgradeWidth = 75;
    const upgradeHeight = 200;
    this.guns       = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.guns.gunLevels.length, 'sprites', this.upgradeInfo.guns.icon);

    this.damage     = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.damage.maxLevel, 'sprites', this.upgradeInfo.damage.icon);

    this.fireRate   = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.fireRate.maxLevel, 'sprites', this.upgradeInfo.fireRate.icon);

    this.defense    = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.defense.maxLevel, 'sprites', this.upgradeInfo.defense.icon);

    this.scoreBoost = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.scoreBoost.maxLevel, 'sprites', this.upgradeInfo.scoreBoost.icon);

    //this.repair     = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
    //  2, this.upgradeInfo.repair.maxLevel, 'sprites', this.upgradeInfo.repair.icon);

    this.ally       = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.ally.maxLevel, 'sprites', this.upgradeInfo.ally.icon);

    const marginX = 10;
    const y = this.game.world.centerY;
    this.guns.x = this.game.world.centerX;
    this.damage.x = this.guns.left - this.damage.width / 2 - marginX;
    this.fireRate.x = this.damage.left - this.fireRate.width / 2 - marginX;
    this.defense.x = this.fireRate.left - this.defense.width / 2 - marginX;

    this.scoreBoost.x = this.guns.right + this.scoreBoost.width / 2 + marginX;
    this.ally.x = this.scoreBoost.right + this.ally.width / 2 + marginX;

    this.guns.y = y;
    this.damage.y = y;
    this.fireRate.y = y;
    this.defense.y = y;
    this.scoreBoost.y = y;
    this.ally.y = y;
  }

  update() {
    // TODO: Stub
  }

}
