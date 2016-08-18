/*
 * UpgradableStoreItem
 */

export default class UpgradableStoreItem extends Phaser.Group {

  constructor(game, width = 20, height = 100, maxUpgradesNum, currentUpgradeNum, upgradePicKey, upgradePicFrame) {
    super(game);

    this.maxUpgradesNum = maxUpgradesNum;
    this.currentUpgradeNum = currentUpgradeNum;
    this.upgradedColor = '0x4df651';
    this.notYetUpgradedColor = '0x6b5e3e';

    this.marginFromSides = 10;

    this.upgradePicKey = upgradePicKey;
    this.upgradePicFrame = upgradePicFrame;

    this.groupWidth = width;
    this.groupHeight = height;

    //setup background
    this.backgroundGraphic = game.add.graphics(0, -this.groupHeight / 2);
    this.setBackgroundGraphicProperties();
    this.addChild(this.backgroundGraphic);

    //add the upgrade image
    this.icon = game.add.image(0,0, upgradePicKey, upgradePicFrame);
    this.setIconProperties();
    this.addChild(this.icon);

    //add the upgrade fillers
    this.upgradeBullets = [];
    const totalHeightForBullets = this.groupHeight - this.icon.height - this.marginFromSides * 3;//margin needed above and below the icon, and below the top of this group
    const bulletHeightPlusMargin = totalHeightForBullets / maxUpgradesNum;
    const bulletHeight = bulletHeightPlusMargin / 2;
    const bulletMargin = bulletHeightPlusMargin - bulletHeight;

    const bmpData = this.getUpgradeBitmapData(this.groupWidth / 2, bulletHeightPlusMargin / 2);
    for(var i=0; i<maxUpgradesNum; i++){
      this.addUpgradeBullet(bmpData, bulletHeight, bulletMargin, i);
    }
  }

  setBackgroundGraphicProperties(lineWidth = 5, color = '0xffd900', radius = this.groupWidth / 3){
    this.backgroundGraphic.anchor.setTo(0.5,0.5);

    this.backgroundGraphic.boundsPadding = 0;
    this.backgroundGraphic.lineStyle(lineWidth, color, 1);
    this.backgroundGraphic.drawRoundedRect(0, 0, this.groupWidth, this.groupHeight, radius);
  }

  setIconProperties(){
    this.icon.anchor.setTo(0.5,0.5);
    this.icon.width = this.groupWidth * 0.75;
    this.icon.height = this.icon.width;
    this.icon.x = this.groupWidth / 2;
    this.icon.y = this.groupHeight / 2 - this.icon.height / 2 - this.marginFromSides;
  }

  changeIconTexture(key,frame){
    this.icon.loadTexture(key,frame);
  }

  getUpgradeBitmapData(width, height){
    var bmd = this.game.add.bitmapData(width, height);
    bmd.ctx.fillStyle = '#ffffff'; //bar must have pure white bitmap data in order to be tinted effectively
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fill();

    return bmd;
  }

  addUpgradeBullet(bmpData, bulletHeight, bulletMargin, bulletNo){
    var bullet = this.game.add.image(0,0, bmpData);
    bullet.anchor.setTo(0.5,0.5);
    this.upgradeBullets.push(bullet);
    this.addChild(bullet);

    bullet.x = this.icon.x;
    bullet.y = this.icon.top - (bulletHeight + bulletMargin) * bulletNo - bulletMargin;

    bullet.tint = (bulletNo < this.currentUpgradeNum) ? this.upgradedColor : this.notYetUpgradedColor;
  }



}
