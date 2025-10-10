// Reference for hand track: https://docs.ml5js.org/#/reference/handpose
// Reference for colour detection: https://editor.p5js.org/elizabethk/sketches/dAA8XOPUg

let video;
let handPose;
let hands = [];
let previousX = null;
let previousY = null;

let img;
let canvas;

function preload() {
  handPose = ml5.handPose();
  img = loadImage("./self-portrait-grey.jpg");
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

function setup() {
  canvas = createCanvas(800, 480);
  background(150);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
  // place the original image on the upper left corner
  image(img, 0, 0);
}

function draw() {
  drawLines();
}

function drawLines() {
  // Get the color at the mouse position
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let keypoint = hand.keypoints[8];
    let c = img.get(keypoint.x, keypoint.y);
    console.log(c);

    if (keypoint.x < img.width) {
      stroke(1);
      fill("green");
      circle(keypoint.x, keypoint.y, 5);
    }

    let randomSize = random(2, 10);

    // Squares
    if (c[0] <= 200) {
      fill(c, 20);
      square(keypoint.x + img.width, keypoint.y, randomSize);
    } else {
      noFill();
      circle(keypoint.x + img.width, keypoint.y, 3);
    }

    // Circles
    // noStroke();
    // if (c[0] <= 200) {
    //   fill(c);
    //   circle(keypoint.x + img.width, keypoint.y, 3);
    // } else {
    //   noFill();
    //   circle(keypoint.x + img.width, keypoint.y, 3);
    // }

    // Line Drawing
    // if (previousX !== null && previousY !== null) {
    //   if (c[0] <= 200) {
    //     stroke(c);
    //     strokeWeight(0.5);
    //     line(previousX, previousY, keypoint.x + img.width, keypoint.y);
    //   }
    // }

    // previousX = keypoint.x + img.width;
    // previousY = keypoint.y;
  }
}
