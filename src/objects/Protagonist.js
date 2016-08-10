/*
 * Protagonist
 * ====
 *
 */
import Ship from '../objects/Ship';

export default class Protagonist extends Ship {

  constructor(game){
    super(game);

    this.body.collideWorldBounds = true;
    this.game.world.add(this); //need to set the parent to the world group, as it is not done automatically

    this.speed = 300;
    this.bufferAbovePointer = 5;
  }

  update(){
    if(Phaser.Point.distance(this, this.game.input.activePointer.position) > this.bufferAbovePointer ){
      this.game.physics.arcade.moveToPointer(this, this.speed);
    }else{
      this.body.velocity.setTo(0,0);
    }
  }

  revive(x, y){
    super.revive(x, y, true, 'sprites', this.game.ships.protagonist.frame);

    this.game.input.onDown.add(this.shootGun, this );
    this.game.input.onUp.add(this.gun.stopShooting, this.gun );
  }

  //due to the way onDown works, it is difficult to pass around the needed context to the gun. Thus, create a custom function for it that will have the proper
  shootGun(){
    this.gun.startShooting();
  }


}
