import * as THREE from "three";

const W = 1080, H = 1920;

export class ThreeScene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;

  private mesh: THREE.Mesh;
  private particles: THREE.Points;
  private ring: THREE.Mesh;

  private time = 0;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = W;
    this.canvas.height = H;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(W, H);
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    this.camera.position.set(0, 0, 8);
    this.camera.lookAt(0, 0, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0x222244, 0.5);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x0047ff, 2);
    dirLight.position.set(2, 3, 4);
    this.scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x00e676, 1.5);
    dirLight2.position.set(-2, -1, 3);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x0047ff, 3, 10);
    pointLight.position.set(0, 1, 2);
    this.scene.add(pointLight);

    // Main geometry — Icosahedron
    const geo = new THREE.IcosahedronGeometry(1.6, 1);
    const mat = new THREE.MeshPhongMaterial({
      color: 0x0047ff,
      emissive: 0x0047ff,
      emissiveIntensity: 0.3,
      specular: 0x00e676,
      shininess: 60,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.mesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e676,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(geo.clone(), wireMat);
    wireMesh.scale.set(1.02, 1.02, 1.02);
    this.mesh.add(wireMesh);

    // Ring around the shape
    const ringGeo = new THREE.TorusGeometry(2.2, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0047ff,
      transparent: true,
      opacity: 0.4,
    });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.ring.rotation.x = Math.PI / 3;
    this.scene.add(this.ring);

    // Ring ring 2 (perpendicular)
    const ring2Geo = new THREE.TorusGeometry(2.4, 0.02, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x00e676,
      transparent: true,
      opacity: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.z = Math.PI / 4;
    this.scene.add(ring2);

    // Particles
    const pCount = 200;
    const positions = new Float32Array(pCount * 3);
    const colors = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() > 0.5 ? [0, 0.28, 1] : [0, 0.9, 0.46];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);
  }

  render(t: number) {
    this.time = t;
    const s = Math.sin(t * 0.3) * 0.15;

    // Rotate main mesh
    this.mesh.rotation.x += 0.008;
    this.mesh.rotation.y += 0.012;
    this.mesh.rotation.z += 0.004;

    // Pulse scale
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    this.mesh.scale.set(pulse, pulse, pulse);

    // Ring rotation
    this.ring.rotation.z += 0.01;
    this.ring.rotation.y += 0.005;

    // Particles rotation
    this.particles.rotation.y += 0.002;
    this.particles.rotation.x += 0.001;

    // Material animation
    const mat = this.mesh.material as THREE.MeshPhongMaterial;
    const intensity = 0.2 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.5));
    mat.emissiveIntensity = intensity;
    mat.opacity = 0.7 + 0.15 * Math.sin(t * 0.8);

    // Camera bob
    this.camera.position.y = Math.sin(t * 0.5) * 0.3;
    this.camera.position.x = Math.sin(t * 0.3) * 0.2;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.renderer.setSize(W, H);
  }

  destroy() {
    this.renderer.dispose();
  }
}
