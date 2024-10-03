<template>
  <div ref="container" class="three-container"></div>
</template>

<script>
import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';

export default {
  name: 'WelcomePage',
  data() {
    return {
      transitioning: false,
      mouse: new THREE.Vector2(),
      startTime: null,
    };
  },
  mounted() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationId = null;

    this.initThree();
    this.animate = this.animate.bind(this);
    this.animate();

    // Add event listeners for window resize and mouse movement
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    this.renderer.domElement.addEventListener('click', this.onClick.bind(this), false);
  },
  beforeDestroy() {
    // Remove event listeners to prevent memory leaks
    window.removeEventListener('resize', this.onWindowResize, false);
    window.removeEventListener('mousemove', this.onMouseMove, false);
    this.renderer.domElement.removeEventListener('click', this.onClick.bind(this), false);
    cancelAnimationFrame(this.animationId);
    if (this.renderer) {
      this.renderer.forceContextLoss();
      this.renderer.dispose();
    }
  },
  methods: {
    initThree() {
      // Define color palette
      const color1 = '#ffffff';
      const color2 = '#C8ACD6';
      const color3 = '#433D8B';
      const color4 = '#000100';

      // Initialize Three.js scene
      this.scene = new THREE.Scene();
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set up camera
      this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
      this.camera.position.z = 100;

      // Set up renderer
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(color4);
      this.$refs.container.appendChild(this.renderer.domElement);

      // Add ambient light to the scene
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      this.scene.add(ambientLight);

      // Create particle system
      this.createParticles(color2, color3);

      // Load fonts and create text meshes
      const loader = new FontLoader();
      loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
        // Create "WELCOME" Text
        const text = 'WELCOME';
        const textGeometry = new TextGeometry(text, {
          font: font,
          size: 20,
          height: 5,
          curveSegments: 12,
        });
        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshPhongMaterial({color: color1});
        this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
        this.scene.add(this.textMesh);

        // Create instruction text with individual word meshes
        const instructionWords = ['Click', 'to', 'continue'];
        const instructionMeshes = [];
        const wordSpacing = 2; // Adjust spacing between words
        let totalWidth = 0;
        const wordGeometries = [];

        // Generate geometries for each instruction word
        for (let i = 0; i < instructionWords.length; i++) {
          const word = instructionWords[i];
          const wordGeometry = new TextGeometry(word, {
            font: font,
            size: 5,
            height: 1,
            curveSegments: 12,
          });
          wordGeometry.computeBoundingBox();
          wordGeometry.translate(-wordGeometry.boundingBox.min.x, 0, 0);
          const wordWidth = wordGeometry.boundingBox.max.x - wordGeometry.boundingBox.min.x;
          totalWidth += wordWidth + wordSpacing;

          wordGeometries.push({geometry: wordGeometry, width: wordWidth, word});
        }

        totalWidth -= wordSpacing;
        let currentPosition = -totalWidth / 2;

        // Position each instruction word mesh
        for (let i = 0; i < wordGeometries.length; i++) {
          const {geometry, width, word} = wordGeometries[i];
          let material;
          if (word === 'Click') {
            material = new THREE.MeshPhongMaterial({color: color1});
          } else {
            material = new THREE.MeshPhongMaterial({color: color2});
          }
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.x = currentPosition;
          mesh.position.y = -30;
          currentPosition += width + wordSpacing;
          this.scene.add(mesh);
          instructionMeshes.push(mesh);

          // Store the "Click" mesh separately for interaction
          if (word === 'Click') {
            this.clickMesh = mesh;
          }
        }
      });

      // Bind the onClick method for later removal
      this.onClickBound = this.onClick.bind(this);
    },
    createParticles(colorStart, colorEnd) {
      const particleCount = 5000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorStartObj = new THREE.Color(colorStart);
      const colorEndObj = new THREE.Color(colorEnd);

      // Initialize particle positions and colors
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() * 2 - 1) * 500;
        positions[i * 3 + 1] = (Math.random() * 2 - 1) * 500;
        positions[i * 3 + 2] = (Math.random() * 2 - 1) * 500;

        const color = colorStartObj.clone().lerp(colorEndObj, Math.random());
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 2,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
        vertexColors: true,
      });

      this.particles = new THREE.Points(geometry, material);
      this.scene.add(this.particles);
    },
    animate(time) {
      this.animationId = requestAnimationFrame(this.animate);

      if (this.textMesh && !this.transitioning) {
        // Subtle floating effect for "WELCOME" text
        this.textMesh.position.y += Math.sin(Date.now() * 0.001) * 0.005;
      }

      if (this.transitioning && this.startTime !== null) {
        const elapsed = time - this.startTime;
        const duration = 3000; // Transition duration in milliseconds
        const progress = Math.min(elapsed / duration, 1);

        // Move camera forward through the scene
        this.camera.position.z -= progress * 2;

        // Optional slight rotation for effect
        this.camera.rotation.y += 0.001;

        if (progress === 1) {
          // Transition to the next page after animation completes
          this.$router.push('/home');
          return;
        }
      }

      if (this.particles) {
        // Animate particle movement
        const positions = this.particles.geometry.attributes.position.array;
        const time = Date.now() * 0.001;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += 0.01 * Math.sin(time + positions[i + 1] * 0.1);
          positions[i + 1] += 0.01 * Math.cos(time + positions[i + 2] * 0.1);
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
      }

      // Enable camera movement with mouse when not transitioning
      if (!this.transitioning) {
        this.camera.position.x += (this.mouse.x * 50 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse.y * 50 - this.camera.position.y) * 0.05;
      }
      this.camera.lookAt(this.scene.position);

      // Render the scene from the perspective of the camera
      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },
    onMouseMove(event) {
      // Update mouse vector with normalized device coordinates
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    onClick(event) {
      if (this.transitioning) return;

      const rect = this.renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      // Check if "Click" word was clicked
      if (this.clickMesh) {
        const intersects = raycaster.intersectObject(this.clickMesh);
        if (intersects.length > 0) {
          // Function to generate a random color
          const getRandomColor = () => {
            const randomR = Math.floor(Math.random() * 256);
            const randomG = Math.floor(Math.random() * 256);
            const randomB = Math.floor(Math.random() * 256);
            return `rgb(${randomR}, ${randomG}, ${randomB})`;
          };

          // Change "WELCOME" text color to a random color from the full spectrum
          const randomColor = getRandomColor();
          this.textMesh.material.color.set(randomColor);
          return;
        }
      }

      // Start transition to the next page if "Click" wasn't clicked
      this.startTransition();
    },
    startTransition() {
      this.transitioning = true;
      this.startTime = performance.now();
    },
  },
};

