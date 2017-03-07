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
    //let key = game.add.graphics(0, 0);
    //key.drawCircle(0, 0, diameter);
    super(game, x, y, 'sprites', 'circle');
  }

  reset(x, y, health) {
    super.reset(x, y, health);
    const diameter = 8;

    ParentSprite.setSize(this, diameter, true);
    this.setFriendlinessTint();
  }
}
