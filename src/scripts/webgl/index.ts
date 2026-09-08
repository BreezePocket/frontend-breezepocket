/**
 * Public API of the hero WebGL scene (implemented in ./scene.ts).
 * The home page module calls `createScene()` once, then feeds it scroll progress.
 * This file is the contract: keep the signatures stable.
 */
export interface SceneOptions {
  /** Called once the first frames have rendered and the canvas can be revealed. */
  onReady?: () => void;
}

export interface SceneHandle {
  /** The canvas element appended to the mount. */
  canvas: HTMLCanvasElement;
  /** Resolves when assets are built and the scene has rendered a few frames. */
  ready: Promise<void>;
  /** 0..1 progress through the hero/flow scroll range. Drives the camera path. */
  setProgress(progress: number): void;
  /** Active flow step (0..3) — lets the scene highlight the matching area. */
  setSection(index: number): void;
  /** Plays the entrance move once the loader finishes. */
  playEntrance(): void;
  /** Pause/resume rendering (e.g. when the hero is far off-screen). */
  setPaused(paused: boolean): void;
  destroy(): void;
}

export async function createScene(mount: HTMLElement, options: SceneOptions = {}): Promise<SceneHandle> {
  const { createHeroScene } = await import('./scene');
  return createHeroScene(mount, options);
}
