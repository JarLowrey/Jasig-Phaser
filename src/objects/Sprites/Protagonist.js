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

    this.speed = 300;
    this.bufferAbovePointer = 5;

    ParentSprite.getPool(Ship, true, this.game).add(this);
  }

  update(){
    super.update();

    if(Phaser.Point.distance(this, this.game.input.activePointer.position) > this.bufferAbovePointer ){
      this.game.physics.arcade.moveToPointer(this, this.speed);
    }else{
      this.body.velocity.setTo(0,0);
    }
  }

  reset(x, y){
    super.reset('protagonist', x, y, true);

    this.body.collideWorldBounds = true;

    this.game.input.onDown.add(this.startShooting.bind(this), this );
    this.game.input.onUp.add(this.stopShooting.bind(this), this.gun );
  }

}
