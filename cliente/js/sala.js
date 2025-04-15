export default class sala extends Phaser.Scene {

  constructor() {
    super('sala')
  }

  create() {
    this.scene.start('fase1')
  }
}
