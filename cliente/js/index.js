/*global Phaser, io*/
/*eslint no-undef: "error"*/
import config from "./config.js";
import abertura from "./abertura.js";
import precarregamento from "./precarregamento.js";
import sala from "./sala.js";
import fase1 from "./fase1.js";
import finalFeliz from "./final-feliz.js";
import finalTriste from "./final-triste.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.audio = document.querySelector("audio");
    this.iceServers = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    this.socket = io();

    this.socket.on("connect", () => {
      console.log(`Usuário ${this.socket.id} conectado no servidor`);
    });

    this.scene.add("abertura", abertura);
    this.scene.add("precarregamento", precarregamento);
    this.scene.add("sala", sala);
    this.scene.add("fase1", fase1);
    this.scene.add("finalFeliz", finalFeliz);
    this.scene.add("finalTriste", finalTriste);

    this.scene.start("abertura");
  }
}

window.onload = () => {
  window.game = new Game();
};
