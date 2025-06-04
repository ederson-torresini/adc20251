/*global Phaser*/
/*eslint no-undef: "error"*/
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
    this.load.setPath("assets/");

    this.load.image("grama", "mapa/grama.png");
    this.load.image("sombras", "mapa/sombras.png");
    this.load.image("itens", "mapa/itens.png");
    this.load.image("fundo", "abertura-fundo.png");

    this.load.spritesheet("tobias", "tobias.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("lola", "lola.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("mapa", "mapa.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.audio("trilha-sonora-fase1", "trilha-sonora-fase1.mp3");
    this.load.audio("sussurro", "sussurro.mp3");
  }

  create() {
    this.scene.start("sala");
  }
}
