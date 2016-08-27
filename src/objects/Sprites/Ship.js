/*
 * Ship
 * ====
 *
 */

import Unit from '../Sprites/Unit';
import ProgressBar from '../../objects/UI/ProgressBar';
import ParentSprite from '../Sprites/ParentSprite';

export default class Ship extends Unit {
  static getClassName(){ return 'Ship'; }

  constructor(game){
    super(game);

    this.healthbar = new ProgressBar(this.game);
    this.healthbar.visible = false; //since many sprites are preallocated in pools, you need to manually hide the healthbar upon creation

    this.weapons = [];
  }

  update(){
    if(!this.alive) return;

    super.update();

    if(this.constructor.getClassName() != 'Protagonist'){
      this.healthbar.alignTo(this, Phaser.TOP_CENTER, 0, -this.healthbar.height/2);
    }


            this.game.debug.body(this); //better way of showing the bounding box when debugging
            this.weapons[0].bullets.forEach(
              function(bullet){
                this.game.debug.body(bullet); //better way of showing the bounding box when debugging
              }.bind(this)
            );
  }

  reset(shipName, isFriendly){
    //super.reset(x, y, this.jsonInfo.health, this.jsonInfo.width, 'sprites', this.jsonInfo.frame, isFriendly, this.jsonInfo.explosionFrame, this.jsonInfo.destYInPercentOfScreen);
    super.reset(shipName, isFriendly, 'ships');

    this.healthbar.setPercent(100);
    this.healthbar.setText( this.getHealthbarText() );
    this.healthbar.setWidth(this.width);

    this.healthbar.visible = true;

    //add all the weapons from the json file
    this.weapons = [];
    const bulletTint = (this.isFriendly) ? '0x00ff00' : '0xff0000'; //friendly is green, enemy is red
    const setBulletProperties = function(weapon, bulletInfo, tint){
      weapon.bullets.forEach(
        function(bullet){
          //bullet.anchor.setTo(0.5,0.5);
          if(bulletInfo.isTinted) bullet.tint = bulletTint;

          //update sprite dimensions & its body dimensions
          bullet.width = bulletInfo.width;
          bullet.scale.y = bullet.scale.x;
          bullet.body.setSize(bullet.width,bullet.height);
        }.bind(this)
      );
    }.bind(this);

    for(var weaponName in this.jsonInfo.weapons){
      const weaponInfo = this.jsonInfo.weapons[weaponName];
      const bulletType = weaponInfo.bulletType || 'default';
      const bulletInfo = this.game.bullets[bulletType];

      var weapon = this.game.add.weapon(30, bulletInfo.key, bulletInfo.frame);
      weapon.weaponName = weaponName;
      weapon.bulletType = bulletType;
      weapon.autoExpandBulletsGroup = (weaponInfo.autoExpandBulletsGroup === false) ? false : true; //has unlimited ammo unless set otherwise in JSON
      weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
      weapon.bulletSpeed = ParentSprite.dp(300);
      weapon.fireAngle = (this.isFriendly) ? Phaser.ANGLE_UP : Phaser.ANGLE_DOWN;

      weapon.fireRate = 1000;//this.getFreRate();
      //weapon.dmg = this.getDamage();

      setBulletProperties(weapon, bulletInfo);
      weapon.dmg = 25; //this does nothing right now
      weapon.bullets.myWeapon = weapon;

      const percentOffset = (weaponInfo.xPercentOffset || 0) / 100;
      const bulletMidpoint = bulletInfo.width / 2;
      const xPixelOffset = this.width * percentOffset;
      const yPixelOffset = -this.anchor.y * this.height + this.height/2 ; //regardless of anchor, bullets start in middle Y of sprite
      //console.log(this.width * offset - bulletMidpoint, offset, weaponInfo.xPercentOffset, bulletMidpoint, this.width);
      weapon.trackSprite(this, xPixelOffset, yPixelOffset);

      //console.log(weapon, weaponInfo)

      this.weapons.push(weapon);
    }
  }

  getHealthbarText(){
    return Math.max(this.health,0);
  }

  arrivedAtYDestionation(){
    super.arrivedAtYDestionation();

    this.startShooting();
  }

  startShooting(){
    if(!this.isAlive()) return;

    this.weapons.forEach(function(weapon){
      weapon.autofire = true;
    });
   }
  stopShooting(){
    this.weapons.forEach(function(weapon){
      weapon.autofire = false;
    });
  }

  damage(amount){
    super.damage(amount);

    //little tween to show damage occurred
    //const tempAngle = this.angle;
    const resetAngle = function(){ this.angle = 0; }.bind(this);
    const tweenAngle = 10 + 10 * Math.random();
    const tweenTime = 4;
    var tween = this.game.add.tween(this)
      .to({angle: -tweenAngle}, tweenTime, Phaser.Easing.Linear.In)
      .to({angle:  tweenAngle}, tweenTime, Phaser.Easing.Linear.In)
      .repeatAll(1);
    tween.onComplete.add(resetAngle, this);
    tween.start();

    this.setHealthBarPercentage();
    this.healthbar.setText( this.getHealthbarText() );
  }

  heal(amount){
    super.heal(amount);

    this.setHealthBarPercentage();
    this.healthbar.setText( this.getHealthbarText() );
  }

  setHealthBarPercentage(){
    const healthPercentLeft = 100 * (this.health / this.maxHealth);
    this.healthbar.setPercent(healthPercentLeft);
  }

  kill(){
    if(this.isBeingKilled) return;

    this.stopShooting();
    this.healthbar.visible = false;

    super.kill();
  }
  //Overrides super method. this is called at the end of super.kill()
  showDeathAnimations(){
    //setup tween to be played upon this.kill()
    const xTweenLen = ParentSprite.dp(15) * Math.random() + ParentSprite.dp(15);
    const tweenAngle = 30 + 30 * Math.random();
    const tweenTime = 35;
    var tween = this.game.add.tween(this)
      .to({x:'-'+xTweenLen}, tweenTime, Phaser.Easing.Linear.In) //tween it relative to the current position. Needs to be a string
      .to({x:'+'+xTweenLen}, tweenTime, Phaser.Easing.Linear.In)
      .to({angle: -tweenAngle}, tweenTime, Phaser.Easing.Linear.In)
      .to({angle:  tweenAngle}, tweenTime, Phaser.Easing.Linear.In)
      .repeatAll(1);
    tween.start();
    tween.onComplete.add(super.showDeathAnimations, this);
  }

  static bulletCollision(unit, bullet){
    //if the parameters come out of order, ensure that unit is a Unit and bullet is a Phaser.Bullet
    //check if the bullet is actually a Unit by seeing if it has a property (function) that is defined for Unit
    if(bullet.isAlive){
      const temp = unit;
      unit = bullet;
      bullet = temp;
    }

    const shootingWeapon = bullet.parent.myWeapon;
    if( unit.isAlive() ) bullet.kill();
    if( unit.isAlive() ) unit.damage(shootingWeapon.dmg);
  }

}
