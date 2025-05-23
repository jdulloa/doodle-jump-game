document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatformBottom) {
            this.bottom = newPlatformBottom
            this.left = Math.random() * 315    
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 600 / platformCount
            let newPlatformBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatformBottom)
            platforms.push(newPlatform)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        upTimerId = setInterval(function() {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
            }
        }, 30) 
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function() {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })
        }, 30)
    }

    function resetGame() {
        // Reset all variables to initial state
        doodlerLeftSpace = 50
        startPoint = 150
        doodlerBottomSpace = startPoint
        isGameOver = false
        platforms = []
        score = 0
        isJumping = true
        isGoingLeft = false
        isGoingRight = false
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        grid.innerHTML = ''
    }

    function gameOver() {
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }

        // Create a container for centering
        const centerContainer = document.createElement('div')
        centerContainer.className = 'center-container'

        // Score
        const scoreElem = document.createElement('div')
        scoreElem.className = 'score'
        scoreElem.innerText = score

        // Button
        const resetButton = document.createElement('button')
        resetButton.innerText = "Play again"
        resetButton.addEventListener('click', () => {
            resetGame()
            start()
        })

        // Info paragraph
        const info = document.createElement('p')
        info.className = 'info-paragraph'
        info.innerText = "Or Press Enter ⎆"

        // Append all to container
        centerContainer.appendChild(scoreElem)
        centerContainer.appendChild(resetButton)
        centerContainer.appendChild(info)
        grid.appendChild(centerContainer)

        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    // Move left, right or straight
    function control(e) {
        if (e.key === "ArrowLeft") {
            moveLeft()
        } else if (e.key === "ArrowRight") {
            moveRight()
        } else if (e.key === "ArrowUp") {
            moveStraight()
        }
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
            doodlerLeftSpace -= 5
            doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
        }, 20)
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function () {
            if (doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        }, 20)
    }

    function moveStraight() {
        isGoingRight = false
        isGoingLeft = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }
    // Attach to button
    function showStartButton() {
        grid.innerHTML = ''

        // Create a container for centering
        const centerContainer = document.createElement('div')
        centerContainer.className = 'center-container'

        // Score (optional, show 0 at start)
        const scoreElem = document.createElement('div')
        scoreElem.className = 'score'
        scoreElem.innerText = score

        // Button
        const playButton = document.createElement('button')
        playButton.innerText = "Start Game"
        playButton.addEventListener('click', () => {
            resetGame()
            start()
        })

        // Info paragraph
        const info = document.createElement('p')
        info.className = 'info-paragraph'
        info.innerText = "Or Press Enter ⎆"

        // Append all to container
        centerContainer.appendChild(scoreElem)
        centerContainer.appendChild(playButton)
        centerContainer.appendChild(info)
        grid.appendChild(centerContainer)
    }

    // Listen for Enter key to start the game
    document.addEventListener('keydown', function(e) {
        if ((e.key === "Enter" || e.key === "NumpadEnter") && !document.querySelector('.doodler')) {
            resetGame()
            start()
        }
    })

    showStartButton()
})