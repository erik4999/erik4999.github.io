let frog;
let cars = [];
let logs = [];
let score = 0;

function setup() {
  createCanvas(400, 400);
  frog = new Frog(width / 2, height - 20);
  generateCars();
  generateLogs();
}

function draw() {
  background(220);

  // Display and update the frog
  frog.update();
  frog.display();

  // Display and update the cars
  for (let car of cars) {
    car.update();
    car.display();
    if (frog.collide(car)) {
      resetGame();
    }
  }

  // Display and update the logs
  for (let log of logs) {
    log.update();
    log.display();
    frog.attach(log);
  }

  // Check if the frog reached the water
  if (frog.reachedGoal()) {
    score++;
    frog.reset();
  }

  // Display the score
  textSize(16);
  fill(0);
  text("Score: " + score, 10, 20);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    frog.move(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    frog.move(0, 1);
  } else if (keyCode === LEFT_ARROW) {
    frog.move(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    frog.move(1, 0);
  }
}

function generateCars() {
  for (let i = 0; i < 5; i++) {
    let lane = floor(random(3)) + 1; // Randomly select a lane (1, 2, or 3)
    let y = height - 40 - lane * 40;
    let speed = random(2, 5);
    cars.push(new Car(0, y, speed));
  }
}

function generateLogs() {
  for (let i = 0; i < 3; i++) {
    let lane = floor(random(2)) + 1; // Randomly select a lane (1 or 2)
    let y = height - 80 - lane * 40;
    let speed = random(1, 3);
    logs.push(new Log(width, y, speed));
  }
}

function resetGame() {
  score = 0;
  frog.reset();
  cars = [];
  logs = [];
  generateCars();
  generateLogs();
}

class Frog {
  constructor(x, y) {
    this.width = 20;
    this.height = 20;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.onLog = false;
  }

  update() {
    this.position.add(this.velocity);
    this.position.x = constrain(this.position.x, 0, width - this.width);
    this.position.y = constrain(this.position.y, 0, height - this.height);
    this.velocity.mult(0.95); // Apply friction
  }

  display() {
    fill(0, 255, 0);
    rect(this.position.x, this.position.y, this.width, this.height);
  }

  move(x, y) {
    this.velocity.add(createVector(x * 20, y * 20));
  }

  collide(other) {
    return (
      this.position.x < other.position.x + other.width &&
      this.position.x + this.width > other.position.x &&
      this.position.y < other.position.y + other.height &&
      this.position.y + this.height > other.position.y
    );
  }

  attach(log) {
    if (this.collide(log)) {
      this.position.add(log.velocity);
      this.onLog = true;
    }
  }

  reachedGoal() {
    return this.position.y === 0 && !this.onLog;
  }

  reset() {
    this.position.set(width / 2, height - 20);
    this.velocity.set(0, 0);
    this.onLog = false;
  }
}

class Car {
  constructor(x, y, speed) {
    this.width = 30;
    this.height = 20;
    this.position = createVector(x, y);
    this.speed = speed;
  }

  update() {
    this.position.x += this.speed;
    if (this.position.x > width) {
      this.position.x = -this.width;
    }
  }

  display() {
    fill(255, 0, 0);
    rect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Log {
  constructor(x, y, speed) {
    this.width = 80;
    this.height = 20;
    this.position = createVector(x, y);
    this.speed = speed;
  }

  update() {
    this.position.x -= this.speed;
    if (this.position.x + this.width < 0) {
      this.position.x = width;
    }
  }

  display() {
    fill(0, 0, 255);
    rect(this.position.x, this.position.y, this.width, this.height);
  }
}
