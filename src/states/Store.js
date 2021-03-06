/*
 * Store state
 */
import UpgradableStoreItem from '../objects/UI/UpgradableStoreItem';
import * as PhaserUi from 'phaser-ui';
import Protagonist from '../objects/Sprites/Ships/Protagonist';
import IconBtn from '../objects/UI/IconBtn';
import IconText from '../objects/UI/IconText';

export default class Store extends Phaser.State {

  create() {
    this.upgradeInfo = this.game.cache.getJSON('upgrades');
    
    this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height,'sprites','background');
    this.starfield = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sprites','starfield');
    this.starfield2 = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sprites','starfield2');

    this.game.world.setBounds(0, 0, this.game.width, this.game.height);

    //setup placement vars
    const outlineWidth = (4);
    const margin = (15);
    this.margin = margin;
    const outlineColor = 0x99E1D9;
    const bgColor = 0x332292F;
    const upgradeHeight = (150);
    const width = Math.min((75), this.game.width / 6);
    const btnLen = Math.min((40), this.game.width / 6);
    const outlineColorPressed = 0xa1e199;
    const bgColorPressed = 0xe1d999;

    this.totalMoney = new IconText(this.game, 20, 'score', 'text', 'sprites', 'coins', 0);
    this.totalMoney.setText(this.game.nFormatter(this.game.data.play.score));

    this.currentWave = this.game.add.text(0, 0, 'Day ' + this.game.data.play.wave.number, Object.assign({}, this.game.fonts.text));
    this.currentWave.anchor.setTo(0.5, 0.5);

    this.createUpgrades(width, upgradeHeight, margin, outlineWidth, outlineColor, bgColor, outlineColorPressed, bgColorPressed);

    const healthStr = this.game.data.play.playerInfo.health + '/' + Protagonist.getMaxHealth(this.game);
    this.healthbar = new PhaserUi.ProgressBar(this.game, this.upgrades.width, 20, null, 9);
    this.healthbar.setText(healthStr, Object.assign({}, this.game.fonts.text));
    this.healthbar.progress = this.game.data.play.playerInfo.health / Protagonist.getMaxHealth(this.game);
    this.healthbar.makePressable(this.upgradePressed('repair', 'health'), 0xffffff, 0xffffff);

    const len = this.upgrades.width;
    this.createTextBox(len, this.upgrades.width, outlineWidth, outlineColor, bgColor);

    this.createStateBtns(btnLen, outlineWidth, outlineColor, outlineColorPressed, bgColor, bgColorPressed, margin);

    this.positionStoreItems();

    this.assignUpgradePressedFunctions(); //assign functions after creation of upgrade displays and text box

