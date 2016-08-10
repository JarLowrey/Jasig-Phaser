/*
 * Unit
 * ====
 *
 */

export default class Unit extends Phaser.Sprite {

  constructor(game){
    super(game);

    this.game.physics.arcade.enableBody(this);


    //Emit an explosion upon death
    var emitter = this.game.add.emitter(0,0, 5);

    emitter.makeParticles('sprites','circle'); //cannot change texture on the fly. Prob would be better to define an emitter per explosion texture desired (with lots of particles), and emit only a few of the particles upon death 

    emitter.minParticleSpeed.set(0, 50);
    emitter.maxParticleSpeed.set(0, 100);
    emitter.gravity = 0;

    emitter.setRotation(0, 0);
    emitter.setAlpha(0.75, 1);

    emitter.minParticleScale = .5;
    emitter.maxParticleScale = .75;

    this.emitter = emitter;
  }


  static initUnitPool(game, preallocationNum = 40){
    if(!Unit.pool){
      Unit.pool = new Phaser.Group(game);
      Unit.pool.classType = Unit;
      Unit.pool.createMultiple(preallocationNum);
    }
  }

  static getNewUnit(){
    var unit = Unit.pool.getFirstDead(true);
    //all the sprites were already alive, so a new one was created via getFirstDead's createIfNull's parameter being set to true. Kill it
    if(unit.alive) unit.kill();

    return unit;
  }

  revive(x, y, isFriendly, key, frame){
    super.revive();

    this.loadTexture(key, frame);

    this.isFriendly = isFriendly;

    this.x = x;
    this.y = y;
    this.speed = 300;

    this.setAnchor(isFriendly);
  }

  setAnchor(isFriendly){
    const yAnchor = (isFriendly) ? 1 : 0.5;
    this.anchor.setTo(0.5,yAnchor);
  }

  kill(){
    super.kill();

    this.emitter.width = this.width ;
    this.emitter.height = this.height ;
    this.emitter.x = this.x;
    this.emitter.y = this.y;
    this.emitter.start(true, 1000);
  }

}
