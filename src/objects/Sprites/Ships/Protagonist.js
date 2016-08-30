/* jshint esversion: 6 */

/*
 * Protagonist
 * ====
 *
 */
import Ship from '../../Sprites/Ship';
import ParentSprite from '../../Sprites/ParentSprite';
import ProgressBar from '../../../objects/UI/ProgressBar';
import Store from '../../../states/Store';

export default class Protagonist extends Ship {
  static getClassName() {
    return 'Protagonist';
  }

  constructor(game) {
    super(game);

    this.game.world.add(this); //need to set the parent to the world group, as it is not done automatically

    this.speed = 5;
  }

  update() {
    super.update();

    this.game.physics.arcade.moveToPointer(this, this.getSpeed());
  }

  getSpeed(activePointer = this.game.input.activePointer) {
    const activePointerPos = activePointer.position;
    const distToPointer = Phaser.Point.distance(this, activePointerPos);

    var speed = distToPointer * this.speed;
    speed = Math.max(speed, ParentSprite.dp(50)); //set a min speed. This causes a shaking effect when still

    return speed;
  }

  reset() {
    super.reset('protagonist', true);

    this.x = this.game.world.centerX;
    this.y = this.game.world.height;

    this.body.collideWorldBounds = true;
    this.reachedYDestination = true; //set to true so Unit will not run checks to see if this has reached its destination. Protagonist does not have a compile time destination.

    this.health = this.game.getConfig('health');
    this.maxHealth = Store.getMaxHealth(this.game);

    //setup healthbar
    const healthbarJson = this.game.dimen.game_health;
    this.healthbar.destroy(); //delete the bar given to this by the parent, Ship
    this.healthbar = new ProgressBar(this.game, null, (parseFloat(healthbarJson.width) / 100) * this.game.width, healthbarJson.height,
      false, healthbarJson.strokeLength);
    this.healthbar.setText(this.getHealthbarText());
    this.healthbar.x = this.game.world.width - healthbarJson.x - this.healthbar.width / 2;
    this.healthbar.y = healthbarJson.y;
    this.healthbar.setTextSizeToBarSize();

    this.body.mass = 0.001; //reduce the mass so collisions aren't as forceful
    this.body.maxVelocity.setTo(500000, 500000); //basically remove maxVelocity restrictions

    //setup begin/end shooting events
    this.game.input.onDown.add(this.startShooting.bind(this), this);
    this.game.input.onUp.add(this.stopShooting.bind(this), this.gun);
  }

  damage(amt) {
    const percentDamaged = amt / this.health;
    const maxShake = 0.05;
    const shakeVal = maxShake * percentDamaged;
    this.game.camera.shake(Phaser.Math.clamp(shakeVal, 0, maxShake));

    super.damage(amt);
  }

  finishKill() {
    super.finishKill('GameOver');
  }

  kill() {
    super.kill();

    this.healthbar.visible = true; //leave healthbar showing while this is dying
  }

  getHealthbarText() {
    return Math.max(this.health, 0) + '/' + this.maxHealth;
  }

}