    this.game.kineticScrolling.start();
  }

  positionStoreItems() {
    //place the store items on the screen
    this.upgrades.x = this.game.world.centerX; //group
    this.healthbar.x = this.game.world.centerX; //group
    this.stateBtns.x = this.game.world.centerX; //group
    this.textBox.x = this.game.world.centerX; //group
    this.totalMoney.right = this.upgrades.right; //group
    this.currentWave.left = this.upgrades.left; //text

    const groupTopAndBottomPropertiesAreMessedUp = false;
    if (groupTopAndBottomPropertiesAreMessedUp) {
      this.currentWave.top = this.margin;
      this.totalMoney.y = this.currentWave.y;
      this.healthbar.y = this.totalMoney.y + this.totalMoney.height / 2 + this.healthbar.height / 2 + this.margin;
      this.upgrades.y = this.healthbar.y + this.healthbar.height / 2 + this.upgrades.height / 2 + this.margin;
      this.textBox.y = this.upgrades.y + this.upgrades.height / 2 + this.textBox.height / 2 + this.margin;
      this.stateBtns.y = this.textBox.y + this.textBox.height / 2 + this.stateBtns.height / 2 + this.margin;
    } else {
      this.totalMoney.top = this.margin;
      this.currentWave.top = this.totalMoney.top;
      this.healthbar.top = this.currentWave.bottom + this.margin;
      this.upgrades.top = this.healthbar.bottom + this.margin;
      this.textBox.top = this.upgrades.bottom + this.margin;
      this.stateBtns.top = this.textBox.bottom + this.margin;
    }

    /*
        console.log('Store items placement variables');
        console.log(this.game.world, this.game.camera);
        console.log('Top: ',this.margin, this.currentWave.top, this.totalMoney.top, this.healthbar.top, this.upgrades.top, this.textBox.top);
        console.log('Y position:',this.margin, this.currentWave.y, this.totalMoney.y, this.healthbar.y, this.upgrades.y, this.textBox.y);
        console.log('X position:',this.margin, this.currentWave.x, this.totalMoney.x, this.healthbar.x, this.upgrades.x, this.textBox.x);
        console.log('height:',this.margin, this.currentWave.height, this.totalMoney.height, this.healthbar.height, this.upgrades.height, this.textBox.height);
        console.log('');
    */
  }

  setScrollArea() {
    //Changing the world height
    const top = this.currentWave.top;
    //stateBtns position is relative to the world, which moves with kineticScrolling camera. Account for this offset when setting new scroll bounds
    const height = this.stateBtns.y + this.stateBtns.height / 2 - this.game.world.y + top;

    this.game.world.setBounds(0, 0, this.game.width, height);
    //this.stars.setEmitAreaToGameArea();
  }

  shutdown() {
    //return game bounds to game size and stop scrolling
    this.game.kineticScrolling.stop();
    this.game.world.setBounds(0, 0, this.game.width, this.game.height);
  }

  update() {
    //this.game.debug.geom(this.title.getBounds()); //better way of showing the bounding box when debugging
    //this.game.debug.geom(this.msg.getBounds()); //better way of showing the bounding box when debugging
  }

  createStateBtns(btnLen, outlineWidth, outlineColor, outlineColorPressed, bgColor, bgColorPressed, margin) {
    var startState = function(stateName) {
      return function() {
        this.game.state.start(stateName, this.game.getRandomStateTransitionOut(), this.game.getRandomStateTransitionIn());
      }.bind(this);
    }.bind(this);

    this.stateBtns = new Phaser.Group(this.game);

    this.playBtn = new IconBtn(this.game, btnLen * 1.5, 'sprites', 'play', outlineWidth / 2, outlineColor, outlineColorPressed, bgColor, bgColorPressed, startState('Game'));
    this.settingsBtn = new IconBtn(this.game, btnLen, 'sprites', 'settings', outlineWidth / 2, outlineColor, outlineColorPressed, bgColor, bgColorPressed, startState('Settings'));
    this.scoresBtn = new IconBtn(this.game, btnLen, 'sprites', 'chart', outlineWidth / 2, outlineColor, outlineColorPressed, bgColor, bgColorPressed, startState('Stats'));

    //set buttons positioning relative to one another
    this.playBtn.x = 0;
    this.playBtn.y = 0;
    this.settingsBtn.right = this.playBtn.left - margin * 2;
    this.settingsBtn.y = this.playBtn.y;
    this.scoresBtn.left = this.playBtn.right + margin * 2;
    this.scoresBtn.y = this.playBtn.y;

    this.stateBtns.addChild(this.playBtn);
    this.stateBtns.addChild(this.settingsBtn);
    this.stateBtns.addChild(this.scoresBtn);
  }

  assignUpgradePressedFunctions() {
    this.guns.assignPressFunction(this.upgradePressed('guns', 'gun').bind(this));
    this.damage.assignPressFunction(this.upgradePressed('damage', 'damage').bind(this));
    this.fireRate.assignPressFunction(this.upgradePressed('fireRate', 'fireRate').bind(this));
    this.defense.assignPressFunction(this.upgradePressed('defense', 'defense').bind(this));
    this.scoreBoost.assignPressFunction(this.upgradePressed('scoreBoost', 'scoreBoost').bind(this));
    this.ally.assignPressFunction(this.upgradePressed('ally', 'ally').bind(this));
  }
  purchaseAttempt(groupName, upgradeName, cost) {
    return function() {
      const currentMoney = this.game.data.play.score;

      if (cost < currentMoney) { //purchase successful
        this.game.data.play.score -= cost;
        this.game.data.play.unlocks.purchases[upgradeName] += 1;
        this.game.data.saveGame();

        //perform extra processing for upgrades with special cases
        if (upgradeName == 'health' || upgradeName == 'defenseLevel') {
          //max out health and set the Store healthbar
          const maxHealth = Protagonist.getMaxHealth(this.game);
          //update data
          this.game.data.play.playerInfo.health = maxHealth;

          //update UI
          this.healthbar.progress = 1;
          this.healthbar.setText(maxHealth + '/' + maxHealth);
        }

        if (this[groupName]) {
          this[groupName].incrementUpgrade();
        } //increment the upgrade display

        this.upgradePressed(groupName, upgradeName)(); //reset the text box
      } else {
        //purchase unsuccessful. show alert TODO
      }

      this.totalMoney.setText(this.game.nFormatter(this.game.data.play.score));
    };
  }
  upgradePressed(groupName, upgradeName) {
    return function() {
      const info = this.upgradeInfo[groupName];

      const title = info.title;
      const msg = this.getMsg(groupName, upgradeName);
      var cost = this.getCost(groupName, upgradeName);

      //change what happens when the buy button is clicked
      this.buyBtn.changePressFunction(this.purchaseAttempt(groupName, upgradeName, cost).bind(this));

      this.setText(title, msg, cost);
    }.bind(this);
  }
  getCost(groupName, upgradeName) {
    const currentLevel = this.game.data.play.unlocks.purchases[upgradeName];
    if (this.upgradeMaxedOut(groupName, upgradeName)) return null; //if the upgrade is maxed, return a null cost

    const info = this.upgradeInfo[groupName];

    //check if the json defines the cost increase schedule
    var cost = info.baseCost * Math.pow(info.costIncreasePerLevel, currentLevel);
    if (info.maxCost) cost = Math.min(cost, info.maxCost);

    if (!cost) cost = info.baseCost * (1 + this.game.data.play.wave.number); //cost not found: maybe cost is linearly proportional to wave number
    if (!cost) cost = info.levels[currentLevel].cost; //cost not found: cost is manually defined for each level, ignore everything above and just set it

    return cost;
  }
  getMsg(groupName, upgradeName) {
    const currentLevel = this.game.data.play.unlocks.purchases[upgradeName];
    const info = this.upgradeInfo[groupName];

    var msg = info.msg;
    if (this.upgradeMaxedOut(groupName, upgradeName)) msg = info.maxed_out || this.upgradeInfo.maxed_out; //maxed out message can be customized in the json entry. If it's not there, use the default
    if (!msg) msg = info.levels[currentLevel].msg;

    return msg;
  }
  upgradeMaxedOut(groupName, upgradeName) {
    const currentLevel = this.game.data.play.unlocks.purchases[upgradeName];
    const info = this.upgradeInfo[groupName];

    const isHealthAndIsMaxed = upgradeName == 'health' && this.game.data.play.playerInfo.health == Protagonist.getMaxHealth(this.game);
    const pastMaxLevel = currentLevel >= info.maxLevel;
    const gunMaxedOut = (upgradeName == 'gun' && info.levels && currentLevel >= info.levels.length);
    const maxedOutLevel = gunMaxedOut || currentLevel == info.maxLevel;

    return isHealthAndIsMaxed || pastMaxLevel || maxedOutLevel;
  }

  createUpgrades(upgradeWidth, upgradeHeight, margin, outlineWidth, outlineColor, backgroundColor, outlineColorPressed, bgColorPressed) {
    this.upgrades = new Phaser.Group(this.game);

    this.guns = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      this.game.data.play.unlocks.purchases.gun, this.upgradeInfo.guns.levels.length, 'sprites', this.upgradeInfo.guns.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed, bgColorPressed);

    this.damage = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      this.game.data.play.unlocks.purchases.damage, this.upgradeInfo.damage.maxLevel, 'sprites', this.upgradeInfo.damage.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed, bgColorPressed);

    this.fireRate = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      this.game.data.play.unlocks.purchases.fireRate, this.upgradeInfo.fireRate.maxLevel, 'sprites', this.upgradeInfo.fireRate.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed, bgColorPressed);

    this.defense = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      this.game.data.play.unlocks.purchases.defense, this.upgradeInfo.defense.maxLevel, 'sprites', this.upgradeInfo.defense.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed, bgColorPressed);

    this.scoreBoost = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      this.game.data.play.unlocks.purchases.scoreBoost, this.upgradeInfo.scoreBoost.maxLevel, 'sprites', this.upgradeInfo.scoreBoost.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed, bgColorPressed);

    this.ally = new UpgradableStoreItem(this.game, upgradeWidth, upgradeHeight,
      this.game.data.play.unlocks.purchases.ally, this.upgradeInfo.ally.maxLevel, 'sprites', this.upgradeInfo.ally.icon,
      outlineWidth, outlineColor, backgroundColor,
      outlineColorPressed, bgColorPressed);

    const x = 0;
    this.scoreBoost.x = x;
    this.guns.right = this.scoreBoost.left - margin;
    this.ally.left = this.scoreBoost.right + margin;

    this.fireRate.x = x;
    this.damage.right = this.fireRate.left - margin;
    this.defense.left = this.fireRate.right + margin;


    this.ally.y = -(this.ally.height / 2 + margin / 2);
    this.scoreBoost.y = -(this.scoreBoost.height / 2 + margin / 2);
    this.guns.y = -(this.guns.height / 2 + margin / 2);

    this.defense.y = this.defense.height / 2 + margin / 2;
    this.damage.y = this.damage.height / 2 + margin / 2;
    this.fireRate.y = this.fireRate.height / 2 + margin / 2;
    /*
    //BOTTOM POSITIONING
    const y = 0;

    this.ally.bottom = y;
    this.scoreBoost.bottom = y;
    this.guns.bottom = y;

    this.defense.y = this.ally.y + this.ally.height/2 + this.defense.height/2 + margin;
    this.damage.y = this.scoreBoost.y + this.scoreBoost.height/2 + this.damage.height/2  + margin;
    this.fireRate.y = this.guns.y + this.guns.height/2 + this.fireRate.height/2  + margin;
    */
    this.upgrades.addChild(this.guns);
    this.upgrades.addChild(this.damage);
    this.upgrades.addChild(this.fireRate);
    this.upgrades.addChild(this.defense);
    this.upgrades.addChild(this.scoreBoost);
    this.upgrades.addChild(this.ally);
  }

  createTextBox(width, height, outlineWidth = 5, outlineColor = '0x123456', bgColor = '0xffffff', outlineColorPressed = 0x654321, bgColorPressed = 0x177612) {
    this.txtBgOutlineWidth = outlineWidth;

    this.txtBackground = this.game.add.graphics(0, 0);
    this.txtBackground.anchor.setTo(0.5, 0.5);

    //draw outline
    this.txtBackground.boundsPadding = 0;
    this.txtBackground.lineStyle(outlineWidth, outlineColor, 1);
    this.txtBackground.drawRect(-width / 2, -height / 2, width, height);

    //draw fill
    this.txtBackground.beginFill(bgColor);
    this.txtBackground.drawRect(-width / 2, -height / 2, width, height);
    this.txtBackground.endFill();

    //create title
    this.title = this.game.add.text(0, 0, 'Store', Object.assign({}, this.game.fonts.title));
    this.title.anchor.setTo(0.5, 0);
    this.title.top = -this.txtBackground.height / 2 + this.txtBgOutlineWidth;

    //create msg
    this.msg = this.game.add.text(0, this.title.bottom, 'Store', Object.assign({}, this.game.fonts.text));
    this.msg.anchor.setTo(0.5, 0);
    this.msg.wordWrapWidth = this.txtBackground.width * 0.9;

    //create buyBtn
    this.buyBtn = new IconText(this.game, 20, 'score', 'text', 'sprites', 'coins', 0);
    this.buyBtn.setPressable(this.txtBackground.width / 2, outlineWidth / 2, outlineColor, bgColor, outlineColorPressed, bgColorPressed);
    this.buyBtn.bottom = this.txtBackground.bottom - this.txtBgOutlineWidth;

    //add text to a group
    this.textBox = new Phaser.Group(this.game);
    this.textBox.addChild(this.txtBackground);
    this.textBox.addChild(this.title);
    this.textBox.addChild(this.msg);
    this.textBox.addChild(this.buyBtn);
  }

  setText(title, msg, cost) {
    this.title.setText(title);
    this.msg.setText(msg);
    if (cost) { //
      this.buyBtn.setText(this.game.nFormatter(cost));
    }
    this.buyBtn.visible = cost; //if maxed, cost is undefined, so use that to hide option to buy

    //resize the background for the new text (not always needed)
    this.txtBackground.width = this.textBox.width; // + this.textMargin * 2;
    this.txtBackground.height = Math.max(this.textBox.height, //prev value
      this.title.height + this.msg.height + this.buyBtn.height + this.margin * 3); //sum of text boxes and buy button
    this.msg.wordWrapWidth = this.txtBackground.width * 0.9;

    //reposition the new text
    this.title.top = -this.txtBackground.height / 2 + this.txtBgOutlineWidth;
    this.msg.top = this.title.bottom;
    const bottomOfBox = this.txtBackground.bottom - this.buyBtn.height / 2 - this.margin;
    const belowMsg = this.msg.bottom + this.buyBtn.height / 2 + this.margin;
    this.buyBtn.y = Math.max(bottomOfBox, belowMsg);

    //after changing the text box's size, it will need to be repositioned (as it grows with the midpoint staying at the same point, instead of the top as desired here)
    this.positionStoreItems();

    this.setScrollArea();
  }
}
