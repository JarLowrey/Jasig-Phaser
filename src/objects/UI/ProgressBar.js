/**
 Copyright (c) 2015 Belahcen Marwane (b.marwane@gmail.com)
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

 /*
  Modified from source: https://github.com/bmarwane/phaser.healthbar
  */


export default class ProgressBar {

  constructor(game, parent, backgroundBarColor = '#651828', barShrinksRightToLeft = false, animationDuration = 50, isFixedToCamera = false){
    this.game = game;
    this.parent = parent;
    this.barHeight = ProgressBar.densityPixels(7);
    this.flipped = barShrinksRightToLeft;
    this.animationDuration = animationDuration;
    this.bgBarColor = backgroundBarColor;

    this.drawBackground();
    this.drawHealthBar();
    this.setFixedToCamera(isFixedToCamera);
    this.reset();
  }

  reset(){
    this.bgSprite.width = this.parent.width;

    this.setPercent(100);
  }

  static densityPixels(pixel){
    return pixel * window.window.devicePixelRatio;
  }

  drawBackground(){
    var bmd = this.game.add.bitmapData(this.parent.width, this.barHeight);
    bmd.ctx.fillStyle = this.bgBarColor;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.parent.width, this.barHeight);
    bmd.ctx.fill();

    this.bgSprite = this.game.add.sprite(this.x, this.y, bmd);
    this.bgSprite.anchor.set(0.5);

    if(this.flipped){
      this.bgSprite.scale.x = -1;
    }
  }

  drawHealthBar(){
    var bmd = this.game.add.bitmapData(this.parent.width, this.barHeight);
    bmd.ctx.fillStyle = '#ffffff'; //this front bar must have pure white bitmap data in order to be tinted effectively
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.parent.width, this.barHeight);
    bmd.ctx.fill();

    this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2, this.y, bmd);
    this.barSprite.anchor.y = 0.5;

    if(this.flipped){
      this.barSprite.scale.x = -1;
    }
  }

  setPositionToTopOfParent(margin = ProgressBar.densityPixels(10) ){
    this.setPosition(this.parent.x, this.parent.top - this.bgSprite.height / 2 - margin);
  }

  setPosition(x,y){
    this.x = x;
    this.y = y;

    if(this.bgSprite !== undefined && this.barSprite !== undefined){
      this.bgSprite.x = x;
      this.bgSprite.y = y;

      this.barSprite.x = x - this.parent.width/2;
      this.barSprite.y = y;
    }
  }

  setBarColor(healthPercentageRemaining){
    if( healthPercentageRemaining < 25 )     { this.barSprite.tint = '0xff0000'; } //red
    else if( healthPercentageRemaining < 50 ){ this.barSprite.tint = '0xffff00'; } //yellow
    else                                     { this.barSprite.tint = '0x00ff00'; } //green
  }

  setPercent(newValue){
    if(newValue < 0)       { newValue = 0; }
    else if(newValue > 100){ newValue = 100; }

    this.setBarColor(newValue);

    var newWidth =  (newValue * this.parent.width) / 100;

    this.setWidth(newWidth);
  }

  setWidth(newWidth){
    if(this.flipped) {
      newWidth = -1 * newWidth;
    }
    this.game.add.tween(this.barSprite).to( { width: newWidth }, this.animationDuration, Phaser.Easing.Linear.None, true);
  }

  hide(){
    this.bgSprite.visible = false;
    this.barSprite.visible = false;
  }

  show(){
    this.bgSprite.visible = true;
    this.barSprite.visible = true;
  }

  setFixedToCamera(fixedToCamera) {
    this.bgSprite.fixedToCamera = fixedToCamera;
    this.barSprite.fixedToCamera = fixedToCamera;
  }

  kill() {
    this.bgSprite.kill();
    this.barSprite.kill();
  }
}
