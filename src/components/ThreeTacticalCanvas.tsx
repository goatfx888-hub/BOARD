import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeTacticalCanvasProps {
  isLight?: boolean;
}

export const ThreeTacticalCanvas: React.FC<ThreeTacticalCanvasProps> = ({ isLight = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isLight ? 0xf1f5f9 : 0x070312, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 45);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for mouse parallax
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Perspective Tactical Grid on the floor
    const gridHelper = new THREE.GridHelper(120, 40, isLight ? 0x9333ea : 0x8b5cf6, isLight ? 0xc4b5fd : 0x2e1065);
    gridHelper.position.y = -12;
    // @ts-ignore
    if (gridHelper.material) {
      // @ts-ignore
      gridHelper.material.opacity = isLight ? 0.25 : 0.4;
      // @ts-ignore
      gridHelper.material.transparent = true;
    }
    worldGroup.add(gridHelper);

    // 2. Tactical floating symbols (circles, dots, tactical markers)
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const purpleColor = new THREE.Color(0xa855f7);
    const violetColor = new THREE.Color(0x6366f1);
    const brightWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const pick = Math.random();
      const col = pick < 0.6 ? purpleColor : pick < 0.85 ? violetColor : brightWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2.5 + 1.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Simple canvas texture for circular particles
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(168, 85, 247, 0.8)');
      gradient.addColorStop(0.7, 'rgba(99, 102, 241, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const pMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: isLight ? 0.35 : 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, pMaterial);
    worldGroup.add(particles);

    // 3. Ambient & Spotlight Beams
    const ambientLight = new THREE.AmbientLight(isLight ? 0xffffff : 0x2e1065, 0.8);
    scene.add(ambientLight);

    const spotLeft = new THREE.SpotLight(0xa855f7, isLight ? 1.5 : 3.5, 90, Math.PI / 4, 0.5, 1);
    spotLeft.position.set(-25, 25, 15);
    scene.add(spotLeft);

    const spotRight = new THREE.SpotLight(0x6366f1, isLight ? 1.5 : 3.0, 90, Math.PI / 4, 0.5, 1);
    spotRight.position.set(25, 25, 15);
    scene.add(spotRight);

    // Mouse Tracking for subtle parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetX = (e.clientX - halfW) / halfW;
      targetY = (e.clientY - halfH) / halfH;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        // Smooth lerp mouse parallax
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        worldGroup.rotation.y = mouseX * 0.12;
        worldGroup.rotation.x = -mouseY * 0.08;

        const elapsedTime = clock.getElapsedTime();
        particles.rotation.y = elapsedTime * 0.03;
        particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      pMaterial.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [isLight]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
};
