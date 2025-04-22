export default class fase1 extends Phaser.Scene {

  constructor() {
    super('fase1')
  }

  preload() {
    this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa.json')
    this.load.image('grama', 'assets/mapa/grama.png')
    this.load.image('sombras', 'assets/mapa/sombras.png')
    this.load.image('itens', 'assets/mapa/itens.png')

    this.load.spritesheet('alien', 'assets/alien.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create() {
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    this.tilesetGrama = this.tilemapMapa.addTilesetImage('grama')
    this.tilesetSombras = this.tilemapMapa.addTilesetImage('sombras')
    this.tilesetItens = this.tilemapMapa.addTilesetImage('itens')

    this.layerChao = this.tilemapMapa.createLayer('chao', [this.tilesetGrama])
    this.layerSombras = this.tilemapMapa.createLayer('sombras', [this.tilesetSombras])
    this.layerObjetos = this.tilemapMapa.createLayer('objetos', [this.tilesetItens])

    this.alien = this.physics.add.sprite(100, 100, 'alien')

    this.layerObjetos.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.alien, this.layerObjetos)

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
