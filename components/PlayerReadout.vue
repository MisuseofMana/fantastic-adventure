<template>
    <div class="mr-2 mt-2 p-2 flexColumn">
        <h2>{{ playerName }}</h2>
        <h3 v-if="yourTurn"> IT'S YOUR TURN </h3>
        <h3 v-if="!yourTurn"> WAIT YOUR TURN </h3>
        
        <!-- CHOOSE YOUR TEAM -->
        <div v-if="chooseTeam">
            <p class="mb-2">Please choose your team.</p>
            <div>
                <v-card
                    hover
                    class="mb-5 pa-5 text-center d-flex flex-column justify-center align-center"
                    v-for="(collection, index) in bugCollections"
                    :key="'bugCollection' + index"
                    @click="chooseTeam(collection.teamName)"
                >
                    <v-row>
                        <v-col cols="12">
                            <p class="mr-1">{{collection.teamName}}</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="d-flex" cols="12">
                            <div v-for="(bug, index) in  collection.roster" :key="'typeOfBug' + index">
                                <img height="40" width="40" :src="require(`@/assets/images/bugs/${bug}.gif`)" :alt="bug"/>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </div>
        </div>

        <div v-if="teamComposition">
            <p class="mb-2">You are the {{ teamComposition }}.</p>
        </div>

        <p v-if="playerMoves > 0">You have {{ playerMoves }} moves left.</p>
    </div>
</template>

<script>
import { bugCollections } from '@/bugTypes/bugCollections.js'

export default {
    data(){
        return {
            bugCollections,
            teamComposition: null,
        }
    },
    props: ['yourTurn', 'chooseTeam', 'playerMoves', 'playerName'],
    methods: {
        chooseTeam(teamName) {
            this.teamComposition = teamName
            this.$emit('picked-team', teamName)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>