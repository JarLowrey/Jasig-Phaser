/*
 * ParentSprite
 * ====
 *
 */

import JsonInfo from '../../objects/JsonInfo';


export default class ParentSprite extends Phaser.Sprite {

  constructor(game){
    super(game);
  }

  reset(jsonType, jsonName, x, y){
    this.jsonInfo = JsonInfo.getInfo(this.game, jsonType, jsonName);

    super.reset(x, y, this.jsonInfo.health);
    this.maxHealth = this.jsonInfo.health;
    this.anchor.setTo(0.5,0.5);

    this.loadTexture('sprites', this.jsonInfo.frame);
    this.setAreaMaintainAspectRatio(this.jsonInfo.width);

    this.alpha = 1;
    this.angle = 0;
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
    return this.jsonInfo.resourceValue || 0;
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
    STATIC METHODS FOR HANDLIING RESOURCE POOLING
  */

  static useFriendlinessPools(isFriendly){
    return !(isFriendly == null || typeof isFriendly == 'undefined');
  }

  static getPool(childClass, isFriendly, game, preallocationNum){
    ParentSprite.initPools(childClass, isFriendly, game, preallocationNum);

    const useFriendlinessPools = ParentSprite.useFriendlinessPools(isFriendly);

    if(useFriendlinessPools && isFriendly){
      return childClass.friendlyPool;
    }else if(useFriendlinessPools){
      return childClass.enemyPool;
    }else{
      return childClass.pool;
    }
  }

  static initPools(childClass, isFriendly, game, preallocationNum = 10){
    const useFriendlinessPools = ParentSprite.useFriendlinessPools(isFriendly);

    const pool = (useFriendlinessPools) ? childClass.friendlyPool : childClass.pool;

    if( !pool ){ //pool does not exist. Initialize them!
      if(useFriendlinessPools){
        childClass.friendlyPool = new Phaser.Group(game);
        childClass.enemyPool = new Phaser.Group(game);

        childClass.friendlyPool.classType = childClass;
        childClass.enemyPool.classType = childClass;

        childClass.friendlyPool.createMultiple(preallocationNum);
        childClass.enemyPool.createMultiple(preallocationNum);
      }else{
        childClass.pool = new Phaser.Group(game);
        childClass.pool.classType = childClass;
        childClass.pool.createMultiple(preallocationNum);
      }
    }
  }

  static getNewSprite(childClass, newSpriteIsFriendly, game, preallocationNum){
    return ParentSprite.getPool(childClass, newSpriteIsFriendly, game, preallocationNum).getFirstDead(true);
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
