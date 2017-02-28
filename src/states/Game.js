/* jshint esversion: 6 */

/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Bonus from '../objects/Sprites/Bonus';
import Unit from '../objects/Sprites/Parents/Unit';
import Ship from '../objects/Sprites/Parents/Ship';
import Protagonist from '../objects/Sprites/Ships/Protagonist';
import Pools from '../objects/Helpers/Pools';

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

    this.setupSpritePools();

    this.game.time.advancedTiming = true;

    this.game.data.play.player = new Protagonist(this.game);
    this.add.existing(this.game.data.play.player);

    this.game.waveHandler = new WaveHandler(this.game, this.hero);
    this.game.waveHandler.startWave();

    this.totalMoney = new IconText(this.game, 20, 'score', 'text', 'icons', 'coins', 0);
    this.totalMoney.right = this.game.waveHandler.progressBar.right;
    this.totalMoney.top = this.game.waveHandler.progressBar.bottom;
    this.incrementGameResources(0);
  }

  setupSpritePools() {
    let pools = {
      [Kamikaze.className()]: {
        'class': Kamikaze,
        'count': 25
      },
      [DiagonalMover.className()]: {
        'class': DiagonalMover,
        'count': 20
      },
      [Meteor.className()]: {
        'class': Meteor,
        'count': 35
      },
      [Unit.className()]: {
        'class': Unit,
        'count': 7
      },
      [Bonus.className()]: {
        'class': Bonus,
        'count': 4
      },
      'friendlyShips': {
        'class': Ship,
        'count': 1
      }
    };

    this.game.spritePools = new Pools(this.game, pools);
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
    let kamikazes = this.game.spritePools.getPool('Kamikaze');
    let diagonalmovers = this.game.spritePools.getPool('DiagonalMover');
    let meteors = this.game.spritePools.getPool('Meteor');
    let bonuses = this.game.spritePools.getPool('Bonus');
    const player = this.game.data.play.player;

    //this.enemyFriendlyOverlap(Ship);
    this.overlapFriendlies(kamikazes);
    this.overlapFriendlies(diagonalmovers);
    this.overlapFriendlies(meteors);

    this.game.physics.arcade.overlap(
      this.hero,
      bonuses,
      Bonus.bonusCollision, null, this);
  }

  //each ship has a list of weapons, and each weapon has its own pool of bullets
  overlapFriendlies(enemies) {
    const player = this.game.data.play.player;

    const overlapWeaponsBullets = function(shooters, receivers) {
      shooters.forEach(function(shooter) { //iterate thru all shooters
        shooter.weapons.forEach(function(weapon) { //iterate thru all shooters weapons
          this.game.physics.arcade.overlap(weapon.bullets, receivers, Ship.bulletCollision, null, this); //collide weapon's bullets with all receivers
        }.bind(this))
      }.bind(this));
    }.bind(this);

    //if enemy has weapons, check to see if those weapon's bullets have hit friendlies
    if (enemies.getChildAt(0).weapons) {
      overlapWeaponsBullets(enemies, player);
    }

    //check to see friendlies' weapon's bullets have hit enemies
    overlapWeaponsBullets([player], enemies);

    //check to see if friendlies and enemies have collided
    this.game.physics.arcade.overlap(player, enemies, Unit.unitCollision, null, this);
  }

  render() {
    this.game.debug.text('fps=' + this.game.time.fps || '--', this.game.world.centerX, 100, '#ffff00');
  }

}
