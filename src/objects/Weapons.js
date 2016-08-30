/* jshint esversion: 6 */

/*
 * Weapons - manages pool of Phaser.Weapon Plugins
 * ====
 *
 */

export default class Weapons {

  constructor(game) {
    Weapons.game = game;
    Weapons.pool = [];
  }

  static getWeapon() {
    Weapons.pool.forEach(function() {

    });
  }

}

}
