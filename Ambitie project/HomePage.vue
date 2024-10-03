<template>
  <div class="app-container">
    <div ref="container" class="three-container"></div>

    <!-- Hamburger Menu Icon -->
    <div class="hamburger-menu" @click="toggleMenu" :class="{ open: isMenuOpen }">
      <div class="bar bar1"></div>
      <div class="bar bar2"></div>
      <div class="bar bar3"></div>
    </div>

    <!-- Dropdown Navigation Menu with Transition -->
    <transition name="menu">
      <div v-if="isMenuOpen" class="menu-overlay" @click.self="closeMenu">
        <nav class="menu">
          <ul>
            <li>
              <router-link to="/" @click="closeMenu">Welcome</router-link>
            </li>
            <li>
              <router-link to="/home" @click="closeMenu">Home</router-link>
            </li>
            <li>
              <router-link to="/about" @click="closeMenu">About Me</router-link>
            </li>
            <li>
              <router-link to="/projects" @click="closeMenu">Projects</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </transition>
  </div>
</template>

<script>
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default {
  name: 'HomePage',
  data() {
    return {
      transitioning: false,
      mouse: new THREE.Vector2(),
      isInitialAnimation: true,
      initialCameraZ: 300,
      targetCameraZ: 100,
      animationStartTime: null,
      animationDuration: 2000,
      eventsAdded: false,
      isMenuOpen: false,
      animatedShapes: [],
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

    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
  },
  beforeUnmount() {
    // Remove event listeners to prevent memory leaks
    window.removeEventListener('resize', this.onWindowResize, false);
    window.removeEventListener('mousemove', this.onMouseMove, false);
    if (this.eventsAdded) {
      this.renderer.domElement.removeEventListener('click', this.onClickBound, false);
    }
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
      this.camera.position.z = this.initialCameraZ;

      // Set up renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(color4, 1);
      this.$refs.container.appendChild(this.renderer.domElement);

      // Add ambient light to the scene
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      this.scene.add(ambientLight);

      // Create particle system
      this.createParticles(color2, color3);

      // Load fonts and create text meshes
      const loader = new FontLoader();
      loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
        // Create "Frontend" Text
        const text1 = 'Frontend';
        const textGeometry1 = new TextGeometry(text1, {
          font: font,
          size: 12,
          height: 4,
          curveSegments: 12,
        });
        textGeometry1.computeBoundingBox();
        textGeometry1.center();

        const textMaterial1 = new THREE.MeshPhongMaterial({ color: color1 });
        this.textMesh1 = new THREE.Mesh(textGeometry1, textMaterial1);
        this.textMesh1.position.y = 8;
        this.scene.add(this.textMesh1);

        // Create "Developer" Text
        const text2 = 'Developer';
        const textGeometry2 = new TextGeometry(text2, {
          font: font,
          size: 12,
          height: 4,
          curveSegments: 12,
        });
        textGeometry2.computeBoundingBox();
        textGeometry2.center();

        const textMaterial2 = new THREE.MeshPhongMaterial({ color: color1 });
        this.textMesh2 = new THREE.Mesh(textGeometry2, textMaterial2);
        this.textMesh2.position.y = -8;
        this.scene.add(this.textMesh2);

        // Create Subtitle Text
        const subtitleText = 'Vue - HTML - CSS - JS';
        const subtitleGeometry = new TextGeometry(subtitleText, {
          font: font,
          size: 4,
          height: 0.8,
          curveSegments: 12,
        });
        subtitleGeometry.computeBoundingBox();
        subtitleGeometry.center();

        const subtitleMaterial = new THREE.MeshPhongMaterial({ color: color2 });
        this.subtitleMesh = new THREE.Mesh(subtitleGeometry, subtitleMaterial);
        this.subtitleMesh.position.y = -24;
        this.scene.add(this.subtitleMesh);

        // Create Credit Text
        const creditText = 'Made by Jorn Noten';
        const creditGeometry = new TextGeometry(creditText, {
          font: font,
          size: 2.5,
          height: 0.4,
          curveSegments: 12,
        });
        creditGeometry.computeBoundingBox();
        creditGeometry.center();

        const creditMaterial = new THREE.MeshPhongMaterial({ color: color2 });
        const creditMesh = new THREE.Mesh(creditGeometry, creditMaterial);
        creditMesh.position.y = -34;
        this.scene.add(creditMesh);
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
    animate() {
      this.animationId = requestAnimationFrame(this.animate);

      const currentTime = performance.now();

      if (this.isInitialAnimation) {
        if (!this.animationStartTime) {
          this.animationStartTime = currentTime;
        }

        const elapsed = currentTime - this.animationStartTime;
        const progress = Math.min(elapsed / this.animationDuration, 1);

        // Smooth camera zoom-in effect
        this.camera.position.z = this.initialCameraZ - (this.initialCameraZ - this.targetCameraZ) * progress;

        if (progress === 1) {
          this.isInitialAnimation = false;

          if (!this.eventsAdded) {
            this.renderer.domElement.addEventListener('click', this.onClickBound, false);
            this.eventsAdded = true;
          }
        }
      } else {
        // Smooth camera movement based on mouse position
        this.camera.position.x += (this.mouse.x * 50 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse.y * 50 - this.camera.position.y) * 0.05;
      }

      // Floating animation for text meshes
      if (this.textMesh1 && this.textMesh2) {
        const floatY = Math.sin(currentTime * 0.001) * 0.5;
        this.textMesh1.position.y = 8 + floatY;
        this.textMesh2.position.y = -8 + floatY;
        if (this.subtitleMesh) {
          this.subtitleMesh.position.y = -24 + floatY;
        }
      }

      // Animate particle movement
      if (this.particles) {
        const positions = this.particles.geometry.attributes.position.array;
        const time = Date.now() * 0.001;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += 0.01 * Math.sin(time + positions[i + 1] * 0.1);
          positions[i + 1] += 0.01 * Math.cos(time + positions[i + 2] * 0.1);
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
      }

      // Update and manage animated shapes
      this.animatedShapes.forEach((shape, index) => {
        shape.update();
        if (shape.isFinished()) {
          this.scene.remove(shape.mesh);
          this.animatedShapes.splice(index, 1);
        }
      });

      // Render the scene from the perspective of the camera
      this.camera.lookAt(this.scene.position);
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
      const intersects = raycaster.intersectObjects(this.scene.children, true);

      let point = new THREE.Vector3();
      if (intersects.length > 0) {
        point.copy(intersects[0].point);
      } else {
        raycaster.ray.at(100, point);
      }

      // Add a new animated shape at the click position
      const animatedShape = new AnimatedShape(this.scene, point);
      this.animatedShapes.push(animatedShape);
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
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

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.three-container {
  width: 100%;
  height: 100%;
}

/* Hamburger Menu Styles */
.hamburger-menu {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 35px;
  height: 30px;
  cursor: pointer;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.5s ease;
}

.hamburger-menu.open {
  transform: rotate(90deg);
}

.hamburger-menu .bar {
  width: 100%;
  height: 4px;
  background-color: #C8ACD6;
  border-radius: 2px;
  transition: all 0.5s ease;
}

.hamburger-menu.open .bar1 {
  transform: rotate(-45deg) translate(-7px, 6px);
}

.hamburger-menu.open .bar2 {
  opacity: 0;
}

.hamburger-menu.open .bar3 {
  transform: rotate(45deg) translate(-7px, -6px);
}

/* Dropdown Menu Overlay Styles */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 1, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 15;
  backdrop-filter: blur(5px);
}

.menu {
  text-align: center;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu ul li {
  margin: 20px 0;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s forwards;
}

.menu ul li:nth-child(1) {
  animation-delay: 0.1s;
}

.menu ul li:nth-child(2) {
  animation-delay: 0.2s;
}

.menu ul li:nth-child(3) {
  animation-delay: 0.3s;
}

.menu ul li:nth-child(4) {
  animation-delay: 0.4s;
}

.menu ul li a {
  color: #C8ACD6;
  text-decoration: none;
  font-size: 2em;
  transition: color 0.3s ease, transform 0.3s ease;
  position: relative;
}

.menu ul li a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  background: #ffffff;
  left: 50%;
  bottom: -5px;
  transition: all 0.3s ease;
}

.menu ul li a:hover {
  color: #ffffff;
  transform: scale(1.1);
}

.menu ul li a:hover::after {
  width: 100%;
  left: 0;
}

/* Keyframes for Dropdown Menu Animation */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
