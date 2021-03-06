/*
 * Pools
 *
 * Sprite pools (recycling) go in this class. External classes may access thru this.game.spritePools (defined in Game state)
 */
import InfoWeapon from '../Gear/Guns/InfoWeapon';

export default class Pools {

  constructor(game, spriteIntializationDefinitions, savedSpriteInfo = null, emitters, weapons) {
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
        particleClass = this._getParticleClass(info.particleClass);

      //create emitter
      var emitter = this.game.add.emitter(0, 0, info.maxParticles || 30);
      emitter.particleClass = particleClass;
      emitter.makeParticles(key, frame, Math.MAX_SAFE_INTEGER, false, false, info.arguments);
      emitter.info = info;
      //this.game.world.bringToTop(emitter);

      this.emitters[name] = emitter;
    }

    this.weapons = {};
    for (let bulletClassName in weapons) {
      this.weapons[bulletClassName] = [];
      const info = weapons[bulletClassName];

      for (let i = 0; i < info.numWeapons; i++) {
        let weapon = this.game.plugins.add(InfoWeapon);
        weapon.createClassBullets(bulletClassName, info.numBullets);
        this.weapons[bulletClassName].push(weapon);
      }
    }

    if (savedSpriteInfo && savedSpriteInfo.length > 0) {
      this.deserialize(savedSpriteInfo);
    }
  }

  getWeapon(bulletClassName, numBullets = 20) {
    let weapons = this.weapons[bulletClassName];
    for (let weapon of weapons) {
      if (!weapon.alive) {
        return weapon;
      }
    }

    //create a new weapon
    let weapon = this.game.plugins.add(InfoWeapon);
    this.weapon.createBullets(bulletClassName, numBullets);
    this.weapons[bulletClassName].push(weapon);

    return weapon;
  }

  _widthToScale(key, frame, desiredWidth) {
    const particleWidth = this.game.cache.getFrameByName(key, frame).width;
    return desiredWidth / particleWidth;
  }

  serialize() {
    var spritesIntoArray = [];

    for (var className in this.pools) {
      this.getPool(className).forEachAlive(function (sprite) {
        if (sprite.serialize) spritesIntoArray.push(sprite.serialize());
      });
    }

    return spritesIntoArray;
  }

  deserialize(savedInfo) {
    for (var i = 0; i < savedInfo.length; i++) {
      const savedSpriteInfo = savedInfo[i];

      this.getPool(savedSpriteInfo.className).getFirstDead().reset(savedSpriteInfo);
    }
  }

  getPool(className) {
    return this.pools[className];
  }

  getEmitter(name) {
    let emitter = this.emitters[name];
    return emitter;
  }

  //convenience method for using explosions designed via JSON instead of in a JS file
  explode(emitterName, explosionName, spriteExplodingFrom) {
    let emitter = this.getEmitter(emitterName);

    emitter.spriteExplodingFrom = spriteExplodingFrom;
    emitter.width = spriteExplodingFrom.width;
    emitter.height = spriteExplodingFrom.height;
    emitter.x = spriteExplodingFrom.x;
    emitter.y = spriteExplodingFrom.y;

    const explosion = emitter.info.explosions[explosionName] || {};
    const gravity = explosion.gravity || {
        x: 0,
        y: 0
      },
      rotation = explosion.rotation || {
        min: -360,
        max: 360
      },
      alpha = explosion.alpha || {
        start: 1,
        end: 0.01
      },
      particleWidth = explosion.particleWidth || {
        min: 5,
        max: 10
      },
      quantity = explosion.quantity || {
        min: 3,
        max: 5
      },
      speed = explosion.speed || {
        'x': {
          'min': -50,
          'max': 50
        },
        'y': {
          'min': -50,
          'max': 50
        }
      },
      lifespan = explosion.lifeSpan || 2000,
      minScale = this.game.spritePools._widthToScale(emitter.info.image.key, emitter.info.image.frame, particleWidth.min),
      maxScale = this.game.spritePools._widthToScale(emitter.info.image.key, emitter.info.image.frame, particleWidth.max);

    emitter.gravity = Phaser.Point.parse(gravity);
    emitter.setXSpeed(speed.x.min, speed.x.max);
    emitter.setYSpeed(speed.y.min, speed.y.max);
    emitter.setRotation(rotation.min, rotation.max);
    emitter.setAlpha(alpha.start, alpha.end, lifespan);
    emitter.setScale(minScale, maxScale, minScale, maxScale);
    emitter.explode(lifespan, Phaser.Math.between(quantity.min, quantity.max));
  }

  _getParticleClass(className) {
    return Phaser.Particle;
  }
}
