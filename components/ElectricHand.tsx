'use client';

import { useEffect, useRef } from 'react';
import type { Line, LineBasicMaterial, Material } from 'three';

const MODEL_URL = '/models/hand.glb';
const ELECTRIC = 0x82c8ff;
const LIME = 0xd2fa75;

const rimVertex = `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    vLocal = position;
    gl_Position = projectionMatrix * mv;
  }
`;

const rimFragment = `
  uniform vec3 uElectric;
  uniform vec3 uLime;
  uniform float uTime;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  void main() {
    float fres = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), uPower);
    float scan = 0.5 + 0.5 * sin(vLocal.y * 46.0 - uTime * 2.6);
    vec3 col = mix(uElectric, uLime, pow(fres, 3.0) * 0.35);
    col *= fres * uIntensity + scan * fres * 0.55;
    gl_FragColor = vec4(col, fres * 0.92);
  }
`;

export function ElectricHand({ className = '' }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    const boot = async (): Promise<() => void> => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
      const { OutputPass } = await import('three/examples/jsm/postprocessing/OutputPass.js');
      if (disposed) return () => {};

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isSmall = () => wrap.clientWidth < 768;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall() ? 1.25 : 1.75));
      renderer.setClearColor(0x080808, 1);
      renderer.toneMapping = THREE.NoToneMapping;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x080808);
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0, 4.5);

      const rig = new THREE.Group();
      scene.add(rig);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envRT.texture;

      scene.add(new THREE.AmbientLight(0x2a3550, 1.1));
      const key = new THREE.DirectionalLight(0x9fd0ff, 2.2);
      key.position.set(2.4, 3, 2.2);
      scene.add(key);
      const rimLight = new THREE.DirectionalLight(LIME, 1.1);
      rimLight.position.set(-2.6, -1.4, -2);
      scene.add(rimLight);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.9, 0.62, 0.55);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());

      const randOnSphere = (radius: number) => {
        const v = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        if (v.lengthSq() < 1e-4) v.set(1, 0, 0);
        return v.normalize().multiplyScalar(radius);
      };

      const sparkPositions = new Float32Array(130 * 3);
      for (let i = 0; i < 130; i += 1) {
        const p = randOnSphere(2.1 + Math.random() * 1.4);
        sparkPositions[i * 3] = p.x;
        sparkPositions[i * 3 + 1] = p.y;
        sparkPositions[i * 3 + 2] = p.z;
      }
      const sparkGeo = new THREE.BufferGeometry();
      sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
      const sparkMat = new THREE.PointsMaterial({ color: ELECTRIC, size: 0.02, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
      const sparks = new THREE.Points(sparkGeo, sparkMat);
      scene.add(sparks);

      const arcGroup = new THREE.Group();
      rig.add(arcGroup);
      const arcAxis = new THREE.Vector3(1, 0, 0);
      let arcHalf = 1.2;

      const rimMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uElectric: { value: new THREE.Color(ELECTRIC) },
          uLime: { value: new THREE.Color(LIME) },
          uTime: { value: 0 },
          uPower: { value: 2.1 },
          uIntensity: { value: 1.5 },
        },
        vertexShader: rimVertex,
        fragmentShader: rimFragment,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const chromeMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0d14, metalness: 0.96, roughness: 0.24, envMapIntensity: 1.35 });
      const edgeMaterial = new THREE.LineBasicMaterial({ color: ELECTRIC, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });

      const clearArcs = () => {
        for (const child of [...arcGroup.children]) {
          arcGroup.remove(child);
          const line = child as Line;
          line.geometry.dispose();
          (line.material as Material).dispose();
        }
      };

      const rebuildArcs = () => {
        clearArcs();
        const count = isSmall() ? 6 : 11;
        for (let a = 0; a < count; a += 1) {
          const along = (Math.random() * 2 - 1) * arcHalf;
          const origin = arcAxis.clone().multiplyScalar(along);
          origin.x += (Math.random() - 0.5) * 0.18;
          origin.y += (Math.random() - 0.5) * 0.18;
          origin.z += (Math.random() - 0.5) * 0.18;

          const dir = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
          const steps = 5 + Math.floor(Math.random() * 5);
          const step = 0.035 + Math.random() * 0.05;

          const pts: InstanceType<typeof THREE.Vector3>[] = [];
          const p = origin.clone();
          for (let i = 0; i <= steps; i += 1) {
            pts.push(p.clone());
            p.addScaledVector(dir, step);
            p.x += (Math.random() - 0.5) * step * 1.5;
            p.y += (Math.random() - 0.5) * step * 1.5;
            p.z += (Math.random() - 0.5) * step * 1.5;
          }
          const geo = new THREE.BufferGeometry().setFromPoints(pts);
          const mat = new THREE.LineBasicMaterial({ color: Math.random() > 0.8 ? LIME : ELECTRIC, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
          arcGroup.add(new THREE.Line(geo, mat));
        }
      };

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointerMove = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      const resize = () => {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        if (!w || !h) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall() ? 1.25 : 1.75));
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        bloom.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      resize();

      let handLoaded = false;
      let arcTimer = 0;
      let arcLifetime = 0.34;
      let rendered = false;

      const render = (dt: number) => {
        if (handLoaded) {
          arcTimer += dt;
          arcLifetime -= dt;
          if (arcLifetime <= 0) {
            arcLifetime = 0.28 + Math.random() * 0.4;
            rebuildArcs();
          }
          rimMaterial.uniforms.uTime.value += dt;
          arcGroup.children.forEach((child, i) => {
            const m = (child as Line).material as LineBasicMaterial;
            m.opacity = 0.25 + Math.abs(Math.sin(pointer.x * 2 + i + arcTimer * 6)) * 0.7;
          });
          sparks.rotation.y += dt * 0.06;

          const t = performance.now() * 0.001;
          pointer.x += (pointer.tx - pointer.x) * 0.05;
          pointer.y += (pointer.ty - pointer.y) * 0.05;
          rig.rotation.y = Math.sin(t * 0.28) * 0.42 + pointer.x * 0.5;
          rig.rotation.x = -0.06 + pointer.y * 0.28;
        }
        if (handLoaded || !rendered) {
          composer.render();
          rendered = true;
        }
      };

      const clock = new THREE.Clock();
      let raf = 0;
      let running = false;

      const loop = () => {
        if (!running) return;
        render(Math.min(clock.getDelta(), 0.05));
        raf = requestAnimationFrame(loop);
      };

      const start = () => {
        if (running || reduced) return;
        running = true;
        clock.getDelta();
        raf = requestAnimationFrame(loop);
      };
      const stop = () => {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.05 });
      io.observe(wrap);

      const onVisibility = () => {
        if (document.hidden) stop();
        else start();
      };
      document.addEventListener('visibilitychange', onVisibility);

      const loader = new GLTFLoader();
      loader.load(
        MODEL_URL,
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const sphere = box.getBoundingSphere(new THREE.Sphere());
          const size = box.getSize(new THREE.Vector3());
          const center = sphere.center.clone();
          const targetRadius = 1.1;
          const scale = targetRadius / sphere.radius;

          model.scale.setScalar(scale);
          model.position.copy(center).multiplyScalar(-scale);
          model.rotation.set(-0.08, 0.5, 0.06);

          const meshes: InstanceType<typeof THREE.Mesh>[] = [];
          model.traverse((obj) => {
            const mesh = obj as InstanceType<typeof THREE.Mesh>;
            if (mesh.isMesh) meshes.push(mesh);
          });

          for (const mesh of meshes) {
            mesh.material = chromeMaterial;
            mesh.frustumCulled = false;

            const rim = new THREE.Mesh(mesh.geometry, rimMaterial);
            rim.scale.setScalar(1.012);
            rim.frustumCulled = false;
            mesh.add(rim);

            const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 28), edgeMaterial);
            edges.frustumCulled = false;
            mesh.add(edges);
          }

          rig.add(model);

          arcAxis.set(1, 0, 0).applyQuaternion(model.quaternion).normalize();
          arcHalf = Math.max(size.x, size.y, size.z) * scale * 0.42;
          rebuildArcs();

          camera.position.set(0, 0, (targetRadius / Math.tan((camera.fov * Math.PI) / 360)) * 1.16);

          handLoaded = true;
          if (loadingRef.current) loadingRef.current.style.opacity = '0';
          if (reduced) render(0);
        },
        undefined,
        () => {
          // model missing or failed — the ambient glow holds the space
        },
      );

      if (reduced) render(0);
      else start();

      return () => {
        stop();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('visibilitychange', onVisibility);
        clearArcs();
        rimMaterial.dispose();
        chromeMaterial.dispose();
        edgeMaterial.dispose();
        sparkGeo.dispose();
        sparkMat.dispose();
        scene.environment = null;
        envRT.dispose();
        pmrem.dispose();
        composer.dispose();
        renderer.dispose();
      };
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        boot()
          .then((fn) => {
            if (disposed) fn();
            else teardown = fn;
          })
          .catch(() => {});
      },
      { rootMargin: '300px 0px' },
    );
    observer.observe(wrap);

    return () => {
      disposed = true;
      observer.disconnect();
      teardown?.();
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative h-full w-full overflow-hidden ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(130,200,255,.16), rgba(210,250,117,.06) 55%, transparent 72%)' }}
      />
      <div ref={loadingRef} className="pointer-events-none absolute inset-0 transition-opacity duration-700">
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border border-[#82c8ff]/40" />
      </div>
    </div>
  );
}
