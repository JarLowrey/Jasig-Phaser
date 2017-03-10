/*
 * GameData
 *
 * Access global data in a convenient wrapper
 */
import DbAccess from './DbAccess';

export default class GameData {

  constructor(game) {
    this.game = game;
  }

  _applySettings() {
    this.game.sound.volume = Number(!this.game.data.settings.muted); //apply volume settings
  }

  _defaultStats() {
    return {
      kills: {},
      medals: {},

      bests: {
        level: 0,
        score: 0
      }
    };
  }
  _defaultSettings() {
    const defaults = this.game.cache.getJSON('preloadJSON').defaults;

    return {
      vibration: defaults.settings.vibration,
      screenShake: defaults.settings.screenShake,
      muted: defaults.settings.muted
    };
  }

  _defaultPlay() {
    const defaults = this.game.cache.getJSON('preloadJSON').defaults;
    return {
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

      score: 10000000,
      totalScore: 0,

      comboCount: 0,
      player: null,
      playerInfo: defaults.playerInfo,

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
    this.play = this._defaultPlay();
    DbAccess.setKey('savedGame', this.play);
  }

  saveGame() {
    //auto-save in Db storage
    if (this.play.player && this.game.spritePools) {
      this.play.serializedObjects.player = this.play.player.serialize();
      this.play.serializedObjects.sprites = this.game.spritePools.serialize();
    }

    //copy play data to a temp array and remove pointers to sprites (otherwise it crashes)
    let save = {};
    Object.assign(save, this.play);
    save.player = null;

    DbAccess.setKey('savedGame', save);
  }

  async load() {
    await DbAccess.open(this.game, {
      'stats': this._defaultStats(),
      'savedGame': this._defaultPlay(),
      'settings': this._defaultSettings()
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
