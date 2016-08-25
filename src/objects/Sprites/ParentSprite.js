/*
 * ParentSprite
 * ====
 *
 */

import JsonInfo from '../../objects/JsonInfo';
import ExplosionRecycler from '../../objects/UI/ExplosionRecycler';


export default class ParentSprite extends Phaser.Sprite {
  static getClassName(){ return 'ParentSprite'; }

  constructor(game){
    super(game);
    this.explosionRecycler = new ExplosionRecycler(this.game, this);
  }

  reset(jsonType, jsonName){
    this.jsonInfo = JsonInfo.getInfo(this.game, jsonType, jsonName);
    this.jsonName = jsonName;

    super.reset(0,0, this.jsonInfo.health);
    this.maxHealth = this.jsonInfo.health;
    this.anchor.setTo(0.5,0.5);

    this.loadTexture(this.jsonInfo.key || 'sprites', this.jsonInfo.frame);
    this.setAreaMaintainAspectRatio(this.jsonInfo.width);

    this.alpha = 1;
    this.angle = 0;

    //set default position
    this.top = 0;
    this.x = (this.game.world.width * 0.9 + 0.1) * Math.random();

    this.explosionRecycler.addExplosionEmitter(this.jsonInfo.explosionKey || 'sprites', this.jsonInfo.explosionFrame || 'explosion1');
  }

  update(){
    //this.game.debug.geom(this.getBounds()); //better way of showing the bounding box when debugging
    //this.game.debug.body(this,'rgba(255,0,0,0.8)');
    //this.game.debug.bodyInfo(this, this.x, this.y);
  }

  //give the sprite a new size while maintaining aspec
  setAreaMaintainAspectRatio(width){
    this.width = ParentSprite.dp(width);
    this.scale.y = Math.abs(this.scale.x);

    //due to the weird way Phaser works, this.body.setSize (and many other things) will cause the bounding box to be the wrong size after the Sprite's width/height changes
    //Instead, completely re-enable the body phsics on this in order for the bounding box to match the image size
    this.game.physics.arcade.enableBody(this);
    //kill sprite if it moves out of bounds of game screen
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(this.silentKill, this);
  }

  silentKill(){
    this.kill(false);
  }
  getValue(){
    return this.jsonInfo.gold || 0;
  }

  //convenience functions to call 'Game' state's getPool function for sprites
  getSpritePool(classOrPoolName,isFriendly){
    return this.game.state.states.Game.spritePools.getPool(classOrPoolName,isFriendly);
  }
  createSprite(classOrPoolName,isFriendly){
    return this.game.state.states.Game.spritePools.getNewSprite(classOrPoolName,isFriendly);
  }

  startNextStateIfPossible(stateToStartAfterwards = 'Store'){
    const allEnemiesDead = this.game.waveHandler.isWaveOver() && this.game.waveHandler.livingEnemiesTotalValue() == 0;
    const noActiveBonuses = this.getSpritePool('Bonus').getFirstAlive() == null;

    if( this.constructor.getClassName() == 'Protagonist' || (allEnemiesDead && noActiveBonuses) ){
      this.game.state.start(stateToStartAfterwards, this.game.getRandomStateTransitionOut(), this.game.getRandomStateTransitionIn() );
      this.game.waveHandler.saveWaveValues();
    }
  }



  /*
    STATIC METHODS FOR HANDLIING DIFFERENT SCREENS
  */

  //density independent pixels
  static dp(pixels){
    return pixels * window.devicePixelRatio;
  }

  static percentWidthToPixels(percent, parent){
    const width = (parent) ? parent.width : window.innerWidth;

    return width * (parseFloat(percent) / 100.0);
  }

  static percentHeightToPixels(percent, parent){
    const height = (parent) ? parent.height : window.innerHeight;

    return height * (parseFloat(percent) / 100.0);
  }


  /*
    STATIC METHODS FOR SCALING SPRITE ATTRIBUTES BASED UPON WAVE NUMBER
  */

  static scaleHealthByWave(wave, health){
    return wave+health;
  }

  static scaleValueByWave(wave, value){
    return wave+value;
  }

}
