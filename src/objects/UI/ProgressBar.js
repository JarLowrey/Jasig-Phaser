/**
 Copyright (c) 2015 Belahcen Marwane (b.marwane@gmail.com)
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the 'Software'), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
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

  constructor(game, {parentSprite, x, y, width, height},
      backgroundBarColor = '0x651828', barColor = [{'threshold':25, 'color': '0xff0000'}, {'threshold':50, 'color': '0xffff00'}, {'threshold':100, 'color': '0x00ff00'}],
      barShrinksRightToLeft = false, animationDuration = 50, isFixedToCamera = false){
    this.game = game;

    if(parentSprite){
      this.parent = parentSprite;
      this.setSize(this.parent.width, height);
    }else{
      this.setPosition(x, y);
      this.setSize(width, height);
    }

    this.flipped = barShrinksRightToLeft;
    this.animationDuration = animationDuration;
    this.backgroundBarColor = backgroundBarColor;
    this.barColor = barColor;

    this.drawBackground();
    this.drawProgressBar();
    this.setFixedToCamera(isFixedToCamera);
    this.reset();
  }

  setSize(width, height = 7, parent){
    if(typeof width == 'string'){   this.width = this.percentWidthToPixels(width, parent); }
    else{                           this.width = ProgressBar.densityPixels(width);}
    if(typeof height == 'string'){  this.height = this.percentWidthToPixels(height, parent); }
    else{                           this.height = ProgressBar.densityPixels(height);}

    //for when setting the position in the constructor, before the bars are created
    if(this.bgSprite !== undefined && this.barSprite !== undefined){
      this.bgSprite.width = this.getWidth();
      this.bgSprite.width = this.getWidth();
      this.barSprite.height = this.getBarHeight();
      this.bgSprite.height = this.getBarHeight();
    }
  }
  getWidth(){
    return this.width;
  }
  getBarHeight(){
    return this.height;
  }

  reset(){
    if(this.parent) this.setSize(this.parent.width);

    //setPercent only changes the front bar, need to change the size of the back bar too as the parent may have changed width
    this.setPercent(100);
  }

  flip(){
    this.flipped = !this.flipped;
    this.barSprite.scale.x = (this.flipped) ? -1 : 0;
  }

  static densityPixels(pixel){
    return pixel * window.window.devicePixelRatio;
  }

  percentWidthToPixels(percent, parent = this.game.world){
    return parent.width * (parseFloat(percent) / 100.0);
  }

  percentHeightToPixels(percent, parent = this.game.world){
    return parent.height * (parseFloat(percent) / 100.0);
  }

  drawBackground(){
    var bmd = this.game.add.bitmapData(this.getWidth(), this.getBarHeight());
    bmd.ctx.fillStyle = '#ffffff'; //bar must have pure white bitmap data in order to be tinted effectively
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.getWidth(), this.getBarHeight());
    bmd.ctx.fill();

    this.bgSprite = this.game.add.sprite(this.x, this.y, bmd);
    this.bgSprite.anchor.setTo(0.5,0.5);

    if(this.flipped){
      this.bgSprite.scale.x = -1;
    }
  }

  drawProgressBar(){
    var bmd = this.game.add.bitmapData(this.getWidth(), this.getBarHeight());
    bmd.ctx.fillStyle = '#ffffff'; //bar must have pure white bitmap data in order to be tinted effectively
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.getWidth(), this.getBarHeight());
    bmd.ctx.fill();

    this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2, this.y, bmd);
    this.barSprite.anchor.y = 0.5;

    if(this.flipped){
      this.barSprite.scale.x = -1;
    }
  }

  setPositionToTopOfParent(margin = ProgressBar.densityPixels(5) ){
    this.setPosition(this.parent.x, this.parent.top - this.bgSprite.height / 2 - margin);
  }
  setPositionOfLeftEdge(x,y){
    this.setPosition(x + this.width / 2, y);
  }
  setPositionOfRightEdge(x,y){
    this.setPosition(x - this.width / 2, y);
  }

  setPosition(x = this.x, y = this.y){
    this.x = x;
    this.y = y;

    //for when setting the position in the constructor, before the bars are created
    if(this.bgSprite !== undefined && this.barSprite !== undefined){
      this.bgSprite.x = x;
      this.bgSprite.y = y;

      this.barSprite.x = x;
      //bgSprite has X anchor=0.5 while barSprites anchor is 0 (flipped) or 1 (not flipped/normal). Apply an offset so their x positions match each other
      this.barSprite.x += (this.flipped) ? this.getWidth()/2 : - this.getWidth()/2;
      this.barSprite.y = y;
    }
  }

  /**
    Set background and foreground bar colors to a variety of options: Static or dynamic (depends upon progressPercentageRemaining)
    Examples:
      this.setBarColor();
        In this example, bars are set to default colors. progressPercentageRemaining defaults to 0 value.
      this.setBarColor(100);
        In this example, bars are set to default colors. If this.barColor is not static, the correct color will be chosen using progressPercentageRemaining.
      this.setBarColor(this_param_is_ignored, '0x123456', '0xffffff');
        In this example, background bar is bluish, foreground bar is white
      this.setBarColor(100, '0xffffff', [{'threshold':50, 'color': '0xff0000'}, {'threshold':100, 'color': '0x00ff00'}]);
        In this example, background bar is white, foreground is green at 50-100% and red at 0-50%. Since progress% is 100, the bar is green. You can have any number of threshold/colorCombos.
  */
  setBarColor(progressPercentageRemaining = 0, backgroundBarColor, barColor){
    //optional arguments to change colors
    if(backgroundBarColor) this.backgroundBarColor = backgroundBarColor;
    if(barColor) this.barColor = barColor;

    //allow Bar's color to change at different progressPercentageRemaining values
    if(typeof this.barColor != 'string'){
      this.barColor.sort(function(a,b){ return a.threshold - b.threshold; } );

      //loop thru all the elements in the barColor array, starting at the smallest theshold. If progressPercentageRemaining is under a threshold, set the color and exit the loop.
      for(var i=0; i<this.barColor.length; i++){
        const barColorInstance = this.barColor[i];
        if(progressPercentageRemaining <= barColorInstance.threshold){
          this.barSprite.tint = barColorInstance.color;
          break;
        }
      }
    }
    //Bar has a static color
    else{
      this.barSprite.tint = this.barColor;
    }

    this.bgSprite.tint = this.backgroundBarColor;
  }

  setPercent(newValue){
    if(newValue < 0)       { newValue = 0; }
    else if(newValue > 100){ newValue = 100; }

    this.setBarColor(newValue);

    var newWidth =  (newValue * this.getWidth()) / 100;

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
