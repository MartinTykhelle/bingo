import Dexie from 'dexie';

export const db = new Dexie('bingoDatabase')

db.version(1).stores({
    tiles: "++id"
}
)

export function initData(tiles){
    console.log(tiles);
    db.table('tiles').clear();
    tiles.forEach((tileTitle)=>{
      let tile = {tileTitle: tileTitle, checked:false}  
      db.table('tiles').add(tile)
      console.log(tile);

    })
    
}

export async function toggleChecked(tileId){
    let currentState = await  db.table('tiles').get(tileId);
    console.log(currentState);
    currentState.checked = ! currentState.checked;
    await db.table('tiles').update(tileId, currentState);
    
}

export async function getData(){
    return await db.table('tiles').toArray();
}