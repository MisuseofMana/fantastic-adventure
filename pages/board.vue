<template>
<v-app>
    <v-container>
        <v-main>
            <v-row justify="center" class="text-center">
                <v-col cols="12">
                    <h1>CRITTER CRAWL</h1>
                </v-col>
            </v-row>

            <v-row no-gutters>
                <v-spacer></v-spacer>
                <v-col cols="1" class="d-flex justify-end">
                    <PlayerReadout
                        :playerName="playerOne.name"
                        :yourTurn="playerOne.activeTurn"
                        :chooseTeam="playerOne.isChoosingTeam"
                        :playerMoves="playerOne.movesLeft"
                        :teamComposition="playerOne.selectedTeam"
                        @picked-team="setTeam($event)"
                    />
                </v-col>
                <v-col cols="8">
                        <v-row align="center" justify="center" v-for="(row, rowIndex) in gameGrid" :key="`gridCol${rowIndex}`" no-gutters class="align-center">
                            <v-col
                                v-for="(col, colIndex) in gameGrid[rowIndex]" 
                                :key="`gridRow${colIndex}`" 
                                @click="checkMovement(rowIndex, colIndex)"
                            >
                                <v-card 
                                :color="squareColor(col)"
                                height="42" width="42" :hover="canHover(col)" outlined class="margin-1px"
                                >
                                    <img v-if="(col.name !== '' && !col.activeSquare)" height="40" width="40" :src="require(`@/assets/images/bugs/${col.name}.png`)" :alt="col.name"/>
                                    <img v-if="(col.name !== '' && col.activeSquare)" height="40" width="40" :src="require(`@/assets/images/bugs/${col.name}.gif`)" :alt="col.name"/>
                                </v-card>
                            </v-col>
                        </v-row>
                </v-col>
                <v-col cols="1">
                    <PlayerReadout
                        :playerName="playerTwo.name"
                        :yourTurn="playerTwo.activeTurn"
                        :chooseTeam="playerTwo.isChoosingTeam"
                        :playerMoves="playerTwo.movesLeft"
                        :teamComposition="playerTwo.selectedTeam"
                    />
                </v-col>
                <v-spacer></v-spacer>
            </v-row>
        </v-main>
    </v-container>
</v-app>
</template>

<script>
import { smallBugs } from '@/bugTypes/smallBugs.js'
import { mediumBugs } from '@/bugTypes/mediumBugs.js'
import { bigBugs } from '@/bugTypes/bigBugs.js'

