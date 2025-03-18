<script>
  import { onMount } from 'svelte';
  import { liveQuery } from "dexie";
  import { db, initData, toggleChecked,getData} from "./lib/db";
  import Tile from './lib/Tile.svelte';

  var socket = io();


  $: bingo = liveQuery(async() =>{
    return getData()
  })

  async function fetchData(){    
    let rawData;
		rawData = await fetch('/data/').then((x) => x.json());
    initData(rawData)
	};

</script>

<main>

  {#if $bingo}
    {#each $bingo as bingoTile(bingoTile.id)}
    <Tile {bingoTile}></Tile>
    {:else}
    
  <button on:click={fetchData}> Get a bingo card!</button>
    {/each}
    {/if}

</main>

<style>

</style>
