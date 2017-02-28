/*
 * Pools
 *
 * Sprite pools (recycling) go in this class. External classes may access thru this.game.spritePools (defined in Game state)
 */

export default class Pools {

  constructor(game, spriteIntializationDefinitions, savedSpriteInfo = null) {
    this.game = game;

    //initialize pools
    this.pools = {};

    //create the groups and reassign this.pools
    for (var className in spriteIntializationDefinitions) {
      const newPool = this.game.add.group();
      const poolInfo = spriteIntializationDefinitions[className];

      newPool.classType = poolInfo['class'];
      newPool.createMultiple(poolInfo['count']);

      this.pools[className] = newPool;
    }

    if (savedSpriteInfo) {
      this.deserialize(savedSpriteInfo);
    }
  }

  serialize() {
    var spritesIntoArray = [];

    for (var className in this.pools) {
      this.getPool(className).forEachAlive(function(sprite) {
        if (sprite.serialize) spritesIntoArray.push(sprite.serialize());
      });
    }

    return spritesIntoArray;
  }

  deserialize(savedInfo) {
    for (var i = 0; i < savedInfo.length; i++) {
      const savedSpriteInfo = savedInfo[i];

      const newSprite = this.spawn(savedSpriteInfo.className);
      newSprite.deserialize(savedSpriteInfo);
    }
  }

  getPool(className) {
    return this.pools[className];
  }

  getInstance(className, x, y) {
    const sprite = this.getPool(className).getFirstDead(true);
    sprite.reset();

    if (x !== undefined) sprite.x = x;
    if (y !== undefined) sprite.y = y;

    return sprite;
  }
}
