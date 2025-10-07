// Reference: https://docs.ml5js.org/#/reference/handpose

// ✓ 1. Set the video capture ✓
// ✓ 2. Connect ML5 ✓
// ✓ 3. Draw lines with hand ✓
// 4. Trace face
// 5. Trace face slowly
// 6. Add gestural movements from hand
// 7. Press button to stop

let video;
let handPose;
let hands = [];
let previousX = null;
let previousY = null;

let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let faces = [];

function preload() {
  handPose = ml5.handPose();
  faceMesh = ml5.faceMesh(options);
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

function setup() {
  createCanvas(640, 480);
  background(150);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  image(video, 0, 0, width, height);

  // Draw all the tracked face points
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
  }

  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let keypoint = hand.keypoints[8];
    fill(0, 255, 0);
    strokeWeight(1);

    if (previousX !== null && previousY !== null) {
      line(previousX, previousY, keypoint.x, keypoint.y);
    }

    previousX = keypoint.x;
    previousY = keypoint.y;
  }
}
