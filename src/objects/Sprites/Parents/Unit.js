/* jshint esversion: 6 */

/*
 * Unit
 * ====
 *
 */

import ParentSprite from './ParentSprite';

import IconText from '../../UI/IconText';
import ExplosionRecycler from '../../UI/ExplosionRecycler';

export default class Unit extends ParentSprite {
  static getClassName() {
    return 'Unit';
  }
  get value() {
    let scaler = this.game.data.play.level / 5;
    scaler = Math.min(1, scaler);
    return this.info.gold * scaler;
  }
  get alive() {
    return !this.isBeingKilled && this.prototype.alive;
  }

  constructor(game) {
    super(game);

    this.explosionRecycler = new ExplosionRecycler(this.game, this);
    this.explosionRecycler.addExplosionEmitter(this.jsonInfo.explosionKey || 'sprites', this.jsonInfo.explosionFrame || 'explosion1');

    this.game.physics.arcade.enableBody(this);
    this.anchor.setTo(0.5, 0.5);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(this.silentKill, this);

    this.goldText = new IconText(this.game, 20, 'score', 'text', 'icons', 'coins', 0);
    this.goldText.kill();
  }

  update() {
    if (!this.alive) return;

    if (!this.reachedYDestination && Math.abs(this.y - this.yDestination) < ParentSprite.dp(5)) {
      this.arrivedAtYDestionation();
    }

    //debug body
    /*
    this.game.debug.geom(this.getBounds()); //better way of showing the bounding box when debugging
    this.game.debug.body(this,'rgba(255,0,0,0.8)');
    this.game.debug.bodyInfo(this, this.x, this.y);
    */
  }

  reset(entityName, isFriendly, entityType = 'units') {
    super.reset(); //reset the physics body in addition to reviving the sprite. Otherwise collisions could be messed up
    this.info = this.game.entities[entityType][entityName];

    //set texture and size
    this.loadTexture(this.jsonInfo.key || 'sprites', this.jsonInfo.frame);
    this.width = this.jsonInfo.width;
    this.scale.y = Math.abs(this.scale.x);
    this.body.setSize(this.width / this.scale.x, this.height / this.scale.y);

    //set body related variables
    this.body.velocity.set(this.info.velocity.x, this.info.velocity.y);
    this.body.maxVelocity.setTo(600, 600);
    this.body.drag.setTo(0, 0);

    //add properties
    this.alpha = 1;
    this.angle = 0;
    this.maxHealth = this.info.health;
    this.isFriendly = isFriendly;
    this.setAnchor(isFriendly);
    this.setYDestination();
    this.reachedYDestination = false;
    this.isBeingKilled = false;

    //set default position
    this.top = 0;
    this.x = (this.game.world.width * 0.9 + 0.1) * Math.random();

  }

  setYDestination() {
    //get the defined destination in the JSON file. default to 100 (moving off the bottom of the screen)
    var destYInPercentOfScreen = this.jsonInfo.destYInPercentOfScreen || 100;

    if (typeof destYInPercentOfScreen != 'number') { //destination is not a number, must be an object. Get the min and max destination values and choose a random position in between
      const min = this.jsonInfo.destYInPercentOfScreen.min || 10;
      const max = this.jsonInfo.destYInPercentOfScreen.max || 50;
      destYInPercentOfScreen = min + (max - min) * Math.random();
    } else if (destYInPercentOfScreen >= 100) { //needs to move off the bottom of screen
      destYInPercentOfScreen = 1000000;
    } else if (destYInPercentOfScreen <= 0) { //needs to move off the top of screen
      destYInPercentOfScreen = -1000000;
    }

    this.yDestination = (destYInPercentOfScreen / 100) * this.game.world.height;
  }

  //set isBeingKilled to true to signal that death has begun. Call the cool tweens, and actually kill() 'this' after the juicy stuff has finished.
  //If the check for isBeingKilled is omitted, and kill() is immediately called,
  //'this' will be added back into the recycling pools. This causes problems.
  kill() {
    if (this.isBeingKilled) return;
    this.isBeingKilled = true;

    //check to see if a bonus should be made
    if (!this.amPlayer()) {
      let bonus = this.game.spritePools.getInstance('Bonus');
      bonus.reset('heal', this);
    }

    //show some cool stuff as the entity dies
    this.goldText.showGoldText(this.value, this.x, this.y);
    this.explosionRecycler.showExplosion();
    this.visible = false;

    //leave enough time for goldtext, explosion, and whatever else may happen in children, to finish
    this.game.time.events.add(1000, this.finishKill(), this);
  }

  finshKill() {
    this.isBeingKilled = false;
    super.kill();
  }

  setAnchor(isFriendly) {
    const yAnchor = (isFriendly) ? 1 : 0.5;
    this.anchor.setTo(0.5, yAnchor);
  }

  arrivedAtYDestionation() {
    this.reachedYDestination = true;
    this.body.velocity.y = 0;
  }

  static unitCollision(friendlyUnit, enemyUnit) {
    //apply their damages, so long as they are still alive
    if (enemyUnit.isAlive()) friendlyUnit.damage(50);
    if (friendlyUnit.isAlive()) enemyUnit.damage(10);

    //set a high drag after colliding so enemies dont go flying offscreen.
    //NOTE: this will cause enemies to stop moving after colliding. It's not the best option but it's the best I got for now
    //enemyUnit.body.drag.setTo(10000,10000);
  }


  serialize() {
    let data = super.serialize();
    data.info = this.info;
    return data;
  }
  deserialize(data) {
    super.deserialize();
    this.info = data.info;
  }

}
