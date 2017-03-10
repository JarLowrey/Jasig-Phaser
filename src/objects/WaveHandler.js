/*
 * WaveHandler
 * ====
 *
 */
import Unit from './Sprites/Parents/Unit';

//specific unit and ship classes
import Meteor from './Sprites/Units/Meteor';
import DiagonalMover from './Sprites/Ships/DiagonalMover';
import Kamikaze from './Sprites/Ships/Kamikaze';

import * as PhaserUi from 'phaser-ui';

export default class WaveHandler {

  constructor(game, hero) {
    this.game = game;
    this.hero = hero;

    //variables to determine how much stuff can be on screen at once
    this.minMeteors = 4;
    this.minShips = 1;
    this.maxShips = 15;
    this.maxMeteors = 7;
    this.wavesUntilOneMoreShipCanAppearOnScreen = 5;
    this.wavesUntilOneMoreMeteorCanAppearOnScreen = 7;

    //variables to control spawn timing
    this.timeToCheckForNewSpawn = 1000;
    this.spawnTimer = game.time.create(false);
    this.waveTimer = game.time.create(false);
    this.game.time.events.loop(Phaser.Timer.SECOND, this.updateProgressBar, this);

    const countDownJson = this.game.dimen.game_countdown;
    this.progressBar = new PhaserUi.ProgressBar(this.game, (parseFloat(countDownJson.width) / 100) * this.game.width, countDownJson.height,
      null, countDownJson.strokeLength);
    this.progressBar.setText('', Object.assign({}, this.game.fonts.text));
    this.progressBar.frontGraphicColor = '0x75c9e5';
    this.progressBar.x = this.game.world.width - countDownJson.x - this.progressBar.width / 2;
    this.progressBar.y = countDownJson.y;

    this.startWave();
    this.updateProgressBar();
  }

  updateProgressBar() {
    const percentLeft = this.waveTimer.duration / WaveHandler.timeNeededToEndWave(this.game.data.play.wave.number);
    this.progressBar.progress = percentLeft;
    this.progressBar.setText((this.waveTimer.duration / 1000).toFixed(0));
  }

  startWave() {
    this.spawn();

    //timer to end the wave
    this.waveTimer.add(WaveHandler.timeNeededToEndWave(this.game.data.play.wave.number), this.stopSpawning, this);
    this.waveTimer.start();
    this.waveIsOver = false;
  }

  stopSpawning() {
    this.spawnTimer.stop();
    this.waveIsOver = true;
    if (this.livingEnemiesTotalValue() === 0) this.game.state.start('Store');
  }

  isWaveOver() {
    return this.waveIsOver;
  }

  _chooseRandMeteorKey() {
    const meteors = this.game.entities.units;
    const keys = Object.keys(meteors);
    const randIdx = this.game.between(0, keys.length);
    return keys[randIdx];
  }

  spawn() {
    var enemyTotal = this.livingEnemiesTotalValue();
    const enemiesThresholdValue = this.spawnValueThresholdForAdvancedEnemies();
    const meteorsThresholdValue = this.spawnValueThresholdForMeteors();


    if (enemyTotal < enemiesThresholdValue + meteorsThresholdValue) {
      let meteor = this.spawnSprite(Meteor, this._chooseRandMeteorKey());
      /*
            this.spawnSprite(Meteor, 'meteor');
            this.spawnSprite(Meteor, 'small_meteor');
            this.spawnSprite(Meteor, 'big_meteor');
            this.spawnSprite(Meteor, 'giant_meteor');
      */
      enemyTotal += meteor.value;
    }

    if (enemyTotal < enemiesThresholdValue) {
      const enemyInfo = this.chooseEnemy();
      this.spawnSprite(enemyInfo.newEnemyClass, enemyInfo.newEnemyJsonName);
    }

    this.spawnTimer.add(this.timeToCheckForNewSpawn, this.spawn, this);
    this.spawnTimer.start();
  }

  spawnSprite(newEnemyClass, newEnemyJsonName, isFriendly = false) {
    var newEnemy = this.game.spritePools.getPool(newEnemyClass.className()).getFirstDead(true);
    newEnemy.reset(newEnemyJsonName, isFriendly);
    return newEnemy;
  }

  chooseEnemy() {
    //var newEnemyJsonName = 'diagonal';
    var newEnemyClass = DiagonalMover;

    //if json is null, the class default will be used
    return {
      'newEnemyJsonName': null,
      'newEnemyClass': newEnemyClass
    };
  }

  //min time = 20s, max time = 90s, wave increments time by 2.5s
  static timeNeededToEndWave(wave) {
    var time = 1000 * 20;
    time += wave * 2.5;
    //return Math.min(time, 1000 * 90);
    return time;
  }

  livingEnemiesTotalValue() {
    var total = 0;
    const addToTotal = function(child) {
      if (!child.isFriendly) total += child.value;
    };

    //this.game.spritePools.getPool(Unit.className()).forEachAlive(addToTotal);
    this.game.spritePools.getPool(Meteor.className()).forEachAlive(addToTotal);
    //this.game.spritePools.getPool(Kamikaze.className()).forEachAlive(addToTotal);
    this.game.spritePools.getPool(DiagonalMover.className()).forEachAlive(addToTotal);

    return total;
  }

  //about how much Ship 'Power' can be on screen at once in a given wave.
  //'power' is approximated by value
  spawnValueThresholdForAdvancedEnemies() {
    const basicShipValue = this.game.entities.ships.diagonal.gold;
    var numBasicShips = this.game.data.play.wave.number / this.wavesUntilOneMoreShipCanAppearOnScreen + this.minShips;
    numBasicShips = Math.min(numBasicShips, this.maxShips);

    return numBasicShips * basicShipValue;
  }

  //about how much basic meteor 'Power' can be on screen at once in a given wave.
  //'power' is approximated by value
  spawnValueThresholdForMeteors() {
    const basicUnitValue = this.game.entities.units.meteor.gold;
    var numBasicUnits = this.game.data.play.wave.number / this.wavesUntilOneMoreMeteorCanAppearOnScreen + this.minMeteors;
    numBasicUnits = Math.min(numBasicUnits, this.maxMeteors);

    return numBasicUnits * basicUnitValue;
  }

}
