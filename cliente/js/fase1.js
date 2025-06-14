/*global Phaser*/
/*eslint no-undef: "error"*/
export default class fase1 extends Phaser.Scene {
  constructor() {
    super("fase1");

    this.threshold = 0.1;
    this.speed = 100;
    this.direcaoAtual = undefined;
  }

  preload() {
    this.load.tilemapTiledJSON("mapa", "assets/mapa/mapa.json");
    this.load.image("grama", "assets/mapa/grama.png");
    this.load.image("sombras", "assets/mapa/sombras.png");
    this.load.image("itens", "assets/mapa/itens.png");

    this.load.spritesheet("tobias", "assets/tobias.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("lola", "assets/lola.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.plugin(
      "rexvirtualjoystickplugin",
      "./js/rexvirtualjoystickplugin.min.js",
      true,
    );

    this.load.spritesheet("tela-cheia", "assets/tela-cheia.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.audio("trilha-sonora-fase1", "assets/trilha-sonora-fase1.mp3");
    this.load.audio("sussurro", "assets/sussurro.mp3");
  }

  create() {
    this.trilha = this.sound.add("trilha-sonora-fase1", { loop: true }).play();
    this.sussurro = this.sound.add("sussurro");

    this.tilemapMapa = this.make.tilemap({ key: "mapa" });

    this.tilesetGrama = this.tilemapMapa.addTilesetImage("grama");
    this.tilesetSombras = this.tilemapMapa.addTilesetImage("sombras");
    this.tilesetItens = this.tilemapMapa.addTilesetImage("itens");

    this.layerChao = this.tilemapMapa.createLayer("chao", [this.tilesetGrama]);
    this.layerSombras = this.tilemapMapa.createLayer("sombras", [
      this.tilesetSombras,
    ]);
    this.layerObjetos = this.tilemapMapa.createLayer("objetos", [
      this.tilesetItens,
    ]);

    if (this.game.jogadores.primeiro === this.game.socket.id) {
      this.game.remoteConnection = new RTCPeerConnection(this.game.iceServers);
      this.game.dadosJogo = this.game.remoteConnection.createDataChannel(
        "dadosJogo",
        { negotiated: true, id: 0 },
      );

      this.game.remoteConnection.onicecandidate = ({ candidate }) => {
        this.game.socket.emit("candidate", this.game.sala, candidate);
      };

      this.game.remoteConnection.ontrack = ({ streams: [stream] }) => {
        this.game.audio.srcObject = stream;
      };

      if (this.game.midias) {
        this.game.midias
          .getTracks()
          .forEach((track) =>
            this.game.remoteConnection.addTrack(track, this.game.midias),
          );
      }

      this.game.socket.on("offer", (description) => {
        this.game.remoteConnection
          .setRemoteDescription(description)
          .then(() => this.game.remoteConnection.createAnswer())
          .then((answer) =>
            this.game.remoteConnection.setLocalDescription(answer),
          )
          .then(() =>
            this.game.socket.emit(
              "answer",
              this.game.sala,
              this.game.remoteConnection.localDescription,
            ),
          );
      });

      this.game.socket.on("candidate", (candidate) => {
        this.game.remoteConnection.addIceCandidate(candidate);
      });

      this.personagemLocal = this.physics.add.sprite(100, 100, "tobias");
      this.personagemRemoto = this.add.sprite(100, 150, "lola");
    } else if (this.game.jogadores.segundo === this.game.socket.id) {
      this.game.localConnection = new RTCPeerConnection(this.game.iceServers);
      this.game.dadosJogo = this.game.localConnection.createDataChannel(
        "dadosJogo",
        { negotiated: true, id: 0 },
      );

      this.game.localConnection.onicecandidate = ({ candidate }) => {
        this.game.socket.emit("candidate", this.game.sala, candidate);
      };

      this.game.localConnection.ontrack = ({ streams: [stream] }) => {
        this.game.audio.srcObject = stream;
      };

      if (this.game.midias) {
        this.game.midias
          .getTracks()
          .forEach((track) =>
            this.game.localConnection.addTrack(track, this.game.midias),
          );
      }

      this.game.localConnection
        .createOffer()
        .then((offer) => this.game.localConnection.setLocalDescription(offer))
        .then(() =>
          this.game.socket.emit(
            "offer",
            this.game.sala,
            this.game.localConnection.localDescription,
          ),
        );

      this.game.socket.on("answer", (description) => {
        this.game.localConnection.setRemoteDescription(description);
      });

      this.game.socket.on("candidate", (candidate) => {
        this.game.localConnection.addIceCandidate(candidate);
      });

      this.personagemLocal = this.physics.add.sprite(100, 150, "lola");
      this.personagemRemoto = this.add.sprite(100, 100, "tobias");
    } else {
      window.alert("Sala cheia!");
      this.scene.stop();
      this.scene.start("sala");
    }

    this.game.dadosJogo.onopen = () => {
      console.log("Conexão de dados aberta!");
    };

    // Processa as mensagens recebidas via DataChannel
    this.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data);

      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x;
        this.personagemRemoto.y = dados.personagem.y;
        this.personagemRemoto.setFrame(dados.personagem.frame);
      }
    };

    this.cameras.main.startFollow(this.personagemLocal);

