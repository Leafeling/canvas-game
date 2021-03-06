class TestScene extends Scene {
  camera = null;

  constructor() {
    super();
    this.init();
  }

  init() {
    this.camera = new Camera(this);
    var character = new Spearman();
    this.gameObjects.push(character);
  }

  update(ctx, step) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.imageSmoothingEnabled = false;
    this.camera.draw(ctx, step);
  }
}

class Camera {
  scene = null;
  center = new Vector2(0, 0);
  unitsPerPixel = .3;

  constructor(scene) {
    this.scene = scene;
  }

  draw(ctx, step) {
    this.scene.gameObjects.forEach((obj) => {
      //obj.update(ctx, step);

      ctx.save();

      let i = obj.getDrawInstructions();
      ctx.translate(i.drawRect.x, i.drawRect.y);
      ctx.drawImage(i.image,
        i.imageRect.x, i.imageRect.y,
        i.imageRect.w, i.imageRect.h,
        -i.drawRect.w / 2, -i.drawRect.h / 2,
        (1 / this.unitsPerPixel) * i.drawRect.w, (1 / this.unitsPerPixel) * i.drawRect.h);

      ctx.restore();
    });
  }
}

class DrawInstructions {
  drawRect;
  image;
  imageRect;

  constructor(drawRect, image, imageRect) {
    this.drawRect = drawRect;
    this.image = image;
    this.imageRect = imageRect;
  }
}

class Character extends GameObject {
  input = new ArrowInput();

  update(ctx, step) {
    ctx.fillStyle = `rgb(0,${255 - (step / 2 % 255)},0)`;
    //if (this.input.up > 0) ctx.fillRect(0, 0, 10, 10);
  }
}

class Spearman extends Character {
  spritesheet = new Image();
  draw = false;
  spriteWidth = 86;
  spriteHeight = 64;

  constructor() {
    super();
    this.vector2 = new Vector2(100, 100);

    this.spritesheet = new Image();
    this.spritesheet.onload = () => { this.draw = true; };
    this.spritesheet.src = './sprite/spearman.png';
  }

  update(ctx, step) {
    ctx.fillStyle = `rgb(0,${255 - (step / 2 % 255)},0)`;
    ctx.fillRect(0, 0, 10, 10);

    if (!this.draw) return;
    ctx.imageSmoothingEnabled = false;

    ctx.save();

    ctx.translate(this.vector2.x, this.vector2.y);
    ctx.scale(1, 1);
    ctx.drawImage(this.spritesheet,
      0, 0,
      this.spriteWidth, this.spriteHeight,
      -this.spriteWidth / 2, -this.spriteHeight / 2,
      2 * this.spriteWidth, 2 * this.spriteHeight);

    ctx.restore();
  }

  getDrawInstructions() {
    return new DrawInstructions(
      { x: this.vector2.x, y: this.vector2.y, w: this.spriteWidth, h: this.spriteHeight },
      this.spritesheet,
      { x: 0, y: 0, w: this.spriteWidth, h: this.spriteHeight });
  }
}

// Bind the game engine to a canvas element.
function bind(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    return console.error("Could not bind to canvas: given object was not a canvas.");
  }

  window.engine = new Engine(canvas);
  engine.init();
  console.log("Engine bound to", canvas);

  init();
}

function init() {
  engine.sceneManager.loadSingle(new TestScene());
}

function fixAspectRatio() {
  if (!engine) {
    return console.error("Couldn't fix aspect ratio on non-existent game.");
  }

  var w = window.innerWidth;
  var h = 9.0 * window.innerWidth / 16.0;

  if (h > window.innerHeight) {
    w = 16.0 * window.innerHeight / 9.0;
    h = window.innerHeight;
  }

  engine.canvas.width = w + 1;
  engine.canvas.height = h;
}

window.onload = () => {
  bind(document.getElementById('canvas'));
  fixAspectRatio();
};

window.onresize = fixAspectRatio;
