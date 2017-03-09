/*
 * GameData
 *
 * Access global data in a convenient wrapper
 */
import DbAccess from './DbAccess';

export default class GameData {

  constructor(game) {
    this.game = game;

    this._defineDefaultData();
  }

  _applySettings() {
    this.game.sound.volume = Number(!this.game.data.settings.muted); //apply volume settings
  }

  _defineDefaultData() {
    const defaults = this.game.cache.getJSON('preloadJSON').defaults;

    this._resetPlayData();

    this.stats = {
      kills: {},
      medals: {},

      bests: {
        level: 0,
        score: 0
      }
    };

    this.settings = {
      vibration: defaults.settings.vibration,
      screenShake: defaults.settings.screenShake,
      muted: defaults.settings.muted
    };
  }

  _resetPlayData() {
    this.play = {
      unlocks: {
        purchases: {
          gun: 0,
          damage: 0,
          fireRate: 0,
          defense: 0,
          scoreBoost: 0,
          ally: 0
        }
      },

      score: 0,
      totalScore: 0,

      comboCount: 0,
      player: null,
      playerInfo: {
        health: 0,
        maxHealth: 0,
        frame: 'playerShip1_green',
        shipFrameType: 1
      },

      level: 0,
      wave: {
        number: 0
      },

      serializedObjects: {
        player: null,
        sprites: []
      }
    };
  }

  //auto update long-term storage for certain properties
  saveStats() {
    DbAccess.setKey('stats', this.stats);
  }
  saveSettings() {
    DbAccess.setKey('settings', this.settings);
    this._applySettings();
  }

  resetGame() {
    this._resetPlayData();
    DbAccess.setKey('savedGame', this.play);
  }

  saveGame() {
    //auto-save in Db storage
    this.play.serializedObjects.player = this.play.player.serialize();
    this.play.serializedObjects.sprites = this.game.spritePools.serialize();

    //copy play data to a temp array and remove pointers to sprites (otherwise it crashes)
    let save = {};
    Object.assign(save, this.play);
    save.player = null;

    DbAccess.setKey('savedGame', save);
  }

  async load() {
    await DbAccess.open(this.game, {
      'stats': this.stats,
      'savedGame': this.play,
      'settings': this.settings
    });

    //load long term info
    let savedGame = DbAccess.getKey('savedGame');
    let stats = DbAccess.getKey('stats');
    let settings = DbAccess.getKey('settings');

    //load long-term storage into cache
    this.play = await savedGame;
    this.stats = await stats;
    this.settings = await settings;

    this._applySettings();
  }
}
