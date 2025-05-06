export default class precarregamento extends Phaser.Scene {
  constructor() {
    super("precarregamento");
  }

  init() {
    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff);
    const progresso = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff);
    this.load.on("progress", (progress) => {
      progresso.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.image("grama", "assets/mapa/grama.png");
    this.load.image("sombras", "assets/mapa/sombras.png");
    this.load.image("itens", "assets/mapa/itens.png");
    this.load.image("fundo", "assets/abertura-fundo.png");
    this.load.spritesheet("alien", "assets/alien.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.audio("trilha-sonora", "assets/trilha-sonora.mp3");
    this.load.audio("zumbi", "assets/zumbi.mp3");
  }

  create() {
    this.scene.start("sala");
  }
}
