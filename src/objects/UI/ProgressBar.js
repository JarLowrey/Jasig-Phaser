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

  constructor(game, x, y, width = 15, height = 7,
      backgroundBarColor = '0x651828', barColor = [{'threshold':25, 'color': '0xff0000'}, {'threshold':50, 'color': '0xffff00'}, {'threshold':100, 'color': '0x00ff00'}],
      barShrinksRightToLeft = false, animationDuration = 50, isFixedToCamera = false){
    this.game = game;

    this.setPosition(x, y);
    this.setSize(width, height);

    this.barShrinksLeftToRight = barShrinksRightToLeft;
    this.animationDuration = animationDuration;
    this.backgroundBarColor = backgroundBarColor;
    this.barColor = barColor;

    this.drawBackground();
    this.drawProgressBar();
    this.setFixedToCamera(isFixedToCamera);
    this.setPercent(100);
  }

  setSize(width, height, parent){
    if(!parent) console.log(width, this.width,this.barSprite,this.bgSprite)

    //set width/height variables
    if(typeof width == 'string' && width.charAt(width.length-1) =='%'){     this.width = this.percentWidthToPixels(width, parent); }
    else if(width){                                                         this.width = ProgressBar.densityPixels(width);}
    if(typeof height == 'string' && height.charAt(height.length-1) =='%'){  this.height = this.percentHeightToPixels(height, parent); }
    else if(height){                                                        this.height = ProgressBar.densityPixels(height);}
    if(!parent) console.log(width, this.width,this.barSprite,this.bgSprite)

    //set underlying Sprites width/height
    //check is for when setting the position in the constructor, before the bars are created
    if(this.bgSprite !== undefined && this.barSprite !== undefined){
      //must reset cropping before setting size. When cropping is applied, size will not be set effectively
      this.applyCrop(1)

      this.barSprite.width = this.getWidth();
      this.barSprite.height = this.getBarHeight();
      if(!parent) console.log(width, this.width,this.barSprite,this.bgSprite)

      this.bgSprite.width = this.getWidth();
      this.bgSprite.height = this.getBarHeight();
    }
  }
  getWidth(){
    return this.width;
  }
  getBarHeight(){
    return this.height;
  }

  flip(){
    this.barShrinksLeftToRight = !this.barShrinksLeftToRight;
    this.barSprite.scale.x = (this.barShrinksLeftToRight) ? -1 : 0;
    //this.bgSprite.scale.x *= -1;
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
    this.bgSprite = this.game.add.sprite(this.x, this.y, this.getBitmapData());
    this.bgSprite.anchor.setTo(0.5,0.5);

    if(this.barShrinksLeftToRight){
      this.bgSprite.scale.x = -1;
    }
  }

  drawProgressBar(){
    this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2, this.y, this.getBitmapData() );
    this.barSprite.anchor.y = 0.5;

    if(this.barShrinksLeftToRight){
      this.barSprite.scale.x = -1;
    }
  }

  getBitmapData(width = this.getWidth(), height = this.getBarHeight()){
    var bmd = this.game.add.bitmapData(width, height);
    bmd.ctx.fillStyle = '#ffffff'; //bar must have pure white bitmap data in order to be tinted effectively
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fill();
    return bmd;
  }

  getRectangleBitmapData(width = this.getWidth(), height = this.getBarHeight()){
    var bmd = this.game.add.bitmapData(width, height);
    bmd.ctx.fillStyle = '#ffffff'; //bar must have pure white bitmap data in order to be tinted effectively
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fill();

    return bmd;
  }

  setPositionToTopOfParent(parent, margin = ProgressBar.densityPixels(5) ){
    this.setPosition(parent.x, parent.top - this.bgSprite.height / 2 - margin);
  }
  setPositionOfLeftEdge(x,y){
    this.setPosition(x + this.width / 2, y);
  }
  setPositionOfRightEdge(x,y){
    this.setPosition(x - this.width / 2, y);
  }

  setPosition(x = 0, y = 0){
    this.x = x;
    this.y = y;

    //for when setting the position in the constructor, before the bars are created
    if(this.bgSprite !== undefined && this.barSprite !== undefined){
      this.bgSprite.x = x;
      this.bgSprite.y = y;

      this.barSprite.x = x;
      //bgSprite has X anchor=0.5 while barSprites anchor is 0 (flipped) or 1 (not flipped/normal). Apply an offset so their x positions match each other
      this.barSprite.x += (this.barShrinksLeftToRight) ? this.getWidth()/2 : - this.getWidth()/2;
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

  setPercent(newPercent,a){
    if(newPercent < 0)       { newPercent = 0; }
    else if(newPercent > 100){ newPercent = 100; }

    this.setBarColor(newPercent);

    this.applyCrop(newPercent / 100,a);
  }

  applyCrop(percentWidth){
    //no idea why, but if the X scale is negative, crop needs to be a pixel value. If it is positive it is a percent value
    var newWidth;
    if(this.barShrinksLeftToRight) newWidth = this.getWidth() * (percentWidth);
    else newWidth = percentWidth;

    //perform the resizing via crop
    console.log(this.barSprite.width, newWidth);
    const cropRect =  new Phaser.Rectangle(0, 0, newWidth, this.barSprite.height);
    this.barSprite.crop(cropRect);
    console.log(this.barSprite.width, newWidth);
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
