/* jshint esversion: 6 */

/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Bonus from '../objects/Sprites/Bonus';
import Unit from '../objects/Sprites/Unit';
import Ship from '../objects/Sprites/Ship';
import Protagonist from '../objects/Sprites/Ships/Protagonist';
import SpritePooling from '../objects/Sprites/SpritePooling';

import WaveHandler from '../objects/WaveHandler';

import Stars from '../objects/UI/Stars';
import IconText from '../objects/UI/IconText';

//specific unit and ship classes
import Meteor from '../objects/Sprites/Units/Meteor';
import DiagonalMover from '../objects/Sprites/Ships/DiagonalMover';
import Kamikaze from '../objects/Sprites/Ships/Kamikaze';

export default class Game extends Phaser.State {

  create() {
    this.stars = new Stars(this.game);
    this.stars.showStars();

    this.spritePools = new SpritePooling(this.game);
    //this.spritePools.initPool(Ship,true);
    //this.spritePools.initPool(Ship,false);
    this.spritePools.initPool(Kamikaze, false);
    this.spritePools.initPool(DiagonalMover, false);
    this.spritePools.initPool(Meteor, false);
    this.spritePools.initPool(Unit, false);
    this.spritePools.initPool(Bonus);

    this.game.time.advancedTiming = true;

    this.hero = new Protagonist(this.game);
    this.hero.reset();

    this.game.waveHandler = new WaveHandler(this.game, this.hero);
    this.game.waveHandler.startWave();

    this.totalMoney = new IconText(this.game, 20, 'score', 'text', 'icons', 'coins', 0);
    this.totalMoney.right = this.game.waveHandler.progressBar.right;
    this.totalMoney.top = this.game.waveHandler.progressBar.bottom;
    this.incrementGameResources(0);
  }

  update() {
    this.game.waveHandler.updateProgressBar();

    this.collisionDectection();
  }

  incrementGameResources(amt) {
    this.game.waveHandler.earnedResources += amt;
    this.totalMoney.setText(this.game.nFormatter(this.game.waveHandler.earnedResources + this.game.getConfig('resources')));
  }

  collisionDectection() {
    //this.enemyFriendlyOverlap(Ship);
    this.enemyFriendlyOverlap(Kamikaze);
    this.enemyFriendlyOverlap(DiagonalMover);
    this.enemyFriendlyOverlap(Meteor);

    //this.overlapBullets(Ship);
    this.overlapBullets(Kamikaze);
    this.overlapBullets(DiagonalMover);
    this.overlapBullets(Meteor);

    this.game.physics.arcade.overlap(
      this.hero,
      this.spritePools.getPool(Bonus),
      Bonus.bonusCollision, null, this);
  }

  enemyFriendlyOverlap(classType) {
    const enemyPool = this.spritePools.getPool(classType, false);
    //const friendlyShips = this.spritePools.getPool(Ship, true);

    //this.game.physics.arcade.overlap( friendlyShips, pool, Unit.unitCollision, null, this);
    this.game.physics.arcade.overlap(this.hero, enemyPool, Unit.unitCollision, null, this);
  }

  //each ship has a list of weapons, and each weapon has its own pool of bullets
  overlapBullets(enemyType) {
    const enemies = this.spritePools.getPool(enemyType, false);

    //loop through each shooter, check if any of their bullets have hit a receiver
    const overlapAllWeapons = function(receivers) {
      return function(shooter) {
        shooter.weapons.forEach(
          function(weapon) {
            this.game.physics.arcade.overlap(weapon.bullets, receivers, Ship.bulletCollision, null, this);
          }.bind(this));
      }.bind(this);
    }.bind(this);

    const overlapAllSprites = function(shooters, receivers) {
      shooters.forEach(overlapAllWeapons(receivers), this, true);
    }.bind(this);

    //const friendlyShips = this.spritePools.getPool(Ship, true);
    //overlapShipsBullets(enemies, friendlyShips);
    //overlapShipsBullets(friendlyShips, enemies);

    //if enemy has weapons, check to see if those weapon's bullets have hit the hero
    if (enemies.getChildAt(0).weapons) overlapAllSprites(enemies, this.hero);
    this.game.physics.arcade.overlap(this.hero.weapons[0].bullets, enemies, Ship.bulletCollision, null, this);

    //overlapAllWeapons(enemies)(this.hero);
  }

  render() {
    this.game.debug.text('fps=' + this.game.time.fps || '--', this.game.world.centerX, 100, '#ffff00');
  }

}
