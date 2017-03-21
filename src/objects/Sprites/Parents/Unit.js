/*
 * Unit
 * ====
 *
 */

import ParentSprite from './ParentSprite';

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
    this.health = this.info.health;
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
    if (!this.inWorld) { //if not inworld, then ran off edge of screen. do not display fancy animations
      this.game.state.states.Game.incrementGameResources(Math.ceil(this.value / 3));
      super.kill();
      return;
    }

    //check to see if a bonus should be made
    if (Math.random() < 0.1 && !this.amPlayer()) {
      let bonus = this.game.spritePools.getPool('Bonus').getFirstDead(true);
      bonus.reset(this.getRandomBonusType(), this.x, this.y);
    }

    //show some cool stuff as the entity dies
    //this.goldText.fadeOut(this.value, this.x, this.y);
    this.game.state.states.Game.incrementGameResources(this.value);

    if (this.showDeathAnimations) {
      this.body.velocity.setTo(0, 0);
      this.showDeathAnimationsThenKill();
    } else {
      super.kill();
    }
  }

  getRandomBonusType() {
    return 'heal';
  }

  setAnchor(isFriendly) {
    const yAnchor = (isFriendly) ? 1 : 0.5;
    this.anchor.setTo(0.5, yAnchor);
  }

  arrivedAtYDestionation() {
    this.reachedYDestination = true;
    this.body.velocity.y = 0;
  }

  static checkCollision(unit1, unit2) {
    console.log('adasdasd')
    return unit1.isFriendly != unit2.isFriendly && unit1.isAlive && unit2.isAlive;
  }
  static unitCollision(friendlyUnit, enemyUnit) {
    console.log('324234234234')
    friendlyUnit.damage(50);
    enemyUnit.damage(10);

    //set a high drag after colliding so enemies dont go flying offscreen.
    //NOTE: this will cause enemies to stop moving after colliding. It's not the best option but it's the best I got for now
    //enemyUnit.body.drag.setTo(10000,10000);
  }

  damage(amount) {
    super.damage(amount);
    this.showDamagedParticles();

    //flash a different color
    this.tint = 0xff0000;
    if (this.dmgOverlay) this.dmgOverlay.tint = 0xff0000;
    this.game.time.events.add(250, function() {
      this.tint = 0xffffff;
      if (this.dmgOverlay) this.dmgOverlay.tint = 0xffffff;
    }, this);
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
