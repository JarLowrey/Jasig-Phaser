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

    //setup tween to be played upon this.kill()
    this.deathTween = this.game.add.tween(this)
      .to({x:'-'+ParentSprite.dp(25)}, 50, Phaser.Easing.Linear.In) //tween it relative to the current position. Needs to be a string
      .to({x:'+'+ParentSprite.dp(25)}, 50, Phaser.Easing.Linear.In)
      .to({angle: -20}, 50, Phaser.Easing.Linear.In)
      .to({angle:  20}, 50, Phaser.Easing.Linear.In)
      .repeatAll(1);
    this.deathTween.onComplete.add(function(){
      this.visible = false; //in this.kill() visible will be set to true before calling the tween and after calling super.kill()
      this.showExplosion();
    }, this);
  }

  update(){
    if(!this.alive) return;

    super.update();
    this.healthbar.setPositionToTopOfParent( ParentSprite.dp(10) );
  }

  reset(shipType, x, y, isFriendly){
    this.shipInfo = this.game.ships[shipType];
    super.reset(x, y, this.shipInfo.health, this.shipInfo.width, 'sprites', this.shipInfo.frame, isFriendly, this.shipInfo.explosionFrame, this.shipInfo.destYInPercentOfScreen);

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

  kill(showCoolStuff = true){
    this.stopShooting();
    super.kill(false); //do not show explosion upon death, instead show it after deathTween completes
    this.healthbar.hide();

    if(showCoolStuff){
      //super.kill() sets visibilty to false. But we want to show our deathTween. So set it to true and assume deathTween.onComplete will set visibility back to false
      this.visible = true;
      this.deathTween.start();
    }
  }

}
