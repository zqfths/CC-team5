import p5 from "p5";
import ml5 from "ml5";

let cam;
let poses = []; // the poseNet.on callback sets this from new poses

export default class Canvas {
  constructor() {
    this.p5 = new p5(createCanvas, "canvas1");

    function createCanvas(p5) {
      let methods = {
        setup: function () {
          this.createCanvas(500, 320);
          this.noStroke();
          // this.fill("red");
          // this.ellipse(this.width / 2, this.height / 2, 80, 80);
          // cam = this.createCapture(this.VIDEO);

          // const poseNet = ml5.poseNet(cam, { flipHorizontal: true }, () => {
          //   select("#status").hide();
          // });

          // poseNet.on("pose", (newPoses) => {
          //   poses = newPoses;
          // });

          // Hide the cam element, and just show the canvas
          // cam.hide();
        },

        draw: function () {
          // this.push();
          // this.translate(cam.width, 0);
          // this.scale(-1, 1);
          // this.image(cam, 0, 0);
          // this.pop();
          // this.drawKeypoints(poses);
          // this.drawSkeleton(poses);
        },

        drawKeypoints: function (poses) {
          for (let pose of poses) {
            for (let keypoint of pose.pose.keypoints) {
              if (keypoint.score > 0.2) {
                this.fill(0, 255, 0);
                this.noStroke();
                this.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
              }
            }
          }
        },

        drawSkeleton: function (poses) {
          for (let pose of poses) {
            for (let skeleton of pose.skeleton) {
              const [p1, p2] = skeleton;
              this.stroke(255, 0, 0);
              this.line(
                p1.position.x,
                p1.position.y,
                p2.position.x,
                p2.position.y
              );
            }
          }
        },
      };
      for (let method in methods) {
        p5[method] = methods[method];
      }

      return p5;
    }
  }
}
