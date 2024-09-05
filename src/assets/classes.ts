export class Engine {
  stockfish: Worker;
  onMessage: (callback: (messageData: Record<string, string>) => void) => void;

  constructor() {
    this.stockfish = new Worker("./stockfish.js");
    this.onMessage = (callback) => {
      this.stockfish.addEventListener("message", (e) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];

        callback({ bestMove });
      });
    };
    // Init engine
    this.stockfish.postMessage("uci");
    this.stockfish.postMessage("isready");
  }

  evaluatePosition(fen: string, depth: number) {
    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage(`go depth ${depth}`);
  }
  stop() {
    this.stockfish.postMessage("stop"); // Run when changing positions
  }
  quit() {
    this.stockfish.postMessage("quit"); // Good to run this before unmounting.
  }
}
