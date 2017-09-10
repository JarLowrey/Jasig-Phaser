/*
 * Protagonist
 * ====
 *
 */
import Ship from '../Parents/Ship';
import ParentSprite from '../Parents/ParentSprite';
import * as PhaserUi from 'phaser-ui';


export default class Protagonist extends Ship {
  static className() {
    return 'Protagonist';
  }

  constructor(game) {
    super(game);

    this.body.collideWorldBounds = true;

    //  Add an emitter for the ship's trail
    this.shipTrail = this.game.add.emitter(0, 0, 50);
    this.shipTrail.width = 10;
    this.shipTrail.makeParticles('sprites', 'explosion');
    this.shipTrail.setXSpeed(-75, 75);
    this.shipTrail.setYSpeed(150, 300);
    this.shipTrail.setRotation(50, -50);
    this.shipTrail.setAlpha(1, 0.01, 800);
    this.shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
    this.shipTrail.start(false, 500, 20);
    this.addChild(this.shipTrail);
  }


  static getMaxHealth(game) {
    const defaultHealth = game.cache.getJSON('preloadJSON').defaults.playerInfo.health;

    const defLevel = game.data.play.unlocks.purchases.defense;
    const upgradeInfo = game.cache.getJSON('upgrades');
    const addedHealth = (upgradeInfo.repair.valueIncreasePerLevel * defLevel);

    return addedHealth + defaultHealth;
  }

  reset() {
    super.reset('protagonist', true);

    this.x = this.game.world.centerX;
    this.y = this.game.world.height;

    this.reachedYDestination = true; //set to true so Unit will not run checks to see if this has reached its destination. Protagonist does not have a compile time destination.

    //setup vars using data instead of the default ship json
    //texture/size
    this.loadTexture('sprites', this.game.data.play.playerInfo.frame);
    ParentSprite.setSize(this, this.info.width, this.info.isCircular, this.info.height);
    this.shipFrameType = this.game.data.play.playerInfo.shipFrameType;
    //health
    this.health = this.game.data.play.playerInfo.health;
    this.maxHealth = Protagonist.getMaxHealth(this.game); //used in parent

    //setup healthbar
    const healthbarJson = this.game.dimen.game_health;
    this.healthbar.destroy(); //delete the bar given to this by the parent, Ship
    this.healthbar = new PhaserUi.ProgressBar(this.game, (parseFloat(healthbarJson.width) / 100) * this.game.width, healthbarJson.height,
      null, healthbarJson.strokeLength);
    this.healthbar.setText('', Object.assign({}, this.game.fonts.text));
    this.healthbar.x = this.game.world.width - healthbarJson.x - this.healthbar.width / 2;
    this.healthbar.y = healthbarJson.y;
    this.updateHealthbar();

    this.body.mass = 0.001; //reduce the mass so collisions aren't as forceful
    this.body.maxVelocity.setTo(5000, 5000); //basically remove maxVelocity restrictions
    this.body.drag.setTo(500, 500);

    //setup begin/end shooting events
    this.game.input.onDown.add(this.startShooting, this);
    this.game.input.onUp.add(this.stopShooting, this);
  }

  checkForDamageOverlay() {
    super.checkForDamageOverlay();
    //player has a different anchor than other ships, must account for this in its overlay
    this.dmgOverlay.y = -this.height;
  }

  damage(amt) {
    const percentDamaged = amt / this.health;
    const maxShake = 0.05;
    const shakeVal = maxShake * percentDamaged;
    this.game.camera.shake(Phaser.Math.clamp(shakeVal, 0, maxShake));

    super.damage(amt);
  }

  kill() {
    super.kill(false);

    this.healthbar.visible = true; //leave healthbar showing while this is dying
  }

}
