/*
 * Serialize
 * ====
 * turn a sprite into json formatted to be usable by Deserialize.js
 */
import DDD from './DDD';

export default class Deserialize extends DDD {

  static serialize(sprite) {
    //use the default JSON from DDD. Do not add new properties, only fill in the ones already there
    let json = DDD.json();

    DataAttributes._serializeImage(sprite, json);
    DataAttributes._serializeSize(sprite, json);
    DataAttributes._serializeBody(sprite, json);
    DataAttributes._serializePosition(sprite, json);

    return json;
  }

  static _serializeImage(sprite, json) {
    json.image.key = sprite.key;
    json.image.frame = sprite.frameName;
  }

  static _serializeSize(sprite, json) {
    json.width = sprite.width;
  }

  static _serializeBody(sprite, json) {
    if (sprite.body) {
      json.body.velocity.x = sprite.body.velocity.x;
      json.body.velocity.y = sprite.body.velocity.y;
    }
  }
  static _serializePosition(sprite, json) {
    for (var prop in json.position) {
      json.position[prop] = sprite[prop];
    }
  }
}
