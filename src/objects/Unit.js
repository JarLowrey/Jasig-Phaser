/*
 * Unit
 * ====
 *
 */

export default class Unit extends Phaser.Sprite {

  constructor(game){
    super(game);

    this.game.physics.arcade.enableBody(this);

    Unit.initUnitPool(game);
  }


  static initUnitPool(game, preallocationNum = 20){
    if(!Unit.enemyUnits && !Unit.explosionGroups){
      //Unit.friendlyUnits = new Phaser.Group(game);
      Unit.enemyUnits = new Phaser.Group(game);

      //Unit.friendlyUnits.classType = Unit;
      Unit.enemyUnits.classType = Unit;

      //Unit.friendlyUnits.createMultiple(preallocationNum);
      Unit.enemyUnits.createMultiple(preallocationNum);

      Unit.explosionGroups = {};
      Unit.addExplosionEmitter('explosion1', game);
    }
  }

  static getNewUnit(newUnitIsFriendly = false){
    var newUnitPool = (newUnitIsFriendly) ? Unit.friendlyUnits : Unit.enemyUnits;

    var unit = newUnitPool.getFirstDead(true);
    //all the sprites were already alive, so a new one was created via getFirstDead's createIfNull's parameter being set to true. Kill it
    //if(unit.alive) unit.kill();

    return unit;
  }

  revive(x, y, isFriendly, key, frame, explosionFrame){
    this.reset(); //reset the physics body in addition to reviving the sprite. Otherwise collisions could be messed up
    super.revive();

    this.loadTexture(key, frame);
    Unit.addExplosionEmitter(explosionFrame, this.game);

    this.isFriendly = isFriendly;

    this.x = x;
    this.y = y;
    this.speed = 300;

    this.setAnchor(isFriendly);

    this.body.setSize(this.width,this.height); //set body to new sprite size, otherwise collisions (and other physics actions) will be messed up
  }

  kill(){
    super.kill();

    this.showExplosion();
  }

  setAnchor(isFriendly){
    const yAnchor = (isFriendly) ? 1 : 0.5;
    this.anchor.setTo(0.5,yAnchor);
  }

  static unitCollision(friendlyUnit, enemyUnit){
    console.log('Units hit');

    enemyUnit.kill();
  }

  showExplosion(frame = 'explosion1'){
    var emitter = Unit.explosionGroups[frame];

    emitter.width = this.width ;
    emitter.height = this.height ;
    emitter.x = this.x;
    emitter.y = this.y;

    emitter.start(true, 500, null, 7);
  }

  static addExplosionEmitter(frame = 'explosion1', game){
    if(frame in Unit.explosionGroups) return; //frame can not yet be added to the emitter hash

    //Emit an explosion upon death
    var emitter = game.add.emitter(0,0, 25);

    emitter.makeParticles('sprites',frame); //cannot change texture on the fly. Prob would be better to define an emitter per explosion texture desired (with lots of particles), and emit only a few of the particles upon death

    emitter.minParticleSpeed.set(-100, -100);
    emitter.maxParticleSpeed.set(100, 100);
    emitter.gravity = 0;

    emitter.setRotation(0, 0);
    emitter.setAlpha(0.75, 1);

    emitter.minParticleScale = .05;
    emitter.maxParticleScale = .1;

    Unit.explosionGroups[frame] = emitter;
  }

}
