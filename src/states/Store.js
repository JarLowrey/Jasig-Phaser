/*
 * Store state
 */
import UpgradableStoreItem from '../objects/UI/UpgradableStoreItem';
import ProgressBar from '../objects/UI/ProgressBar';
import UiHelper from '../objects/UI/UiHelper';
import Stars from '../objects/UI/Stars';
import IconBtn from '../objects/UI/IconBtn';
import IconText from '../objects/UI/IconText';


export default class Store extends Phaser.State {

  create() {
    this.upgradeInfo = this.game.cache.getJSON('upgrades');

    this.stars = new Stars(this.game);
    this.stars.showStars();

    //setup placement vars
    const outlineWidth = UiHelper.dp(4);
    const margin = UiHelper.dp(15);
    this.margin = margin;
    const outlineColor = 0x99E1D9;
    const bgColor = 0x332292F;
    const upgradeHeight = Math.min(UiHelper.dp(150), this.game.height / 5);
    const width = Math.min(UiHelper.dp(75), this.game.width / 6);
    const btnLen = Math.min(UiHelper.dp(40), this.game.width / 6);
    const outlineColorPressed = 0xa1e199;
    const bgColorPressed = 0xe1d999;

    this.createUpgrades(width, upgradeHeight, margin, outlineWidth,outlineColor,bgColor,outlineColorPressed,bgColorPressed);
    this.upgrades.x = this.game.world.centerX;
    this.upgrades.y = 0 + this.upgrades.height/2;

    const len = this.upgrades.width;
    this.createTextBox(this.game.world.centerX, this.upgrades.bottom + len/2 + margin, len, this.upgrades.width, outlineWidth,outlineColor,bgColor);

    this.assignUpgradePressedFunctions(); //assign functions after creation of upgrade displays and text box

    this.createStateBtns(btnLen, outlineWidth, outlineColor, outlineColorPressed, bgColor, bgColorPressed, margin);

    //simulate a press of the 'guns' upgrade to set some valid text into the text box
    this.guns.onDown();
    this.guns.onUp();
  }

  update(){
    //this.game.debug.geom(this.title.getBounds()); //better way of showing the bounding box when debugging
    //this.game.debug.geom(this.msg.getBounds()); //better way of showing the bounding box when debugging
  }

  createStateBtns(btnLen, outlineWidth, outlineColor, outlineColorPressed, bgColor, bgColorPressed, margin){
    var startState = function(stateName){ return function(){ this.state.start(stateName); }.bind(this); }.bind(this);

    this.stateBtns = new Phaser.Group(this.game);

    this.playBtn = new IconBtn(this.game, btnLen * 1.5, 'icons', 'play', outlineWidth/2, outlineColor, outlineColorPressed, bgColor, bgColorPressed,startState('Game'));
    this.settingsBtn = new IconBtn(this.game, btnLen, 'icons', 'settings', outlineWidth/2, outlineColor, outlineColorPressed, bgColor, bgColorPressed,startState('Settings'));
    this.scoresBtn = new IconBtn(this.game, btnLen, 'icons', 'chart', outlineWidth/2, outlineColor, outlineColorPressed, bgColor, bgColorPressed,startState('Stats'));

    this.playBtn.x = 0;
    this.playBtn.top = this.textBox.bottom + margin;

    this.settingsBtn.right = this.playBtn.left - margin * 2;
    this.settingsBtn.y = this.playBtn.y;

    this.scoresBtn.left = this.playBtn.right + margin * 2;
    this.scoresBtn.y = this.playBtn.y;

    this.stateBtns.addChild(this.playBtn);
    this.stateBtns.addChild(this.settingsBtn);
    this.stateBtns.addChild(this.scoresBtn);

    this.stateBtns.x = this.game.world.centerX;
  }

