/*global Phaser*/
/*eslint no-undef: "error"*/
export default class sala extends Phaser.Scene {
  constructor() {
    super("sala");
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("sala")) {
      this.game.sala = urlParams.get("sala");
      console.log("Sala já selecionada:", this.game.sala);
    }
  }

  create() {
    this.salas = [];

    if (this.game.sala) {
      this.game.socket.emit("entrar-na-sala", this.game.sala);
    } else {
      this.salas = [
        { x: 200, y: 200, numero: "1" },
        { x: 300, y: 200, numero: "2" },
        { x: 400, y: 200, numero: "3" },
        { x: 500, y: 200, numero: "4" },
        { x: 600, y: 200, numero: "5" },
      ];

      this.salas.forEach((sala) => {
        sala.botao = this.add
          .text(sala.x, sala.y, sala.numero)
          .setInteractive()
          .on("pointerdown", () => {
            this.game.sala = sala.numero;
            this.game.socket.emit("entrar-na-sala", this.game.sala);
          });
      });
    }

    this.game.socket.on("jogadores", (jogadores) => {
      if (jogadores.segundo) {
        this.game.jogadores = jogadores;
        this.scene.stop();
        this.scene.start("fase1");
      } else if (jogadores.primeiro) {
        this.salas.forEach((sala) => {
          sala.botao.destroy();
        });
        this.add.text(10, 10, `Aguardando na sala ${this.game.sala}...`);
      }
    });
  }
}
