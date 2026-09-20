/**
 * ============================================================================
 * TACTIC ANIMATOR & RECORDING ENGINE (Vanilla JS / TypeScript ES6 Module)
 * ============================================================================
 * 
 * A high-performance, modular tactical animation engine for HTML5 Canvas, SVG,
 * and Web Graphics.
 * 
 * Features:
 * 1. Automatic Keyframe Step Recording on mouse/touch release (mouseup / touchend)
 * 2. Initial State Snapshot & Instant Reset before playback
 * 3. 3-Second Visual Countdown Overlay (3, 2, 1) directly on the pitch
 * 4. Smooth Sequential Keyframe Animation using LERP & requestAnimationFrame
 * 5. Opponent Pressing Simulation (calculates closest defender & moves them to press)
 * 6. Playback controls: Play, Pause, Step Forward/Back, Speed Scaling, Scrubbing
 */

export interface Vector2D {
  x: number; // 0 to 100 percentage coordinates
  y: number; // 0 to 100 percentage coordinates
}

export interface RecordedStep {
  elementId: string; // Player ID or 'ball'
  type?: 'player' | 'ball';
  team?: 'home' | 'away';
  from: Vector2D;
  to: Vector2D;
  order: number; // Sequential step index (0, 1, 2, ...)
  timestamp?: number;
  duration?: number; // Duration in milliseconds for this step
  label?: string;
  carriedBall?: boolean; // True if player carries/dribbles the ball in this step
  ballFrom?: Vector2D; // Initial ball position during player carry
  ballTo?: Vector2D; // Target ball position at player feet after move
}

export interface ElementSnapshot {
  id: string;
  type: 'player' | 'ball';
  team?: 'home' | 'away';
  x: number;
  y: number;
  number?: number;
  name?: string;
}

export type PlaybackStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'completed';
export type PlaybackMode = 'sequential' | 'unit';

export interface FrameState {
  status: PlaybackStatus;
  playbackMode?: PlaybackMode;
  currentStepIndex: number;
  totalSteps: number;
  stepProgress: number; // 0.0 to 1.0 within current step
  overallProgress: number; // 0.0 to 1.0 across entire animation
  countdownValue: number | null; // 3, 2, 1, or null
  countdownFraction: number; // 0.0 to 1.0 within the current countdown second
  activeElementId: string | null;
  positions: Record<string, Vector2D>;
  ballPos: Vector2D;
  hasUnplayedSteps?: boolean;
  lastCompletedStepIndex?: number;
}

export type FrameListener = (state: FrameState) => void;
export type StatusListener = (status: PlaybackStatus) => void;
export type CountdownListener = (count: number, fraction: number) => void;

/**
 * Smooth Natural Easing Function for Responsive Athletic Player Movement
 * Eliminates sluggish dead-zones at start/end while keeping motion silky smooth
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * High-Precision Hermite Smoothstep for organic pitch transitions
 */
export function smoothStep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Linear Interpolation (LERP) between two scalar values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Linear Interpolation between two 2D Points
 */
export function lerp2D(p1: Vector2D, p2: Vector2D, t: number): Vector2D {
  return {
    x: lerp(p1.x, p2.x, t),
    y: lerp(p1.y, p2.y, t),
  };
}

/**
 * Euclidean distance between two 2D points
 */
