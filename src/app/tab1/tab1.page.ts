import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

let player;
let platforms;

class GameScene extends Phaser.Scene {
  constructor(config) {
    super(config);
  }

  preload() {
    // 引入本地文件到游戏容器中
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('left', 'assets/left.png');
    this.load.image('turn', 'assets/turn.png');
    this.load.image('right', 'assets/right.png');

    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {

    // 使用图片，这里使用sky 作为背景
    this.add.image(400, 100, 'sky');

    // 构建静态物理游戏场景组
    platforms = this.physics.add.staticGroup();

    // 创建一个新的游戏对象并将其添加到该组中,缩放以适应游戏的宽度
    platforms.create(window.innerWidth - 20, 400, 'ground').setScale(2).refreshBody();

    // 新建玩家
    player = this.physics.add.sprite(100, 250, 'dude');

    player.setBounce(0.2); //设置这个身体的反弹值。弹跳是身体与另一个物体碰撞时的恢复量或弹性。值为 1 意味着它将在回弹后保持其全速。值为 0 表示它根本不会反弹
    player.setCollideWorldBounds(true); //设置这个身体是否与边界碰撞。

    // 创建左转动画效果
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // 创建上动画效果
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    // 创建右动画效果
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.physics.add.collider(player, platforms);//Arcade Physics Collider 将在每一步自动检查两个对象之间的碰撞或重叠。如果发生碰撞或重叠，它将调用给定的回调

    // cursors = this.input.keyboard.createCursorKeys(); 创建键盘键

    // 用为作为App，没有键盘，需要定义上、左、右三个按钮来操控人物行动，同事监听事件触发上面定义的相对应动画及行走距离
    const button = this.add.sprite(200, 500, 'turn')
      .setInteractive()
      .on('pointerdown', () => {
        player.setVelocityX(0);
        player.anims.play('turn');
        player.setVelocityY(-330);
      });
    const rightButton = this.add.sprite(300, 500, 'right')
      .setInteractive()
      .on('pointerdown', () => {
        player.setVelocityX(160);
        player.anims.play('right', true);
      })
      .on('pointerup', () => {
        player.setVelocityX(0);
      });
    const leftButton = this.add.sprite(100, 500, 'left')
      .setInteractive()
      .on('pointerdown', () => {
        player.setVelocityX(-160);
        player.anims.play('left', true);
      })
      .on('pointerup', () => {
        player.setVelocityX(0);
      });
  }

  update() {

  }
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})



export class Tab1Page implements OnInit {

  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  winH = window.innerHeight;
  winW = window.innerWidth;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: this.winW,
      height: this.winH,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      parent: 'game',
      scene: GameScene
    };
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }
}
