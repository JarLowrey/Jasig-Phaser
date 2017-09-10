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

import Pools from '../objects/Systems/Pools';
import WaveHandler from '../objects/Systems/WaveHandler';

import Gun from '../objects/Gear/Guns/Gun';
import Bullet from '../objects/Gear/Bullets/Bullet';

import MoveController from '../objects/MoveController';

import IconText from '../objects/UI/IconText';

//specific unit and ship classes
import Meteor from '../objects/Sprites/Units/Meteor';
import DiagonalMover from '../objects/Sprites/Ships/DiagonalMover';
import Kamikaze from '../objects/Sprites/Ships/Kamikaze';

export default class Game extends Phaser.State {

  create() {
    //document.documentElement.style.cursor = 'none'; //hide cursor in game

    this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height,'sprites','background');
    this.starfield = this.game.add.tileSprite(0, 0, this.game.width, this.game.height,'sprites', 'starfield');
    this.starfield2 = this.game.add.tileSprite(0, 0, this.game.width, this.game.height,'sprites', 'starfield2');

    this.setupSpritePools();
    this.game.data.play.player = this.game.spritePools.getPool('Protagonist').getFirstDead();
    this.game.data.play.player.reset();
    this.moveController = new MoveController(this.game.data.play.player);

    this.game.time.advancedTiming = true;
    //this.game.forceSingleUpdate = true; //http://www.html5gamedevs.com/topic/13514-simple-game-horrible-performance-on-androidcooconjs/#comment-77719

    this.game.waveHandler = new WaveHandler(this.game, this.hero);
    this.game.waveHandler.startWave();

    this.totalMoney = new IconText(this.game, 20, 'score', 'text', 'sprites', 'coins', 0);
    this.totalMoney.right = this.game.waveHandler.progressBar.right;
    this.totalMoney.top = this.game.waveHandler.progressBar.bottom;
    this.incrementGameResources(0);
  }

  shutdown() {
    //document.documentElement.style.cursor = 'default';

    //delete objects as needed
    //Ship.cleanupAllWeapons(this.game);

    //save necessary data
    this.game.data.play.playerInfo.health = this.game.data.play.player.health;
    this.game.data.play.player.kill();
    this.game.spritePools = null;
    this.game.data.play.player = null;

    this.game.data.saveGame();
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
        class: DiagonalMover,
        count: 7
      },
      ['Explosion']: {
        class: Explosion,
        count: 25
      },
      [Meteor.className()]: {
        class: Meteor,
        count: 15
      },
      [Bonus.className()]: {
        class: Bonus,
        count: 6
      },
      'friendlyShips': {
        class: Ship,
        count: 1
      },
      'Protagonist': {
        class: Protagonist,
        count: 1
      },
      'gun': {
        class: Gun,
        count: 20
      }
    };
    this.enemyEntityClassNames = [DiagonalMover.className(), Meteor.className()];
    this.friendlyEntityClassNames = ['friendlyShips', 'Protagonist'];

    const weapons = {
      'Bullet': {
        numWeapons: 20,
        numBullets: 20
      }
    };

    this.game.spritePools = new Pools(this.game,
      pools,
      this.game.data.play.serializedObjects.sprites,
      this.game.cache.getJSON('emitters'),
      weapons
    );
  }

  _tileBackground() {
    this.bg.tilePosition.y += 2;
    this.starfield.tilePosition.y += 4;
    this.starfield2.tilePosition.y += 8;
  }

  update() {
    this.moveController.move();

    this.game.debug.text(this.game.time.fps, this.game.world.centerX, this.game.world.centerY);

    this.collisionDectection();
  }

  incrementGameResources(amt) {
    this.game.data.play.score += amt;
    this.game.data.play.totalScore += amt;
    this.totalMoney.setText(this.game.nFormatter(this.game.data.play.score));
  }

  collisionDectection() {
    const player = this.game.data.play.player;

    this.overlapUnits();
    this.overlapBullets(this.friendlyEntityClassNames, this.enemyEntityClassNames);
    this.overlapBullets(this.enemyEntityClassNames, this.friendlyEntityClassNames);

    this.game.physics.arcade.overlap(
      player,
      this.game.spritePools.getPool(Bonus.className()),
      Bonus.bonusCollision, null, this);
  }

  overlapUnits() {
    for (let friendlyName of this.friendlyEntityClassNames) {
      let friendlies = this.game.spritePools.getPool(friendlyName);

      for (let enemyName of this.enemyEntityClassNames) {
        let enemies = this.game.spritePools.getPool(enemyName);
        this.game.physics.arcade.overlap(enemies, friendlies, Unit.unitCollision, Unit.checkCollision, this);
      }
    }
  }

  _overlapBullets(shooter, receiversArray) {
    if (shooter.guns) {
      for (let gun of shooter.guns) {
        let bullets = gun.weapon.bullets;

        for (let receiversName of receiversArray) {
          let receiversPool = this.game.spritePools.getPool(receiversName);
          this.game.physics.arcade.overlap(receiversPool, bullets, Bullet.bulletCollision, Bullet.checkCollision, this);
        }
      }
    }
  }

  overlapBullets(shootersArray, receiversArray) {
    for (let shooterName of shootersArray) {
      let shooters = this.game.spritePools.getPool(shooterName);
      shooters.forEachAlive((child) => this._overlapBullets(child, receiversArray), this);
    }
  }

}
