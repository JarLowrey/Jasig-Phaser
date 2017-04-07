/*
 * Deserialize
 * ====
 * Applies a entity defined thru JSON onto a given sprite.
 */

import ParentSprite from '../Sprites/Parents/ParentSprite';
import DDD from './DDD';

export default class Deserialize extends DDD {

  static apply(sprite, json) {
    const defaultJson = DDD.json();

    Deserialize._applyImage(sprite, json, defaultJson);
    Deserialize._applySize(sprite, json, defaultJson);
    Deserialize._applyBody(sprite, json, defaultJson);
    Deserialize._setPosition(sprite, json, defaultJson);
  }

  //randomly selects a value if property is array or has a min & max value
  //otherwise, just returns the property
  static _selectProp(json) {
    let prop = null;

    if (Array.isArray(json)) {
      const randIndx = Phaser.Math.between(0, json.length);
      prop = jsonProperty[randIndx];
    } else if (json.min && json.max) {
      prop = Phaser.Math.random(json.min, json.max);
    } else {
      prop = json;
    }

    return prop;
  }

  static _applyImage(sprite, json, defaultJson) {
    let frame = Deserialize._selectProp(json.image.frame);
    this.loadTexture(json.image.key || defaultJson.image.key, frame);
  }

  static _applySize(sprite, json, defaultJson) {
    ParentSprite.setSize(sprite, Deserialize._selectProp(json.size.width), json.isCircular);
  }

  static _applyBody(sprite, json, defaultJson) {
    if (sprite.body) {
      let v = json.velocity || defaultJson.body.velocity.x;
      sprite.body.velocity.set(
        Deserialize._selectProp(v.x),
        Deserialize._selectProp(v.y)
      );
      sprite.body.drag.setTo(0, 0);
    }
  }

  static _setPosition(sprite, json, defaultJson) {
    sprite.x = Deserialize._selectProp(json.position.x) || defaultJson.position.x;
    sprite.y = Deserialize._selectProp(json.position.y) || defaultJson.position.y;
    sprite.alpha = Deserialize._selectProp(json.position.alpha) || defaultJson.position.alpha;
    sprite.angle = Deserialize._selectProp(json.position.angle) || defaultJson.position.angle;
  }
}
