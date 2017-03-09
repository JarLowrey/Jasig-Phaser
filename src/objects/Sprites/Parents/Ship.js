/*
 * Ship
 * ====
 *
 */

import Unit from './Unit';
import Weapons from '../../Helpers/Weapons';
import * as PhaserUi from 'phaser-ui';

export default class Ship extends Unit {
  static className() {
    return 'Ship';
  }

  constructor(game) {
    super(game);

    this.healthbar = new PhaserUi.ProgressBar(this.game, 100, 15, null, 2);
    this.addChild(this.healthbar);
    this.healthbar.visible = false; //since many sprites are preallocated in pools, you need to manually hide the healthbar upon creation

    this.dmgOverlay = this.game.add.sprite(0, 0);
    this.dmgOverlay.anchor.setTo(0.5, 0.5);
    this.addChild(this.dmgOverlay);
  }

  update() {
    if (!this.isAlive) return;

    super.update();
  }

  showDamagedParticles() {

  }

  reset(shipName, isFriendly) {
    super.reset(shipName, isFriendly, 'ships');

    //setup+choose weapons
    this.weapons = new Weapons(this);
    this.weapons.setupWeapons(this.info.weapons['low_level']);

    //save the frame type
    this.shipFrameType = this.info.shipFrameType;

    this.healthbar.width = this.width / this.scale.x;
    this.healthbar.scale.y = Math.abs(this.healthbar.scale.x);
    this.healthbar.y = -(10 + this.height / 2) / Math.abs(this.scale.y);
    this.healthbar.setText('', Object.assign({}, this.game.fonts.text));
    this.updateHealthbar();
    this.healthbar.visible = true;
  }

  arrivedAtYDestionation() {
    super.arrivedAtYDestionation();
    this.weapons.startShooting();
  }

  damage(amount) {
    super.damage(amount);

    this.checkForDamageOverlay();
    this.hurtTween();
    this.updateHealthbar();
  }

  checkForDamageOverlay() {
    if (!this.shipFrameType) return; //if no frame type, no dmg overlay exists
    const percentLeft = this.health / this.maxHealth;

    if (percentLeft <= 0.75) {
      let dmgExtent = 1;
      this.dmgOverlay.visible = true;
      if (percentLeft <= 0.25) {
        dmgExtent = 3;
      } else if (percentLeft <= 0.5) {
        dmgExtent = 2;
      }
      //change texture, which forces use to update size+position
      this.dmgOverlay.loadTexture('sprites', 'ship' + this.shipFrameType + '_damage' + dmgExtent);
      this.dmgOverlay.width = this.width / Math.abs(this.scale.x);
      this.dmgOverlay.height = this.height / Math.abs(this.scale.y);
    } else {
      this.dmgOverlay.visible = false;
    }

  }

  hurtTween() {
    const resetAngle = function() {
      this.angle = 0;
    }.bind(this);

    const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    const tweenAngle = (10 + 10 * Math.random()) * plusOrMinus;
    const tweenTime = 4;
    var tween = this.game.add.tween(this)
      .to({
        angle: -tweenAngle
      }, tweenTime, Phaser.Easing.Linear.In)
      .to({
        angle: tweenAngle
      }, tweenTime, Phaser.Easing.Linear.In)
      .repeatAll(1);
    tween.onComplete.add(resetAngle, this);
    tween.start();
  }

  heal(amount) {
    super.heal(amount);

    this.updateHealthbar();
  }

  updateHealthbar() {
    const healthPercentLeft = (this.health / this.maxHealth);
    this.healthbar.progress = healthPercentLeft;
    this.healthbar.setText(Math.max(this.health, 0));
  }

  kill() {
    if (this.isBeingKilled) return;

    if (this.inWorld) {
      this.game.spritePools.explode('primaryExplosion', 'default', this);
      this.game.spritePools.getPool('Explosion').getFirstDead(true).reset(this.x, this.y);
    }
    this.weapons.stopShooting();
    this.healthbar.visible = false;

    super.kill();
  }
  finishKill() {
    this.isBeingKilled = false;
    super.kill();
  }
  //Overrides super method. this is called at the end of super.kill()
  showDeathAnimationsThenKill() {
    this.isBeingKilled = true;

    //setup tween to be played upon this.kill()
    const xTweenLen = 10 * Math.random() + 10;
    const tweenAngle = 20 + 20 * Math.random();
    const tweenTime = 30;
    var tween = this.game.add.tween(this)
      .to({
        x: '-' + xTweenLen
      }, tweenTime, Phaser.Easing.Linear.In) //tween it relative to the current position. Needs to be a string
      .to({
        x: '+' + xTweenLen
      }, tweenTime, Phaser.Easing.Linear.In)
      .to({
        angle: -tweenAngle
      }, tweenTime, Phaser.Easing.Linear.In)
      .to({
        angle: tweenAngle
      }, tweenTime, Phaser.Easing.Linear.In)
      .repeatAll(1);
    tween.start();
    tween.onComplete.add(this.finishKill, this);
  }

  reverseXonEdges() {
    const vx = Math.abs(this.body.velocity.x);
    if (this.left < 0) {
      this.body.velocity.x = vx;
    } else if (this.right > this.game.world.width) {
      this.body.velocity.x = -vx;
    }
  }

  static bulletCollision(unit, bullet) {
    const shootingWeapon = bullet.parent.myWeapon;
    if (unit.isAlive) bullet.kill();
    if (unit.isAlive) unit.damage(shootingWeapon.dmg);
  }

}
