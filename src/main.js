const canvas = document.getElementById("albumCover");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 800;

// Palette of colors for the circles
const palette = [
  "#F82529", "#F86C25", "#F9A339", "#F9C54E",
  "#94C072", "#46AF8F"
];

// Default settings for animation
const settings = {
  backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark background
  gradientStart: "rgba(251, 56, 90, 0.4)", // Warm pink
  gradientEnd: "rgba(0, 0, 0, 0.8)", // Black
  glowIntensity: 30, // Shadow blur intensity
};

// Generate random settings for circles
let numArcs = Math.floor(Math.random() * 10) + 5; // Random number of arcs (5–15)
let speeds = Array.from({ length: numArcs }, () => Math.random() * 0.03 + 0.02); // Random speed (0.02–0.05)
let colors = Array.from({ length: numArcs }, () => palette[Math.floor(Math.random() * palette.length)]); // Random colors
let angles = Array.from({ length: numArcs }, () => 0); // Start angle for each arc
let radii = Array.from({ length: numArcs }, (_, i) => 100 + i * 20); // Layered radii for arcs

// Rotation angle for the text
let textAngle = 0;

// Star properties
let stars = [];
let numStars = 50;

// Initialize stars
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.05 + 0.02,
    growing: Math.random() > 0.5,
  });
}

// Draw the animated arcs for all layers and the stars
function drawAnimation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Background gradient
  let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width / 2);
  gradient.addColorStop(0, settings.gradientStart);
  gradient.addColorStop(1, settings.gradientEnd);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Apply shadow properties for arcs
  ctx.shadowColor = settings.gradientStart;
  ctx.shadowBlur = settings.glowIntensity;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Draw arcs
  for (let i = 0; i < numArcs; i++) {
    const radius = radii[i];
    const startAngle = angles[i];
    const endAngle = startAngle + Math.PI / 3; // Fixed arc size
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();

    angles[i] += speeds[i]; // Increment angle for movement
  }

  // Draw rotating text with gradient
  ctx.save();
  ctx.translate(centerX, centerY); // Move the origin to the center
  ctx.rotate(textAngle); // Apply rotation

  // Create gradient for the text
  const textGradient = ctx.createLinearGradient(-150, 0, 150, 0); // Horizontal gradient
  textGradient.addColorStop(0, "#F82529");
  textGradient.addColorStop(0.5, "#F86C25");
  textGradient.addColorStop(1, "#F9A339");

  ctx.font = "50px 'Playfair Display', serif"; // Text font
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = textGradient; // Apply the gradient
  ctx.shadowColor = "rgba(255, 255, 255, 0.7)"; // Glow for the text
  ctx.shadowBlur = 20;
  ctx.fillText("Sol y Sombra", 0, 0); // Draw text at the center
  ctx.restore();

  textAngle += 0.01; // Increment the text's rotation angle

  // Draw stars
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
    ctx.fillStyle = "#FFFFFF"; // White stars
    ctx.fill();
  }
}

// Animate the scene
function animate() {
  drawAnimation();
  requestAnimationFrame(animate);
}

// Initialize Tweakpane (without color selection)
const pane = new Tweakpane.Pane();

pane.addInput(settings, "backgroundColor", { label: "Background Color" }).on("change", () => {});
pane.addInput(settings, "gradientStart", { label: "Gradient Start" }).on("change", () => {});
pane.addInput(settings, "gradientEnd", { label: "Gradient End" }).on("change", () => {});
pane.addInput(settings, "glowIntensity", { label: "Glow Intensity", min: 0, max: 50 }).on("change", () => {});

// Start animation
animate();

// Diviser chaque titre en lettres et les envelopper dans un élément <span>
const titles = document.querySelectorAll('h1.waveTitle'); // Sélectionner tous les h1 avec la classe waveTitle

titles.forEach(title => {
  const text = title.textContent;
  title.innerHTML = ''; // Vider le contenu actuel du titre

  // Ajouter chaque lettre dans un <span>
  text.split('').forEach((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter;
    title.appendChild(span);
    
    // Ajouter un délai pour chaque lettre, créant l'effet de vague
    span.style.animationDelay = `${index * 0.05}s`;

    // Ajouter un peu d'espacement entre les lettres
    span.style.marginRight = '5px';  // Vous pouvez ajuster cette valeur
  });
});

