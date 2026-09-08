/**
 * Hero WebGL scene — a procedural low-poly world flown over by the scroll-driven camera.
 *
 * Layout (world units, Y up, one storey = 4; see ./constants.ts AREAS):
 *   A  downtown      (0, 0)        camera progress 0        "hero"
 *   B  power plant   (45, -100)    0.25                     "cleared to count"
 *   C  wind farm     (100, -240)   0.64                     "proven field match"
 *   D  campus        (190, -318)   0.82, pull-back to 1     "seamless arrival"
 * The districts are linked by red routes with blue signal lines (continuous pulse); the search
 * grid at the substation fades in over TIMING.grid and the campus emblem past TIMING.emblem.
 *
 * Camera: the home page feeds 0..1 camera progress (pages/home/flow.ts). It is smoothed with a
 * critically damped spring (smoothTime 0.15 s, 0.1 s on mobile) and turned into a pose by
 * CameraPath (./camera.ts). To tune the flight edit KEYFRAMES there: each entry is
 * {progress, target, azimuth, pitch, distance}; the camera position is derived from the target by
 * that spherical offset, and positions/targets are threaded through centripetal Catmull-Rom
 * splines sampled by arc length (constant speed between keyframes). Keep heights ~60–70 above the
 * floor (pitch/distance) so the tallest towers (~52) stay below the camera. Reveal windows for
 * lines, grid and emblem live in TIMING (./constants.ts).
 *
 * Rendering: transparent clear over the page colour, fog whose colour is pre-compensated for the
 * ACES tone mapper so the horizon dissolves exactly into the page, PCF soft shadows following the
 * look-at point, and (desktop only) an UnrealBloom pass with a high threshold so only the HDR line
 * pulses glow. Everything is built from primitives and batched into a handful of draw calls.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import type { SceneHandle, SceneOptions } from './index';
import {
  BASE_FOV,
  CameraPath,
  ENTRANCE_DURATION,
  ENTRANCE_HEIGHT,
  KEYFRAMES,
  responsiveFov,
  smoothDamp,
  type Spring,
} from './camera';
import { PALETTE } from './constants';
import { acesInverse } from './tonemap';
import { buildWorld, type WorldState } from './world';

const FOG_NEAR = 320;
const FOG_FAR = 720;
const EXPOSURE = 0.62;
const MAX_PIXEL_RATIO = 1.75;
/** Longest frame step we integrate; avoids jumps after the tab was hidden or the loop stalled. */
const MAX_DT = 1 / 20;
const READY_FRAMES = 3;
/** Pointer parallax amplitude in world units (desktop only). */
const PARALLAX = 1.5;
/** If the page never calls playEntrance() the camera still settles after this delay. */
const ENTRANCE_FALLBACK_MS = 6000;
/** Sun direction from the original bundle (0.5, 1.5, 0.25), placed at a fixed offset from the look-at point. */
const SUN_OFFSET = new THREE.Vector3(0.5, 1.5, 0.25).normalize().multiplyScalar(340);
/** Half-size of the orthographic shadow frustum around the look-at point. */
const SHADOW_EXTENT = 260;
const BLOOM = { strength: 0.8, radius: 0.35, threshold: 1.6 };

const isMobile = (): boolean =>
  window.matchMedia('(max-width: 820px)').matches || window.matchMedia('(pointer: coarse)').matches;
const hasFinePointer = (): boolean => window.matchMedia('(pointer: fine)').matches;

function createComposer(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): EffectComposer {
  const samples = Math.min(4, renderer.capabilities.maxSamples);
  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), BLOOM.strength, BLOOM.radius, BLOOM.threshold));
  composer.addPass(new OutputPass());
  return composer;
}

