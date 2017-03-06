/*
 * Unit
 * ====
 *
 */

import ParentSprite from './ParentSprite';

import IconText from '../../UI/IconText';

export default class Unit extends ParentSprite {
  static className() {
    return 'Unit';
  }
  get value() {
    if (!this.info) {
      return 0;
    }
    return this.info.gold;
  }
  get isAlive() {
    return !this.isBeingKilled && this.alive;
  }

  constructor(game) {
    super(game);

    this.goldText = new IconText(this.game, 20, 'score', 'text', 'icons', 'coins', 0);
    this.goldText.kill();
  }

  update() {
    if (!this.isAlive) return;
    super.update();

    if (!this.reachedYDestination && Math.abs(this.y - this.yDestination) < (5)) {
      this.arrivedAtYDestionation();
    }
  }

  reset(entityName, isFriendly, entityType = 'units') {
    super.reset(entityType, entityName); //reset the physics body in addition to reviving the sprite. Otherwise collisions could be messed up

    //add properties
    this.maxHealth = this.info.health;
    this.isFriendly = isFriendly;
    this.setAnchor(isFriendly);
    this.setYDestination();
    this.reachedYDestination = false;
    this.isBeingKilled = false;
  }

  setYDestination() {
    //get the defined destination in the JSON file. default to 100 (moving off the bottom of the screen)
    var destYInPercentOfScreen = this.info.destYInPercentOfScreen || 100;

    if (typeof destYInPercentOfScreen != 'number') { //destination is not a number, must be an object. Get the min and max destination values and choose a random position in between
      const min = this.info.destYInPercentOfScreen.min || 10;
      const max = this.info.destYInPercentOfScreen.max || 50;
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
      bonus.reset(this.getRandomBonusType(), this);
    }

    //show some cool stuff as the entity dies
    this.goldText.showGoldText(this.value, this.x, this.y);
    this.game.spritePools.explode('explosion1', this);
    this.visible = false;

    //leave enough time for goldtext, explosion, and whatever else may happen in children, to finish
    this.game.time.events.add(1000, this.finishKill, this);
  }

  getRandomBonusType() {
    return 'heal';
  }

  finishKill() {
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
    if (enemyUnit.isAlive) friendlyUnit.damage(50);
    if (friendlyUnit.isAlive) enemyUnit.damage(10);

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
