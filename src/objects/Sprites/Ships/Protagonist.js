/*
 * Protagonist
 * ====
 *
 */
import Ship from '../../Sprites/Ship';
import ParentSprite from '../../Sprites/ParentSprite';
import SpritePooling from '../../Sprites/SpritePooling';
import ProgressBar from '../../../objects/UI/ProgressBar';
import Store from '../../../states/Store';

export default class Protagonist extends Ship {
  static getClassName(){ return 'Protagonist'; }

  constructor(game){
    super(game);

    this.game.world.add(this); //need to set the parent to the world group, as it is not done automatically

    this.speed = 5;

    const friendlyShipsPoolName = SpritePooling.getPoolName(Ship, true);
    this.getSpritePool(friendlyShipsPoolName).add(this);
  }

  update(){
    super.update();

    this.game.physics.arcade.moveToPointer(this, this.getSpeed());
  }

  getSpeed(activePointer = this.game.input.activePointer){
    const activePointerPos = activePointer.position;
    const distToPointer = Phaser.Point.distance(this, activePointerPos);

    var speed = distToPointer * this.speed;
    speed = Math.max(speed, ParentSprite.dp(50)); //set a min speed. This causes a shaking effect when still

    return speed;
  }

  reset(x, y){
    super.reset('protagonist', x, y, true);

    this.body.collideWorldBounds = true;
    this.reachedYDestination = true; //set to true so Unit will not run checks to see if this has reached its destination. Protagonist does not have a compile time destination.

    this.health = this.game.getConfig('health');
    this.maxHealth = Store.getMaxHealth(this.game);

    //setup healthbar
    const healthbarJson = this.game.dimen['game_health'];
    this.healthbar.destroy(); //delete the bar given to this by the parent, Ship
    this.healthbar = new ProgressBar(this.game, null, (parseFloat(healthbarJson.width) / 100) * this.game.width, healthbarJson.height,
      false, healthbarJson.strokeLength);
    this.healthbar.setText( this.getHealthbarText() );
    this.healthbar.x = this.game.world.width - healthbarJson.x - this.healthbar.width / 2;
    this.healthbar.y = healthbarJson.y;
    this.healthbar.setTextSizeToBarSize();

    this.body.mass = .001; //reduce the mass so collisions aren't as forceful
    this.body.maxVelocity.setTo(500000, 500000); //basically remove maxVelocity restrictions

    //setup begin/end shooting events
    this.game.input.onDown.add(this.startShooting.bind(this), this );
    this.game.input.onUp.add(this.stopShooting.bind(this), this.gun );
  }

  damage(amt){
    super.damage(amt);
    this.game.camera.shake(0.01);
  }

  finishKill(){
    super.finishKill('GameOver');
  }

  kill(){
    super.kill();

    this.healthbar.visible = true; //leave healthbar showing while this is dying
  }

  getHealthbarText(){
    return Math.max(this.health,0) + '/' + this.maxHealth;
  }

}