    this.layerObjetos.setCollisionByProperty({ collides: true });
    this.physics.add.collider(
      this.personagemLocal,
      this.layerObjetos,
      () => {
        this.sussurro.play();
      },
      null,
      this,
    );

    this.anims.create({
      key: "personagem-parado-cima",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 28,
          end: 28,
        },
      ),
      frameRate: 1,
    });

    this.anims.create({
      key: "personagem-parado-baixo",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 14,
          end: 14,
        },
      ),
      frameRate: 1,
    });

    this.anims.create({
      key: "personagem-parado-esquerda",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 36,
          end: 36,
        },
      ),
      frameRate: 1,
    });

    this.anims.create({
      key: "personagem-parado-direita",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 52,
          end: 52,
        },
      ),
      frameRate: 1,
    });

    this.anims.create({
      key: "personagem-cavando-cima",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 28,
          end: 35,
        },
      ),
      frameRate: 10,
      repeat: 3,
    });

    this.anims.create({
      key: "personagem-cavando-baixo",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 44,
          end: 51,
        },
      ),
      frameRate: 10,
      repeat: 3,
    });

    this.anims.create({
      key: "personagem-cavando-esquerda",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 36,
          end: 43,
        },
      ),
      frameRate: 10,
      repeat: 3,
    });

    this.anims.create({
      key: "personagem-cavando-direita",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 52,
          end: 59,
        },
      ),
      frameRate: 10,
      repeat: 3,
    });

    this.anims.create({
      key: "personagem-andando-cima",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 60,
          end: 68,
        },
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "personagem-andando-baixo",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 78,
          end: 86,
        },
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "personagem-andando-esquerda",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 69,
          end: 77,
        },
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "personagem-andando-direita",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 87,
          end: 95,
        },
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "personagem-correndo-cima",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 236,
          end: 243,
        },
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "personagem-correndo-baixo",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 252,
          end: 259,
        },
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "personagem-correndo-esquerda",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 244,
          end: 251,
        },
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "personagem-correndo-direita",
      frames: this.anims.generateFrameNumbers(
        this.personagemLocal.texture.key,
        {
          start: 260,
          end: 267,
        },
      ),
      frameRate: 10,
      repeat: -1,
    });

    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 200,
      y: 310,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc),
    });

    this.contador = 1200;
    this.contadorTexto = this.add
      .text(10, 10, `Iniciando...`, {
        fontSize: "32px",
        fill: "#fff",
      })
      .setScrollFactor(0);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.contador--;
        const minutos = Math.floor(this.contador / 60);
        const segundos = Math.floor(this.contador % 60);
        this.contadorTexto.setText(
          `Tempo restante: ${String(minutos).padStart(2, "0")}:${String(
            segundos,
          ).padStart(2, "0")}`,
        );
        if (this.contador <= 0) {
          this.trilha.stop();
          this.scene.stop();
          this.scene.start("finalTriste");
        }
      },
      callbackScope: this,
      loop: true,
    });

    this.telaCheia = this.add
      .sprite(750, 50, "tela-cheia", 0)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
          this.telaCheia.setFrame(0);
        } else {
          this.scale.startFullscreen();
          this.telaCheia.setFrame(1);
        }
      })
      .setScrollFactor(0);
  }

  update() {
    const angle = Phaser.Math.DegToRad(this.joystick.angle);
    const force = this.joystick.force;

    if (force > this.threshold) {
      var velocityX = Math.cos(angle) * this.speed;
      var velocityY = Math.sin(angle) * this.speed;
      var movimento = "andando";

      if (this.personagemLocal.texture.key === "lola") {
        velocityX *= 2;
        velocityY *= 2;
        movimento = "correndo";
      }

      this.personagemLocal.setVelocity(velocityX, velocityY);

      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > 0) {
          this.personagemLocal.anims.play(
            "personagem-" + movimento + "-direita",
            true,
          );
          this.direcaoAtual = "direita";
        } else {
          this.personagemLocal.anims.play(
            "personagem-" + movimento + "-esquerda",
            true,
          );
          this.direcaoAtual = "esquerda";
        }
      } else {
        if (velocityY > 0) {
          this.personagemLocal.anims.play(
            "personagem-" + movimento + "-baixo",
            true,
          );
          this.direcaoAtual = "baixo";
        } else {
          this.personagemLocal.anims.play(
            "personagem-" + movimento + "-cima",
            true,
          );
          this.direcaoAtual = "cima";
        }
      }
    } else {
      this.personagemLocal.setVelocity(0);
      switch (this.direcaoAtual) {
        case "baixo":
          this.personagemLocal.anims.play("personagem-parado-baixo");
          break;
        case "direita":
          this.personagemLocal.anims.play("personagem-parado-direita");
          break;
        case "esquerda":
          this.personagemLocal.anims.play("personagem-parado-esquerda");
          break;
        case "cima":
          this.personagemLocal.anims.play("personagem-parado-cima");
          break;
      }
    }

    try {
      if (this.game.dadosJogo.readyState === "open") {
        if (this.personagemLocal) {
          this.game.dadosJogo.send(
            JSON.stringify({
              personagem: {
                x: this.personagemLocal.x,
                y: this.personagemLocal.y,
                frame: this.personagemLocal.frame.name,
              },
            }),
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
