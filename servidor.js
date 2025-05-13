const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;

io.on("connection", (socket) => {
  console.log(`Usuário ${socket.id} conectado no servidor`);

  socket.on("entrar-na-sala", (sala) => {
    socket.join(sala);
    console.log(`Usuário ${socket.id} entrou na sala ${sala}`);

    let jogadores = {};
    if (io.sockets.adapter.rooms.get(sala).size === 1) {
      jogadores = {
        primeiro: socket.id,
        segundo: undefined,
      };
    } else if (io.sockets.adapter.rooms.get(sala).size === 2) {
      const [primeiro] = io.sockets.adapter.rooms.get(sala);
      jogadores = {
        primeiro,
        segundo: socket.id,
      };
    }
    io.to(sala).emit("jogadores", jogadores);
  });

  socket.on("disconnect", () => {});
});

app.use(express.static("cliente/"));
server.listen(port, () => {
  console.log("Servidor rodando!");
});
