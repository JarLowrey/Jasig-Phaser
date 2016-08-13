/*
 * Ship
 * ====
 *
 */

import Gun from '../../objects/Gun';
import Unit from '../Sprites/Unit';
import ProgressBar from '../../objects/UI/ProgressBar';
import ParentSprite from '../Sprites/ParentSprite';

export default class Ship extends Unit {

  constructor(game){
    super(game);

    this.healthbar = new ProgressBar(this.game, this);
    this.healthbar.hide(); //since many sprites are preallocated in pools, you need to manually hide the healthbar upon creation
  }

  update(){
    if(!this.alive) return;

    this.healthbar.setPositionToTopOfParent( ParentSprite.dp(10) );
  }

  reset(shipType, x, y, isFriendly){
    this.shipInfo = this.game.ships[shipType];
    super.reset(x, y, this.shipInfo.health, this.shipInfo.width, 'sprites', this.shipInfo.frame, isFriendly, this.shipInfo.explosionFrame);

    this.healthbar.reset();
    this.healthbar.show();

    this.guns = [];
    for(var gunName in this.shipInfo.guns){
      const gun = this.shipInfo.guns[gunName];
      this.guns.push( new Gun(this.game, this, gun.gunType, gun.bulletType) ); //NOT YET FROM A POOL OF GUNS!
    }
  }

  startShooting(){
    this.guns.forEach(function(gun){
      gun.startShooting();
    });
  }

  stopShooting(){
    this.guns.forEach(function(gun){
      gun.stopShooting();
    });
  }

  damage(amount){
    super.damage(amount);

    this.setHealthBarPercentage();
  }

  heal(amount){
    super.heal(amount);

    this.setHealthBarPercentage();
  }

  setHealthBarPercentage(){
    const healthPercentLeft = 100 * (this.health / this.maxHealth);
    this.healthbar.setPercent(healthPercentLeft);
  }

  kill(){
    super.kill();

    this.healthbar.hide();

    this.stopShooting();
  }

}
