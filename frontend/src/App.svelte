<script>
    import { onMount } from 'svelte';
    import { liveQuery } from 'dexie';
    import { db, getName, setName, initData, getData, getCount, getMaxLengths, toggleChecked } from './lib/db';
    import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';
    import Tile from './lib/Tile.svelte';

    // @ts-ignore
    var socket = io();
    let inputName;
    let hasBingo = false;
    $: bingo = liveQuery(async () => {
        return getData();
    });

    $: count = liveQuery(async () => {
        return await getCount();
    });

    let bingoLength = [];
    socket.on('message', (message) => {
        toasts.add({
            title: message.title,
            description: message.text,
            duration: 3000, // 0 or negative to avoid auto-remove
            placement: 'bottom-right',
            type: 'info',
            theme: 'dark',
            showProgress: true,
            // component: BootstrapToast, // allows to override toast component/template per toast
        });
    });
    async function button() {
        await fetchData();
    }

    async function fetchData() {
        let rawData;
        rawData = await fetch('/data/').then((x) => x.json());
        initData(rawData);
    }

    async function clickTile(id) {
        if (!hasBingo) {
            await toggleChecked(id);
            bingoLength = await getMaxLengths();
            hasBingo = bingoLength[0] === 5;
            socket.emit('status', { name: name, length: bingoLength });
        }
        console.log(hasBingo);
    }
    let name;
    getName().then((value) => {
        try {
            name = value[0].name;
        } catch (error) {
            name = undefined;
        }
    });
    async function submitName() {
        setName(inputName);
        name = inputName;
    }
</script>

<main>
    {#if !name}
        I don't know you... <br />
        <input bind:value={inputName} placeholder="Your Name" />
        <button on:click={submitName}>Submit</button>
    {:else}
        <div class="grid-container" style="grid-template-columns: repeat({Math.floor(Math.sqrt($count))}, 1fr);">
            {#if $bingo}
                {#each $bingo as bingoTile (bingoTile.id)}
                    <Tile {bingoTile} {clickTile}></Tile>
                {:else}
                    <button on:click={fetchData}> Get a bingo card!</button>
                {/each}
            {/if}
        </div>
    {/if}
    <ToastContainer let:data>
        <FlatToast {data} />
    </ToastContainer>
</main>

<style>
    .grid-container {
        display: inline-grid;
        background-color: black;
        border: 10px solid black;
        border-radius: 12px;
    }
</style>
