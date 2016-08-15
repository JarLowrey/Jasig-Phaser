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

    this.healthbar = new ProgressBar(this.game, {'parentSprite': this});
    this.healthbar.hide(); //since many sprites are preallocated in pools, you need to manually hide the healthbar upon creation
  }

  update(){
    if(!this.alive) return;

    super.update();
    if(this.getClassName() != 'Protagonist') this.healthbar.setPositionToTopOfParent();
  }

  reset(shipName, x, y, isFriendly){
    //super.reset(x, y, this.jsonInfo.health, this.jsonInfo.width, 'sprites', this.jsonInfo.frame, isFriendly, this.jsonInfo.explosionFrame, this.jsonInfo.destYInPercentOfScreen);
    super.reset(shipName, x, y, isFriendly, 'ships');

    this.healthbar.reset();
    this.healthbar.show();

    //add all the guns from the json file
    this.guns = [];
    for(var gunName in this.jsonInfo.guns){
      const gun = this.jsonInfo.guns[gunName];
      this.guns.push( new Gun(this.game, this, gun.gunType, gun.bulletType) ); //NOT YET FROM A POOL OF GUNS!
    }
  }

  arrivedAtYDestionation(){
    super.arrivedAtYDestionation();

    this.startShooting();
  }

  startShooting(){
    if( !this.isAlive() )return;

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

  //set isBeingKilled to true to signal that death has begun. Call the cool tweens, and actually kill() 'this' after the tween.
  //You will need check if isBeingKilled when doing most a lot of stuff from now on. If this is omitted, and kill() is immediately called,
  //'this' will be added back into the recycling pools. This causes problems as it can be recycled and completing the tween simultaneously
  kill(showCoolStuff = true){
    if(this.isBeingKilled) return;

    this.isBeingKilled = true;
    this.stopShooting();
    this.healthbar.hide();

    if(showCoolStuff){
      this.visible = true;
      this.playDeathTween(); //super.kill is called after tween finishes
    }
  }

  playDeathTween(){
    //setup tween to be played upon this.kill()
    const xTweenLen = ParentSprite.dp(20) * Math.random() + ParentSprite.dp(20);
    const tweenAngle = 20 + 20 * Math.random();
    var tween = this.game.add.tween(this)
      .to({x:'-'+xTweenLen}, 50, Phaser.Easing.Linear.In) //tween it relative to the current position. Needs to be a string
      .to({x:'+'+xTweenLen}, 50, Phaser.Easing.Linear.In)
      .to({angle: -tweenAngle}, 50, Phaser.Easing.Linear.In)
      .to({angle:  tweenAngle}, 50, Phaser.Easing.Linear.In)
      .repeatAll(1);
    tween.start();
    tween.onComplete.add(this.finishKill, this);
  }

  finishKill(){
    this.isBeingKilled = false;

    super.kill(false); //do not show explosion upon death, instead show it after deathTween completes
    this.goldText.showGoldText(this.jsonInfo.resourceValue, this.x, this.y);
    this.showExplosion();
  }

}
