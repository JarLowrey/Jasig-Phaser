/*
 * UpgradableStoreItem
 */

export default class UpgradableStoreItem extends Phaser.Group {

  constructor(game, width = 20, height = 100, currentUpgradeNum, maxUpgradesNum, upgradePicKey, upgradePicFrame,
    outlineWidth, outlineColor, bgColor,
    outlineColorPressed, bgColorPressed) {
    super(game);

    this.maxUpgradesNum = maxUpgradesNum;
    this.currentUpgradeNum = currentUpgradeNum;
    this.upgradedColor = '0x4df651';
    this.notYetUpgradedColor = '0x705D56';

    this.marginFromSides = 10;

    this.upgradePicKey = upgradePicKey;
    this.upgradePicFrame = upgradePicFrame;

    //setup pressed bg graphic
    this.bgGraphicPressed = this.getBackgroundGraphic(width, height, outlineWidth, outlineColorPressed, bgColorPressed);
    this.addChild(this.bgGraphicPressed);

    //setup background
    this.bgGraphic = this.getBackgroundGraphic(width, height, outlineWidth, outlineColor, bgColor);
    this.addChild(this.bgGraphic);

    //add the upgrade image
    this.icon = game.add.image(0,0, upgradePicKey, upgradePicFrame);
    this.setIconProperties();
    this.addChild(this.icon);

    //add the upgrade fillers
    this.upgradeBullets = [];
    this.setNumberUpgradeBullets(currentUpgradeNum, maxUpgradesNum);

    //register click listeners
    this.setAll('inputEnabled', true);
    this.callAll('events.onInputDown.add', 'events.onInputDown', this.onDown, this);
    this.callAll('events.onInputUp.add', 'events.onInputUp', this.onUp, this);
  }

  onDown(){
    this.swapChildren(this.bgGraphic, this.bgGraphicPressed);
  }

  onUp(){
    this.swapChildren(this.bgGraphic, this.bgGraphicPressed);
  }

  getRadiusFromPercent(radiusPercent, width, height){
    //these extra vars are only for use in the constructor, where this.width and this.height will be set after the radius
    if(this.width > 0) width = this.width;
    if(this.height > 0) height = this.width;

    const min_dimen = Math.min(width, height); //cannot be >= Max_Dimension / 2
    radiusPercent = Math.min(radiusPercent, 50); //max radius is 50%

    const radius = min_dimen * (radiusPercent / 100) - 1;
    return Math.max(0.1,radius); //radius must be >0 to be a rectangle
  }

  getBackgroundGraphic(width, height, lineWidth = 3, outlineColor = '0x99E1D9', backgroundColor = '0x332292F', radiusPercent = 25){
    var graphic = this.game.add.graphics(- width / 2, - height / 2);

    graphic.anchor.setTo(0.5,0.5);
    const radius = this.getRadiusFromPercent(radiusPercent, width, height);

    //draw outline
    graphic.boundsPadding = 0;
    graphic.lineStyle(lineWidth, outlineColor, 1);
    graphic.drawRoundedRect(0, 0, width, height, radius);

    //draw fill
    graphic.beginFill(backgroundColor);
    graphic.drawRoundedRect(0, 0, width, height, radius);
    graphic.endFill();

    return graphic;
  }

  setIconProperties(){
    this.icon.anchor.setTo(0.5,0.5);
    this.icon.width = this.width * 0.5;
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
    this.bulletHasChanged(this.currentUpgradeNum, this.upgradedColor);
    this.currentUpgradeNum++;
  }
  decrementUpgrade(){
    this.currentUpgradeNum--;
    this.bulletHasChanged(this.currentUpgradeNum, this.notYetUpgradedColor);
  }
  bulletHasChanged(bulletNo, newColor){
    var bullet = this.upgradeBullets[bulletNo];
    bullet.tint = newColor;
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
