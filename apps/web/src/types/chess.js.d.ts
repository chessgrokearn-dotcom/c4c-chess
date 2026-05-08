declare module 'chess.js' {
  export class Chess {
    constructor(fen?: string);
    fen(): string;
    moves(options?: { square: string } | { verbose: boolean }): string[] | any[];
    move(move: string | { from: string; to: string; promotion?: string }): any;
    undo(): any;
    reset(): void;
    load(fen: string): boolean;
    game_over(): boolean;
    in_check(): boolean;
    in_checkmate(): boolean;
    in_draw(): boolean;
    in_stalemate(): boolean;
    in_threefold_repetition(): boolean;
    insufficient_material(): boolean;
    turn(): 'w' | 'b';
    board(): any[][];
    history(options?: { verbose: boolean }): any[];
    pgn(options?: { newline?: string; max_width?: number }): string;
  }
}
