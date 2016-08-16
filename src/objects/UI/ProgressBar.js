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

  constructor(game, x, y, width = 15, height = 7, outlineLength = 0,
      backgroundBarColor = '0x651828', outlineBarColor = '0xffffff', barColor = [{'threshold':25, 'color': '0xff0000'}, {'threshold':50, 'color': '0xffff00'}, {'threshold':100, 'color': '0x00ff00'}],
      fontStyle = game.fonts['progress_bar'], text ='',
      barShrinksLeftToRight = false, isFixedToCamera = false){
    this.game = game;

    this.setPosition(x, y);
    this.setSize(width, height, outlineLength); //set size variables before creating sprites
    this.setBarColor(null, backgroundBarColor, outlineBarColor, barColor); //set the color variables to their defaults, or whatever is passed into constructor

    this.barShrinksLeftToRight = barShrinksLeftToRight;

    this.outlineSprite = this.createBar();
    this.bgSprite = this.createBar();
    this.barSprite = this.createBar();
    this.barSprite.anchor.x = 0;
    this.text = this.game.add.text(x,y);
    this.text.anchor.setTo(0.5,0.4);
    this.setTextStyle(fontStyle);
    this.setText(text);
    this.setSize(); //update sprite sizes now that they are defined

    this.setFixedToCamera(isFixedToCamera);
    this.setPercent(100); //this also sets bar color, not that the bars are defined
  }

  setSize(width, height, outlineLength, parent){
    //set width/height variables
    if(typeof width == 'string' && width.charAt(width.length-1) =='%'){     this.width = this.percentWidthToPixels(width, parent); }
    else if(typeof width == 'number'){                                      this.width = ProgressBar.densityPixels(width);}
    if(typeof height == 'string' && height.charAt(height.length-1) =='%'){  this.height = this.percentHeightToPixels(height, parent); }
    else if(typeof height == 'number'){                                     this.height = ProgressBar.densityPixels(height);}
    if(typeof outlineLength == 'number'){ this.strokeLength = ProgressBar.densityPixels(outlineLength); }

    //set underlying Sprites width/height
    //check is for when setting the position in the constructor, before the bars are created
    if(this.spritesAreDefined()){
      this.barSprite.width = this.getBarWidth();
      this.barSprite.height = this.getBarHeight();

      this.bgSprite.width = this.getBarWidth();
      this.bgSprite.height = this.getBarHeight();

      this.outlineSprite.width = this.width;
      this.outlineSprite.height = this.height;

      this.setTextStyle();
    }
  }
  getBarWidth(){
    return this.width - this.strokeLength;
  }
  getBarHeight(){
    return this.height - this.strokeLength;
  }

  flip(){
    this.barShrinksLeftToRight = !this.barShrinksLeftToRight;
    this.barSprite.scale.x *= -1;
    this.bgSprite.scale.x *= -1;
    this.outlineSprite.scale.x *= -1;
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

  setText(text){
    this.text.setText(text);
  }

  setTextStyle(fontStyle){
    if(fontStyle) this.fontStyle = fontStyle;

    this.text.setStyle(this.fontStyle);

    this.text.fontSize = this.height * 2;
    this.text.scale.x = this.text.scale.y;
  }

  createBar(){
    var bar = this.game.add.sprite(this.x, this.y, this.getRectangleBitmapData());
    bar.anchor.setTo(0.5,0.5);

    if(this.barShrinksLeftToRight){
      bar.scale.x = -1;
    }
    return bar;
  }

  getRectangleBitmapData(width = this.getBarWidth(), height = this.getBarHeight()){
    var bmd = this.game.add.bitmapData(width, height);
    bmd.ctx.fillStyle = '#ffffff'; //bar must have pure white bitmap data in order to be tinted effectively
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fill();

    return bmd;
  }

  setPositionToTopOfParent(parent, margin = ProgressBar.densityPixels(5) ){
    this.setPosition(parent.x, parent.top - this.height / 2 - margin);
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
    if(this.spritesAreDefined()){
      this.bgSprite.x = x;
      this.bgSprite.y = y;
      this.outlineSprite.x = x;
      this.outlineSprite.y = y;
      this.text.x = x;
      this.text.y = y;

      this.barSprite.x = x;
      //bgSprite has X anchor=0.5 while barSprites anchor is 0 (flipped) or 1 (not flipped/normal). Apply an offset so their x positions match each other
      this.barSprite.x += (this.barShrinksLeftToRight) ? this.getBarWidth()/2 : - this.getBarWidth()/2;
      this.barSprite.y = y;
    }
  }

  spritesAreDefined(){
    return this.bgSprite !== undefined && this.barSprite !== undefined && this.outlineSprite !== undefined && this.text !== undefined;
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
  setBarColor(progressPercentageRemaining = 0, backgroundBarColor, outlineBarColor, barColor){
    //optional arguments to change colors
    if(backgroundBarColor) this.backgroundBarColor = backgroundBarColor;
    if(outlineBarColor) this.outlineBarColor = outlineBarColor;
    if(barColor) this.barColor = barColor;

    if(this.spritesAreDefined()){
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

      this.outlineSprite.tint = this.outlineBarColor;
      this.bgSprite.tint = this.backgroundBarColor;
    }
  }

  setPercent(newPercent){
    if(newPercent < 0)       { newPercent = 0; }
    else if(newPercent > 100){ newPercent = 100; }

    this.setBarColor(newPercent);

    this.barSprite.width = newPercent / 100 * this.getBarWidth() * Math.sign(this.barSprite.scale.x);
  }

  hide(){
    this.bgSprite.visible = false;
    this.barSprite.visible = false;
    this.outlineSprite.visible = false;
    this.text.visible = false;
  }

  show(){
    this.bgSprite.visible = true;
    this.barSprite.visible = true;
    this.outlineSprite.visible = true;
    this.text.visible = true;
  }

  setFixedToCamera(fixedToCamera) {
    this.bgSprite.fixedToCamera = fixedToCamera;
    this.barSprite.fixedToCamera = fixedToCamera;
    this.outlineSprite.fixedToCamera = fixedToCamera;
    this.text.fixedToCamera = fixedToCamera;
  }

  kill() {
    this.bgSprite.kill();
    this.barSprite.kill();
    this.outlineSprite.kill();
    this.text.kill();
  }
}
