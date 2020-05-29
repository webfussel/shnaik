export const MAIN_GAME_CONFIG = {
    blockSize: 20,
    blockNumber: 30,
    width() {
        return this.blockSize * this.blockNumber;
    },
    height() {
        return this.blockSize * this.blockNumber;
    }
}