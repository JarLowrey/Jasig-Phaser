/*
 * Pools
 *
 * Sprite pools (recycling) go in this class. External classes may access thru this.game.spritePools (defined in Game state)
 */

import * as PhaserUi from 'phaser-ui';

export default class Pools {

  constructor(game, spriteIntializationDefinitions, savedSpriteInfo = null, emitters) {
    this.game = game;

    //initialize pools
    this.pools = {};
    for (let className in spriteIntializationDefinitions) {
      const newPool = this.game.add.group();
      const poolInfo = spriteIntializationDefinitions[className];

      newPool.classType = poolInfo['class'];
      newPool.createMultiple(poolInfo['count']);

      this.pools[className] = newPool;
    }

    this.emitters = {};
    for (let name in emitters) {
      //define emitter properties with defaults
      let info = emitters[name];
      let key = info.image.key,
        frame = info.image.frame,
        gravity = info.gravity || 0,
        rotation = info.rotation || {
          min: 0,
          max: 0
        },
        alpha = info.alpha || {
          min: 1,
          max: 1
        },
        particleWidth = info.particleWidth || {
          min: 50,
          max: 50
        };

      //create emitter
      var emitter = this.game.add.emitter(0, 0, info.maxParticles);
      emitter.makeParticles(key, frame);
      emitter.gravity = gravity;
      emitter.setRotation(rotation.min, rotation.max);
      emitter.setAlpha(alpha.min, alpha.max);
      emitter.minParticleScale = this._widthToScale(key, frame, particleWidth.min);
      emitter.minParticleScale = this._widthToScale(key, frame, particleWidth.max);

      emitter.info = info;

      this.emitters[name] = emitter;
    }

    if (savedSpriteInfo && savedSpriteInfo.length > 0) {
      this.deserialize(savedSpriteInfo);
    }
  }

  _widthToScale(key, frame, desiredWidth) {
    const particleWidth = this.game.cache.getFrameByName(key, frame).width;
    return desiredWidth / particleWidth;
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

  getEmitter(name) {
    let emitter = this.emitters[name];
    return emitter;
  }

  explode(emitterName, spriteExplodingFrom) {
    let emitter = this.getEmitter(emitterName);

    if (spriteExplodingFrom) {
      emitter.width = spriteExplodingFrom.width;
      emitter.height = spriteExplodingFrom.height;
      emitter.x = spriteExplodingFrom.x;
      emitter.y = spriteExplodingFrom.y;
    }

    for (let name in emitter.info.explosions) {
      let explosion = emitter.info.explosions[name];
      emitter.minParticleSpeed.set(explosion.speed.min.x, explosion.speed.min.y);
      emitter.maxParticleSpeed.set(explosion.speed.max.x, explosion.speed.max.y);
      emitter.start(explosion.explode, explosion.lifeSpan, explosion.frequency, explosion.quantity, explosion.forceQuantity);
    }
  }

  getInstance(className) {
    return this.getPool(className).getFirstDead(true);
  }
}