// Class to handle animated shapes added on user interaction
class AnimatedShape {
  constructor(scene, position) {
    this.scene = scene;
    this.position = position.clone();

    // Randomly select a shape type
    const shapeTypes = ['cube', 'sphere', 'cone'];
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

    let geometry;
    switch (type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(2, 2, 2);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1, 32, 32);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(1, 2, 32);
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 2, 2);
    }

    // Create material with random color and additive blending for visual effect
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
    });

    // Create mesh and add to scene
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);

    // Initialize animation properties
    this.scale = 1;
    this.rotationSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
    );

    this.lifespan = 200;
    this.age = 0;
  }

  update() {
    // Rotate the shape
    this.mesh.rotation.x += this.rotationSpeed.x;
    this.mesh.rotation.y += this.rotationSpeed.y;
    this.mesh.rotation.z += this.rotationSpeed.z;

    // Scale up the shape over time
    this.scale += 0.02;
    this.mesh.scale.set(this.scale, this.scale, this.scale);

    // Fade out the shape's opacity
    const remaining = 1 - this.age / this.lifespan;
    this.mesh.material.opacity = remaining;

    this.age++;
  }

  isFinished() {
    // Determine if the shape has reached its lifespan
    return this.age >= this.lifespan;
  }
}
</script>

<style>
.three-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

body {
  margin: 0;
}
</style>
