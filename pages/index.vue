<template>
    <div>
        <h1>CRITTER CRAWL</h1>

        <h2> Critter Crawl is a game created by Sean Yager for the Game Off 2021 hosted by Github and Lee Reilly.</h2>
        <h3>It's a chess-like board game, taking inspiration from old GBA tactics games like Final Fantasy Tactics, Fire Emblem, and Advanced Wars. </h3>
        

        <h2>Let's Play!</h2>
        <p>First, pick a board size then grab a friend!</p>

        <div>
            <p> Board Size: </p>
            <button>Short Game: 9 x 9</button>
            <button>Medium Game: 13 x 13</button>
            <button>Long Game: 15 x 15</button>
        </div>

        <p>
            Who's playing?
        </p>

        <label for="playerOne">Player One's Name:</label>
        <input type="text" id="playerOne" name="playerOne" v-model="playerOne">
        
        <label for="playerTwo">Player Two's Name:</label>
        <input type="text" id="playerTwo" name="playerTwo" v-model="playerTwo">
    </div>
</template>

<script>
    export default {
        data() {
            return {
                playerOne: '',
                playerTwo: '',
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
