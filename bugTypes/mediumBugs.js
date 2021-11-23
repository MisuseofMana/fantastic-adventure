export const mediumBugs = {
    ladybug: {
        movementPattern: [
            [-2,-1],
            [-2, 1],
            [-1,-2],
            [-1,2],
            [1,-2],
            [1,2],
            [2,-1],
            [2,1]
        ],
        attackPattern: [
            [-1,-1],
            [-1,0],
            [-1,1],
            [0,-1],
            [0,1],
            [1,-1],
            [1,0],
            [1,1],
        ],
        movementCost: 4,
        attackCost: 4
    },
    mosquito: {
        movementPattern: [
            [-2,-1],
            [-2, 1],
            [-1,-2],
            [-1,2],
            [1,-2],
            [1,2],
            [2,-1],
            [2,1]
        ],
        attackPattern: [
            [-2,0],
            [-1,0],
            [0,-2],
            [0,-1],
            [0,1],
            [0,2],
            [1,0],
            [2,0],
        ],
        movementCost: 4,
        attackCost:4
    },
    spider: {
        movementPattern: [
            [-2,-2],
            [-2,2],
            [-1,-1],
            [-1,1],
            [1,-1],
            [1,1],
            [2,-2],
            [2,2],
        ],
        attackPattern: [
            [-2,-1],
            [-2,1],
            [-1,-2],
            [-1,2],
            [1,-2],
            [1,2],
            [2,1],
            [2,-1],
        ],
        movementCost: 4,
        attackCost:4
    },
}