declare module 'chessboardjs' {
  interface ChessboardConfig {
    position?: string
    draggable?: boolean
    dropOffBoard?: string
    sparePieces?: boolean
    onDrop?: (source: string, target: string) => string | undefined
  }

  interface ChessboardInstance {
    position(fen?: string): string
    destroy(): void
  }

  function Chessboard(container: HTMLElement | string, config?: ChessboardConfig): ChessboardInstance

  export default Chessboard
}