/*global Phaser*/
/*eslint no-undef: "error"*/
export default class abertura extends Phaser.Scene {
  constructor() {
    super("abertura");
  }

  preload() {
    this.load.image("fundo", "assets/abertura-fundo.png");
    this.load.image("vazio", "assets/vazio.png");
  }

  create() {
    this.add.image(225, 225, "fundo");

    this.botao = this.physics.add
      .sprite(210, 265, "vazio")
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

    this.titulo = this.add.text(580, 420, "Mapa do\nTesouro", {
      fontFamily: "monospace",
      fontSize: "96px",
      color: "#ffffff",
    }).rotation = Phaser.Math.DegToRad(270);
  }
}
