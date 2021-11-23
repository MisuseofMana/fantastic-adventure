export const smallBugs = {
    grub: {
        movementPattern: [
            [-1,0],
            [0,-1],
            [0,1],
            [1,0],
        ],
        attackPattern: [],
        movementCost: 1,
        attackCost: 0,
    },
    ant: {
        movementPattern: [
            [-2,-1],
            [-2,1],
            [-1,0],
            [0,-1],
            [0,1],
            [1,0],
            [2,1],
            [2,-1],
        ],
        attackPattern: [],
        movementCost: 1,
        attackCost:1
    },
    worm: {
        movementPattern: [
            [-2,-2],
            [-1,-1],
            [-1,1],
            [-2,2],
            [1,-1],
            [2,-2],
            [1,1],
            [2,2]
        ],
        attackPattern: [],
        movementCost: 1,
        attackCost:0
    },
    inchworm: {
        movementPattern: [
            [-1,0],
            [-2,0],
            [0,-1],
            [0,-2],
            [0,1],
            [0,2],
            [1,0],
            [2,0],
        ],
        attackPattern: [],
        movementCost: 1,
        attackCost: 1
    },
}