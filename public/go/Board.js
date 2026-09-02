class Board {
    constructor(rows, cols, player) {
        this.rows = rows;
        this.cols = cols;
        this.player = player;
        this.pts = new Array(rows * cols).fill(null);
        this.blackScore = 0;
        this.whiteScore = 0;
        this.prevBoardState = null;
        this.consecutivePasses = 0;
        this.gameOver = false;
        this.lastMove = null;
    }

    getPts() {
        return this.pts;
    }

    setPoint(row, col, piece) {
        this.pts[(row * this.cols) + col] = piece;
    }

    changePlayer() {
        this.player = 1 - this.player;
    }

    rowOf(move) {
        return (move - this.colOf(move)) / this.rows;
    }

    colOf(move) {
        return move % this.cols;
    }

    getLoc(row, col) {
        return (row * this.rows) + col;
    }

    occupiedHuh(move) {
        return this.pts[move] === 0 || this.pts[move] === 1;
    }

    getColor() {
        return this.player;
    }

    getOppColor() {
        return 1 - this.player;
    }

    getState() {
        return JSON.stringify(this.pts);
    }

    offBoard(loc, hDir, vDir) {
        if ((loc + hDir) < 0 || (loc + hDir) > this.pts.length - 1) return true;
        if ((loc + (vDir * this.cols)) < 0 || (loc + (vDir * this.cols)) > this.pts.length - 1) return true;
        if (hDir < 0 && loc % this.cols === 0) return true;
        if (hDir > 0 && loc % this.cols === this.cols - 1) return true;
        return false;
    }

    /*
     * Recursively checks if the stone at `loc` has any liberties in the given direction.
     * vDir/hDir are each -1, 0, or 1; only one should be non-zero at a time.
     * Returns true if surrounded (no liberties found), false if a liberty exists.
     */
    checkSurrInDir(loc, vDir, hDir, color, checked) {
        const listPos = loc + (vDir * this.cols) + hDir;

        if (this.offBoard(loc, hDir, vDir)) return true;

        if (this.pts[listPos] === color) {
            if (checked[listPos]) {
                return this.checkSurrInDir(listPos, vDir, hDir, color, checked);
            }
            return this.checkSurr(listPos, color, checked) &&
                   this.checkSurrInDir(listPos, vDir, hDir, color, checked);
        }

        if (this.pts[listPos] === null) return false;

        return true;
    }

    checkSurr(loc, color, checked) {
        checked[loc] = true;
        return this.checkSurrInDir(loc,  1,  0, color, checked) &&
               this.checkSurrInDir(loc, -1,  0, color, checked) &&
               this.checkSurrInDir(loc,  0,  1, color, checked) &&
               this.checkSurrInDir(loc,  0, -1, color, checked);
    }

    initCheckSurr(loc, color) {
        const checked = new Array(this.cols * this.rows).fill(false);
        return this.checkSurr(loc, color, checked);
    }

    checkAllSurr(color) {
        const s = new Array(this.cols * this.rows).fill(false);
        for (let i = 0; i < this.pts.length; i++) {
            if (this.pts[i] === color && this.initCheckSurr(i, color)) {
                s[i] = true;
            }
        }
        return s;
    }

    isSuicide(logCol, logRow) {
        return this.initCheckSurr(this.getLoc(logRow, logCol), this.getColor());
    }

    /*
     * Flood-fill territory scoring (Japanese rules).
     * Empty regions bordered by only one color count as that color's territory.
     */
    calculateTerritory() {
        const visited = new Array(this.pts.length).fill(false);
        let blackTerritory = 0;
        let whiteTerritory = 0;

        for (let i = 0; i < this.pts.length; i++) {
            if (this.pts[i] !== null || visited[i]) continue;

            const region = [];
            const borders = new Set();
            const stack = [i];

            while (stack.length > 0) {
                const cur = stack.pop();
                if (visited[cur]) continue;
                visited[cur] = true;
                region.push(cur);

                const neighbors = [
                    cur >= this.cols ? cur - this.cols : -1,
                    cur + this.cols < this.pts.length ? cur + this.cols : -1,
                    cur % this.cols > 0 ? cur - 1 : -1,
                    cur % this.cols < this.cols - 1 ? cur + 1 : -1,
                ];

                for (const n of neighbors) {
                    if (n === -1) continue;
                    if (this.pts[n] === null && !visited[n]) {
                        stack.push(n);
                    } else if (this.pts[n] !== null) {
                        borders.add(this.pts[n]);
                    }
                }
            }

            if (borders.size === 1) {
                const owner = borders.values().next().value;
                if (owner === 0) blackTerritory += region.length;
                else whiteTerritory += region.length;
            }
        }

        return { blackTerritory, whiteTerritory };
    }
}
