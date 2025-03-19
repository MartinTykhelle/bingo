<script>
    export let bingoTile;
    export let clickTile;

    async function click() {
        if (!bingoTile.freeSpace) {
            await clickTile(bingoTile.id);
        }
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="tile" class:clicked={bingoTile.checked} on:click={click}>
    {bingoTile.tileTitle}
</div>

<style>
    .tile {
        height: 80px;
        width: 80px;
        border: 1px solid white;
        background: black;
        color: white;
        border-radius: 2px;
        font-size: smaller;
        cursor: pointer;
    }
    .tile:hover {
        background: #cccccc;
    }
    .clicked,
    .clicked:hover {
        background: red;
    }
</style>