export default {
    data(){
        return {
            playerOne: {
                name: 'Bugboy',
                activeTurn: true,
                isChoosingTeam: true,
                movesLeft: 5,
                selectedTeam: null,
            },
            playerTwo: {
                name: 'King Cricket',
                activeTurn: false,
                isChoosingTeam: false,
                movesLeft: 0,
                selectedTeam: null,
            },
            boardSize:15,
            gameGrid: [],
            registeredSquare:[],
            bugs: [
                'grub',
                'ant',
                'worm',
                'inchworm',
                'ladybug',
                'mosquito',
                'spider',
                'mantis',
                'dragonfly',
            ],
            symbols: {
                grub: 'G',
                ant: 'A',
                worm: 'W',
                caterpillar: "C"
            }
        }
    },
    methods: {
        setTeam(event){
            console.log()
        },
        squareColor(square){
            if(square.acceptableMovement) return '#09f'
            else if(square.activeSquare) return '#fd3'
            else if(square.acceptableAttack) return '#f46'
            else if(square.name === '') return '#ddd'
            else if (square.name) return '#fff'
        },
        canHover(square) {
            if(square.acceptableMovement) return true
            else if(square.activeSquare) return true
            else if(square.acceptableAttack) return true
            else if(square.name === '') return false
            else if (square.name) return true
        },
        rollTable() {
            let gameGridArray = []
            for(let row = 0; row < this.boardSize; row++) {
                gameGridArray.push([])
                for(let column = 0; column < this.boardSize; column++) {
                    const randomSelection = this.randomNumber(this.bugs.length)
                    const bugName = this.bugs[randomSelection]
                    if(row % 3 === 1 && column % 2 === 1) {
                        gameGridArray[row].push(
                            {
                                rowIndex: row,
                                columnIndex: column,
                                movementPattern:this.allBugs[bugName]?.movementPattern || null,
                                attackPattern:this.allBugs[bugName]?.attackPattern || null,
                                name: bugName,
                                acceptableMovement: false,
                                acceptableAttack: false,
                                movementCost: this.allBugs[bugName]?.movementCost || null,
                                attackCost: this.allBugs[bugName]?.attackCost || null
                            }
                        )
                    }
                    else {
                        gameGridArray[row].push(
                            {
                                rowIndex: row,
                                columnIndex: column,
                                movementPattern: null,
                                attackPattern: null,
                                name: '',
                                acceptableMovement: false,
                                acceptableAttack: false,
                            }
                        )
                    }
                }
            }       
            this.gameGrid = gameGridArray
        },
        sentenceCase(stringInput) {
            return stringInput[0].toUpperCase() + stringInput.slice(1)
        },
        randomNumber(max) {
            return Math.floor(Math.random()*max)
        },
        checkMovement(row, column){
            const clickedSquare = this.gameGrid[row][column]
            const { movementPattern, attackPattern, activeSquare, acceptableMovement, acceptableAttack, name, movementCost, attackCost } = clickedSquare
            // a non-active square is clicked and is not currently an acceptable movement or attack option
            // it is also not an empty square, (it has a name and living bug)
            // reset the board indicators, hilight a new active square, add new movement indicators
            if (!activeSquare && !acceptableMovement && !acceptableAttack && name !== '' && (this.currentPlayer.movesLeft >= movementCost || this.currentPlayer.movesLeft >= attackCost)){
                this.resetIcons()
                this.gameGrid[row][column].activeSquare = true
                this.registeredSquare = [row, column]
                if(this.currentPlayer.movesLeft >= movementCost) {
                    this.findAvailableMovementLocations(movementPattern, clickedSquare.rowIndex, clickedSquare.columnIndex)
                }
                if(this.currentPlayer.movesLeft >= attackCost){
                    this.findAvailableAttackLocations(attackPattern, clickedSquare.rowIndex, clickedSquare.columnIndex)
                }
            }
            // a player clicks an already active square, just reset all board indicators
            else if (activeSquare) {
                this.resetIcons()
            }
            // a square is clicked and is acceptable to be moved to
            // swap the icons between the active and clicked squares
            else if(acceptableMovement) {
                this.moveSquare(clickedSquare)
            }
            else if(acceptableAttack) {
                this.squashBug()
                this.resetIcons()
            }
        },
        moveSquare(clickedSquare) {
            this.gameGrid[clickedSquare.rowIndex][clickedSquare.columnIndex] = {
                ...this.gameGrid[this.registeredSquare[0]][this.registeredSquare[1]],
                rowIndex: clickedSquare.rowIndex,
                columnIndex: clickedSquare.columnIndex
            }
            this.gameGrid[this.registeredSquare[0]][this.registeredSquare[1]] = {
                ...this.gameGrid[this.registeredSquare[0]][this.registeredSquare[1]],
                movementPattern: null,
                attackPattern: null,
                name: '',
                acceptableMovement: false,
                acceptableAttack: false,
            }
            this.useMovement(this.gameGrid[this.registeredSquare[0]][this.registeredSquare[1]].movementCost)
            this.resetIcons()
        },
        squashBug(clickedSquare) {
            this.gameGrid[clickedSquare.rowIndex][clickedSquare.columnIndex] = {
                ...this.gameGrid[this.registeredSquare[0]][this.registeredSquare[1]],
                rowIndex: clickedSquare.rowIndex,
                columnIndex: clickedSquare.columnIndex
            }
            this.gameGrid[this.registeredSquare[0]][this.registeredSquare[1]] = {
                ...this.gameGrid[this.registeredSquare[0]][this.registeredSquare[1]],
                movementPattern: null,
                attackPattern: null,
                name: '',
                acceptableMovement: false,
                acceptableAttack: false,
            }
            this.useMovement(this.gameGrid[this.registeredSquare[0]][this.registeredSquare[1]].attackCost)
            this.resetIcons()
        },
        useMovement(cost){
            this.currentPlayer.movesLeft -= cost
        },
        findAvailableMovementLocations(movementPattern, row, column) {
            let locationsToActivate = this.findLocations(movementPattern, row, column)
            this.setMovementSquares(locationsToActivate, row, column)
        },
        findAvailableAttackLocations(attackPattern, row, column) {
            let locationsToActivate = this.findLocations(attackPattern, row, column)
            this.setAttackSquares(locationsToActivate, row, column)
        },
        findLocations(array, row, column) {
            let locationsToActivate = []
            array.forEach(pair => {
                const calculatedSquare = [row + pair[0], column + pair[1]]
                const calcRow = calculatedSquare[0]
                const calcCol = calculatedSquare[1]
                if((calcRow >= 0 && calcRow < this.boardSize) && (calcCol >= 0 && calcCol < this.boardSize)) {
                    locationsToActivate.push(calculatedSquare)
                }
            })
            return locationsToActivate
        },
        setMovementSquares(locationsToActivate) {
            locationsToActivate.forEach(pair => {
                if(this.gameGrid[pair[0]][pair[1]].name === '') {
                    this.gameGrid[pair[0]][pair[1]].acceptableMovement = true
                }
            })
        },
        setAttackSquares(locationsToActivate) {
            locationsToActivate.forEach(pair => {
                this.gameGrid[pair[0]][pair[1]].acceptableAttack = true
            })
        },
        resetIcons() {
            this.registeredSquare = []
            this.gameGrid.forEach(row => {
                row.forEach(col => {
                    col.acceptableMovement = false
                    col.acceptableAttack = false
                    col.activeSquare = false
                })
            })
        },
    },
    computed: {
        allBugs() {
            return {...smallBugs, ...mediumBugs, ...bigBugs }
        },
        currentPlayer() {
            if (this.playerOne.activeTurn) return this.playerOne
            else return this.playerTwo
        }
    },
    mounted() {
        this.rollTable()
    },
}
</script>

<style>
.col {
    flex-grow: 0;
}
.margin-1px {
    margin:1px;
}
</style>