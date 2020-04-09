const p5 = require("p5");
const Tone = require("tone");
const StartAudioContext = require("startaudiocontext");

// const synth = new Tone.Synth().toMaster();

var noise = new Tone.Noise("brown").start();
var autoFilter = new Tone.AutoFilter({
  "frequency" : "4m",
  "depth": 0.1,
  "min" : 800,
  "max" : 5000
}).connect(Tone.Master);

noise.connect(autoFilter);
autoFilter.start();

StartAudioContext(Tone.context);

let faceapi;
let detections;
let width = window.outerWidth;
let height = window.outerHeight-30;

const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
    Mobilenetv1Model: 'models',
    FaceLandmarkModel: 'models',
    FaceRecognitionModel: 'models',
    FaceExpressionModel: 'models',
};

const p5draw = (p) => {

    let p5video;

    let createImage, createSubtitle;

    let welcome = "subject has agreed to use webcam.";
    let text = "A VERY INTERACTIVE WEBPAGE";

    function drawBox(detections) {
        detections.forEach((detection) => {
            const alignedRect = detection.alignedRect;

            p.noFill();
            p.stroke(0);
            p.strokeWeight(2);
            p.rect(
                alignedRect._box._x,
                alignedRect._box._y,
                alignedRect._box._width,
                alignedRect._box._height,
            );
        });
    }

    p.setup = () => {
        p.createCanvas(width, height);
        p.background(0);

        p5video = p.createCapture(p.VIDEO);
        p5video.size(width, height);
        p5video.hide();

        faceapi = ml5.faceApi(p5video, detection_options, modelReady);

    }

    p.draw = () => {
        let textZoom;

        //p.image(p5video, 0, 0, p.width, p.height);

        let screenCssPixelRatio = (window.outerWidth - 8) / window.innerWidth;
        console.log(screenCssPixelRatio);

        if (detections) {
                p.background(0);

                if(detections.length > 0){
                    const detection = detections[0];
                    const headWidth = detection.alignedRect._box._width;

                    textZoom = p.map(headWidth, 250, 700, 15, 130);

                    createImage = p.createGraphics(width,height-100);

                    createImage.blendMode(p.BLEND);
                    createImage.background = (0);
                    createImage.blendMode(p.SCREEN);

                    createImage.push();
                    createImage.drawingContext.shadowColor = createImage.color(155);

                    if(headWidth < 250){
                        textBlur = 1;
                    } else {
                        textBlur = p.map(headWidth, 250, 700, 1, 100);
                    }
                    createImage.drawingContext.shadowBlur = textBlur;

                    createImage.textSize(textZoom);
                    createImage.fill(0);
                    createImage.textAlign(createImage.CENTER);
                    createImage.text(text, createImage.width/2, createImage.height/2);
                    createImage.pop();
                    createImage.loadPixels();
                    createImage.updatePixels();

                    p.image(createImage, 0, 50);

                    // if(headWidth < 250) {
                        
                    // } else {
                    //     for (let i = 0; i < height; i += 1) {
                    //         let distort = p.map(p.noise(i * textBlur), 0, 1, 0, 99);
                    //         createDistortion = createImage.get(0, i, width, 1);
                    //         p.image(createDistortion, distort, i);
                    //     }
                    // }
                }
            }
        }
}

function setup() {
    const myp5 = new p5(p5draw, "main");
}

function modelReady() {
    console.log("model ready!!!!");
    faceapi.detect(gotResults);
}

function gotResults(err, results) {
    if (err) {
        console.log(err);
        return;
    }

    detections = results;
    faceapi.detect(gotResults);
}

// Calls the setup function when the page is loaded
window.addEventListener("DOMContentLoaded", setup);
