/*
 * Ship
 * ====
 *
 */

import Gun from '../../objects/Gun';
import Unit from '../Sprites/Unit';

export default class Ship extends Unit {

  constructor(game){
    super(game);
  }

  reset(shipType, x, y, isFriendly){
    this.shipInfo = this.game.ships[shipType];
    super.reset(x, y, this.shipInfo.health, this.shipInfo.width, 'sprites', this.shipInfo.frame, isFriendly, this.shipInfo.explosionFrame);

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

  kill(){
    super.kill();

    this.stopShooting();
  }

}
