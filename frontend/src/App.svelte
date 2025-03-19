<script>
    import { onMount } from 'svelte';
    import { liveQuery } from 'dexie';
    import { db, initData, getData, getCount, getMaxLengths, toggleChecked } from './lib/db';
    import Tile from './lib/Tile.svelte';

    // @ts-ignore
    var socket = io();

    $: bingo = liveQuery(async () => {
        return getData();
    });

    $: count = liveQuery(async () => {
        return await getCount();
    });

    let bingoLength = 0;

    async function button() {
        await fetchData();
    }

    async function fetchData() {
        let rawData;
        rawData = await fetch('/data/').then((x) => x.json());
        initData(rawData);
    }

    async function clickTile(id) {
        await toggleChecked(id);
        bingoLength = await getMaxLengths();
    }
</script>

<main>
    <button on:click={button}> button!</button>
    <div class="grid-container" style="grid-template-columns: repeat({Math.floor(Math.sqrt($count))}, 1fr);">
        {#if $bingo}
            {#each $bingo as bingoTile (bingoTile.id)}
                <Tile {bingoTile} {clickTile}></Tile>
            {:else}
                <button on:click={fetchData}> Get a bingo card!</button>
            {/each}
        {/if}
    </div>
    {bingoLength}
</main>

<style>
    .grid-container {
        display: inline-grid;
    }
</style>
