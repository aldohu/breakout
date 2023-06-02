// Get the canvas element and its context
let canvas = document.getElementById('game-canvas');
let ctx = canvas.getContext('2d');

// Define the ball properties
let ball = {
	x: canvas.width / 2,
	y: canvas.height - 30,
	radius: 10,
	dx: 2,
	dy: -2,
};

// Define the paddle properties
let paddle = {
	width: 75,
	height: 10,
	x: (canvas.width - 75) / 2,
	dx: 7, // Paddle speed
};

// Define the brick properties
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];
let score = 0;
for (let c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (let r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}

// Add event listeners for paddle movement
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

// Handle keydown event
function keyDownHandler(event) {
	if (event.keyCode === 39) {
		paddle.rightPressed = true;
	} else if (event.keyCode === 37) {
		paddle.leftPressed = true;
	}
}

// Handle keyup event
function keyUpHandler(event) {
	if (event.keyCode === 39) {
		paddle.rightPressed = false;
	} else if (event.keyCode === 37) {
		paddle.leftPressed = false;
	}
}

// Handle mouse movement
function mouseMoveHandler(event) {
	let relativeX = event.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddle.x = relativeX - paddle.width / 2;
	}
}

// Draw the ball on the canvas
function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = '#0095DD';
	ctx.fill();
	ctx.closePath();
}

// Draw the paddle on the canvas
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(
		paddle.x,
		canvas.height - paddle.height,
		paddle.width,
		paddle.height,
	);
	ctx.fillStyle = '#0095DD';
	ctx.fill();
	ctx.closePath();
}

// Draw the bricks on the canvas
function drawBricks() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status === 1) {
				let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = '#0095DD';
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}
const updateScoreDisplay = () => {
	let scoreDisplay = document.getElementById('score');
	scoreDisplay.innerText = score;
	if (score === 100) {
		alert('You win!');
		document.location.reload();
	}
	document.getElementById('score').textContent = score;
};
function collisionDetection() {
	// Check collision with the bricks
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			let brick = bricks[c][r];
			if (brick.status === 1) {
				if (
					ball.x > brick.x &&
					ball.x < brick.x + brickWidth &&
					ball.y > brick.y &&
					ball.y < brick.y + brickHeight
				) {
					ball.dy = -ball.dy; // Reverse the ball's vertical direction
					brick.status = 0; // Mark the brick as broken
					score += 1; // Increase the score
					updateScoreDisplay(); // Update the score display on the HTML page
				}
			}

			// Reverse the ball's vertical direction
			// Mark the brick as broken
		}
	}

	// Check collision with the top edge of the canvas
	if (ball.y + ball.dy < ball.radius) {
		ball.dy = -ball.dy; // Reverse the ball's vertical direction
	}

	// Check collision with the bottom edge of the canvas
	if (ball.y + ball.dy > canvas.height - ball.radius) {
		// Check if the ball hits the paddle
		if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
			ball.dy = -ball.dy; // Reverse the ball's vertical direction
		} else {
			// Handle game over condition
			// For example, reset the ball position and decrease a life count
			resetBall();
		}
	}

	// Check collision with the left and right edges of the canvas
	if (
		ball.x + ball.dx < ball.radius ||
		ball.x + ball.dx > canvas.width - ball.radius
	) {
		ball.dx = -ball.dx; // Reverse the ball's horizontal direction
	}
}

// Update the game state and redraw the canvas
function draw() {
	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	collisionDetection();
	// Draw the ball
	drawBall();

	// Draw the paddle
	drawPaddle();

	// Draw the bricks
	drawBricks();

	// Move the ball
	ball.x += ball.dx;
	ball.y += ball.dy;

	// Move the paddle
	if (paddle.rightPressed && paddle.x < canvas.width - paddle.width) {
		paddle.x += paddle.dx;
	} else if (paddle.leftPressed && paddle.x > 0) {
		paddle.x -= paddle.dx;
	}

	requestAnimationFrame(draw);
}

// Start the game loop
draw();
