/*
 * `states` module
 * ===============
 *
 * Declares all present game states.
 * Expose the required game states using this module.
 */

export {
  default as Boot
}
from './states/Boot';
export {
  default as Preload
}
from './states/Preload';
export {
  default as Game
}
from './states/Game';
export {
  default as Menu
}
from './states/Menu';
export {
  default as Store
}
from './states/Store';
export {
  default as GameOver
}
from './states/GameOver';
