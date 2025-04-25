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

    this.scene.add("abertura", abertura);
    this.scene.add("precarregamento", precarregamento);
    this.scene.add("sala", sala);
    this.scene.add("fase1", fase1);
    this.scene.add("finalFeliz", finalFeliz);
    this.scene.add("finalTriste", finalTriste);

    this.scene.start("fase1");
  }
}

window.onload = () => {
  window.game = new Game();
};
