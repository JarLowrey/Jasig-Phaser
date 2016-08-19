/*
 * UpgradableStoreItem
 */

export default class UpgradableStoreItem extends Phaser.Group {

  constructor(game, width = 20, height = 100, currentUpgradeNum, maxUpgradesNum, upgradePicKey, upgradePicFrame) {
    super(game);

    this.maxUpgradesNum = maxUpgradesNum;
    this.currentUpgradeNum = currentUpgradeNum;
    this.upgradedColor = '0x4df651';
    this.notYetUpgradedColor = '0x705D56';

    this.marginFromSides = 10;

    this.upgradePicKey = upgradePicKey;
    this.upgradePicFrame = upgradePicFrame;

    //setup background
    this.backgroundGraphic = game.add.graphics(- width / 2, - height / 2);
    this.setBackgroundGraphicProperties(width, height);
    this.addChild(this.backgroundGraphic);

    //add the upgrade image
    this.icon = game.add.image(0,0, upgradePicKey, upgradePicFrame);
    this.setIconProperties();
    this.addChild(this.icon);

    //add the upgrade fillers
    this.upgradeBullets = [];
    this.setNumberUpgradeBullets(currentUpgradeNum, maxUpgradesNum);
  }

  setBackgroundGraphicProperties(width, height, lineWidth = 5, outlineColor = '0x99E1D9', backgroundColor = '0x332292F', radius = width / 2){
    this.backgroundGraphic.anchor.setTo(0.5,0.5);
    radius = Math.min(radius, width / 2 - 1, height / 2 - 1); //cannot be >= Max_Dimension / 2

    //draw outline
    this.backgroundGraphic.boundsPadding = 0;
    this.backgroundGraphic.lineStyle(lineWidth, outlineColor, 1);
    this.backgroundGraphic.drawRoundedRect(0, 0, width, height, radius);

    //draw fill
    this.backgroundGraphic.beginFill(backgroundColor);
    this.backgroundGraphic.drawRoundedRect(0, 0, width, height, radius);
    this.backgroundGraphic.endFill();
  }

  setIconProperties(){
    this.icon.anchor.setTo(0.5,0.5);
    this.icon.width = this.width * 0.75;
    this.icon.height = this.icon.width;
    this.icon.y = this.height / 2 - this.icon.height / 2 - this.marginFromSides;
  }

  changeIconTexture(key,frame){
    this.icon.loadTexture(key,frame);
  }

  getUpgradeBulletBitmapData(width, height){
    var bmd = this.game.add.bitmapData(width, height);
    bmd.ctx.fillStyle = '#ffffff'; //bar must have pure white bitmap data in order to be tinted effectively
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fill();

    return bmd;
  }

  incrementUpgrade(){
    this.currentUpgradeHasChanged(this.upgradedColor);
    this.currentUpgradeNum++;
  }
  decrementUpgrade(){
    this.currentUpgradeNum--;
    this.currentUpgradeHasChanged(this.notYetUpgradedColor);
  }
  currentUpgradeHasChanged(color){
    var bullet = this.upgradeBullets[this.currentUpgradeNum];
    bullet.tint = color;
    //TODO add tween
  }

  setNumberUpgradeBullets(currentUpgradeNum = this.currentUpgradeNum, maxUpgradesNum = this.maxUpgradesNum){
    //remove any current bullets.
    for(var i=this.upgradeBullets.length-1;i>=0;i--){
      var oldBullet = this.upgradeBullets.pop();
      oldBullet.kill();
    }

    //set vars that govern how many bullets are set
    this.currentUpgradeNum = currentUpgradeNum;
    this.maxUpgradesNum = maxUpgradesNum;

    //create the new bullets
    const totalHeightForBullets = this.height - this.icon.height - this.marginFromSides * 3;//margin needed above and below the icon, and below the top of this group
    const bulletHeightPlusMargin = totalHeightForBullets / this.maxUpgradesNum;
    const bulletHeight = bulletHeightPlusMargin * 0.75;
    const bulletMargin = bulletHeightPlusMargin - bulletHeight;

    const bmpData = this.getUpgradeBulletBitmapData(this.width / 2, bulletHeightPlusMargin / 2);
    for(i=0; i<this.maxUpgradesNum; i++){
      this.addUpgradeBullet(bmpData, bulletHeight, bulletMargin, i);
    }
  }

  addUpgradeBullet(bmpData, bulletHeight, bulletMargin, bulletNo){
    var bullet = this.game.add.image(0,0, bmpData);
    bullet.anchor.setTo(0.5,0.5);
    this.upgradeBullets.push(bullet);
    this.addChild(bullet);

    bullet.x = this.icon.x;
    bullet.y = this.icon.top - (bulletHeight + bulletMargin) * bulletNo - this.marginFromSides;

    bullet.tint = (bulletNo < this.currentUpgradeNum) ? this.upgradedColor : this.notYetUpgradedColor;
  }



}
