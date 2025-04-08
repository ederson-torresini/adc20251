export default class precarregamento extends Phaser.Scene {

  constructor() {
    super('precarregamento')
  }

  init() { }

  preload() { }

  create() {
    this.scene.start('sala')
  }

  update() { }
}
