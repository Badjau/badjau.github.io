import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import type { ModelPose } from './types';

type SceneOptions = {
  reducedMotion: boolean;
  onReady: () => void;
  onError: () => void;
};

export class KeyboardScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  private readonly modelRoot = new THREE.Group();
  private readonly clock = new THREE.Clock();
  private readonly pointer = new THREE.Vector2();
  private readonly targetRotation = new THREE.Vector3();
  private readonly targetPosition = new THREE.Vector3();
  private readonly resizeObserver: ResizeObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private frame = 0;
  private targetScale = 1;
  private dragYaw = 0;
  private dragPitch = 0;
  private scrollProgress = 0;
  private dragging = false;
  private active = true;
  private disposed = false;
  private lastPointer = new THREE.Vector2();

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly stage: HTMLElement,
    private readonly options: SceneOptions,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.35 : 1.7));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera.position.set(0, 0.25, 7.2);
    this.scene.fog = new THREE.FogExp2(0x0a0a09, 0.06);
    this.scene.add(this.modelRoot);
    this.addLighting();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(stage);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.active = entry.isIntersecting;
      if (this.active) this.render();
    }, { rootMargin: '160px' });
    this.intersectionObserver.observe(stage);

    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerUp);
    this.resize();
    this.render();
  }

  async load(modelUrl: string): Promise<void> {
    const loader = new DRACOLoader();
    loader.setDecoderPath('/draco/');
    loader.setDecoderConfig({ type: 'wasm' });

    try {
      const geometry = await loader.loadAsync(modelUrl);
      if (this.disposed) return;
      this.prepareGeometry(geometry);

      const material = new THREE.MeshStandardMaterial({
        color: 0x363832,
        metalness: 0.18,
        roughness: 0.56,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = mesh.receiveShadow = true;
      this.modelRoot.add(mesh);

      const size = new THREE.Vector3();
      geometry.boundingBox?.getSize(size);
      const largestDimension = Math.max(size.x, size.y, size.z);
      const normalization = 3.6 / Math.max(largestDimension, 0.001);
      mesh.scale.setScalar(normalization);

      this.options.onReady();
    } catch (error) {
      console.error('Unable to load the keyboard model.', error);
      this.options.onError();
    } finally {
      loader.dispose();
    }
  }

  setPose(pose: ModelPose, immediate = false): void {
    this.targetRotation.set(...pose.rotation);
    this.targetPosition.set(...pose.position);
    this.targetScale = pose.scale;
    if (immediate) {
      this.modelRoot.rotation.set(...pose.rotation);
      this.modelRoot.position.set(...pose.position);
      this.modelRoot.scale.setScalar(pose.scale);
    }
  }

  setScrollProgress(progress: number): void {
    this.scrollProgress = progress;
  }

  dispose(): void {
    this.disposed = true;
    window.cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerUp);
    this.modelRoot.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => material.dispose());
    });
    this.renderer.dispose();
  }

  private prepareGeometry(geometry: THREE.BufferGeometry): void {
    geometry.computeBoundingBox();
    geometry.center();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  }

  private addLighting(): void {
    this.scene.add(new THREE.HemisphereLight(0xdde7ff, 0x17120c, 1.35));

    const key = new THREE.DirectionalLight(0xffe7c2, 4.2);
    key.position.set(-3.5, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0xd7ff43, 3.1);
    rim.position.set(4, 1.2, -2.5);
    this.scene.add(rim);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.3 }),
    );
    floor.position.set(0, -1.72, 0);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  private resize(): void {
    const width = Math.max(this.stage.clientWidth, 1);
    const height = Math.max(this.stage.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.position.z = width < 700 ? 8.3 : 7.2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private render = (): void => {
    if (this.disposed) return;
    this.frame = window.requestAnimationFrame(this.render);
    if (!this.active) return;

    const elapsed = this.clock.getElapsedTime();
    const ease = this.options.reducedMotion ? 1 : 0.055;
    const idle = this.options.reducedMotion || this.dragging ? 0 : Math.sin(elapsed * 0.55) * 0.018;
    const authoredYaw = this.targetRotation.y + (this.options.reducedMotion ? 0 : (this.scrollProgress - 0.5) * 0.22);

    if (!this.dragging) {
      this.dragYaw *= 0.94;
      this.dragPitch *= 0.94;
    }
    this.modelRoot.rotation.x = THREE.MathUtils.lerp(this.modelRoot.rotation.x, this.targetRotation.x + this.dragPitch + idle, ease);
    this.modelRoot.rotation.y = THREE.MathUtils.lerp(this.modelRoot.rotation.y, authoredYaw + this.dragYaw, ease);
    this.modelRoot.rotation.z = THREE.MathUtils.lerp(this.modelRoot.rotation.z, this.targetRotation.z, ease);
    this.modelRoot.position.lerp(this.targetPosition, ease);
    const nextScale = THREE.MathUtils.lerp(this.modelRoot.scale.x, this.targetScale, ease);
    this.modelRoot.scale.setScalar(nextScale);
    this.renderer.render(this.scene, this.camera);
  };

  private onPointerDown = (event: PointerEvent): void => {
    this.dragging = true;
    this.pointer.set(event.clientX, event.clientY);
    this.lastPointer.copy(this.pointer);
    this.canvas.setPointerCapture(event.pointerId);
    this.stage.classList.add('is-dragging');
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging) return;
    this.pointer.set(event.clientX, event.clientY);
    this.dragYaw += (this.pointer.x - this.lastPointer.x) * 0.006;
    this.dragPitch = THREE.MathUtils.clamp(this.dragPitch + (this.pointer.y - this.lastPointer.y) * 0.004, -0.55, 0.55);
    this.lastPointer.copy(this.pointer);
  };

  private onPointerUp = (event: PointerEvent): void => {
    this.dragging = false;
    if (this.canvas.hasPointerCapture(event.pointerId)) this.canvas.releasePointerCapture(event.pointerId);
    this.stage.classList.remove('is-dragging');
  };
}
