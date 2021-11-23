<template>
<div class="fullscreen flexColumn">
    <div class="flexRow">
        <div class="mr-2 mt-2 p-2 flexColumn">
            <h2>{{ playerOne }}</h2>
            <h3> IT'S YOUR TURN </h3>
            <div>
            <p class="mb-2">Please choose your team.</p>
            
            <div class="flexColumn cardButton mb-2" v-for="(collection, index) in bugCollections" :key="'bugCollection' + index">
                <p class="mr-1">{{collection.teamName}}</p>
                <div class="flexRow mb-2">
                    <div v-for="(bug, index) in  collection.roster" :key="'typeOfBug' + index" class="gridBox mr-1">
                        <img height="40" width="40" :src="require(`@/assets/images/bugs/${bug}.gif`)" :alt="bug"/>
                    </div>
                </div>
            </div>
            </div>
            <p>You have {{ playerMoves }} moves left.</p>
        </div>

        <div class="flexColumn">
            <div>
                <h1>CRITTER CRAWL</h1> 
            </div>
            <div class="card mr-2">
                <div class="flexRow" v-for="(row, rowIndex) in gameGrid" :key="`gridCol${rowIndex}`">
                    <div
                        class="gridBox flexColumn pointer" 
                        v-for="(col, colIndex) in gameGrid[rowIndex]" 
                        :key="`gridRow${colIndex}`" 
                        :class="[ col.name === '' ? 'cantClick' : 'canClick', col.acceptableMovement ? 'availableSquare' : '', col.activeSquare ? 'activeSquare' : '', col.acceptableAttack ? 'attackSquare' : '' ]"
                        @click="checkMovement(rowIndex, colIndex)"
                    >
                        <img v-if="(col.name !== '' && !col.activeSquare)" height="40" width="40" :src="require(`@/assets/images/bugs/${col.name}.png`)" :alt="col.name"/>
                        <img v-if="(col.name !== '' && col.activeSquare)" height="40" width="40" :src="require(`@/assets/images/bugs/${col.name}.gif`)" :alt="col.name"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-2 p-2">
            <h2>{{ playerTwo }}</h2>
        </div>
    </div>

    <div class="flexRow">
        
    </div>
</div>
</template>

<script>
import { smallBugs } from '@/bugTypes/smallBugs.js'
import { mediumBugs } from '@/bugTypes/mediumBugs.js'
import { bigBugs } from '@/bugTypes/bigBugs.js'
import { bugCollections } from '@/bugTypesw/bugCollections.js'

export default {
    data(){
        return {
            playerOne: 'Bugboy',
            playerTwo: 'King Cricket',
            bugCollections,
            playerMoves: 3,
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
            const { movementPattern, attackPattern, activeSquare, acceptableMovement, acceptableAttack, name } = clickedSquare
            // a non-active square is clicked and is not currently an acceptable movement or attack option
            // it is also not an empty square, (it has a name and living bug)
            // reset the board indicators, hilight a new active square, add new movement indicators
            if (!activeSquare && !acceptableMovement && !acceptableAttack && name !== ''){
                this.resetIcons()
                this.gameGrid[row][column].activeSquare = true
                this.registeredSquare = [row, column]
                this.findAvailableMovementLocations(movementPattern, clickedSquare.rowIndex, clickedSquare.columnIndex)
                this.findAvailableAttackLocations(attackPattern, clickedSquare.rowIndex, clickedSquare.columnIndex)
            }
            // a player clicks an already active square, just reset all board indicators
            else if (activeSquare) {
                this.resetIcons()
            }
            // a square is clicked and is acceptable to be moved to
            // swap the icons between the active and clicked squares
            else if(acceptableMovement) {
                this.swapIcons(clickedSquare)
                this.resetIcons()
            }
            else if(acceptableAttack) {
                this.squashBug()
                this.resetIcons()
            }
        },
        swapIcons(clickedSquare) {
            const fromIcon = this.gameGrid[this.registeredSquare[0]][this.registeredSquare[1]]
            column.name = clickedSquare.name
            this.gameGrid[clickedSquare.rowIndex][clickedSquare.columnIndex].name = activeIcon
        },
        squashBug(clickedSquare) {
            const activeIcon = this.registeredSquareName
            clickedSquare.name = ''
            this.gameGrid[clickedSquare.rowIndex][clickedSquare.columnIndex].name = activeIcon
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
        findAvailableMovementLocations(movementPattern, row, column) {
            let locationsToActivate = this.findLocations(movementPattern, row, column)
            this.setMovementSquares(locationsToActivate)
        },
        findAvailableAttackLocations(attackPattern, row, column) {
            let locationsToActivate = this.findLocations(attackPattern, row, column)
            this.setAttackSquares(locationsToActivate)
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
        }
    },
    mounted() {
        this.rollTable()
    },
}
</script>

<style>
.fullscreen {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: start;
    justify-content: center;
    margin:0;
    padding:0;
    background:rgb(48, 48, 48);
}
.flexColumn {
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content:flex-start;
}
.flexRow {
    display:flex;
    flex-direction: row;
    align-items: start;
    justify-content: flex-start;
}

.mr-1 {
    margin-right:.5rem;
}
.mr-2{ 
    margin-right:1rem;
}
.mb-2{
    margin-bottom:1rem;
}
.mt-2 {
    margin-top:2rem;
}
.p-2 {
    padding:2rem;
}
.statText {
    font-size: 1.5rem;
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.card {
    padding:2rem 2rem;
    border-radius:5px;
    box-shadow: 1px 1px 5px black;
    background: rgb(192, 192, 192);
}
.cardButton {
    padding:1rem 1rem;
    border-radius:5px;
    box-shadow: 1px 1px 5px black;
    background: rgb(138, 138, 138);
}
.cardButton:hover {
    background: rgb(173, 233, 171);
    color:black;
    cursor:pointer;
}
.gridBox {
    width:40px;
    height:40px;
    box-shadow: 1px 1px 3px black;
    border-radius:5px;
    transition: all .1s linear;
    background:rgb(214, 214, 214);
}

.cantClick {
    background:rgb(156, 156, 156);
}
.cantClick:hover {
    cursor: not-allowed;
}

.availableSquare {
    background:rgb(72, 212, 255);
    transition: all .1s linear;
}
.availableSquare:hover {
    background:rgb(72, 255, 72);
    cursor: pointer;
    transition: all .1s linear;
}
.activeSquare {
    background:gold;
}
.activeSquare:hover, .canClick:hover {
    background:gold;
    color:white
}
.attackSquare {
    background:rgb(255, 0, 0)
}
.attackSquare:hover {
    background:darkred;
}
body {
    margin:0;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    color:white;
}
.pointer {
    cursor:pointer;
}
.text-center {
    text-align: center;
}
h3, h2, p {
    margin:0;
    margin-bottom:.5rem;
}
</style>