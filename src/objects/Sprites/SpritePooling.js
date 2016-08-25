
export default class SpritePooling {

  constructor(game){
    this.game = game;

    this.pools = {};
  }

  initPool(childClass, isFriendly, preallocationNum = 5){
    const poolName = SpritePooling.getPoolName(childClass, isFriendly);

    this.pools[poolName] = new Phaser.Group(this.game);
    this.pools[poolName].classType = childClass;
    this.pools[poolName].createMultiple(preallocationNum);
  }

  getPool(nameOrChildClass, isFriendly){
    return this.pools[SpritePooling.getPoolName(nameOrChildClass, isFriendly)];
  }

  getNewSprite(nameOrChildClass, isFriendly){
    return this.getPool( SpritePooling.getPoolName(nameOrChildClass, isFriendly) ).getFirstDead(true);
  }

  static getPoolName(nameOrChildClass, isFriendly){
    if(typeof nameOrChildClass == 'string') return nameOrChildClass;

    var friendliness = '';
    if(isFriendly) friendliness = 'friendly';
    else if(isFriendly === false) friendliness = 'enemy';

    return friendliness + nameOrChildClass.getClassName();
  }

}
