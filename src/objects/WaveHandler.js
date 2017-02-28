/* jshint esversion: 6 */

/*
 * WaveHandler
 * ====
 *
 */
import ParentSprite from './Sprites/Parents/ParentSprite';
import Unit from './Sprites/Parents/Unit';
//import Ship from './Sprites/Parents/Ship';
import Pools from './Helpers/Pools';

//specific unit and ship classes
import Meteor from './Sprites/Units/Meteor';
import DiagonalMover from './Sprites/Ships/DiagonalMover';
import Kamikaze from './Sprites/Ships/Kamikaze';

import ProgressBar from 'phaser-ui';

export default class WaveHandler {

  constructor(game, hero) {
    this.game = game;
    this.hero = hero;

    this.wave = this.game.getConfig('waveNumber');
    this.earnedResources = 0;

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

    const countDownJson = this.game.dimen.game_countdown;
    this.progressBar = new ProgressBar(this.game, null, (parseFloat(countDownJson.width) / 100) * this.game.width, countDownJson.height,
      false, countDownJson.strokeLength, this.game.fonts.progressBar, '');
    this.progressBar.setBarColor(null, '0xcccccc', '0xffffff', '0x75c9e5');
    this.progressBar.x = this.game.world.width - countDownJson.x - this.progressBar.width / 2;
    this.progressBar.y = countDownJson.y;

    this.startWave();
  }

  updateProgressBar() {
    const percentLeft = this.waveTimer.duration / WaveHandler.timeNeededToEndWave(this.wave);
    this.progressBar.setPercent(percentLeft * 100);
    this.progressBar.setText(Math.round(this.waveTimer.duration / 1000));
  }

  startWave() {
    this.spawn();

    //timer to end the wave
    this.waveTimer.add(WaveHandler.timeNeededToEndWave(this.wave), this.stopSpawning, this);
    this.waveTimer.start();
    this.waveIsOver = false;
  }

  stopSpawning() {
    this.spawnTimer.stop();
    this.waveIsOver = true;
    if (this.livingEnemiesTotalValue() === 0) this.game.state.start('Store');
  }

  saveWaveValues() {
    //save completed level stats
    this.game.storeConfig('health', this.hero.health);
    this.game.storeConfig('waveNumber', this.wave + 1);
    this.game.storeConfig('resources', this.game.getConfig('resources') + this.earnedResources);
  }

  isWaveOver() {
    return this.waveIsOver;
  }

  spawn() {
    var enemyTotal = this.livingEnemiesTotalValue();
    const enemiesThresholdValue = this.spawnValueThresholdForAdvancedEnemies();
    const meteorsThresholdValue = this.spawnValueThresholdForMeteors();

    if (enemyTotal < enemiesThresholdValue + meteorsThresholdValue) {
      this.spawnSprite(Meteor);
      enemyTotal += ParentSprite.scaleValueByWave(this.wave, this.game.units.meteor.gold);
    }
    if (enemyTotal < enemiesThresholdValue) {
      const enemyInfo = this.chooseEnemy();
      this.spawnSprite(enemyInfo.newEnemyClass, enemyInfo.newEnemyJsonName);
    }

    this.spawnTimer.add(this.timeToCheckForNewSpawn, this.spawn, this);
    this.spawnTimer.start();
  }

  spawnSprite(newEnemyClass, newEnemyJsonName, isFriendly = false) {
    const poolName = Pools.getPoolName(newEnemyClass, isFriendly);
    var newEnemy = this.game.state.states.Game.spritePools.getNewSprite(poolName);

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
    return 1500;
  }

  livingEnemiesTotalValue() {
    var total = 0;
    const addToTotal = function(child) {
      if (!child.isFriendly) total += child.getValue();
    };

    this.getPool(Unit).forEachAlive(addToTotal);
    this.getPool(Meteor).forEachAlive(addToTotal);

    //this.getPool(Ship).forEachAlive(addToTotal);
    this.getPool(Kamikaze).forEachAlive(addToTotal);
    this.getPool(DiagonalMover).forEachAlive(addToTotal);

    return total;
  }

  getPool(classType, isFriendly = false) {
    return this.game.state.states.Game.spritePools.getPool(classType, isFriendly);
  }

  //about how much Ship 'Power' can be on screen at once in a given wave.
  //'power' is approximated by value
  spawnValueThresholdForAdvancedEnemies() {
    const basicShipValue = ParentSprite.scaleValueByWave(this.wave, this.game.ships.diagonal.gold);
    var numBasicShips = this.wave / this.wavesUntilOneMoreShipCanAppearOnScreen + this.minShips;
    numBasicShips = Math.min(numBasicShips, this.maxShips);

    return numBasicShips * basicShipValue;
  }

  //about how much basic meteor 'Power' can be on screen at once in a given wave.
  //'power' is approximated by value
  spawnValueThresholdForMeteors() {
    const basicUnitValue = ParentSprite.scaleValueByWave(this.wave, this.game.units.meteor.gold);
    var numBasicUnits = this.wave / this.wavesUntilOneMoreMeteorCanAppearOnScreen + this.minMeteors;
    numBasicUnits = Math.min(numBasicUnits, this.maxMeteors);

    return numBasicUnits * basicUnitValue;
  }

}
