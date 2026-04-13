let img;
let sizeSlider, diffSlider, angleSlider;
let shapeSelector, iconSelector;
let images = {};
let icons = {
  Plane: "Chatham_Illustrations-07.png",
  Planet: "Chatham_Illustrations-08.png",
  People: "Chatham_Illustrations-09.png",
  Bike: "Chatham_Illustrations-10.png",
  Earphone: "Chatham_Illustrations-11.png",
};

function preload() {
  for (let key in icons) {
    images[key] = loadImage(icons[key]);
  }
}

function setup() {
  createCanvas(800, 800);
  pixelDensity(1);
  noStroke();
  loadAndProcessImage("Plane"); // 默认图像

  // 控制面板
  let controlPanel = createDiv();
  controlPanel.position(10, 10);
  controlPanel.style("background", "#ffffffdd");
  controlPanel.style("padding", "12px");
  controlPanel.style("border-radius", "10px");
  controlPanel.style("font-family", "Helvetica, sans-serif");
  controlPanel.style("width", "200px");
  controlPanel.style("box-shadow", "0 4px 8px rgba(0,0,0,0.1)");

  // 字体 & 通用样式
  const labelStyle =
    "margin: 6px 0 2px; font-size: 13px; font-weight: 600; color: #333";
  const sliderStyle = "width: 100%; margin-bottom: 10px";
  const dropdownStyle = "width: 100%; padding: 4px; margin-bottom: 10px";

  // 图标选择
  controlPanel.child(createP("Icon Version").style(labelStyle));
  iconSelector = createSelect();
  for (let key in icons) {
    iconSelector.option(key);
  }
  iconSelector.value("Plane");
  iconSelector.style(dropdownStyle);
  controlPanel.child(iconSelector);
  iconSelector.changed(() => {
    loadAndProcessImage(iconSelector.value());
  });

  // Scale of Stroke
  controlPanel.child(createP("Thickness").style(labelStyle));
  sizeSlider = createSlider(1, 200, 50);
  sizeSlider.style(sliderStyle);
  controlPanel.child(sizeSlider);

  // Size Difference
  controlPanel.child(createP("Thickness difference").style(labelStyle));
  diffSlider = createSlider(0, 100, 50);
  diffSlider.style(sliderStyle);
  controlPanel.child(diffSlider);

  // Stroke Shape
  controlPanel.child(createP("Stroke Shape").style(labelStyle));
  shapeSelector = createSelect();
  shapeSelector.option("ellipse");
  shapeSelector.option("square");
  shapeSelector.style(dropdownStyle);
  controlPanel.child(shapeSelector);

  // Stroke Rotate
  controlPanel.child(createP("Stroke Rotate").style(labelStyle));
  angleSlider = createSlider(0, 360, 0);
  angleSlider.style(sliderStyle);
  controlPanel.child(angleSlider);

  // 提示文字
  const instructions = createP("Press SPACE to save image.");
  instructions.style("font-size", 12);
  instructions.style("color", "#555");
  instructions.style("margin-top", "6px");
  controlPanel.child(instructions);
}

function draw() {
  background(255);
  if (!img) return;

  let step = 1;
  let offsetX = width / 2 - img.width / 2;
  let offsetY = height / 2 - img.height / 2;

  let maxSize = sizeSlider.value();
  let diff = diffSlider.value();
  let lightX = mouseX;
  let lightY = mouseY;
  let angle = radians(angleSlider.value());
  let shape = shapeSelector.value();

  for (let y = 0; y < img.height; y += step) {
    for (let x = 0; x < img.width; x += step) {
      let i = (int(x) + int(y) * img.width) * 4;
      let r = img.pixels[i];
      let g = img.pixels[i + 1];
      let b = img.pixels[i + 2];
      let brightness = (r + g + b) / 3;

      if (brightness < 230) {
        let canvasX = x + offsetX;
        let canvasY = y + offsetY;

        let d = dist(lightX, lightY, canvasX, canvasY);
        let norm = constrain(d / width, 0, 1);
        let eased = pow(1 - norm, 2.2);
        let S = pow(eased, 1.2) * diff + (maxSize - diff);
        S = max(S, 0.25);

        push();
        translate(canvasX, canvasY);
        rotate(angle);
        fill(0, 160);
        if (shape === "ellipse") {
          ellipse(0, 0, S, S);
        } else {
          rectMode(CENTER);
          rect(0, 0, S, S);
        }
        pop();
      }
    }
  }
}

function loadAndProcessImage(key) {
  img = images[key];
  img.resize(500, 500);
  img.filter(GRAY);
  img.loadPixels();
}

function keyPressed() {
  if (key === " " || key === "Spacebar") {
    saveCanvas("output", "png");
  }
}
