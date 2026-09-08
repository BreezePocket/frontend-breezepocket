import { revealHeader } from '@/scripts/header';
import { lockScroll, unlockScroll } from '@/scripts/lenis';
import { prefersReducedMotion, qs } from '@/scripts/utils';
import { createScene, type SceneHandle } from '@/scripts/webgl';
import { initHero } from './home/hero';
import { initFlow } from './home/flow';
import { initFeatures } from './home/features';
import { initFaq } from './home/faq';

/**
 * Home page: loader sequence, hero scroll-hide, scroll-driven flow steps feeding the
 * WebGL camera, sticky features reveal and the FAQ accordion.
 */
const MIN_LOADER_MS = 2100;
const SCENE_TIMEOUT_MS = 6000;
const HERO_SHOW_DELAY_MS = 700;
const UNLOCK_DELAY_MS = 2200;
const LOADER_REMOVE_MS = 2500;

let scene: SceneHandle | null = null;
let pendingProgress: number | null = null;
let pendingSection: number | null = null;
let paused = false;
let revealed = false;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** Boots the WebGL scene; resolves once it has rendered (or immediately when unavailable). */
async function bootScene(mount: HTMLElement | null): Promise<void> {
  if (!mount || prefersReducedMotion()) return;
  try {
    const handle = await createScene(mount);
    scene = handle;
    if (pendingProgress !== null) scene.setProgress(pendingProgress);
    if (pendingSection !== null) scene.setSection(pendingSection);
    if (paused) scene.setPaused(true);
    // The loader may already have been dismissed by the timeout fallback: replay the reveal.
    if (revealed) {
      handle.canvas.classList.add('is-ready');
      handle.playEntrance();
    }
    await handle.ready;
  } catch (err) {
    console.warn('[home] WebGL scene unavailable', err);
  }
}

/** Pause rendering when the canvas is fully covered by the sections below the hero. */
function initScenePause() {
  const features = qs('.features');
  if (!features) return;
  let ticking = false;
  const check = () => {
    ticking = false;
    const covered = features.getBoundingClientRect().top < -window.innerHeight;
    if (covered === paused) return;
    paused = covered;
    scene?.setPaused(covered);
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(check);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  check();
}

/** Defers non-critical work until the browser is idle (like the original's Ui() scheduling). */
function whenIdle(fn: () => void) {
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(fn, { timeout: 1500 });
  else window.setTimeout(fn, 800);
}

function reveal() {
  if (revealed) return;
  revealed = true;
  const loader = document.getElementById('loader');
  if (scene) {
    scene.canvas.classList.add('is-ready');
    scene.playEntrance();
  }
  loader?.classList.add('hide');
  whenIdle(initFeatures);
  window.setTimeout(() => {
    qs('.hero')?.classList.add('show');
    revealHeader();
  }, HERO_SHOW_DELAY_MS);
  window.setTimeout(unlockScroll, UNLOCK_DELAY_MS);
  window.setTimeout(() => {
    if (loader) loader.style.display = 'none';
  }, LOADER_REMOVE_MS);
}

export function init() {
  lockScroll();

  initFaq();
  initHero();
  initFlow({
    onProgress: (progress) => {
      pendingProgress = progress;
      scene?.setProgress(progress);
    },
    onSection: (index) => {
      pendingSection = index;
      scene?.setSection(index);
    },
  });
  initScenePause();

  const sceneReady = Promise.race([bootScene(document.getElementById('app')), wait(SCENE_TIMEOUT_MS)]);
  Promise.all([sceneReady, wait(MIN_LOADER_MS)]).then(reveal);
}
