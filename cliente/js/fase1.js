export default class fase1 extends Phaser.Scene {

  constructor() {
    super('fase1')
  }

  preload() {
    this.load.spritesheet('alien', 'assets/alien.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create() {
    this.alien = this.physics.add.sprite(100, 100, 'alien')

    this.anims.create({
      key: 'alien-direita',
      frames: this.anims.generateFrameNumbers('alien', { start: 260, end: 267 }),
      frameRate: 10,
      repeat: -1
    })

    this.alien.play('alien-direita')
    this.alien.setVelocityX(100)
   }
}
