/*
 * Unit
 * ====
 *
 */

import ParentSprite from '../Sprites/ParentSprite';
import Bonus from '../Sprites/Bonus';
import SpritePooling from '../Sprites/SpritePooling';

import IconText from '../../objects/UI/IconText';

export default class Unit extends ParentSprite {
  static getClassName(){ return 'Unit'; }

  constructor(game){
    super(game);

    this.goldText = new IconText(this.game, 20, 'score', 'text', 'icons', 'coins', 0);
    this.goldText.kill();
  }

  update(){
    if(!this.alive) return;

    if( !this.reachedYDestination && Math.abs(this.y - this.yDestination) < ParentSprite.dp(5)){
      this.arrivedAtYDestionation();
    }
  }

  reset(jsonInfo, x, y, isFriendly, jsonType = 'units'){
    super.reset(jsonType, jsonInfo, x, y); //reset the physics body in addition to reviving the sprite. Otherwise collisions could be messed up

    this.isFriendly = isFriendly;
    this.setAnchor(isFriendly);
    this.setYDestination();

    //set body related variables
    this.body.velocity.y = 300;
    this.body.maxVelocity.setTo(600, 600);
    this.body.drag.setTo(0,0);

    this.reachedYDestination = false;
    this.isBeingKilled = false;
  }

  setYDestination(){
    //get the defined destination in the JSON file. default to 100 (moving off the bottom of the screen)
    var destYInPercentOfScreen = this.jsonInfo.destYInPercentOfScreen || 100;

    if(typeof destYInPercentOfScreen != 'number'){ //destination is not a number, must be an object. Get the min and max destination values and choose a random position in between
      const min = this.jsonInfo.destYInPercentOfScreen.min || 10;
      const max = this.jsonInfo.destYInPercentOfScreen.max || 50;
      destYInPercentOfScreen = min + (max-min) * Math.random();
    }else if( destYInPercentOfScreen >= 100 ){ //needs to move off the bottom of screen
      destYInPercentOfScreen = 1000000;
    }else if( destYInPercentOfScreen <= 0   ){ //needs to move off the top of screen
      destYInPercentOfScreen = - 1000000;
    }

    this.yDestination = (destYInPercentOfScreen / 100) * this.game.world.height;
  }

  //set isBeingKilled to true to signal that death has begun. Call the cool tweens, and actually kill() 'this' after the juicy stuff has finished.
  //If the check for isBeingKilled is omitted, and kill() is immediately called,
  //'this' will be added back into the recycling pools. This causes problems.
  kill(showCoolStuff = true){
    if(this.isBeingKilled) return;
    this.isBeingKilled = true;

    //check to see if a bonus should be made
    if( this.constructor.getClassName() != 'Protagonist' ){
      const bonusesPoolName = SpritePooling.getPoolName(Bonus);
      this.createSprite(bonusesPoolName).reset('heal', this);
    }

    if(showCoolStuff)this.showDeathAnimations();
    else{
      this.finishKill();
      this.game.state.states.Game.incrementGameResources(this.jsonInfo.gold);
    }
  }
  showDeathAnimations(){
    this.goldText.showGoldText(this.getValue(), this.x, this.y);
    this.explosionRecycler.showExplosion();
    this.visible = false;

    //leave eno ugh time for goldtext, explosion, and whatever else may happen in children, to finish
    this.game.time.events.add(1000,this.finishKill, this);
  }
  finishKill(stateToStartAfterwards = 'Store'){
    this.isBeingKilled = false;
    super.kill(); //actually kill this sprite!
    this.startNextStateIfPossible(stateToStartAfterwards);
  }

  setAnchor(isFriendly){
    const yAnchor = (isFriendly) ? 1 : 0.5;
    this.anchor.setTo(0.5,yAnchor);
  }

  arrivedAtYDestionation(){
    this.reachedYDestination = true;
    this.body.velocity.y = 0;
  }

  static unitCollision(friendlyUnit, enemyUnit){
    //apply their damages, so long as they are still alive
    if( enemyUnit.isAlive() ) friendlyUnit.damage(50);
    if( friendlyUnit.isAlive() ) enemyUnit.damage(10);

    //set a high drag after colliding so enemies dont go flying offscreen.
    //NOTE: this will cause enemies to stop moving after colliding. It's not the best option but it's the best I got for now
    //enemyUnit.body.drag.setTo(10000,10000);
  }

  isAlive(){
    return !this.isBeingKilled && this.alive;
  }

}
