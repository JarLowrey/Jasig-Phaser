/* jshint esversion: 6 */

/*
 * UiHelper
 * ====
 *
 */

import ParentSprite from '../../objects/Sprites/Parents/ParentSprite';

export default class UiHelper {

  constructor(game) {
    this.game = game;
  }

  //density independent pixels
  static dp(pixels) {
    return pixels * window.devicePixelRatio;
  }

  static addImage(game, x, y, key, frameName, width, height) {
    if (!(width || height)) {
      const imgName = (frameName && frameName !== '') ? frameName : key;
      const imgInfo = game.dimen[imgName];
      width = imgInfo.width;
      height = imgInfo.height;
    }

    if (typeof width == 'string' && width.includes('%')) width = ParentSprite.percentWidthToPixels(width);
    if (typeof height == 'string' && height.includes('%')) height = ParentSprite.percentWidthToPixels(height);

    var img = game.add.image(x, y, key, frameName);
    img.width = width;

    if (height) {
      img.height = height;
    } else {
      img.scale.y = img.scale.x;
    }

    img.anchor.setTo(0.5, 0.5);

    return img;
  }

}
