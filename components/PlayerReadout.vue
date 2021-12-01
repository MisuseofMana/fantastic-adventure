<template>
    <div class="mr-2 mt-2 p-2 flexColumn">
        <h2>{{ playerName }}</h2>
        <h3 v-if="yourTurn"> IT'S YOUR TURN </h3>
        <h3 v-if="!yourTurn"> WAIT YOUR TURN </h3>
    </div>
</template>

<script>

export default {
    props: ['yourTurn', 'playerName'],
}
</script>