export async function createHeroScene(mount: HTMLElement, options: SceneOptions = {}): Promise<SceneHandle> {
  const mobile = isMobile();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = EXPOSURE;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const canvas = renderer.domElement;
  canvas.style.cssText = 'width:100vw;height:100lvh;touch-action:none;';
  mount.appendChild(canvas);

  const scene = new THREE.Scene();
  const page = new THREE.Color(PALETTE.page);
  const fogLinear = acesInverse([page.r, page.g, page.b], EXPOSURE);
  scene.fog = new THREE.Fog(new THREE.Color().setRGB(fogLinear[0], fogLinear[1], fogLinear[2]), FOG_NEAR, FOG_FAR);

  const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 1, 1400);

  const hemisphere = new THREE.HemisphereLight(0xffffff, PALETTE.main, 2);
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  const sun = new THREE.DirectionalLight(0xffffff, 2.6);
  sun.castShadow = true;
  const shadowSize = mobile ? 1024 : 2048;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  sun.shadow.camera.left = -SHADOW_EXTENT;
  sun.shadow.camera.right = SHADOW_EXTENT;
  sun.shadow.camera.top = SHADOW_EXTENT;
  sun.shadow.camera.bottom = -SHADOW_EXTENT;
  sun.shadow.camera.near = 40;
  sun.shadow.camera.far = 800;
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.2;
  scene.add(hemisphere, ambient, sun, sun.target);

  const world = buildWorld({ mobile });
  scene.add(world.group);
  const path = new CameraPath(KEYFRAMES);

  let composer: EffectComposer | null = null;
  if (!mobile) {
    try {
      if (renderer.extensions.has('EXT_color_buffer_float')) composer = createComposer(renderer, scene, camera);
    } catch (err) {
      console.warn('[scene] bloom unavailable, rendering without post-processing', err);
      composer = null;
    }
  }

  // --- runtime state -------------------------------------------------------------------------
  const spring: Spring = { value: 0, velocity: 0 };
  const smoothTime = mobile ? 0.1 : 0.15;
  let targetProgress = 0;
  const state: WorldState = { progress: 0, targetProgress: 0, time: 0, section: 0 };
  let entrance = 0;
  let entrancePlaying = false;
  const parallaxEnabled = !mobile && hasFinePointer();
  const pointer = new THREE.Vector2();
  const parallax = new THREE.Vector2();
  const camPosition = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  const axis = new THREE.Vector3();

  let rafId = 0;
  let lastTime = 0;
  let frames = 0;
  let apiPaused = false;
  let destroyed = false;
  let contextLost = false;
  let readyResolved = false;
  let resolveReady: () => void = () => {};
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });
  const markReady = (notify: boolean) => {
    if (readyResolved) return;
    readyResolved = true;
    if (notify) options.onReady?.();
    resolveReady();
  };

  let sized = false;
  function resize(): void {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    if (width <= 0 || height <= 0) return;
    sized = true;
    renderer.setSize(width, height, false);
    composer?.setSize(width, height);
    camera.aspect = width / height;
    camera.fov = responsiveFov(camera.aspect);
    camera.updateProjectionMatrix();
  }

  function update(dt: number): void {
    smoothDamp(spring, targetProgress, smoothTime, dt);
    state.progress = spring.value;
    state.targetProgress = targetProgress;

    path.poseAt(spring.value, camPosition, camTarget);
    if (entrancePlaying) {
      entrance = Math.min(1, entrance + dt / ENTRANCE_DURATION);
      if (entrance >= 1) entrancePlaying = false;
    }
    const eased = 1 - Math.pow(1 - entrance, 3);
    camera.position.copy(camPosition);
    camera.position.y += ENTRANCE_HEIGHT * (1 - eased);
    camera.lookAt(camTarget);

    if (parallaxEnabled) {
      const k = 1 - Math.exp(-4 * dt);
      parallax.x += (pointer.x - parallax.x) * k;
      parallax.y += (pointer.y - parallax.y) * k;
      axis.set(1, 0, 0).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(axis, parallax.x * PARALLAX);
      axis.set(0, 1, 0).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(axis, parallax.y * PARALLAX);
    }

    sun.position.set(camTarget.x + SUN_OFFSET.x, camTarget.y + SUN_OFFSET.y, camTarget.z + SUN_OFFSET.z);
    sun.target.position.copy(camTarget);

    world.update(dt, state);
  }

  /** After the first composed frame, drop back to plain rendering if the GL context reported an error. */
  function verifyComposer(): void {
    if (!composer) return;
    const gl = renderer.getContext();
    if (gl.getError() === gl.NO_ERROR) return;
    console.warn('[scene] post-processing reported a GL error, rendering without bloom');
    composer.dispose();
    composer = null;
  }

  function render(): void {
    if (composer) {
      composer.render();
      if (frames === 0) verifyComposer();
    } else {
      renderer.render(scene, camera);
    }
  }

  function frame(now: number): void {
    rafId = requestAnimationFrame(frame);
    if (!sized) {
      resize();
      if (!sized) return;
    }
    const dt = Math.min(Math.max((now - lastTime) / 1000, 0), MAX_DT);
    lastTime = now;
    state.time += dt;
    update(dt);
    render();
    frames++;
    if (frames === READY_FRAMES) markReady(true);
  }

  /** Starts or stops the rAF loop depending on pause/visibility/context state, without delta spikes. */
  function syncLoop(): void {
    const shouldRun = !apiPaused && !destroyed && !contextLost && !document.hidden;
    if (shouldRun && rafId === 0) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    } else if (!shouldRun && rafId !== 0) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  const onVisibility = () => syncLoop();
  const onResize = () => resize();
  const onPointer = (event: PointerEvent) => {
    pointer.set((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1));
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    syncLoop();
  };
  const onContextRestored = () => {
    contextLost = false;
    syncLoop();
  };

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  if (parallaxEnabled) window.addEventListener('pointermove', onPointer, { passive: true });
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);

  const playEntrance = () => {
    window.clearTimeout(entranceTimer);
    entrance = 0;
    entrancePlaying = true;
  };
  const entranceTimer = window.setTimeout(() => {
    if (!entrancePlaying && entrance < 1) playEntrance();
  }, ENTRANCE_FALLBACK_MS);

  resize();
  update(0);
  syncLoop();

  const handle: SceneHandle = {
    canvas,
    ready,
    setProgress(progress: number) {
      targetProgress = Math.max(0, Number.isFinite(progress) ? progress : 0);
      if (frames === 0) {
        spring.value = targetProgress;
        spring.velocity = 0;
      }
    },
    setSection(index: number) {
      state.section = Math.max(0, Math.min(3, Math.round(index)));
    },
    playEntrance,
    setPaused(paused: boolean) {
      apiPaused = paused;
      syncLoop();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      syncLoop();
      window.clearTimeout(entranceTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      world.dispose();
      composer?.dispose();
      composer = null;
      sun.shadow.dispose();
      renderer.dispose();
      canvas.remove();
      markReady(false);
    },
  };

  if (import.meta.env.DEV) {
    // Debug hook: lets tooling (and hidden tabs, where requestAnimationFrame never fires)
    // advance the simulation and render a frame on demand. Dev builds only.
    (window as unknown as { __heroScene?: unknown }).__heroScene = {
      handle,
      renderer,
      camera,
      scene,
      step(dt = 1 / 60) {
        if (!sized) resize();
        state.time += dt;
        update(dt);
        render();
        frames++;
        if (frames === READY_FRAMES) markReady(true);
      },
    };
  }

  return handle;
}
