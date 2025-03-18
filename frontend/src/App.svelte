<script>
    import { onMount } from 'svelte';
    import { liveQuery } from 'dexie';
    import { db, initData, toggleChecked, getData, getCount, getMaxLengths } from './lib/db';
    import Tile from './lib/Tile.svelte';

    // @ts-ignore
    var socket = io();

    $: bingo = liveQuery(async () => {
        return getData();
    });

    $: count = liveQuery(async () => {
        return await getCount();
    });

    async function button() {
        console.log(bingo.getValue().map((x) => x.checked));
    }
    async function fetchData() {
        let rawData;
        rawData = await fetch('/data/').then((x) => x.json());
        initData(rawData);
    }
</script>

<main>
    <button on:click={button}> button!</button>
    <div class="grid-container" style="grid-template-columns: repeat({Math.floor(Math.sqrt($count))}, 1fr);">
        {#if $bingo}
            {#each $bingo as bingoTile (bingoTile.id)}
                <Tile {bingoTile}></Tile>
            {:else}
                <button on:click={fetchData}> Get a bingo card!</button>
            {/each}
        {/if}
    </div>
</main>

<style>
    .grid-container {
        display: inline-grid;
    }
</style>
