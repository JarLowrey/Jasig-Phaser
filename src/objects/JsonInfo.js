/*
 * JsonInfo
 * ====
 *
 */

export default class JsonInfo {

  static getInfo(game, jsonType, jsonName){
    return game[jsonType][jsonName];
  }

}
