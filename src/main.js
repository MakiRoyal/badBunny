const canvas = document.getElementById("albumCover");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

const warmPalette = [
  "#FF5733", "#FF6F61", "#FF8C42", "#FFB300",
  "#F9C74F", "#F39C12", "#E74C3C", "#D35400"
];

const settings = {
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  gradientStart: "rgba(251, 56, 90, 0.4)",
  gradientEnd: "rgba(0, 0, 0, 0.8)",
  glowIntensity: 30,
};

let numArcs = Math.floor(Math.random() * 10) + 5;
let speeds = Array.from({ length: numArcs }, () => Math.random() * 0.03 + 0.02);
let colors = Array.from({ length: numArcs }, () => warmPalette[Math.floor(Math.random() * warmPalette.length)]);
let angles = Array.from({ length: numArcs }, () => 0);
let radii = Array.from({ length: numArcs }, (_, i) => 100 + i * 20);

let textAngle = 0;

let stars = [];
let numStars = 50;
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.05 + 0.02,
    growing: Math.random() > 0.5,
  });
}

function drawAnimation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;


  let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width / 2);
  gradient.addColorStop(0, settings.gradientStart);
  gradient.addColorStop(1, settings.gradientEnd);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  ctx.shadowColor = settings.gradientStart;
  ctx.shadowBlur = settings.glowIntensity;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;


  for (let i = 0; i < numArcs; i++) {
    const radius = radii[i];
    const startAngle = angles[i];
    const endAngle = startAngle + Math.PI / 3;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();

    angles[i] += speeds[i]; 
  }


  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(textAngle);

  const textGradient = ctx.createLinearGradient(-150, 0, 150, 0);
  textGradient.addColorStop(0, "#FF5733");
  textGradient.addColorStop(0.5, "#FF6F61");
  textGradient.addColorStop(1, "#FF8C42");

  ctx.font = "50px 'Playfair Display', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = textGradient;
  ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
  ctx.shadowBlur = 20;
  ctx.fillText("Sol y Sombra", 0, 0);
  ctx.restore();

  textAngle += 0.01;


  for (let i = 0; i < numStars; i++) {
    let star = stars[i];
    if (star.growing) {
      star.size += star.speed;
      if (star.size > 1.5) star.growing = false;
    } else {
      star.size -= star.speed;
      if (star.size < 1) star.growing = true;
    }
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  }
}

function animate() {
  drawAnimation();
  requestAnimationFrame(animate);
}

animate();

const pane = new Tweakpane.Pane();
pane.addInput(settings, "backgroundColor", { label: "Background Color" }).on("change", () => {});
pane.addInput(settings, "gradientStart", { label: "Gradient Start" }).on("change", () => {});
pane.addInput(settings, "gradientEnd", { label: "Gradient End" }).on("change", () => {});
pane.addInput(settings, "glowIntensity", { label: "Glow Intensity", min: 0, max: 50 }).on("change", () => {});
