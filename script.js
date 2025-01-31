const mapCanvas = document.getElementById("mapCanvas");
const ctx = mapCanvas.getContext("2d");

let drawing = false;
let seed = '';
let landmarks = [];
let mapData = [];
const width = mapCanvas.width;
const height = mapCanvas.height;
let scale = 0.01; // Adjust the scale for noise (larger value = zoomed out, smaller = zoomed in)
noise.seed(Math.random());

document.getElementById('generateMap').addEventListener('click', () => {
    reload(width / 2, height / 2);
});
document.getElementById('downloadMap').addEventListener('click', downloadMap);

mapCanvas.addEventListener("mousedown", (e) => {
    drawing = true;
    placeLandmark(e);
});

mapCanvas.addEventListener("mouseup", () => {
    drawing = false;
});

mapCanvas.addEventListener("wheel", function(event) {
    // Check if the user is scrolling up or down
    if (event.deltaY < 0) {
        // Scroll up (zoom in)
        scale *= 1.1;
    } else {
        // Scroll down (zoom out)
        scale /= 1.1;
    }

    // Prevent the default scroll behavior (like page scrolling)
    event.preventDefault();
    
    
    console.log(event.deltaY)
});

for (let y = 0; y < height; y++) {
    mapData[y] = [];
    for (let x = 0; x < width; x++) {
        // Get Perlin noise value (ranging from -1 to 1)
        const noiseValue = noise.perlin2(x * scale, y * scale);

        // Map the noise value to a height value (0-255)
        mapData[y][x] = (noiseValue + 1) * 128; // Normalize it to the range [0, 255]
    }
}

// Initialize Perlin noise with a random seed
function initializeNoise() {
    const seed = document.getElementById('seedInput').value || Math.random().toString(36).substr(2, 9);
    noise.seed(seed);
}

// Generate random terrain using Perlin noise
function generateTerrain() {
    initializeNoise(); // Set the seed for noise generation

    mapData = [];

    // Generate Perlin noise for the entire canvas
    for (let y = 0; y < height; y++) {
        mapData[y] = [];
        for (let x = 0; x < width; x++) {
            // Get Perlin noise value (ranging from -1 to 1)
            const noiseValue = noise.perlin2(x * scale, y * scale);

            // Map the noise value to a height value (0-255)
            mapData[y][x] = (noiseValue + 1) * 128; // Normalize it to the range [0, 255]
        }
    }
}

// Draw the generated terrain on the canvas
function drawTerrain(x, y) {
    const width = mapCanvas.width;
    const height = mapCanvas.height;

    for (let i = y - height / 2; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const heightValue = mapData[i][j];

            // Simple coloring based on terrain height
            if (heightValue < 100) {
                ctx.fillStyle = 'lightblue';  // Water
            } else if (heightValue < 130) {
                ctx.fillStyle = 'yellow';     // Desert
            } else if (heightValue < 170) {
                ctx.fillStyle = 'green';      // Grasslands
            } else {
                ctx.fillStyle = 'gray';       // Mountains
            }

            ctx.fillRect(j, i, 1, 1);  // Draw a 1px square for each pixel in the map
        }
    }

    // Draw any existing landmarks
    drawLandmarks();
}

// Place a landmark (small icon) on the terrain
function placeLandmark(e) {
    const x = e.offsetX;
    const y = e.offsetY;

    landmarks.push({ x, y });
    drawLandmarks();
}

function reload (x, y) {
    generateTerrain()
    drawTerrain(x, y)
}

// Draw the landmarks on top of the terrain
function drawLandmarks() {
    ctx.fillStyle = 'red';  // Landmark color
    landmarks.forEach((landmark) => {
        ctx.beginPath();
        ctx.arc(landmark.x, landmark.y, 5, 0, 2 * Math.PI);  // Small circle as a landmark
        ctx.fill();
    });
}

// For downloading the map as an image
function downloadMap() {
    const link = document.createElement("a");
    link.href = mapCanvas.toDataURL();
    link.download = "fantasy_map.png";
    link.click();
}

//function animate(){
//    requestAnimationFrame(animate);
    drawTerrain(width / 2, height / 2);
//}

//animate()
