/*
 * DataDrivenDesign.js - DDD.js
 * ====
 * create and modify sprites via data formats
 */
export default class DDD {

  static get json() {
    return {
      image: {
        key: 'sprites',
        frame: ''
      },
      size: {
        width: 0
      },
      body: {
        velocity: {
          x: 0,
          y: 0
        }
      },
      position: {
        x: 0,
        y: 0,
        alpha: 1,
        angle: 0
      }
    };
  }

}
