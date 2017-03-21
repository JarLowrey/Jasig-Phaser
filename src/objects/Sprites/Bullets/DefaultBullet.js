/*
 * Default
 * ====
 *
 */

import ParentSprite from '../Parents/ParentSprite';
import Bullet from './Bullet';

export default class DefaultBullet extends Bullet {

  constructor(game, x, y) {
    const diameter = 8;
    super(game, x, y, Bullet.createCircleBmd(game, diameter));
    ParentSprite.setSize(this, diameter, true);
  }

  reset(x, y, health) {
    super.reset(x, y, health);
  }
}
