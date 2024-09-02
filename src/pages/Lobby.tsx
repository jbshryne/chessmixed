import socket from "../assets/socket";

const joinRoom = () => {
  console.log("joining room");
  socket.emit("joinRoom", "room");
};

const Lobby = () => {
  return (
    <div>
      <button onClick={() => joinRoom()}></button>
    </div>
  );
};

export default Lobby;
