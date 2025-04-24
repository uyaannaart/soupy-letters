const {
  Engine,
  Render,
  Runner,
  World,
  Body,
  Bodies,
  Events
} = Matter;

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: canvas.width,
    height: canvas.height,
    wireframes: false,
    background: 'transparent',
    pixelRatio: 1 // window.devicePixelRatio
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Add ground
const ground = Bodies.rectangle(
  canvas.width/4,
  canvas.height+50,
  canvas.width,
  100,
  {
    isStatic: true,
    render: {
      visible: true
    }
  }
);
// const ground = Bodies.rectangle(
//   canvas.width / 2,
//   canvas.height -5,
//   canvas.width,
//   20,
//   {
//     isStatic: true,
//     render: {
//       visible: true
//     }
//   }
// );

const wallThickness = 100;
const leftWall = Bodies.rectangle(-wallThickness / 2, canvas.height / 2, wallThickness, canvas.height, {
  isStatic: true,
  render: { visible: false }
});
const rightWall = Bodies.rectangle(canvas.width + wallThickness / 2, canvas.height / 2, wallThickness, canvas.height, {
  isStatic: true,
  render: { visible: false }
});

World.add(world, [ground, leftWall, rightWall]);

let letters = [];
let letterIndex = 0;

function createFallingLetter(char) {
  const size = 40;
  const spacing = size - 20;
  const maxPerRow = Math.floor(canvas.width / spacing);
  const x = 80 + (letterIndex % maxPerRow) * spacing;
  const y = -50;

  const letterBody = Bodies.circle(x, y, size, {
    restitution: 0.3,
    friction: 1,
    frictionStatic: 1,
    frictionAir: 0.02,
    label: char,
    render: {
      fillStyle: "transparent",
    
      lineWidth: 1
    }
  });

  letterIndex++;
  letters.push(letterBody);
  World.add(world, letterBody);
}

function resetScene() {
  letters.forEach(body => {
    World.remove(world, body);
  });
  letters = [];
  letterIndex = 0;
}

// Draw letters on top of rectangles
Events.on(render, "afterRender", () => {
  const ctx = render.context;
  ctx.font = "bold 48px 'Courier New', monospace";
  ctx.fillStyle = "#5e1784";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  letters.forEach(body => {
    if (!body.label) return;
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    ctx.fillText(body.label, 0, 0);
    ctx.restore();
  });
});

// Input handler
// document.getElementById("textInput").addEventListener("input", (e) => {
//   const char = e.target.value.slice(-1);
//   if (char && char !== ' ') {
//     createFallingLetter(char);
//   }
// });

//Keydown
document.addEventListener("keydown", (event) => {

  let char = event.key.toLowerCase();
  let isValid = /^[a-z]$/i.test(char);

  if(isValid) {
    createFallingLetter(char)
  }
});

// Clear button
document.getElementById("clearBtn").addEventListener("click", resetScene);
  
render.canvas.width = canvas.width;
render.canvas.height = canvas.height;
