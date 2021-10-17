<template>
    <div class="flexRow">
        <div class="mr-2"> 
            <div>
                <img height="32" width="32" v-for="stat in stats" :key="stat" :src="require(`@/assets/images/${stat}.png`)" :alt="stat"/>
            </div>
            <div>
                <img height="64" width="64" v-for="item in classes" :key="item" :src="require(`@/assets/images/${item}.jpg`)" :alt="item"/>
            </div>
            <div class="card" v-for="character in playerCharacters" :key="character.name">
                <h2>{{ sentenceCase(character.name) }}</h2>
                <div class="flexRow">
                    <img class="mr-2" height="80" width="80"  :src="require(`@/assets/images/${character.name}.jpg`)" :alt="character.name"/>
                    <div class="flexRow flexWrap">
                        <div class="flexRow mr-2 mb-2" v-for="stat in stats" :key="stat">
                            <img class="mr-1" height="32" width="32" :src="require(`@/assets/images/${stat}.png`)" :alt="stat"/>
                            <div class="statText">
                                {{ character.stats[stat] }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-for="(row, index) in gameGrid" :key="`gridRow${index}`">
            <div class="gridBox flexColumn" :class="column.acceptableMovement ? 'availableSquare' : 'dormantSquare'" v-for="(column, innerIndex) in gameGrid[index]" :key="`grid${innerIndex}`" @click="checkMovement(innerIndex, index)">
                <img v-if="column.icon" height="48" width="48" :src="require(`@/assets/images/${column.icon}.png`)" :alt="column.icon"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            gridRows: 2,
            gridColumns: 4,
            gameGrid: [],
            activeSquare: [],
            stats: [
                'health',
                'attack',
                'armor',
                // 'magic',
                // 'ward',
                // 'faith',
                // 'speed',
                // 'mettle'
            ],
            classes: [
                'cleric',
                'mage',
                'varlet',
                'witch'
           ],
           playerCharacters: {
               witch: {
                   name: 'witch',
                    stats: {
                        health: 28,
                        attack: 5,
                        armor: 3,
                        magic: 14,
                        ward: 8,
                        faith: 1,
                        speed: 5,
                        mettle: 1,
                    }
                },
                cleric: {
                   name: 'cleric',
                    stats: {
                        health: 40,
                        attack: 11,
                        armor: 10,
                        magic: 1,
                        ward: 2,
                        faith: 11,
                        speed: 4,
                        mettle: 1,

                    }
                },
                varlet: {
                   name: 'varlet',
                    stats: {
                        health: 31,
                        attack: 20,
                        armor: 3,
                        magic: 1,
                        ward: 1,
                        faith: 5,
                        speed: 6,
                        mettle: 1,
                    }
                },
                mage: {
                   name: 'mage',
                    stats: {
                        health:34,
                        attack: 3,
                        armor: 5,
                        magic: 17,
                        ward: 5,
                        faith: 10,
                        speed: 5,
                        mettle: 1,
                    }
                }
            }   
        }
    },
    methods: {
        rollTable() {
            let gameGridArray = []
            for(let i = 0; i < this.gridColumns; i++) {
                gameGridArray.push([])
                for(let ii = 0; ii < this.gridRows; ii++) {
                    gameGridArray[i].push(
                        {
                            location: `Col ${i + 1}, Row ${ii + 1}`,
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
            // if an inactive square is clicked 
            if(this.gameGrid[column][row].acceptableMovement === false){
                if (row === this.activeSquare[0] && column === this.activeSquare[1]) {
                    this.resetIcons()
                }
                else {
                    //set it to the activre square
                this.activeSquare = [column, row]
                // hilite available movements
                this.setAvailableLocations(row, column)
                }
            }
            else if(this.gameGrid[column][row].acceptableMovement === true){
                const fromSquareRow = this.activeSquare[0]
                const fromSquareColumn = this.activeSquare[1]
                const replacedSquareIcon = this.gameGrid[fromSquareColumn][fromSquareRow].icon
                this.gameGrid[fromSquareColumn][fromSquareRow].icon = this.gameGrid[column][row].icon
                this.gameGrid[column][row].icon = replacedSquareIcon
                this.resetIcons()
            }
            else {
                this.resetIcons()
            }
        },
        setAvailableLocations(row, column) {
            // if top left clicked
            if(row === 0) {
                if(column === 0) {
                    this.gameGrid[column][row + 1].acceptableMovement = true
                    this.gameGrid[column + 1][row].acceptableMovement = true
                    this.gameGrid[column + 1][row + 1].acceptableMovement = true
                }
                // top mid clicked
                else if(column > 0 && column < this.gridColumns - 1) {
                    this.gameGrid[column - 1][row].acceptableMovement = true
                    this.gameGrid[column + 1][row].acceptableMovement = true
                    this.gameGrid[column - 1][row + 1].acceptableMovement = true
                    this.gameGrid[column][row + 1].acceptableMovement = true
                    this.gameGrid[column + 1][row + 1].acceptableMovement = true
                }
                else if(column === this.gridColumns - 1) {
                    this.gameGrid[column - 1][row].acceptableMovement = true
                    this.gameGrid[column - 1][row + 1].acceptableMovement = true
                    this.gameGrid[column][row + 1].acceptableMovement = true
                }
            }
            if(row > 0 && row < this.gridRows - 1) {
                if (column === 0) {
                    this.gameGrid[column][row - 1].acceptableMovement = true
                    this.gameGrid[column + 1][row - 1].acceptableMovement = true
                    this.gameGrid[column + 1][row].acceptableMovement = true
                    this.gameGrid[column + 1][row + 1].acceptableMovement = true
                    this.gameGrid[column][row + 1].acceptableMovement = true
                }
                else if(column > 0 && column < this.gridColumns - 1) {
                    this.gameGrid[column - 1][row - 1].acceptableMovement = true
                    this.gameGrid[column][row - 1].acceptableMovement = true
                    this.gameGrid[column + 1][row - 1].acceptableMovement = true
                    this.gameGrid[column - 1][row].acceptableMovement = true
                    this.gameGrid[column + 1][row].acceptableMovement = true
                    this.gameGrid[column - 1][row + 1].acceptableMovement = true
                    this.gameGrid[column][row + 1].acceptableMovement = true
                    this.gameGrid[column + 1][row + 1].acceptableMovement = true
                }
                else if(column === this.gridColumns - 1) {
                    this.gameGrid[column][row - 1].acceptableMovement = true
                    this.gameGrid[column - 1][row - 1].acceptableMovement = true
                    this.gameGrid[column - 1][row].acceptableMovement = true
                    this.gameGrid[column - 1][row + 1].acceptableMovement = true
                    this.gameGrid[column][row + 1].acceptableMovement = true
                }
            }
            if(row === this.gridRows - 1) {
                if(column === 0) {
                    this.gameGrid[column][row - 1].acceptableMovement = true
                    this.gameGrid[column + 1][row].acceptableMovement = true
                    this.gameGrid[column + 1][row - 1].acceptableMovement = true
                }
                // top mid clicked
                else if(column > 0 && column < this.gridColumns - 1) {
                    this.gameGrid[column - 1][row].acceptableMovement = true
                    this.gameGrid[column + 1][row].acceptableMovement = true
                    this.gameGrid[column - 1][row - 1].acceptableMovement = true
                    this.gameGrid[column][row - 1].acceptableMovement = true
                    this.gameGrid[column + 1][row - 1].acceptableMovement = true
                }
                else if(column === this.gridColumns - 1) {
                    this.gameGrid[column - 1][row].acceptableMovement = true
                    this.gameGrid[column - 1][row - 1].acceptableMovement = true
                    this.gameGrid[column][row - 1].acceptableMovement = true
                }
            }
        },
        resetIcons() {
            this.gameGrid.forEach(column => {
                column.forEach(row => {
                    row.acceptableMovement = false;
                })
            })
            this.activeSquare = []
        }
    },
    mounted() {
        this.rollTable()
    },
}
</script>

<style scoped>
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
    justify-content:start;
}
.flexWrap {
    flex-wrap:wrap;
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
    width:400px;
    padding:0 .5rem;
    box-shadow: 1px 1px 5px grey;
}
.gridBox {
    width:64px;
    height:64px;
    margin-right:3px;
    margin-bottom: 3px;
    box-shadow: 1px 1px 5px grey;
}

.availableSquare {
    background:greenyellow;
}

.dormantSquare {
    background:white;
}
</style>