  assignUpgradePressedFunctions(){
    //use a closure to return a function with valid title, text, cost properties
    var pressed = function(groupName, upgradeName){
      return function(){
        const upgradeLvl = this.game.getConfig(upgradeName);
        const info = this.upgradeInfo[groupName];

        const title = info.title;
        const msg = this.getMsg(groupName, upgradeLvl);
        var cost = this.getCost(groupName, upgradeLvl);

        const purchase = this.purchaseAttempt(groupName,upgradeName, cost).bind(this);
        this.buyBtn.changePressFunction(purchase);

        this.setText( title, msg, cost, this.upgradeMaxedOut(groupName,upgradeLvl) );
      }.bind(this);
    }.bind(this);

    this.guns.assignPressFunction(        pressed('guns', 'gunLevel') );
    this.damage.assignPressFunction(      pressed('damage', 'damageLevel') );
    this.fireRate.assignPressFunction(    pressed('fireRate', 'fireRateLevel') );
    this.defense.assignPressFunction(     pressed('defense', 'defenseLevel') );
    this.scoreBoost.assignPressFunction(  pressed('scoreBoost', 'scoreBoostLevel') );
    this.ally.assignPressFunction(        pressed('ally', 'allyLevel') );
  }
  purchaseAttempt(groupName, upgradeName, cost){
    return function(){
      const currentMoney = this.game.getConfig('resources');

      if(cost < currentMoney){ //purchase successful
        this.game.storeConfig('resources',currentMoney - cost);
        this.game.storeConfig(upgradeName,this.game.getConfig(upgradeName) + 1);
        this[groupName].incrementUpgrade();
        console.log('purchase successful');
      }else{  //purchase unsuccessful
        console.log('purchase not successful');
      }
    };
  }
  getCost(upgradeName, level){
    const info = this.upgradeInfo[upgradeName];

    //check if the json defines the cost increase schedule
    var cost = info.baseCost * Math.pow(info.costIncreasePerLevel, level);
    if(info.maxCost) cost = Math.min(cost, info.maxCost);

    if(!cost) cost = info.baseCost * this.waveNumber; //cost not found: maybe cost is linearly proportional to wave number
    if(!cost) cost = info.levels[level].cost; //cost not found: cost is manually defined for each level, ignore everything above and just set it

    return cost;
  }
  getMsg(upgradeName, level){
    const info = this.upgradeInfo[upgradeName];

    var msg = info.msg;
    if(!msg) msg = info.levels[level].msg;
    if(this.upgradeMaxedOut(upgradeName,level)) msg = info.maxed_out;

    return msg;
  }
  upgradeMaxedOut(upgradeName, level){
    const info = this.upgradeInfo[upgradeName];
    return level >= info.maxLevel || (info.levels && level >= info.levels.length);
  }

  createUpgrades(upgradeWidth, upgradeHeight, margin, outlineWidth, outlineColor, backgroundColor, outlineColorPressed, bgColorPressed){
    this.upgrades = new Phaser.Group(this.game);

    this.guns       = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      2, this.upgradeInfo.guns.levels.length, 'icons', this.upgradeInfo.guns.icon,
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

  createTextBox(x,y, width, height, outlineWidth = 5, outlineColor = '0x123456', bgColor = '0xffffff', outlineColorPressed = 0x654321, bgColorPressed = 0x177612){
    this.txtBgOutlineWidth = outlineWidth;

    this.txtBackground = this.game.add.graphics(0,0);
    this.txtBackground.anchor.setTo(0.5,0.5);

    //draw outline
    this.txtBackground.boundsPadding = 0;
    this.txtBackground.lineStyle(outlineWidth, outlineColor, 1);
    this.txtBackground.drawRect(-width/2, -height/2, width, height);

    //draw fill
    this.txtBackground.beginFill(bgColor);
    this.txtBackground.drawRect(-width/2, -height/2, width, height);
    this.txtBackground.endFill();

    //create title
    this.title = this.game.add.text(0,0,'Store',this.game.fonts['title']);
    this.title.anchor.setTo(0.5,0);
    this.title.top = - this.txtBackground.height / 2 + this.txtBgOutlineWidth;

    //create msg
    this.msg = this.game.add.text(0,this.title.bottom,'Store',this.game.fonts['text']);
    this.msg.anchor.setTo(0.5,0);
    this.msg.wordWrapWidth = this.txtBackground.width * 0.9;

    //create buyBtn
    this.buyBtn = new IconText(this.game,20,'score', 'text', 'icons', 'coins', 0);
    this.buyBtn.setPressable(this.txtBackground.width/2, outlineWidth / 2, outlineColor, bgColor, outlineColorPressed, bgColorPressed);
    this.buyBtn.bottom = this.txtBackground.bottom - this.txtBgOutlineWidth;

    //add text to a group
    this.textBox = new Phaser.Group(this.game);
    this.textBox.addChild(this.txtBackground);
    this.textBox.addChild(this.title);
    this.textBox.addChild(this.msg);
    this.textBox.addChild(this.buyBtn);

    //position the group
    this.textBox.x = x;
    this.textBox.y = y;
  }

  setText(title, msg, cost,upgradeMaxedOut){
    const oldTop = this.textBox.top;

    this.title.setText(title);
    this.msg.setText(msg);
    this.buyBtn.setText(this.game.nFormatter(cost));
    this.buyBtn.visible = !upgradeMaxedOut; //if maxed, hide option to buy

    //resize the background for the new text (not always needed)
    this.txtBackground.width = this.textBox.width;// + this.textMargin * 2;
    this.txtBackground.height = Math.max(this.textBox.height, //prev value
      this.title.height + this.msg.height + this.buyBtn.height + this.margin * 3); //sum of text boxes and buy button
    this.msg.wordWrapWidth = this.txtBackground.width * 0.9;

    //reposition the new text
    this.title.top =  - this.txtBackground.height / 2 + this.txtBgOutlineWidth;
    this.msg.top = this.title.bottom;
    const bottomOfBox = this.txtBackground.bottom  - this.buyBtn.height / 2 - this.margin;
    const belowMsg = this.msg.bottom + this.buyBtn.height / 2 + this.margin;
    this.buyBtn.y = Math.max(bottomOfBox, belowMsg);

    //ensure that the group stays at its old position
    this.textBox.top = oldTop;

    //ensure the buttons remain below
    this.stateBtns.top = this.textBox.bottom + this.margin;
  }
}
