/*
 * Protagonist
 * ====
 *
 */
import Ship from '../Sprites/Ship';
import ParentSprite from '../Sprites/ParentSprite';

export default class Protagonist extends Ship {

  constructor(game){
    super(game);

    this.game.world.add(this); //need to set the parent to the world group, as it is not done automatically

    this.speed = 5;

    ParentSprite.getPool(Ship, true, this.game).add(this);
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

    //setup healthbar
    const healthbarJson = this.game.dimen['game_health'];
    this.healthbar.setSize(healthbarJson.width, healthbarJson.height, healthbarJson.strokeLength);
    this.healthbar.flip();
    this.healthbar.setBarColor(100, '0xcccccc');
    this.healthbar.setPositionOfRightEdge(this.game.world.width - healthbarJson.x, healthbarJson.y);
    this.healthbar.setPercent(100);
    this.healthbar.setTextStyle(this.game.fonts['ui_progress_bars']);
    this.healthbar.setText( this.getHealthbarText() );

    //setup begin/end shooting events
    this.game.input.onDown.add(this.startShooting.bind(this), this );
    this.game.input.onUp.add(this.stopShooting.bind(this), this.gun );
  }

  finishKill(){
    super.finishKill();
    this.startNextStateAfterDeath('GameOver');
  }

  kill(){
    super.kill();
    this.healthbar.show(); //leave healthbar showing while this is dying
  }

  getHealthbarText(){
    return Math.max(this.health,0) + '/' + this.maxHealth;
  }

}
