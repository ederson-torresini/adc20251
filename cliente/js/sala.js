/*global Phaser*/
/*eslint no-undef: "error"*/
export default class sala extends Phaser.Scene {
  constructor() {
    super("sala");
  }

  preload() {
    this.load.image("WaitingInVain", "assets/WaitingInVain.png");

    this.load.spritesheet("botao", "assets/botao.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.salas = [
      { x: 200, y: 200, numero: "1", sprite: 20 },
      { x: 300, y: 200, numero: "2", sprite: 22 },
      { x: 400, y: 200, numero: "3", sprite: 24 },
      { x: 500, y: 200, numero: "4", sprite: 31 },
      { x: 600, y: 200, numero: "5", sprite: 33 },
    ];

    this.salas.forEach((sala) => {
      sala.botao = this.add
        .sprite(sala.x, sala.y, "botao", sala.sprite)
        .setInteractive()
        .on("pointerdown", () => {
          this.game.sala = sala.numero;
          this.game.socket.emit("entrar-na-sala", this.game.sala);

          this.add.image(400, 225, "WaitingInVain");

          this.salas.forEach((sala) => {
            sala.botao.destroy();
          });
        });
    });

    this.game.socket.on("jogadores", (jogadores) => {
      if (jogadores.segundo) {
        this.game.jogadores = jogadores;
        this.scene.stop();
        this.scene.start("fase1");
      }
    });
  }
}
