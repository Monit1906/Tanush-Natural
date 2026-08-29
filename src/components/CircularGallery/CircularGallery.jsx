import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';
import './CircularGallery.css';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    video_url,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.video_url = video_url;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;

    this.isVideo = false;
    this.video = null;
    this.isHovered = false;
    this.isMuted = true;

    this.checkMediaType();
    this.createShader();
    this.createMesh();
    this.onResize();
  }

  checkMediaType() {
    const mediaSource = this.video_url || this.image || '';
    if (
      this.video_url ||
      mediaSource.startsWith('blob:') ||
      mediaSource.startsWith('data:video') ||
      mediaSource.includes('.mp4') ||
      mediaSource.includes('.mov') ||
      mediaSource.includes('.webm') ||
      mediaSource.includes('.m4v')
    ) {
      this.isVideo = true;
    }
  }

  createShader() {
    this.texture = new Texture(this.gl, {
      generateMipmaps: false
    });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          if (alpha < 0.005) discard;
          
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `,
      uniforms: {
        tMap: { value: this.texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [400, 600] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });

    if (this.isVideo) {
      this.setupVideo();
    } else {
      this.setupImage();
    }
  }

  setupVideo() {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.playsInline = true;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.preload = 'auto';
    video.src = this.video_url || this.image;

    video.addEventListener('loadeddata', () => {
      this.texture.image = video;
      this.program.uniforms.uImageSizes.value = [video.videoWidth || 400, video.videoHeight || 600];
      video.play().catch(() => {});
    });

    video.addEventListener('error', () => {
      this.setupImage();
    });

    video.play().catch(() => {});
    this.video = video;
  }

  setupImage() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      this.texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  setAudio(enabled) {
    if (!this.video) return;
    this.isMuted = !enabled;
    this.video.muted = !enabled;
  }

  toggleAudio() {
    if (!this.video) return false;
    const newState = this.video.muted;
    this.setAudio(newState);
    return newState;
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    // Continuously stream video texture frames to WebGL shader
    if (this.isVideo && this.video && this.video.readyState >= 2) {
      this.texture.image = this.video;
      this.texture.needsUpdate = true;
    }

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }

  destroy() {
    if (this.video) {
      this.video.pause();
      this.video.src = '';
      this.video.load();
      this.video = null;
    }
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = '#ffffff',
      borderRadius = 0.05,
      font = 'bold 30px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05
    } = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.activeAudioMedia = null;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
    this.setupIntersectionObserver();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }

  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/800/600?grayscale`, text: 'Bridge' },
      { image: `https://picsum.photos/seed/2/800/600?grayscale`, text: 'Desk Setup' },
      { image: `https://picsum.photos/seed/3/800/600?grayscale`, text: 'Waterfall' },
      { image: `https://picsum.photos/seed/4/800/600?grayscale`, text: 'Strawberries' },
      { image: `https://picsum.photos/seed/5/800/600?grayscale`, text: 'Deep Diving' },
      { image: `https://picsum.photos/seed/16/800/600?grayscale`, text: 'Train Track' }
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        video_url: data.video_url,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      });
    });
  }

  // Find media card under mouse position
  findMediaUnderPointer(clientX, clientY) {
    if (!this.medias || !this.screen || !this.viewport) return null;
    const rect = this.container.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    if (px < 0 || px > rect.width || py < 0 || py > rect.height) return null;

    const mouseViewportX = ((px / this.screen.width) - 0.5) * this.viewport.width;
    const mouseViewportY = -(((py / this.screen.height) - 0.5) * this.viewport.height);

    for (let i = 0; i < this.medias.length; i++) {
      const m = this.medias[i];
      const hw = m.plane.scale.x / 2;
      const hh = m.plane.scale.y / 2;
      const dx = Math.abs(mouseViewportX - m.plane.position.x);
      const dy = Math.abs(mouseViewportY - m.plane.position.y);

      if (dx <= hw && dy <= hh) {
        return m;
      }
    }
    return null;
  }

  // Central Audio Manager
  setOnlyAudio(targetMedia) {
    this.medias.forEach(m => {
      if (m !== targetMedia) {
        m.setAudio(false);
      }
    });

    if (targetMedia && targetMedia.video) {
      targetMedia.setAudio(true);
      this.activeAudioMedia = targetMedia;
    } else {
      this.activeAudioMedia = null;
    }
  }

  onMouseMove(e) {
    if (this.isDown) {
      this.onTouchMove(e);
      return;
    }

    const hoveredMedia = this.findMediaUnderPointer(e.clientX, e.clientY);
    if (hoveredMedia && hoveredMedia.isVideo) {
      if (this.activeAudioMedia !== hoveredMedia) {
        this.setOnlyAudio(hoveredMedia);
      }
    } else if (this.activeAudioMedia) {
      this.setOnlyAudio(null);
    }
  }

  onMouseLeave() {
    this.setOnlyAudio(null);
  }

  onTouchDown(e) {
    this.isDown = true;
    this.isDragging = false;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
    this.startX = this.start;
    this.startY = e.touches ? e.touches[0].clientY : e.clientY;
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    
    if (Math.abs(x - this.startX) > 6 || Math.abs(y - this.startY) > 6) {
      this.isDragging = true;
    }

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp(e) {
    if (this.isDown && !this.isDragging) {
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      const clickedMedia = this.findMediaUnderPointer(clientX, clientY);

      if (clickedMedia && clickedMedia.isVideo) {
        if (this.activeAudioMedia === clickedMedia) {
          this.setOnlyAudio(null);
        } else {
          this.setOnlyAudio(clickedMedia);
        }
      }
    }

    this.isDown = false;
    this.onCheck();
  }

  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.scroll.target += this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.scroll.target -= this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;
      default:
        break;
    }
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.medias?.forEach(m => {
            if (m.video && m.video.paused) {
              m.video.play().catch(() => {});
            }
          });
        } else {
          this.medias?.forEach(m => {
            if (m.video && !m.video.paused) {
              m.video.pause();
            }
          });
          this.setOnlyAudio(null);
        }
      });
    }, { threshold: 0.1 });

    this.observer.observe(this.container);
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseLeave = this.onMouseLeave.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);

    window.addEventListener('resize', this.boundOnResize);
    this.container.addEventListener('mousewheel', this.boundOnWheel, { passive: true });
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: true });
    this.container.addEventListener('mousedown', this.boundOnTouchDown);
    this.container.addEventListener('mousemove', this.boundOnMouseMove);
    this.container.addEventListener('mouseleave', this.boundOnMouseLeave);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    this.container.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('touchend', this.boundOnTouchUp);

    this.container.addEventListener('keydown', this.boundOnKeyDown);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    if (this.observer) this.observer.disconnect();
    window.removeEventListener('resize', this.boundOnResize);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchend', this.boundOnTouchUp);

    if (this.medias) {
      this.medias.forEach(m => m.destroy());
    }

    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px Figtree',
  scrollSpeed = 2,
  scrollEase = 0.05
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let app;

    app = new App(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase
    });

    return () => {
      if (app) app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Interactive video reels and story gallery"
    />
  );
}
