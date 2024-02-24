let canvas
let canvasContext
let ballX = 50
let ballY = 50
let ballSpeedX = 10
let ballSpeedY = 4
let paddle1Y = 250
let paddle2Y = 250

const PADDLE_HEIGHT = 100
const PADDLE_THICKNESS = 10
const WIN_SCORE = 3

let showWinScreen = false

let player1Score = 0
let player2Score = 0

function calculateMousePos(evt) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement
  let mouseX = evt.clientX - rect.left - root.scrolLeft
  let mouseY = evt.clientY - rect.top - root.scrollTop
  return {
    x: mouseX,
    y: mouseY,
  }
}

function handleMouseClick(e) {
  if (showWinScreen) {
    player1Score = 0
    player2Score = 0
    showWinScreen = false
  }
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas')
  canvasContext = canvas.getContext('2d')

  let framesPerSecond = 30

  setInterval(function () {
    moveEverything()
    drawEverything()
  }, 1000 / framesPerSecond)

  canvas.addEventListener('mousedown', handleMouseClick)

  canvas.addEventListener('mousemove', function (evt) {
    let mousePos = calculateMousePos(evt)
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2
  })
}

function ballReset() {
  if (player1Score >= WIN_SCORE || player2Score >= WIN_SCORE) {
    showWinScreen = true
  }
  ballSpeedX = -ballSpeedX

  ballX = canvas.width / 2
  ballY = canvas.height / 2
}

function computerMovement() {
  let paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2

  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6
  }
}

function moveEverything() {
  if (showWinScreen) {
    return
  }
  computerMovement()
  ballX += ballSpeedX
  ballY += ballSpeedY

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX

      let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2)
      ballSpeedY = deltaY * 0.35
    } else {
      player2Score++
      ballReset()
    }
  }

  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX

      let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2)
      ballSpeedY = deltaY * 0.35
    } else {
      player1Score++
      ballReset()
    }
  }

  if (ballY < 0) {
    ballSpeedY = -ballSpeedY
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY
  }
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor
  canvasContext.fillRect(leftX, topY, width, height)
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white')
  }
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, 'black')

  if (showWinScreen) {
    canvasContext.fillStyle = 'white'

    if (player1Score >= WIN_SCORE) {
      canvasContext.fillText('Left Player Won!', 350, 300)
    } else if (player2Score >= WIN_SCORE) {
      canvasContext.fillText('Right Player Won', 350, 300)
    }
    return
  }

  drawNet()
  //left paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white')
  //right paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    'white'
  )

  //draw ballX
  colorCircle(ballX, ballY, 10, 'white')

  //score
  canvasContext.fillText(player1Score, 100, 100)
  canvasContext.fillText(player2Score, canvas.width - 100, 100)
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor
  canvasContext.beginPath()
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
  canvasContext.fill()
}
