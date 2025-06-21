import Dexie from 'dexie';

export const db = new Dexie('bingoDatabase');

db.version(1).stores({
    tiles: '++id',
    name: '++id',
});

export function initData(tiles) {
    db.table('tiles').clear();

    for (let index = 0; index < tiles.length; index++) {
        const element = tiles[index];
        if (index === Math.floor(tiles.length / 2)) {
            db.table('tiles').add({ tileTitle: 'Free Space!', checked: true, freeSpace: true });
        }

        let tile = { tileTitle: element, checked: false, freeSpace: false };
        db.table('tiles').add(tile);
    }
}

export async function toggleChecked(tileId) {
    let currentState = await db.table('tiles').get(tileId);
    console.log(currentState);
    currentState.checked = !currentState.checked;
    await db.table('tiles').update(tileId, currentState);
}

export async function getData() {
    return await db.table('tiles').toArray();
}

export async function getName() {
    return await db.table('name').toArray();
}

export async function getCount() {
    return (await db.table('tiles').toArray()).length;
}
export async function setName(name) {
    db.table('name').clear();
    db.table('name').add({ name: name });
}

export async function getMaxLengths() {
    let stuff = (await db.table('tiles').toArray()).map((x) => x.checked);
    let maxRows = Math.ceil(Math.sqrt(stuff.length));
    let maxCols = maxRows;

    let colNum = 0;
    let rows = [];
    let columns = [];
    for (let index = 0; index < stuff.length; index++) {
        /*if (colNum === Math.floor(maxCols / 2) && rowNum === Math.floor(maxRows / 2)) {
            columns.push(true);
            colNum++;
        }*/

        let element = stuff[index];
        if (colNum >= maxCols) {
            rows.push(columns);
            columns = [];
            colNum = 0;
        }

        columns.push(element);
        colNum++;
        if (index == stuff.length - 1) {
            rows.push(columns);
        }
    }

    let lengths = Array(maxRows)
        .fill(0)
        .map(() => Array(maxCols).fill(0));

    for (let row = 0; row < lengths.length; row++) {
        for (let col = 0; col < lengths[row].length; col++) {
            let value = rows[row][col];
            let horizontal = 0;
            let vertical = 0;
            let upDiagonal = 0;
            let downDiagonal = 0;
            // at position [row][col], lets check how long we can go in ->
            if (value) {
                for (let index = col; index < maxCols; index++) {
                    if (rows[row][index]) {
                        horizontal++;
                    } else {
                        //break;
                    }
                }

                for (let index = row; index < maxRows; index++) {
                    if (rows[index][col]) {
                        vertical++;
                    } else {
                        //break;
                    }
                }

                //there are only two diagonals, for col = row and col = row - maxRows or something
                if (col === row) {
                    //downward diagonal
                    for (let index = 0; index < maxCols; index++) {
                        let pos = [index, index];
                        if (rows[pos[0]][pos[1]]) {
                            upDiagonal++;
                        } else {
                            //break;
                        }
                    }
                }
                if (col === maxRows - row - 1) {
                    //upward diagonal
                    for (let index = 0; index < maxCols; index++) {
                        let pos = [maxCols - 1 - index, index];
                        if (rows[pos[0]][pos[1]]) {
                            downDiagonal++;
                        } else {
                            //break;
                        }
                    }
                }
            }
            lengths[row][col] = Math.max(horizontal, vertical, upDiagonal, downDiagonal);
        }
    }
    return [Math.max(...lengths.flat()), stuff.filter((x) => x).length];
}
