/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

import Bonus from '../objects/Sprites/Bonus';
import Unit from '../objects/Sprites/Parents/Unit';
import Explosion from '../objects/Sprites/Explosion';
import Ship from '../objects/Sprites/Parents/Ship';
import Protagonist from '../objects/Sprites/Ships/Protagonist';
import Pools from '../objects/Helpers/Pools';
import Weapons from '../objects/Helpers/Weapons';

import WaveHandler from '../objects/WaveHandler';

import IconText from '../objects/UI/IconText';

//specific unit and ship classes
import Meteor from '../objects/Sprites/Units/Meteor';
import DiagonalMover from '../objects/Sprites/Ships/DiagonalMover';
import Kamikaze from '../objects/Sprites/Ships/Kamikaze';

export default class Game extends Phaser.State {

  create() {
    this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sprites', 'background');
    this.starfield = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sprites', 'starfield');
    this.starfield2 = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sprites', 'starfield2');


    this.game.data.play.player = new Protagonist(this.game);
    this.game.data.play.player.reset();
    this.add.existing(this.game.data.play.player);

    //setup pools after player so emitters are shown on top
    this.setupSpritePools();

    this.game.time.advancedTiming = true;
    //this.game.forceSingleUpdate = true; //http://www.html5gamedevs.com/topic/13514-simple-game-horrible-performance-on-androidcooconjs/#comment-77719

    this.game.waveHandler = new WaveHandler(this.game, this.hero);
    this.game.waveHandler.startWave();

    this.totalMoney = new IconText(this.game, 20, 'score', 'text', 'icons', 'coins', 0);
    this.totalMoney.right = this.game.waveHandler.progressBar.right;
    this.totalMoney.top = this.game.waveHandler.progressBar.bottom;
    this.incrementGameResources(0);
  }

  shutdown() {
    Weapons.cleanupAllWeapons(this.game);
  }

  setupSpritePools() {
    let pools = {
      /*
      [Kamikaze.className()]: {
        'class': Kamikaze,
        'count': 0
      },
      */
      [DiagonalMover.className()]: {
        'class': DiagonalMover,
        'count': 7
      },
      ['Explosion']: {
        'class': Explosion,
        'count': 25
      },
      [Meteor.className()]: {
        'class': Meteor,
        'count': 15
      },
      [Bonus.className()]: {
        'class': Bonus,
        'count': 6
      },
      'friendlyShips': {
        'class': Ship,
        'count': 1
      }
    };

    this.game.spritePools = new Pools(this.game,
      pools,
      this.game.data.play.serializedObjects.sprites,
      this.game.cache.getJSON('emitters'));
  }

  update() {
    this.bg.tilePosition.y += 2;
    this.starfield.tilePosition.y += 4;
    this.starfield2.tilePosition.y += 8;

    this.game.debug.text(this.game.time.fps, this.game.world.centerX, this.game.world.centerY);

    this.collisionDectection();
  }

  incrementGameResources(amt) {
    this.game.data.play.score += amt;
    this.game.data.play.totalScore += amt;
    this.totalMoney.setText(this.game.nFormatter(this.game.data.play.score));
  }

  collisionDectection() {
    let kamikazes = this.game.spritePools.getPool('Kamikaze');
    let diagonalmovers = this.game.spritePools.getPool('DiagonalMover');
    let meteors = this.game.spritePools.getPool('Meteor');
    let bonuses = this.game.spritePools.getPool('Bonus');
    const player = this.game.data.play.player;

    //this.enemyFriendlyOverlap(Ship);
    //this.overlapFriendlies(kamikazes);
    this.overlapFriendlies(diagonalmovers);
    this.overlapFriendlies(meteors);

    this.game.physics.arcade.overlap(
      player,
      bonuses,
      Bonus.bonusCollision, null, this);
  }

  //each ship has a list of weapons, and each weapon has its own pool of bullets
  overlapFriendlies(enemies) {
    const player = this.game.data.play.player;

    //if enemy has weapons, check to see if those weapon's bullets have hit friendlies
    if (enemies.getChildAt(0).weapons) {
      enemies.forEachAlive(function(enemy) {
        enemy.weapons.overlapBullets(player);
      });
    }

    //check to see friendlies' weapon's bullets have hit enemies
    player.weapons.overlapBullets(enemies);

    //check to see if friendlies and enemies have collided
    this.game.physics.arcade.overlap(player, enemies, Unit.unitCollision, null, this);
  }

}
