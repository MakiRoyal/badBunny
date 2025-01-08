const canvas = document.getElementById("albumCover");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 800;

// Colors for the animation (warm colors only)
const colors = [
  "rgba(251, 56, 90, 0.7)",  // Warm pink (#FB385A)
  "rgba(248, 108, 37, 0.7)"   // Warm orange (#F86C25)
];

// Variables for the animation
let angles = []; // Array to store individual angles for each arc
let radii = []; // Array to store individual radii for each arc
let speeds = []; // Array to store random speeds for each arc

let numArcs = 30; // Increased the number of arcs (more lines)
let arcDistance = 40; // Distance from the center to the arc's endpoint
let numLayers = 6; // Number of layers of arcs (increased for more complexity)

// Star properties
let stars = [];
let numStars = 50; // Number of stars

// Initialize the properties for each arc in each layer
for (let layer = 0; layer < numLayers; layer++) {
  let anglesLayer = [];
  let radiiLayer = [];
  let speedsLayer = [];

  for (let i = 0; i < numArcs; i++) {
    anglesLayer.push(0); // Start angle for each arc
    radiiLayer.push(150 - (layer * 30)); // Decrease radius for each layer
    speedsLayer.push(Math.random() * 0.05 + 0.01); // Random speed for each arc
  }

  angles.push(anglesLayer);
  radii.push(radiiLayer);
  speeds.push(speedsLayer);
}

// Initialize the stars with random positions and sizes
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width, // Random x position
    y: Math.random() * canvas.height, // Random y position
    size: Math.random() * 2 + 1, // Random size between 1 and 3
    speed: Math.random() * 0.05 + 0.02, // Speed of size change
    growing: Math.random() > 0.5 // Randomly decide if the star is growing or shrinking
  });
}

// Function to draw the stars that will form the text "Bad Bunny"
function drawTextWithStars(text, x, y) {
  ctx.font = "70px 'Playfair Display', serif"; // Using Playfair Display font
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  
  // Loop over each character of the text
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Draw stars around each character
    for (let j = 0; j < 100; j++) { // 100 stars per character
      const offsetX = (i * 75) + Math.random() * 10 - 5; // Position of each star around the character
      const offsetY = Math.random() * 10 - 5;
      
      // Draw a star
      ctx.beginPath();
      ctx.arc(x + offsetX, y + offsetY, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // White stars with some transparency
      ctx.fill();
    }
  }

  // Draw the text itself at the center position
  ctx.fillText(text, x, y);
}

// Draw the animated arcs for all layers and the stars
function drawAnimation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Background color with gradient to simulate a dreamy, glowing effect
  let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width / 2);
  gradient.addColorStop(0, "rgba(251, 56, 90, 0.4)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.8)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Apply shadow properties to create the glowing effect with warm colors
  ctx.shadowColor = "rgba(248, 108, 37, 0.7)"; // Warm orange shadow for glowing effect
  ctx.shadowBlur = 30; // Increase this value for a more intense glow
  ctx.shadowOffsetX = 0; // No horizontal shadow offset
  ctx.shadowOffsetY = 0; // No vertical shadow offset

  // Loop through each layer of arcs
  for (let layer = 0; layer < numLayers; layer++) {
    for (let i = 0; i < numArcs; i++) {
      let radius = radii[layer][i];

      // Draw the animated arcs around the center
      const startAngle = angles[layer][i] + (i * Math.PI / (numArcs / 2)); // Spread arcs evenly around the circle
      const endAngle = startAngle + Math.PI / (numArcs / 2); // Control the size of each arc

      // Set the color for each arc (using the two specified warm colors)
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 3;

      // Draw the arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + arcDistance, startAngle, endAngle);
      ctx.stroke();
      
      // Update the angle for this arc's movement (different speeds)
      angles[layer][i] += speeds[layer][i]; // Increment the angle based on the arc's speed
    }
  }

  // Draw stars in the background
  for (let i = 0; i < numStars; i++) {
    let star = stars[i];

    // Update the star size
    if (star.growing) {
      star.size += star.speed; // Increase size
      if (star.size > 1.5) {
        star.growing = false; // Switch to shrinking
      }
    } else {
      star.size -= star.speed; // Decrease size
      if (star.size < 1) {
        star.growing = true; // Switch to growing
      }
    }

    // Draw the star
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 3);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // White stars with some transparency
    ctx.fill();
  }

}

// Animate the scene
function animate() {
  drawAnimation(); // Draw the animated arcs and stars
  requestAnimationFrame(animate); // Repeat the animation
}

// Start animation
animate();
