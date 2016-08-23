
export default class SpritePooling {

  constructor(game){
    this.game = game;

    this.pools = {};
  }

  getPool(poolName){
    return this.pools[poolName];
  }

  initPool(poolName, childClass, preallocationNum = 10){
    this.pools[poolName] = new Phaser.Group(this.game);
    this.pools[poolName].classType = childClass;
    this.pools[poolName].createMultiple(preallocationNum);
  }

  getNewSprite(poolName){
    return this.getPool(poolName).getFirstDead(true);
  }

  static getPoolName(childClass, isFriendly){
    var friendliness = '';
    if(isFriendly) friendliness = 'friendly';
    else if(isFriendly === false) friendliness = 'enemy';

    return friendliness + childClass.getClassName();
  }

}
