/*
 * Unit
 * ====
 *
 */

export default class Unit extends Phaser.Sprite {

  constructor(game){
    super(game);

    this.game.physics.arcade.enableBody(this);
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

}