export function distance2D(p1: Vector2D, p2: Vector2D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * ============================================================================
 * TACTIC ANIMATOR ENGINE CLASS
 * ============================================================================
 */
export interface ElementTrajectory {
  id: string;
  type: 'player' | 'ball';
  team: 'home' | 'away';
  start: Vector2D;
  end: Vector2D;
  waypoints: Vector2D[];
  carriedBall?: boolean;
  ballFrom?: Vector2D;
  ballTo?: Vector2D;
}

export class TacticAnimator {
  public steps: RecordedStep[] = [];
  public initialPositions: Record<string, ElementSnapshot> = {};
  public currentPositions: Record<string, Vector2D> = {};
  public ballPos: Vector2D = { x: 50, y: 50 };
  
  public status: PlaybackStatus = 'idle';
  public playbackMode: PlaybackMode = 'sequential';
  public currentStepIndex: number = 0;
  public stepProgress: number = 0;
  public unitProgress: number = 0;
  public playbackSpeed: number = 1.0;
  public stepDurationMs: number = 520; // Base milliseconds per step for fluid, athletic motion
  public pauseBetweenStepsMs: number = 30; // Crisp inter-action transition
  public lastCompletedStepIndex: number = -1;

  // Internal Animation Loop State
  private rafId: number | null = null;
  private animationStartTime: number = 0;
  private stepStartTime: number = 0;
  private unitStartTime: number = 0;
  private countdownStartTime: number = 0;
  private countdownDurationMs: number = 3000;
  private listeners: Set<FrameListener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();

  constructor() {
    this.resetState();
  }

  /**
   * Register an element's initial position before any drag occurs
   */
  public registerInitialElement(
    id: string,
    x: number,
    y: number,
    type: 'player' | 'ball' = 'player',
    team: 'home' | 'away' = 'home'
  ): void {
    this.initialPositions[id] = { id, x, y, type, team };
    this.currentPositions[id] = { x, y };
    if (id === 'ball' || type === 'ball') {
      this.ballPos = { x, y };
    }
  }

  /**
   * Snapshot a whole squad / board of initial positions
   */
  public setInitialState(elements: ElementSnapshot[]): void {
    this.initialPositions = {};
    elements.forEach((el) => {
      this.initialPositions[el.id] = { ...el };
      this.currentPositions[el.id] = { x: el.x, y: el.y };
      if (el.id === 'ball' || el.type === 'ball') {
        this.ballPos = { x: el.x, y: el.y };
      }
    });
  }

  /**
   * AUTOMATIC STEP RECORDING (ON RELEASE):
   * Call this in `mouseup` / `touchend` / `pointerup` after dragging a player or ball.
   * Immediately records the movement as a keyframe.
   */
  public recordStep(
    elementId: string,
    from: Vector2D,
    to: Vector2D,
    options?: {
      type?: 'player' | 'ball';
      team?: 'home' | 'away';
      label?: string;
      carriedBall?: boolean;
      ballFrom?: Vector2D;
      ballTo?: Vector2D;
    }
  ): RecordedStep | null {
    // If movement is negligible (under 0.5% pitch distance), ignore click jitter
    if (distance2D(from, to) < 0.4) {
      return null;
    }

    // Capture initial position if not already tracked
    const hasExistingStepForElement = this.steps.some((s) => s.elementId === elementId);
    if (!this.initialPositions[elementId] || !hasExistingStepForElement) {
      this.registerInitialElement(
        elementId,
        from.x,
        from.y,
        options?.type || (elementId === 'ball' ? 'ball' : 'player'),
        options?.team || 'home'
      );
    }

    const currentStepIndex = this.steps.length;
    const newStep: RecordedStep = {
      elementId,
      type: options?.type || (elementId === 'ball' ? 'ball' : 'player'),
      team: options?.team || this.initialPositions[elementId]?.team || 'home',
      from: { x: Number(from.x.toFixed(2)), y: Number(from.y.toFixed(2)) },
      to: { x: Number(to.x.toFixed(2)), y: Number(to.y.toFixed(2)) },
      order: currentStepIndex,
      timestamp: Date.now(),
      label: options?.label || `${elementId === 'ball' ? 'Ball' : 'Player'} Move #${currentStepIndex + 1}`,
      carriedBall: options?.carriedBall ?? false,
      ballFrom: options?.ballFrom ? { x: Number(options.ballFrom.x.toFixed(2)), y: Number(options.ballFrom.y.toFixed(2)) } : undefined,
      ballTo: options?.ballTo ? { x: Number(options.ballTo.x.toFixed(2)), y: Number(options.ballTo.y.toFixed(2)) } : undefined,
    };

    this.steps.push(newStep);
    this.currentPositions[elementId] = { ...to };
    if (elementId === 'ball' || newStep.type === 'ball') {
      this.ballPos = { ...to };
    } else if (newStep.carriedBall && newStep.ballTo) {
      this.ballPos = { ...newStep.ballTo };
      this.currentPositions['ball'] = { ...newStep.ballTo };
    }

    if (this.status === 'completed') {
      this.status = 'idle';
      this.emitStatus();
    }

    this.emitState();
    return newStep;
  }

  /**
   * Remove a step by index
   */
  public removeStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.steps.splice(index, 1);
      // Re-index remaining steps
      this.steps.forEach((step, i) => {
        step.order = i;
      });
      this.emitState();
    }
  }

  /**
   * Clear all recorded steps and reset playback
   */
  public clearSteps(): void {
    this.stop();
    this.steps = [];
    this.currentStepIndex = 0;
    this.stepProgress = 0;
    this.lastCompletedStepIndex = -1;
    this.emitState();
  }

  /**
   * Reset all elements to their initial pre-drag state
   */
  public resetToInitialPositions(): void {
    this.currentPositions = {};
    Object.values(this.initialPositions).forEach((el) => {
      this.currentPositions[el.id] = { x: el.x, y: el.y };
      if (el.id === 'ball' || el.type === 'ball') {
        this.ballPos = { x: el.x, y: el.y };
      }
    });
    this.currentStepIndex = 0;
    this.stepProgress = 0;
    this.lastCompletedStepIndex = -1;
    this.emitState();
  }

  /**
   * PLAYBACK WITH 3-SECOND COUNTDOWN:
   * Supports both Sequential Mode (step-by-step) and Unit Mode (all moved elements move simultaneously).
   */
  public play(withCountdown: boolean = true, mode: PlaybackMode = 'sequential'): void {
    if (this.steps.length === 0) {
      console.warn('TacticAnimator: No recorded steps to play.');
      return;
    }

    this.playbackMode = mode;
    this.stop();
    this.resetToInitialPositions();
    this.lastCompletedStepIndex = -1;

    if (withCountdown) {
      this.status = 'countdown';
      this.emitStatus();
      this.countdownStartTime = performance.now();
      this.startCountdownLoop();
    } else {
      this.status = 'playing';
      this.emitStatus();
      this.currentStepIndex = 0;
      this.stepProgress = 0;
      this.unitProgress = 0;
      if (this.playbackMode === 'unit') {
        this.startUnitPlaybackLoop(true);
      } else {
        this.startPlaybackLoop(true);
      }
    }
  }

  /**
   * PLAY AS ONE UNIT:
   * Moves all players (and ball) that have been repositioned simultaneously as one synchronized team block.
   */
  public playUnit(withCountdown: boolean = true): void {
    this.play(withCountdown, 'unit');
  }

  /**
   * CONTINUE PLAYBACK:
   * Continues the tactical motion from where the playback stopped or from the newly added keyframes,
   * without resetting all players and the ball back to the starting positions.
   */
  public continuePlayback(mode: PlaybackMode = 'sequential'): void {
    if (this.steps.length === 0) return;

    if (this.status === 'paused') {
      this.resume();
      return;
    }

    if (this.status === 'playing' || this.status === 'countdown') {
      return;
    }

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.playbackMode = mode;
    this.status = 'playing';
    this.emitStatus();

    // Determine starting step index
    let startIndex = 0;
    if (this.lastCompletedStepIndex >= 0 && this.lastCompletedStepIndex < this.steps.length - 1) {
      startIndex = this.lastCompletedStepIndex + 1;
    } else if (this.currentStepIndex >= 0 && this.currentStepIndex < this.steps.length) {
      startIndex = this.currentStepIndex;
    } else {
      startIndex = 0;
    }

    this.currentStepIndex = startIndex;
    this.stepProgress = 0;
    this.unitProgress = 0;

    if (mode === 'unit') {
      this.startUnitPlaybackLoop(true, startIndex);
    } else {
      this.startPlaybackLoop(true);
    }
  }

  /**
   * CONTINUE AS UNIT:
   * Continues playback from current stopped position with all remaining/new elements moving simultaneously.
   */
  public continueUnitPlayback(): void {
    this.continuePlayback('unit');
  }

  /**
   * Returns true if there are unplayed steps after the last completed step or current stopped position
   */
  public hasUnplayedSteps(): boolean {
    if (this.steps.length === 0) return false;
    return this.steps.length - 1 > this.lastCompletedStepIndex;
  }

  /**
   * Build complete movement trajectories for all unique elements that were recorded.
   */
  public getElementTrajectories(): ElementTrajectory[] {
    return this.getElementTrajectoriesFrom(0);
  }

  /**
   * Build movement trajectories starting from a specific step index
   */
  public getElementTrajectoriesFrom(startIndex: number = 0): ElementTrajectory[] {
    const elementMap = new Map<
      string,
      {
        type: 'player' | 'ball';
        team: 'home' | 'away';
        waypoints: Vector2D[];
        carriedBall?: boolean;
        ballFrom?: Vector2D;
        ballTo?: Vector2D;
      }
    >();

    const targetSteps = this.steps.slice(startIndex);
    if (targetSteps.length === 0) return [];

    for (const step of targetSteps) {
      let entry = elementMap.get(step.elementId);
      if (!entry) {
        const initial = startIndex === 0 ? this.initialPositions[step.elementId] : null;
        const startPos = initial ? { x: initial.x, y: initial.y } : { ...step.from };
        entry = {
          type: step.type || (step.elementId === 'ball' ? 'ball' : 'player'),
          team: step.team || 'home',
          waypoints: [startPos, { ...step.to }],
          carriedBall: step.carriedBall,
          ballFrom: step.ballFrom,
          ballTo: step.ballTo,
        };
        elementMap.set(step.elementId, entry);
      } else {
        entry.waypoints.push({ ...step.to });
        if (step.carriedBall) {
          entry.carriedBall = true;
          if (!entry.ballFrom) entry.ballFrom = step.ballFrom;
          entry.ballTo = step.ballTo;
        }
      }
    }

    const result: ElementTrajectory[] = [];
    elementMap.forEach((val, id) => {
      result.push({
        id,
        type: val.type,
        team: val.team,
        start: val.waypoints[0],
        end: val.waypoints[val.waypoints.length - 1],
        waypoints: val.waypoints,
        carriedBall: val.carriedBall,
        ballFrom: val.ballFrom,
        ballTo: val.ballTo,
      });
    });

    return result;
  }

  /**
   * Smoothly interpolate a position along waypoints (supporting single or multi-step paths)
   */
  public interpolateAlongWaypoints(waypoints: Vector2D[], t: number): Vector2D {
    if (waypoints.length === 0) return { x: 50, y: 50 };
    if (waypoints.length === 1) return { ...waypoints[0] };
    if (waypoints.length === 2) return lerp2D(waypoints[0], waypoints[1], t);

    const segmentLengths: number[] = [];
    let totalLength = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const d = distance2D(waypoints[i], waypoints[i + 1]);
      segmentLengths.push(d);
      totalLength += d;
    }

    if (totalLength === 0) return { ...waypoints[0] };

    const targetDist = t * totalLength;
    let accumulated = 0;
    for (let i = 0; i < segmentLengths.length; i++) {
      const segLen = segmentLengths[i];
      if (accumulated + segLen >= targetDist || i === segmentLengths.length - 1) {
        const segT = segLen === 0 ? 0 : (targetDist - accumulated) / segLen;
        return lerp2D(waypoints[i], waypoints[i + 1], Math.max(0, Math.min(1, segT)));
      }
      accumulated += segLen;
    }

    return { ...waypoints[waypoints.length - 1] };
  }

  /**
   * Calculate fluid athletic duration for unit team movement based on maximum travel distance
   */
  public getUnitDuration(trajectories?: ElementTrajectory[]): number {
    const list = trajectories || this.getElementTrajectories();
    let maxDist = 0;
    list.forEach((traj) => {
      let d = 0;
      for (let i = 0; i < traj.waypoints.length - 1; i++) {
        d += distance2D(traj.waypoints[i], traj.waypoints[i + 1]);
      }
      if (d > maxDist) maxDist = d;
    });

    // Base duration between 1050ms and 2400ms depending on travel distance, scaled by playbackSpeed
    const baseDuration = Math.max(1050, Math.min(2400, 950 + maxDist * 20));
    return baseDuration / this.playbackSpeed;
  }

  /**
   * 3-Second Countdown Timer loop using requestAnimationFrame
   */
  private startCountdownLoop = (): void => {
    const loop = (now: number) => {
      if (this.status !== 'countdown') return;

      const elapsed = now - this.countdownStartTime;
      const totalDuration = 3000; // 3 seconds

      if (elapsed >= totalDuration) {
        // Countdown finished! Transition to playing
        this.status = 'playing';
        this.emitStatus();
        this.currentStepIndex = 0;
        this.stepProgress = 0;
        this.unitProgress = 0;
        if (this.playbackMode === 'unit') {
          this.startUnitPlaybackLoop(true, 0);
        } else {
          this.startPlaybackLoop(true);
        }
        return;
      }

      // Calculate countdown numbers (3 -> 2 -> 1)
      const remainingSeconds = Math.ceil((totalDuration - elapsed) / 1000);
      const currentSecondElapsed = (elapsed % 1000) / 1000;

      this.emitState({
        countdownValue: remainingSeconds,
        countdownFraction: currentSecondElapsed,
      });

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  };

  /**
   * Unit Playback Loop: Moves all relocated players and ball simultaneously as one synchronized unit
   */
  private startUnitPlaybackLoop = (resetStartTime: boolean = true, startIndex: number = 0): void => {
    const trajectories = startIndex > 0 ? this.getElementTrajectoriesFrom(startIndex) : this.getElementTrajectories();
    if (trajectories.length === 0) {
      this.status = 'completed';
      this.lastCompletedStepIndex = this.steps.length - 1;
      this.emitStatus();
      this.emitState();
      return;
    }

    const unitDuration = this.getUnitDuration(trajectories);

    if (resetStartTime) {
      this.unitStartTime = performance.now();
      this.unitProgress = 0;
    }

    const loop = (now: number) => {
      if (this.status !== 'playing' || this.playbackMode !== 'unit') return;

      const elapsed = now - this.unitStartTime;
      const rawProgress = Math.min(1.0, elapsed / unitDuration);
      this.unitProgress = rawProgress;
      this.stepProgress = rawProgress;

      const easedT = easeInOutCubic(rawProgress);

      // Simultaneously update ALL elements on the pitch
      trajectories.forEach((traj) => {
        const currentPos = this.interpolateAlongWaypoints(traj.waypoints, easedT);
        this.currentPositions[traj.id] = currentPos;

        if (traj.id === 'ball' || traj.type === 'ball') {
          this.ballPos = currentPos;
        }

        // Accompany ball carried by player
        if (traj.carriedBall && traj.ballFrom && traj.ballTo) {
          const activeBallPos = lerp2D(traj.ballFrom, traj.ballTo, easedT);
          this.ballPos = activeBallPos;
          this.currentPositions['ball'] = activeBallPos;
        }
      });

      // Emit synchronized frame update
      this.emitState({
        playbackMode: 'unit',
        activeElementId: null, // Moving as one complete squad unit!
        overallProgress: rawProgress,
        stepProgress: rawProgress,
        currentStepIndex: Math.min(this.steps.length - 1, startIndex + Math.floor(rawProgress * (this.steps.length - startIndex))),
      });

      if (rawProgress >= 1.0) {
        // Lock to exact final destinations
        trajectories.forEach((traj) => {
          this.currentPositions[traj.id] = { ...traj.end };
          if (traj.id === 'ball' || traj.type === 'ball') {
            this.ballPos = { ...traj.end };
          }
          if (traj.carriedBall && traj.ballTo) {
            this.ballPos = { ...traj.ballTo };
            this.currentPositions['ball'] = { ...traj.ballTo };
          }
        });

        this.status = 'completed';
        this.unitProgress = 1.0;
        this.stepProgress = 1.0;
        this.lastCompletedStepIndex = this.steps.length - 1;
        this.currentStepIndex = Math.max(0, this.steps.length - 1);
        this.emitStatus();
        this.emitState({
          playbackMode: 'unit',
          activeElementId: null,
          overallProgress: 1.0,
          stepProgress: 1.0,
        });
        return;
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  };

  /**
   * Main Playback Loop: Smooth sequential step-by-step playback with distance-aware athletic timing
   */
  private startPlaybackLoop = (resetStartTime: boolean = true): void => {
    if (resetStartTime) {
      this.stepStartTime = performance.now();
    }

    const loop = (now: number) => {
      if (this.status !== 'playing') return;

      const currentStep = this.steps[this.currentStepIndex];

      if (!currentStep) {
        // Finished all steps!
        this.status = 'completed';
        this.lastCompletedStepIndex = this.steps.length - 1;
        this.emitStatus();
        this.emitState();
        return;
      }

      // Calculate distance-aware dynamic step duration (snappy short runs, fluid long crosses)
      const dist = distance2D(currentStep.from, currentStep.to);
      const isBallPass = currentStep.elementId === 'ball' || currentStep.type === 'ball';
      // Passes travel fast and crisp, player runs move at realistic athletic pace
      const stepDuration = isBallPass
        ? Math.max(280, Math.min(520, 240 + dist * 5.0)) / this.playbackSpeed
        : Math.max(340, Math.min(620, 280 + dist * 6.5)) / this.playbackSpeed;
      const pauseDuration = this.pauseBetweenStepsMs / this.playbackSpeed;
      const totalStepTime = stepDuration + pauseDuration;

      const stepElapsed = now - this.stepStartTime;

      // Calculate progress in current step (0.0 to 1.0 during movement, clamped at 1.0 during inter-step pause)
      const moveProgress = Math.min(1.0, stepElapsed / stepDuration);
      const easedT = easeInOutCubic(moveProgress);
      this.stepProgress = moveProgress;

      // 1. Animate active element (Player or Ball)
      const activePos = lerp2D(currentStep.from, currentStep.to, easedT);
      this.currentPositions[currentStep.elementId] = activePos;
      if (currentStep.elementId === 'ball' || currentStep.type === 'ball') {
        this.ballPos = activePos;
      }

      // 1b. If this player carried/dribbled the ball, animate ball position alongside the player!
      if (currentStep.carriedBall && currentStep.ballFrom && currentStep.ballTo) {
        const activeBallPos = lerp2D(currentStep.ballFrom, currentStep.ballTo, easedT);
        this.ballPos = activeBallPos;
        this.currentPositions['ball'] = activeBallPos;
      }

      // 2. Emit Frame Update
      this.emitState({
        activeElementId: currentStep.elementId,
      });

      // 4. Check if current step finished
      if (stepElapsed >= totalStepTime) {
        // Ensure exact target reached
        this.currentPositions[currentStep.elementId] = { ...currentStep.to };
        if (currentStep.elementId === 'ball' || currentStep.type === 'ball') {
          this.ballPos = { ...currentStep.to };
        }
        if (currentStep.carriedBall && currentStep.ballTo) {
          this.ballPos = { ...currentStep.ballTo };
          this.currentPositions['ball'] = { ...currentStep.ballTo };
        }

        this.lastCompletedStepIndex = this.currentStepIndex;
        this.currentStepIndex++;
        this.stepStartTime = performance.now();

        if (this.currentStepIndex >= this.steps.length) {
          // Playback completed
          this.status = 'completed';
          this.lastCompletedStepIndex = this.steps.length - 1;
          this.emitStatus();
          this.emitState();
          return;
        }
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  };

  /**
   * Pause current playback
   */
  public pause(): void {
    if (this.status === 'playing' || this.status === 'countdown') {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.status = 'paused';
      this.emitStatus();
      this.emitState();
    }
  }

  /**
   * Resume playback from paused state
   */
  public resume(): void {
    if (this.status === 'paused') {
      this.status = 'playing';
      this.emitStatus();
      if (this.playbackMode === 'unit') {
        const unitDuration = this.getUnitDuration();
        this.unitStartTime = performance.now() - (this.unitProgress * unitDuration);
        this.startUnitPlaybackLoop(false);
      } else {
        const currentStep = this.steps[this.currentStepIndex];
        const dist = currentStep ? distance2D(currentStep.from, currentStep.to) : 20;
        const isBallPass = currentStep?.elementId === 'ball' || currentStep?.type === 'ball';
        const stepDuration = isBallPass
          ? Math.max(280, Math.min(520, 240 + dist * 5.0)) / this.playbackSpeed
          : Math.max(340, Math.min(620, 280 + dist * 6.5)) / this.playbackSpeed;
        this.stepStartTime = performance.now() - (this.stepProgress * stepDuration);
        this.startPlaybackLoop(false);
      }
    }
  }

  /**
   * Stop playback completely and reset loop
   */
  public stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.status = 'idle';
    this.currentStepIndex = 0;
    this.stepProgress = 0;
    this.unitProgress = 0;
    this.emitStatus();
    this.emitState();
  }

  /**
   * Jump directly to a specific step
   */
  public seekToStep(targetIndex: number): void {
    if (targetIndex < 0 || targetIndex >= this.steps.length) return;
    this.stop();
    this.resetToInitialPositions();

    // Fast-forward positions up to targetIndex
    for (let i = 0; i <= targetIndex; i++) {
      const step = this.steps[i];
      this.currentPositions[step.elementId] = { ...step.to };
      if (step.elementId === 'ball' || step.type === 'ball') {
        this.ballPos = { ...step.to };
      }
      if (step.carriedBall && step.ballTo) {
        this.ballPos = { ...step.ballTo };
        this.currentPositions['ball'] = { ...step.ballTo };
      }
    }

    this.currentStepIndex = targetIndex;
    this.emitState();
  }

  /**
   * Set playback speed (e.g. 0.5, 1.0, 1.5, 2.0)
   */
  public setSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.25, Math.min(3.0, speed));
  }

  /**
   * Subscribe to frame state updates (for Canvas, SVG, or React re-renders)
   */
  public subscribe(listener: FrameListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Subscribe to playback status changes
   */
  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private resetState(): void {
    this.steps = [];
    this.initialPositions = {};
    this.currentPositions = {};
    this.ballPos = { x: 50, y: 50 };
    this.status = 'idle';
    this.playbackMode = 'sequential';
    this.currentStepIndex = 0;
    this.stepProgress = 0;
    this.unitProgress = 0;
  }

  private emitStatus(): void {
    this.statusListeners.forEach((fn) => fn(this.status));
  }

  private emitState(extra: Partial<FrameState> = {}): void {
    const totalSteps = this.steps.length;
    const effectiveMode = extra.playbackMode ?? this.playbackMode;
    const overallProgress =
      effectiveMode === 'unit'
        ? (extra.overallProgress ?? this.unitProgress)
        : totalSteps === 0
        ? 0
        : Math.min(1.0, (this.currentStepIndex + this.stepProgress) / totalSteps);

    const frame: FrameState = {
      status: this.status,
      playbackMode: effectiveMode,
      currentStepIndex: this.currentStepIndex,
      totalSteps,
      stepProgress: this.stepProgress,
      overallProgress,
      countdownValue: extra.countdownValue ?? null,
      countdownFraction: extra.countdownFraction ?? 0,
      activeElementId: extra.activeElementId ?? null,
      positions: { ...this.currentPositions },
      ballPos: { ...this.ballPos },
      hasUnplayedSteps: this.hasUnplayedSteps(),
      lastCompletedStepIndex: this.lastCompletedStepIndex,
      ...extra,
    };

    this.listeners.forEach((fn) => fn(frame));
  }
}

/**
 * Singleton default instance for direct drop-in usage across canvas and React
 */
export const defaultTacticAnimator = new TacticAnimator();
export default TacticAnimator;
