/*
 * Store state
 */
import UpgradableStoreItem from '../objects/UI/UpgradableStoreItem';
import ProgressBar from '../objects/UI/ProgressBar';
import UiHelper from '../objects/UI/UiHelper';
import Stars from '../objects/UI/Stars';
import IconBtn from '../objects/UI/IconBtn';


export default class Store extends Phaser.State {

  create() {
    this.upgradeInfo = this.game.cache.getJSON('upgrades');
    this.stars = new Stars(this.game);
    this.stars.showStars();

    //setup placement vars
    const outlineWidth = UiHelper.dp(4);
    const margin = UiHelper.dp(15);
    const outlineColor = 0x99E1D9;
    const bgColor = 0x332292F;
    const upgradeHeight = Math.min(UiHelper.dp(150), this.game.height / 5);
    const width = Math.min(UiHelper.dp(75), this.game.width / 6);
    const btnLen = Math.min(UiHelper.dp(40), this.game.width / 6);
    const outlineColorPressed = 0xa1e199;
    //const bgColor = 0xe1d999;
    const bgColorPressed = 0xe1d999;

    this.createUpgrades(width, upgradeHeight, margin, outlineWidth,outlineColor,bgColor,outlineColorPressed,bgColorPressed);
    this.upgrades.x = this.game.world.centerX;
    this.upgrades.y = this.game.world.centerY - this.upgrades.height/2;

    const len = this.upgrades.width;
    this.createTextInfoBox(this.game.world.centerX, this.upgrades.bottom + len/2 + margin, len, this.upgrades.width, outlineWidth,outlineColor,bgColor);
    //this.setText('STERE','buy this all day eer day asdp pasdh ppihd piahs dph',100);

    this.playBtn = new IconBtn(this.game, btnLen * 1.5, 'icons', 'play', outlineWidth/2, outlineColor, outlineColorPressed, bgColor, bgColorPressed);
    this.settingsBtn = new IconBtn(this.game, btnLen * 1.5, 'icons', 'settings', outlineWidth/2, outlineColor, outlineColorPressed, bgColor, bgColorPressed);
    this.scoresBtn = new IconBtn(this.game, btnLen * 1.5, 'icons', 'chart', outlineWidth/2, outlineColor, outlineColorPressed, bgColor, bgColorPressed);

    this.playBtn.x = this.game.world.centerX;
    this.playBtn.top = this.infoGroup.bottom + margin;
    this.settingsBtn.x = this.upgrades.left + this.upgrades.width / 3;
    this.settingsBtn.top = margin;
    this.scoresBtn.x = this.upgrades.right - this.upgrades.width / 3;
    this.scoresBtn.top = margin;
  }

  createUpgrades(upgradeWidth, upgradeHeight, margin, outlineWidth, outlineColor, backgroundColor, outlineColorPressed, bgColorPressed){
    this.upgrades = new Phaser.Group(this.game);

    this.guns       = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.guns.gunLevels.length, 'icons', this.upgradeInfo.guns.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed,bgColorPressed);

    this.damage     = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.damage.maxLevel, 'icons', this.upgradeInfo.damage.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed,bgColorPressed);

    this.fireRate   = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.fireRate.maxLevel, 'icons', this.upgradeInfo.fireRate.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed,bgColorPressed);

    this.defense    = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.defense.maxLevel, 'icons', this.upgradeInfo.defense.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed,bgColorPressed);

    this.scoreBoost = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.scoreBoost.maxLevel, 'icons', this.upgradeInfo.scoreBoost.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed,bgColorPressed);

    this.ally       = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.ally.maxLevel, 'icons', this.upgradeInfo.ally.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed,bgColorPressed);

    const x = 0;
    const y = 0;
    this.scoreBoost.x = x;
    this.guns.right = this.scoreBoost.left - margin;
    this.ally.left = this.scoreBoost.right + margin;

    this.fireRate.x = x;
    this.damage.right = this.fireRate.left - margin;
    this.defense.left = this.fireRate.right + margin;

    this.ally.bottom = y;
    this.scoreBoost.bottom = y;
    this.guns.bottom = y;

    this.defense.top = this.ally.bottom + margin;
    this.damage.top = this.scoreBoost.bottom + margin;
    this.fireRate.top = this.guns.bottom + margin;

    this.upgrades.addChild(this.guns);
    this.upgrades.addChild(this.damage);
    this.upgrades.addChild(this.fireRate);
    this.upgrades.addChild(this.defense);
    this.upgrades.addChild(this.scoreBoost);
    this.upgrades.addChild(this.ally);
  }

  createTextInfoBox(x,y, width, height, outlineWidth = 5, outlineColor = '0x123456', backgroundColor = '0xffffff'){
    this.txtBgOutlineWidth = outlineWidth;

    this.txtBackground = this.game.add.graphics(0,0);
    this.txtBackground.anchor.setTo(0.5,0.5);

    //draw outline
    this.txtBackground.boundsPadding = 0;
    this.txtBackground.lineStyle(outlineWidth, outlineColor, 1);
    this.txtBackground.drawRect(-width/2, -height/2, width, height);

    //draw fill
    this.txtBackground.beginFill(backgroundColor);
    this.txtBackground.drawRect(-width/2, -height/2, width, height);
    this.txtBackground.endFill();

    //create title
    this.title = this.game.add.text(0,0,'Store',this.game.fonts['title']);
    this.title.anchor.setTo(0.5,0);
    this.title.top = - this.txtBackground.height / 2 + this.txtBgOutlineWidth;

    //create msg
    this.msg = this.game.add.text(0,this.title.bottom,'Store',this.game.fonts['text']);
    this.msg.anchor.setTo(0.5,0);
    this.msg.wordWrapWidth = this.txtBackground.width * 0.75;

    //create cost
    this.cost = this.game.add.text(0,this.title.bottom,'Store',this.game.fonts['text']);
    this.cost.anchor.setTo(0.5,1);
    this.cost.bottom = this.txtBackground.height / 2 - this.txtBgOutlineWidth;

    //add text to a group
    this.infoGroup = new Phaser.Group(this.game);
    this.infoGroup.addChild(this.txtBackground);
    this.infoGroup.addChild(this.title);
    this.infoGroup.addChild(this.msg);
    this.infoGroup.addChild(this.cost);

    //position the group
    this.infoGroup.x = x;
    this.infoGroup.y = y;
  }

  update(){
    //this.game.debug.geom(this.title.getBounds()); //better way of showing the bounding box when debugging
    //this.game.debug.geom(this.msg.getBounds()); //better way of showing the bounding box when debugging
  }

  setText(title, msg, cost){
    const oldTop = this.infoGroup.top;

    this.title.setText(title);
    this.msg.setText(msg);
    this.cost.setText('$'+cost);

    //resize the background for the new text (not always needed)
    this.txtBackground.width = this.infoGroup.width;// + this.textMargin * 2;
    this.txtBackground.height = this.infoGroup.height;//+ this.textMargin * 2;
    this.msg.wordWrapWidth = this.txtBackground.width * 0.75;

    //reposition the new text
    this.title.top =  - this.txtBackground.height / 2 + this.txtBgOutlineWidth;
    this.msg.top = this.title.bottom;

    //ensure that the group stays at its old position
    this.infoGroup.top = oldTop;
  }
}
