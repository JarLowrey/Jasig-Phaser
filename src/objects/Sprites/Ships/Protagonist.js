/*
 * Protagonist
 * ====
 *
 */
import Ship from '../Parents/Ship';
import ParentSprite from '../Parents/ParentSprite';
import * as PhaserUi from 'phaser-ui';
import Store from '../../../states/Store';


export default class Protagonist extends Ship {
  static className() {
    return 'Protagonist';
  }

  update() {
    super.update();

    this.game.physics.arcade.moveToPointer(this, this.getSpeed());
  }

  getSpeed(activePointer = this.game.input.activePointer) {
    const activePointerPos = activePointer.position;
    const distToPointer = Phaser.Point.distance(this, activePointerPos);

    var speed = distToPointer * 5;
    speed = Math.max(speed, (50)); //set a min speed. This causes a shaking effect when still

    return speed;
  }

  static getMaxHealth(game) {
    const defLevel = game.data.play.unlocks.purchases.defense;
    const heroBaseHealth = game.entities.ships.protagonist.health;
    const upgradeInfo = game.cache.getJSON('upgrades');

    return (upgradeInfo.repair.valueIncreasePerLevel * defLevel) + heroBaseHealth;
  }

  reset() {
    super.reset('protagonist', true);

    this.x = this.game.world.centerX;
    this.y = this.game.world.height;

    this.body.collideWorldBounds = true;
    this.reachedYDestination = true; //set to true so Unit will not run checks to see if this has reached its destination. Protagonist does not have a compile time destination.

    this.health = this.game.data.play.playerInfo.health;
    this.maxHealth = Protagonist.getMaxHealth(this.game); //used in parent

    //setup healthbar
    const healthbarJson = this.game.dimen.game_health;
    this.healthbar.destroy(); //delete the bar given to this by the parent, Ship
    this.healthbar = new PhaserUi.ProgressBar(this.game, (parseFloat(healthbarJson.width) / 100) * this.game.width, healthbarJson.height,
      null, healthbarJson.strokeLength);
    this.healthbar.x = this.game.world.width - healthbarJson.x - this.healthbar.width / 2;
    this.healthbar.y = healthbarJson.y;
    this.updateHealthbar();

    this.body.mass = 0.001; //reduce the mass so collisions aren't as forceful
    this.body.maxVelocity.setTo(500000, 500000); //basically remove maxVelocity restrictions

    //setup begin/end shooting events
    this.game.input.onDown.add(this.startShooting.bind(this), this);
    this.game.input.onUp.add(this.stopShooting.bind(this), this);
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
