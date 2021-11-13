<template>
<div class="fullscreen">
    <div class="card">
            <div class="flexRow" v-for="(row, rowIndex) in gameGrid" :key="`gridCol${rowIndex}`">
                <div
                    class="gridBox flexColumn" 
                    v-for="(col, colIndex) in gameGrid[rowIndex]" 
                    :key="`gridRow${colIndex}`" 
                    :class="[ col.acceptableMovement ? 'availableSquare' : 'dormantSquare', col.activeSquare ? 'activeSquare' : '']"
                    @click="checkMovement(rowIndex, colIndex)"
                >
                    <img v-if="col.icon" height="40" width="40" :src="require(`@/assets/images/${col.icon}.png`)" :alt="col.icon"/>
                    <div class="tinyText">{{ col.location }}</div>
                </div>
            </div>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return {
            gridRows: 10,
            gridColumns: 10,
            gameGrid: [],
            stats: [
                '',
                'health',
                'attack',
                'armor',
                'magic',
                'ward',
                'faith',
                'speed',
                'mettle'
            ],
        }
    },
    methods: {
        rollTable() {
            let gameGridArray = []
            for(let row = 0; row < this.gridRows; row++) {
                gameGridArray.push([])
                for(let column = 0; column < this.gridColumns; column++) {
                    gameGridArray[row].push(
                        {
                            rowIndex: row,
                            columnIndex: column,
                            movementPattern:[[0,1], [1,0], [1,1]],
                            icon: this.stats[this.randomNumber(this.stats.length)],
                            acceptableMovement: false,
                            activeSquare: false,
                        }
                    )
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
            const movementPattern = clickedSquare.movementPattern
            const squareIsActive = clickedSquare.activeSquare
            const acceptableMovement = clickedSquare.acceptableMovement
            // a player clicks an already active square, just reset all board indicators
            if (squareIsActive) {
                this.resetIcons()
            }
            // a non-active square is clicked and is not currently an acceptable movement option
            // reset the board indicators, hilight a new active square, add new movement indicators
            else if (!squareIsActive && !acceptableMovement){
                this.resetIcons()
                this.gameGrid[row][column].activeSquare = true
                this.setAvailableLocations(movementPattern)
            }
            // a square is clicked and is acceptable to be moved to
            // swap the icons between the active and clicked squares
            else if(acceptableMovement) {
                this.swapIcons(clickedSquare)
                this.resetIcons()
            }
        },
        swapIcons(clickedSquare) {
            this.gameGrid.forEach(row => {
                row.forEach(column => {
                    if(column.activeSquare) {
                        const activeIcon = column.icon
                        column.icon = clickedSquare.icon
                        this.gameGrid[clickedSquare.rowIndex][clickedSquare.columnIndex].icon = activeIcon
                    }
                })
            })
        },
        setAvailableLocations(movementPattern) {
            movementPattern.forEach(direction => {
                this.validateSquare(direction[0], direction[1])
            })
        },
        validateSquare(row, column) {
            if((row >= 0 && row < this.gridRows) && (column >= 0 && column < this.gridColumns)) {
                for(let i = -row; i )
                    this.gameGrid[row][column].acceptableMovement = true
            }
        },
        resetIcons() {
            this.gameGrid.forEach(row => {
                row.forEach(col => {
                    col.acceptableMovement = false;
                    col.activeSquare = false
                })
            })
        }
    },
    mounted() {
        this.rollTable()
    },
}
</script>

<style>
.flexColumn {
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content:center;
}
.flexRow {
    display:flex;
    flex-direction: row;
    align-items: center;
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
.statText {
    font-size: 1.5rem;
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.card {
    padding:2rem 2rem;
    border-radius:5px;
    box-shadow: 1px 1px 5px black;
    background:rgb(85, 85, 85);
}

.gridBox {
    width:48px;
    height:48px;
    margin-right:3px;
    margin-bottom: 3px;
    box-shadow: 1px 1px 5px black;
    border-radius:5px;
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

.dormantSquare {
    background:rgb(129, 129, 129);
    transition: all .1s linear;
}
.dormantSquare:hover {
    background:gold;
    cursor: pointer;
}
.activeSquare {
    background:gold;
}
.activeSquare:hover {
    background:rgb(189, 41, 41);
}
.fullscreen {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin:0;
    padding:0;
    background:rgb(48, 48, 48);
}
body {
    margin:0;
}
.tinyText {
    font-size:.5rem;
    color:white;
}
</style>