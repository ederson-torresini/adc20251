/*global Phaser*/
/*eslint no-undef: "error"*/
export default class abertura extends Phaser.Scene {
  constructor() {
    super("abertura");
  }

  preload() {
    this.load.image("fundo", "assets/abertura-fundo.png");
    this.load.image("botao", "assets/botao.png");
  }

  create() {
    this.add.image(400, 225, "fundo");

    this.add
      .sprite(400, 400, "botao")
      .setInteractive()
      .on("pointerdown", () => {
        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            this.game.midias = stream;
          })
          .catch((error) => console.error(error));
        
        this.scene.stop();
        this.scene.start("precarregamento");
      });
  }
}
