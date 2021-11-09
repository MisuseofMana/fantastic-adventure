<template>
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
</template>