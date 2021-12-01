<template>
    <v-app>
        <v-container>
            <v-main>
                <v-row justify="center" class="text-center">
                    <v-col cols="12">
                        <h1>CRITTER CRAWL</h1>
                        <p>A game by <a href="https://www.seanyager.com">Sean Yager</a> and Eli Crow</p>
                    </v-col>
                </v-row>

                <v-row no-gutters>
                    <v-spacer></v-spacer>
                    <v-col cols="2" class="d-flex justify-end">
                        <PlayerReadout playerName="RED" :yourTurn="whosTurn === 'player1'"/>
                    </v-col>
                    <v-col cols="8">
                        <v-row
                            align="center"
                            justify="center"
                            v-for="(row, rowIndex) in gameGrid"
                            :key="`gridCol${rowIndex}`"
                            no-gutters
                            class="align-center"
                        >
                            <v-col
                                v-for="(col, colIndex) in gameGrid[rowIndex]"
                                :key="`gridRow${colIndex}`"
                                @click="checkMovement(rowIndex, colIndex)"
                            >
                                <v-card
                                    :color="squareColor(col)"
                                    height="42"
                                    width="42"
                                    :hover="canHover(col)"
                                    outlined
                                    class="margin-1px"
                                >
                                    <img
                                        v-if="(col.name !== '' && !col.activeSquare)"
                                        height="40"
                                        width="40"
                                        :src="require(`@/assets/images/bugs/${col.name}.png`)"
                                        :alt="col.name"
                                    />
                                    <img
                                        v-if="(col.name !== '' && col.activeSquare)"
                                        height="40"
                                        width="40"
                                        :src="require(`@/assets/images/bugs/${col.name}.gif`)"
                                        :alt="col.name"
                                    />
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="2">
                        <PlayerReadout playerName="BLUE" :yourTurn="whosTurn === 'player2'" />
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
            </v-main>
        </v-container>
    </v-app>
</template>

<script>
import all, { boardSetup } from '@/bugTypes/all.js'

export default {
    data() {
        return {
            all,
            whosTurn: 'player1',
            boardSize: 15,
            gameGrid: [],
            registeredSquare: [],
            bugs: [
                'grub',
                'ant',
                'inchworm',
                'ladybug',
                'mosquito',
                'spider',
                'mantis',
                'dragonfly',
            ],
        }
    },
    methods: {
        squareColor(square) {
            if (square.acceptableMovement) return '#09f'
            else if (square.activeSquare) return '#fd3'
            else if (square.acceptableAttack) return '#f46'
            else if (square.name === '') return '#ddd'
            else if (square.belongsTo === 'player1') return '#ffd2d2'
            else if (square.belongsTo === 'player2') return '#becfff'
        },
        canHover(square) {
            if (square.acceptableMovement) return true
            else if (square.activeSquare) return true
            else if (square.acceptableAttack) return true
            else if (square.name === '') return false
            else if (square.name && square.belongsTo === this.whosTurn) return true
        },
        initializeBoard() {
            this.gameGrid = boardSetup.map((row, rowIndex) => {
                return row.map((cell, columnIndex) => {
                    if (cell in all) {
                        const name = cell
                        const { movementPattern, attackPattern } = all[name]
                        return {
                            rowIndex,
                            columnIndex,
                            movementPattern,
                            attackPattern,
                            name,
                            belongsTo: columnIndex > 7 ? 'player2' : 'player1',
                            acceptableMovement: false,
                        }
                    } else {
                        return {
                            rowIndex,
                            columnIndex,
                            movementPattern: null,
                            attackPattern: null,
                            name: '',
                            belongsTo: null,
                            acceptableMovement: false,
                        }
                    }
                })
            })
        },
        randomNumber(max) {
            return Math.floor(Math.random() * max)
        },
        checkMovement(row, column) {
            const clickedSquare = this.gameGrid[row][column]
            if(!(clickedSquare.belongsTo === null || clickedSquare.belongsTo === this.whosTurn)) return
            const { movementPattern, activeSquare, acceptableMovement, acceptableAttack, name } = clickedSquare
            // a non-active square is clicked and is not currently an acceptable movement or attack option
            // it is also not an empty square, (it has a name and living bug)
            // reset the board indicators, hilight a new active square, add new movement indicators
            if (!activeSquare && !acceptableMovement && !acceptableAttack && name !== '') {
                this.resetIcons()
                this.gameGrid[row][column].activeSquare = true
                this.registeredSquare = [row, column]
                this.findAvailableMovementLocations(movementPattern, clickedSquare.rowIndex, clickedSquare.columnIndex)
            }
            // a player clicks an already active square, just reset all board indicators
            else if (activeSquare) {
                this.resetIcons()
            }
            // a square is clicked and is acceptable to be moved to
            // swap the icons between the active and clicked squares
            else if (acceptableMovement) {
                this.moveSquare(clickedSquare)
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
            this.resetIcons()
            this.checkBoard()
        },
        checkBoard() {
            const hasPlayer1 = this.gameGrid.some(row => row.some(cell => cell.belongsTo === 'player1'))
            const hasPlayer2 = this.gameGrid.some(row => row.some(cell => cell.belongsTo === 'player2'))
            if (hasPlayer1 && hasPlayer2) {
                console.log('still active')
                return
            }
            else if (hasPlayer1) {
                //do a thing for player1
                this.$router.push({
                    path: '/winner',
                })
            } 
            else if(hasPlayer2) {
                //do a thing for player2
                this.$router.push({
                    path: '/winner',
                })
            }

            if(this.whosTurn === 'player1') {
                this.whosTurn = 'player2'
            }
            else {
                this.whosTurn = 'player1'
            }
        },
        findAvailableMovementLocations(movementPattern, row, column) {
            let locationsToActivate = this.findLocations(movementPattern, row, column)
            this.setMovementSquares(locationsToActivate, row, column)
        },
        findLocations(array, row, column) {
            let locationsToActivate = []
            array.forEach(pair => {
                const calculatedSquare = [row + pair[0], column + pair[1]]
                const calcRow = calculatedSquare[0]
                const calcCol = calculatedSquare[1]
                if ((calcRow >= 0 && calcRow < this.boardSize) && (calcCol >= 0 && calcCol < this.boardSize)) {
                    locationsToActivate.push(calculatedSquare)
                }
            })
            return locationsToActivate
        },
        setMovementSquares(locationsToActivate) {
            locationsToActivate.forEach(pair => {
                if (this.gameGrid[pair[0]]?.[pair[1]]?.name === '') {
                    this.gameGrid[pair[0]][pair[1]].acceptableMovement = true
                }
            })
        },
        resetIcons() {
            this.registeredSquare = []
            this.gameGrid.forEach(row => {
                row.forEach(col => {
                    col.acceptableMovement = false
                    col.activeSquare = false
                })
            })
        },
    },
    mounted() {
        this.initializeBoard()
    },
}
</script>

<style>
.col {
    flex-grow: 0;
}
.margin-1px {
    margin: 1px;
}
</style>