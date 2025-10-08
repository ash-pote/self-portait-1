// Reference for hand track: https://docs.ml5js.org/#/reference/handpose
// Reference for edge detection: https://editor.p5js.org/p5/sketches/Image:_EdgeDetection
// Reference for colour detection: https://editor.p5js.org/elizabethk/sketches/dAA8XOPUg

// ✓ 1. Set the video capture ✓
// ✓ 2. Connect ML5 ✓
// ✓ 3. Draw lines with hand ✓
// ✓ 4. Trace face ✓
// 5. Trace face slowly
// 6. Add gestural movements from hand
// 7. Press button to stop

let video;
let handPose;
let hands = [];
let previousX = null;
let previousY = null;

let kernel = [
  [-1, -1, -1],
  [-1, 11, -1],
  [-1, -1, -1],
];

let sum = 0;
let edgeImg;
let img;
let finishedEdgeImg;
let canvas;

function preload() {
  handPose = ml5.handPose();
  img = loadImage("./img-test-2.jpg");
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
  drawImage();
  // draw edgeImg at the right of the original image
  // image(edgeImg, img.width, 0);
}

function draw() {
  // image(video, 0, 0, width, height);
  // filter(INVERT);
  // loadPixels();

  drawLines();
}

function drawImage() {
  // create a new image, same dimensions as img
  edgeImg = createImage(img.width, img.height);
  // load its pixels
  edgeImg.loadPixels();

  for (let x = 1; x < img.width - 1; x++) {
    for (let y = 1; y < img.height - 1; y++) {
      // kernel sum for the current pixel starts as 0
      sum = 0;

      // kx, ky variables for iterating over the kernel
      // kx, ky have three different values: -1, 0, 1
      for (kx = -1; kx <= 1; kx++) {
        for (ky = -1; ky <= 1; ky++) {
          let xpos = x + kx;
          let ypos = y + ky;
          let pos = (y + ky) * img.width + (x + kx);
          // since our image is grayscale,
          // RGB values are identical
          // we retrieve the red value for this example
          let val = red(img.get(xpos, ypos));
          // accumulate the  kernel sum
          // kernel is a 3x3 matrix
          // kx and ky have values -1, 0, 1
          // if we add 1 to kx and ky, we get 0, 1, 2
          // with that we can use it to iterate over kernel
          // and calculate the accumulated sum
          sum += kernel[ky + 1][kx + 1] * val;
        }
      }

      // set the pixel value of the edgeImg
      if (sum < 100) {
        edgeImg.set(x, y, color(200)); // dark edge
      } else {
        edgeImg.set(x, y, color(255)); // bright background
      }
    }
  }

  // updatePixels() to write the changes on edgeImg
  edgeImg.updatePixels();
  // image(edgeImg, img.width, 0);
}

function drawLines() {
  // Get the color at the mouse position

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let keypoint = hand.keypoints[8];
    let c = img.get(keypoint.x, keypoint.y);
    console.log(c);

    fill("green");
    circle(keypoint.x, keypoint.y, 5);

    if (c[0] <= 100) {
      fill(c);
      circle(keypoint.x + img.width, keypoint.y, 5);
    } else {
      fill(255);
      noStroke();
      circle(keypoint.x + img.width, keypoint.y, 5);
    }

    // if (previousX !== null && previousY !== null) {
    //   if (c[0] <= 50) {
    //     fill(c);
    //     circle(keypoint.x + img.width, keypoint.y, 5);
    //     // line(
    //     //   previousX + img.width,
    //     //   previousY,
    //     //   keypoint.x + img.width,
    //     //   keypoint.y
    //     // );
    //   }
    // }

    // previousX = keypoint.x;
    // previousY = keypoint.y;

    // if (c[0] <= 100) {
    //   fill("green");
    //   circle(keypoint.x + 200, keypoint.y, 20);
    // } else {
    //   fill("purple");
    //   circle(keypoint.x + 200, keypoint.y, 20);
    // }
  }

  // fill(c);
  // square(mouseX, mouseY, 20);

  // loadPixels();
}
