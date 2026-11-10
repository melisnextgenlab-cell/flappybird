import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Flame, 
  Sparkles, 
  Zap, 
  Medal, 
  Share2, 
  Check,
  Award,
  X,
  ShieldAlert,
  Lock,
  CheckCircle2
} from 'lucide-react';

// --- Web Audio Synthesizer ---
class SoundSystem {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  jump() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.14);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio fallback silent
    }
  }

  score() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [880, 1174].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + i * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {
      // Audio fallback silent
    }
  }

  achievement() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [587, 740, 880, 1174]; // D5, F#5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.24);
      });
    } catch {
      // Silent
    }
  }

  shoot() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Silent
    }
  }

  speedUp() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523, 659, 784, 1046]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + idx * 0.06;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch {
      // Silent
    }
  }

  hit() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Silent
    }
  }
}

const sounds = new SoundSystem();

// Character skins
interface Skin {
  id: string;
  name: string;
  bodyColor: string;
  bellyColor: string;
  wingColor: string;
  beakColor: string;
  crestColor: string;
}

const SKINS: Skin[] = [
  { id: 'yellow', name: 'Pofuduk', bodyColor: '#FBBF24', bellyColor: '#FEF08A', wingColor: '#F59E0B', beakColor: '#EA580C', crestColor: '#D97706' },
  { id: 'cyan', name: 'Maviş', bodyColor: '#38BDF8', bellyColor: '#BAE6FD', wingColor: '#0284C7', beakColor: '#F97316', crestColor: '#0369A1' },
  { id: 'pink', name: 'Kiraz', bodyColor: '#F472B6', bellyColor: '#FCE7F3', wingColor: '#DB2777', beakColor: '#EA580C', crestColor: '#BE185D' },
  { id: 'lime', name: 'Zümrüt', bodyColor: '#4ADE80', bellyColor: '#BBF7D0', wingColor: '#16A34A', beakColor: '#F97316', crestColor: '#15803D' },
];

interface Pipe {
  x: number;
  topHeight: number;
  gap: number;
  passed: boolean;
}

interface Soldier {
  x: number;
  y: number;
  width: number;
  height: number;
  hasFired: boolean;
  aimAngle: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

// Başarımlar Tanımı
interface AchievementItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

const ALL_ACHIEVEMENTS: AchievementItem[] = [
  { id: 'first_flap', title: 'İlk Kanat Çırpışı', desc: 'Boşluk tuşuna basarak ilk kanadını çırp', icon: '🪶' },
  { id: 'pipe_first', title: 'Boru Kaşifi', desc: 'İlk borudan geçerek 10 puan kazan', icon: '🎯' },
  { id: 'bullet_dodge', title: 'Kurşun Geçirmez', desc: 'Askerin ateşlediği mermiden başarıyla sıyrıl', icon: '🛡️' },
  { id: 'wings_5', title: 'Kanat Koleksiyoncusu', desc: 'Karakterine 5 veya daha fazla kanat ekle', icon: '🪽' },
  { id: 'wings_12', title: 'Melek Kanatları', desc: 'Tek uçuşta 12 kanat seviyesine ulaş', icon: '🕊️' },
  { id: 'speed_50', title: 'Hız Canavarı', desc: '50 puana ulaş ve hız artışını yakala', icon: '⚡' },
  { id: 'score_100', title: 'Yüzyıl Uçuşu', desc: '100 puan barajını aş', icon: '🏆' },
  { id: 'score_150', title: 'Efsanevi Kuş', desc: '150 puana ulaşarak Platin Rozet kazan', icon: '👑' },
  { id: 'fashion_bird', title: 'Stil İkonu', desc: 'Tüm kuş kostümlerini dene', icon: '🎨' },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game states
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ziplayan_kus_highscore');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedSkin, setSelectedSkin] = useState<Skin>(SKINS[0]);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [showSpeedAlert, setShowSpeedAlert] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Kanat Sayısı (Her basışta kanat eklenir)
  const [wingCount, setWingCount] = useState<number>(1);
  const wingCountRef = useRef<number>(1);

  // Başarımlar Bölmesi State
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ziplayan_kus_achievements');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [currentUnlockedToast, setCurrentUnlockedToast] = useState<AchievementItem | null>(null);
  const [showAchievementsDrawer, setShowAchievementsDrawer] = useState<boolean>(false);
  const [achievementFilter, setAchievementFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const testedSkinsRef = useRef<Set<string>>(new Set([SKINS[0].id]));

  // Constants - Yere Düşüş Hızı Azaltıldı: Süzülen, hafif yerçekimi
  const V_WIDTH = 400;
  const V_HEIGHT = 640;
  const GROUND_HEIGHT = 100;
  const PIPE_WIDTH = 68;
  const BASE_GAP = 150;
  const BASE_SPEED = 1.5; // Oyun hızı yavaşlatıldı (daha kontrollü ve sakin akış)
  const GRAVITY = 0.12; // Yavaş süzülme
  const MAX_FALL_SPEED = 2.2; // Yumuşak süzülme terminal hızı
  const JUMP_FORCE = -4.3; // Süzülmeyle dengeli zıplama kuvveti

  // Refs for continuous animation loop
  const birdRef = useRef({
    x: 95,
    y: 280,
    vy: 0,
    angle: 0,
    radius: 17,
    wingAngle: 0,
    wingFlapPhase: 0,
    wingFlapSpeed: 0.15,
  });

  const pipesRef = useRef<Pipe[]>([]);
  const soldiersRef = useRef<Soldier[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cloudsRef = useRef<{ x: number; y: number; scale: number; speed: number }[]>([]);
  const groundOffsetRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const scoreRef = useRef<number>(0);
  const shakeRef = useRef<number>(0);

  // Synchronize sounds state
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Sync wing count ref
  useEffect(() => {
    wingCountRef.current = wingCount;
  }, [wingCount]);

  // Initialize Clouds
  useEffect(() => {
    cloudsRef.current = [
      { x: 30, y: 70, scale: 0.9, speed: 0.3 },
      { x: 210, y: 120, scale: 1.2, speed: 0.45 },
      { x: 340, y: 55, scale: 0.8, speed: 0.25 },
      { x: 120, y: 190, scale: 0.7, speed: 0.35 },
    ];
  }, []);

  // Başarım Tetikleyici
  const unlockAchievement = useCallback((achId: string) => {
    setUnlockedAchievements((prev) => {
      if (prev.includes(achId)) return prev;
      const next = [...prev, achId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('ziplayan_kus_achievements', JSON.stringify(next));
      }
      const item = ALL_ACHIEVEMENTS.find((a) => a.id === achId);
      if (item) {
        setCurrentUnlockedToast(item);
        sounds.achievement();
        setTimeout(() => {
          setCurrentUnlockedToast(null);
        }, 3200);
      }
      return next;
    });
  }, []);

  // Karakter Değişimi & Stil İkonu Başarımı
  const handleSelectSkin = (skin: Skin) => {
    setSelectedSkin(skin);
    testedSkinsRef.current.add(skin.id);
    if (testedSkinsRef.current.size >= SKINS.length) {
      unlockAchievement('fashion_bird');
    }
  };

  // Particles generator
  const addJumpParticles = (x: number, y: number, currentWings: number) => {
    const count = Math.min(10, 4 + Math.floor(currentWings / 2));
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: x - Math.random() * 8,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 1.8 - 1.2,
        vy: (Math.random() - 0.5) * 1.8 + 0.8,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.4 ? selectedSkin.wingColor : '#FFFFFF',
        alpha: 0.9,
        life: 1,
      });
    }
  };

  const addExplosionParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 3,
        color: Math.random() > 0.4 ? color : '#FEF08A',
        alpha: 1,
        life: 1,
      });
    }
  };

  // MANUEL ZIPLAMA & KANAT EKLEME (Otomatik hiçbir şey yapmaz, tamamen manuel)
  const handleUserFlap = useCallback(() => {
    if (gameState === 'IDLE') {
      setGameState('PLAYING');
      birdRef.current.vy = JUMP_FORCE;
      setWingCount(2);
      wingCountRef.current = 2;
      sounds.jump();
      addJumpParticles(birdRef.current.x - 10, birdRef.current.y, 2);
      unlockAchievement('first_flap');
      return;
    }

    if (gameState === 'PLAYING') {
      setWingCount((prev) => {
        const next = Math.min(16, prev + 1);
        wingCountRef.current = next;
        if (next >= 5) unlockAchievement('wings_5');
        if (next >= 12) unlockAchievement('wings_12');
        return next;
      });

      birdRef.current.vy = JUMP_FORCE;
      birdRef.current.wingFlapSpeed = 0.35;
      sounds.jump();
      addJumpParticles(birdRef.current.x - 10, birdRef.current.y, wingCountRef.current);
    }
  }, [gameState, JUMP_FORCE, unlockAchievement]);

  // Restart Game
  const restartGame = useCallback(() => {
    birdRef.current = {
      x: 95,
      y: 280,
      vy: JUMP_FORCE,
      angle: 0,
      radius: 17,
      wingAngle: 0,
      wingFlapPhase: 0,
      wingFlapSpeed: 0.35,
    };
    pipesRef.current = [];
    soldiersRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    shakeRef.current = 0;
    setScore(0);
    setWingCount(2);
    wingCountRef.current = 2;
    setSpeedMultiplier(1.0);
    setShowSpeedAlert(null);
    setGameState('PLAYING');
    sounds.jump();
    addJumpParticles(birdRef.current.x - 10, birdRef.current.y, 2);
  }, [JUMP_FORCE]);

  // Reset to initial title screen
  const resetToIdle = useCallback(() => {
    birdRef.current = {
      x: 95,
      y: 280,
      vy: 0,
      angle: 0,
      radius: 17,
      wingAngle: 0,
      wingFlapPhase: 0,
      wingFlapSpeed: 0.15,
    };
    pipesRef.current = [];
    soldiersRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    shakeRef.current = 0;
    setScore(0);
    setWingCount(1);
    wingCountRef.current = 1;
    setSpeedMultiplier(1.0);
    setShowSpeedAlert(null);
    setGameState('IDLE');
  }, []);

  // Keyboard handler ('Space' starts or jumps)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'GAMEOVER') {
          restartGame();
        } else {
          handleUserFlap();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleUserFlap, restartGame]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Hız Hesaplaması
      const currentScore = scoreRef.current;
      const speedLevel = Math.floor(currentScore / 50);
      const currentMultiplier = Math.pow(1.05, speedLevel);
      const currentSpeed = BASE_SPEED * currentMultiplier;

      // Screen Shake
      let shakeX = 0;
      let shakeY = 0;
      if (shakeRef.current > 0) {
        shakeX = (Math.random() - 0.5) * shakeRef.current;
        shakeY = (Math.random() - 0.5) * shakeRef.current;
        shakeRef.current = Math.max(0, shakeRef.current - 0.8);
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // --- Arka Plan: Modern Açık Renk Gökyüzü ---
      const skyGradient = ctx.createLinearGradient(0, 0, 0, V_HEIGHT - GROUND_HEIGHT);
      skyGradient.addColorStop(0, '#7DD3FC');
      skyGradient.addColorStop(0.65, '#BAE6FD');
      skyGradient.addColorStop(1, '#E0F2FE');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

      // Güneş
      const sunGrad = ctx.createRadialGradient(310, 80, 5, 310, 80, 55);
      sunGrad.addColorStop(0, '#FEF08A');
      sunGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.45)');
      sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(310, 80, 55, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FEF9C3';
      ctx.beginPath();
      ctx.arc(310, 80, 22, 0, Math.PI * 2);
      ctx.fill();

      // Uzak Tepeler
      ctx.fillStyle = 'rgba(186, 230, 253, 0.55)';
      ctx.beginPath();
      ctx.moveTo(0, V_HEIGHT - GROUND_HEIGHT);
      ctx.lineTo(0, V_HEIGHT - GROUND_HEIGHT - 60);
      ctx.quadraticCurveTo(80, V_HEIGHT - GROUND_HEIGHT - 110, 160, V_HEIGHT - GROUND_HEIGHT - 70);
      ctx.quadraticCurveTo(240, V_HEIGHT - GROUND_HEIGHT - 130, 320, V_HEIGHT - GROUND_HEIGHT - 65);
      ctx.quadraticCurveTo(360, V_HEIGHT - GROUND_HEIGHT - 90, V_WIDTH, V_HEIGHT - GROUND_HEIGHT - 60);
      ctx.lineTo(V_WIDTH, V_HEIGHT - GROUND_HEIGHT);
      ctx.closePath();
      ctx.fill();

      // Bulutlar
      cloudsRef.current.forEach((cloud) => {
        if (gameState !== 'GAMEOVER') {
          cloud.x -= cloud.speed * (gameState === 'PLAYING' ? currentMultiplier * 0.9 : 0.6);
          if (cloud.x + 90 * cloud.scale < 0) {
            cloud.x = V_WIDTH + 40;
            cloud.y = 40 + Math.random() * 160;
          }
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
        ctx.beginPath();
        const r = 24 * cloud.scale;
        ctx.arc(cloud.x, cloud.y, r, 0, Math.PI * 2);
        ctx.arc(cloud.x + r * 0.9, cloud.y - r * 0.35, r * 0.85, 0, Math.PI * 2);
        ctx.arc(cloud.x + r * 1.7, cloud.y, r * 0.75, 0, Math.PI * 2);
        ctx.fill();
      });

      // Şehir silüeti
      ctx.fillStyle = 'rgba(147, 197, 253, 0.4)';
      for (let i = 0; i < V_WIDTH + 60; i += 45) {
        const h = 30 + (Math.sin(i * 0.1) + 1) * 15;
        ctx.fillRect(i - (groundOffsetRef.current * 0.25) % 45, V_HEIGHT - GROUND_HEIGHT - h, 32, h);
      }

      // --- Boru Üretimi (Yükseklikleri Rastgele) ---
      if (gameState === 'PLAYING') {
        const pipeSpacing = 220 / currentMultiplier;
        if (pipesRef.current.length === 0 || V_WIDTH - pipesRef.current[pipesRef.current.length - 1].x >= pipeSpacing) {
          const minGapTop = 75;
          const maxGapTop = V_HEIGHT - GROUND_HEIGHT - BASE_GAP - 75;
          const randomTop = Math.floor(minGapTop + Math.random() * (maxGapTop - minGapTop));
          pipesRef.current.push({
            x: V_WIDTH + 10,
            topHeight: randomTop,
            gap: BASE_GAP,
            passed: false,
          });

          // Aşşağıya Asker Koyma (Her boruyla veya aralıklarla yerde asker belirir)
          if (Math.random() > 0.35) {
            soldiersRef.current.push({
              x: V_WIDTH + 115,
              y: V_HEIGHT - GROUND_HEIGHT,
              width: 22,
              height: 28,
              hasFired: false,
              aimAngle: -Math.PI / 3,
            });
          }
        }
      }

      // --- Boruları Çiz ve Güncelle ---
      for (let i = pipesRef.current.length - 1; i >= 0; i--) {
        const pipe = pipesRef.current[i];

        if (gameState === 'PLAYING') {
          pipe.x -= currentSpeed;

          // 3. Her geçilen boru 10 puan eklesin
          if (!pipe.passed && pipe.x + PIPE_WIDTH < birdRef.current.x) {
            pipe.passed = true;
            scoreRef.current += 10;
            const newScore = scoreRef.current;
            setScore(newScore);
            sounds.score();

            unlockAchievement('pipe_first');
            if (newScore >= 50) unlockAchievement('speed_50');
            if (newScore >= 100) unlockAchievement('score_100');
            if (newScore >= 150) unlockAchievement('score_150');

            setHighScore((prev) => {
              if (newScore > prev) {
                localStorage.setItem('ziplayan_kus_highscore', newScore.toString());
                return newScore;
              }
              return prev;
            });

            // 4. Her 50 puanda hız yüzde beş artsın
            if (newScore > 0 && newScore % 50 === 0) {
              const newMultiplier = Math.pow(1.05, Math.floor(newScore / 50));
              setSpeedMultiplier(newMultiplier);
              sounds.speedUp();
              setShowSpeedAlert(`⚡ HIZ ARTTI! (+%${Math.round((newMultiplier - 1) * 100)})`);
              setTimeout(() => {
                setShowSpeedAlert(null);
              }, 1800);
            }
          }
        }

        if (pipe.x + PIPE_WIDTH < -30) {
          pipesRef.current.splice(i, 1);
          continue;
        }

        const bottomY = pipe.topHeight + pipe.gap;
        const bottomHeight = V_HEIGHT - GROUND_HEIGHT - bottomY;

        drawPipeColumn(ctx, pipe.x, 0, PIPE_WIDTH, pipe.topHeight, true);
        drawPipeColumn(ctx, pipe.x, bottomY, PIPE_WIDTH, bottomHeight, false);

        // 2. Boruya çarpınca karakter ölsün
        if (gameState === 'PLAYING') {
          const bird = birdRef.current;
          const hitTop = checkCircleRectCollision(
            bird.x, bird.y, bird.radius - 2,
            pipe.x, 0, PIPE_WIDTH, pipe.topHeight
          );
          const hitBottom = checkCircleRectCollision(
            bird.x, bird.y, bird.radius - 2,
            pipe.x, bottomY, PIPE_WIDTH, bottomHeight
          );

          if (hitTop || hitBottom) {
            triggerDeath();
          }
        }
      }

      // --- Zemin (Toprak ve Çim) ---
      if (gameState !== 'GAMEOVER') {
        groundOffsetRef.current = (groundOffsetRef.current + (gameState === 'PLAYING' ? currentSpeed : 1.2)) % 24;
      }

      const groundY = V_HEIGHT - GROUND_HEIGHT;

      // Çim Barı
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(0, groundY, V_WIDTH, 14);
      ctx.fillStyle = '#86EFAC';
      ctx.fillRect(0, groundY, V_WIDTH, 3);

      ctx.fillStyle = '#16A34A';
      for (let x = -groundOffsetRef.current; x < V_WIDTH + 30; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 14);
        ctx.lineTo(x + 9, groundY + 14);
        ctx.lineTo(x + 4.5, groundY + 19);
        ctx.closePath();
        ctx.fill();
      }

      // Toprak katmanı
      ctx.fillStyle = '#D97706';
      ctx.fillRect(0, groundY + 14, V_WIDTH, GROUND_HEIGHT - 14);

      ctx.fillStyle = '#B45309';
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, groundY + 14, V_WIDTH, GROUND_HEIGHT - 14);
      ctx.clip();
      for (let x = -24 - groundOffsetRef.current; x < V_WIDTH + 48; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 14);
        ctx.lineTo(x + 12, groundY + 14);
        ctx.lineTo(x - 14, V_HEIGHT);
        ctx.lineTo(x - 26, V_HEIGHT);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      ctx.strokeStyle = '#15803D';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 14);
      ctx.lineTo(V_WIDTH, groundY + 14);
      ctx.stroke();

      // --- AŞŞAĞIDAKİ ASKERLER & YAVAŞ MERMİLER ---
      const bird = birdRef.current;

      // Askerleri Güncelle ve Çiz
      for (let sIdx = soldiersRef.current.length - 1; sIdx >= 0; sIdx--) {
        const soldier = soldiersRef.current[sIdx];

        if (gameState === 'PLAYING') {
          soldier.x -= currentSpeed;

          // Asker kuşa nişan alır
          const dx = bird.x - soldier.x;
          const dy = bird.y - (soldier.y - soldier.height * 0.6);
          soldier.aimAngle = Math.atan2(dy, dx);

          // Asker kuşa ateş etsin: mermiler kuşa yavaş gelsin ve her asker BİR KEZ ateş edebilsin
          if (!soldier.hasFired && soldier.x < V_WIDTH - 15 && soldier.x > bird.x - 40) {
            soldier.hasFired = true;

            const dist = Math.hypot(dx, dy) || 1;
            const slowBulletSpeed = 1.2; // Mermiler kuşa yavaş gelsin (hız yavaşlatıldı)

            bulletsRef.current.push({
              x: soldier.x + Math.cos(soldier.aimAngle) * 16,
              y: (soldier.y - soldier.height * 0.6) + Math.sin(soldier.aimAngle) * 16,
              vx: (dx / dist) * slowBulletSpeed,
              vy: (dy / dist) * slowBulletSpeed,
              radius: 4.5,
            });

            sounds.shoot();

            // Namlu alevi parçacıkları
            for (let i = 0; i < 4; i++) {
              particlesRef.current.push({
                x: soldier.x + Math.cos(soldier.aimAngle) * 16,
                y: (soldier.y - soldier.height * 0.6) + Math.sin(soldier.aimAngle) * 16,
                vx: Math.cos(soldier.aimAngle + (Math.random() - 0.5) * 0.5) * 2,
                vy: Math.sin(soldier.aimAngle + (Math.random() - 0.5) * 0.5) * 2,
                size: Math.random() * 3 + 2,
                color: '#F97316',
                alpha: 1,
                life: 0.6,
              });
            }
          }
        }

        if (soldier.x < -40) {
          soldiersRef.current.splice(sIdx, 1);
          continue;
        }

        drawSoldier(ctx, soldier.x, soldier.y, soldier.width, soldier.height, soldier.aimAngle, soldier.hasFired);
      }

      // Mermileri Güncelle ve Çiz (Yavaşça Kuşa Gelen Mermiler)
      for (let bIdx = bulletsRef.current.length - 1; bIdx >= 0; bIdx--) {
        const bullet = bulletsRef.current[bIdx];

        if (gameState === 'PLAYING') {
          bullet.x += bullet.vx;
          bullet.y += bullet.vy;

          // Mermi arkası duman/kıvılcım izi
          if (Math.random() > 0.4) {
            particlesRef.current.push({
              x: bullet.x,
              y: bullet.y,
              vx: (Math.random() - 0.5) * 0.6,
              vy: (Math.random() - 0.5) * 0.6,
              size: Math.random() * 2.5 + 1.5,
              color: '#FBBF24',
              alpha: 0.8,
              life: 0.5,
            });
          }

          // Çarpışma: Mermi kuşa çarparsa kuş ölür
          const hitDistSq = (bullet.x - bird.x) ** 2 + (bullet.y - bird.y) ** 2;
          const hitThreshold = (bullet.radius + bird.radius - 3) ** 2;

          if (hitDistSq < hitThreshold) {
            triggerDeath();
          }

          // Başarım: Mermi kuşu geçip arkada kaldıysa sıyrıldık
          if (bullet.x < bird.x - 40 && bullet.x > bird.x - 50) {
            unlockAchievement('bullet_dodge');
          }
        }

        // Ekrandan çıkınca sil
        if (bullet.x < -20 || bullet.x > V_WIDTH + 20 || bullet.y < -20 || bullet.y > groundY) {
          bulletsRef.current.splice(bIdx, 1);
          continue;
        }

        // Yavaş Mermiyi Çiz (Parlak akkor çekirdekli roket/mermi)
        ctx.save();
        ctx.shadowColor = '#F97316';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(bullet.x - bullet.vx * 0.5, bullet.y - bullet.vy * 0.5, bullet.radius * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- KUŞUN YERE SÜZÜLMESİ (Düşmesin, yere süzülsün & Otomatik hiçbir şey yapmasın) ---
      if (gameState === 'PLAYING') {
        // Nazik, yumuşak süzülme fiziği
        bird.vy = Math.min(bird.vy + GRAVITY, MAX_FALL_SPEED);
        bird.y += bird.vy;

        // Yumuşak süzülme açısı
        if (bird.vy < 0) {
          bird.angle = -0.28;
        } else {
          bird.angle = Math.min(Math.PI / 4, bird.angle + 0.024);
        }

        bird.wingFlapPhase += bird.wingFlapSpeed;
        bird.wingFlapSpeed = Math.max(0.08, bird.wingFlapSpeed * 0.985);

        // Zemin çarpışması
        if (bird.y + bird.radius >= groundY) {
          bird.y = groundY - bird.radius;
          triggerDeath();
        }

        // Tavan sınırı
        if (bird.y - bird.radius <= 0) {
          bird.y = bird.radius;
          bird.vy = 0;
        }
      } else if (gameState === 'IDLE') {
        const time = Date.now() * 0.005;
        bird.y = 280 + Math.sin(time) * 6;
        bird.angle = Math.sin(time) * 0.05;
        bird.wingFlapPhase += 0.06;
      } else if (gameState === 'GAMEOVER') {
        if (bird.y + bird.radius < groundY) {
          bird.vy += GRAVITY * 1.2;
          bird.y += bird.vy;
          bird.angle = Math.min(Math.PI / 2, bird.angle + 0.05);
        } else {
          bird.y = groundY - bird.radius;
        }
      }

      // DAHA DETAYLI KUŞ ÇİZİMİ
      drawDetailedBirdWithWings(
        ctx, 
        bird.x, 
        bird.y, 
        bird.radius, 
        bird.angle, 
        bird.wingFlapPhase, 
        wingCountRef.current, 
        selectedSkin
      );

      // --- Particles ---
      for (let pIdx = particlesRef.current.length - 1; pIdx >= 0; pIdx--) {
        const p = particlesRef.current[pIdx];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= 0.024;
        p.alpha = Math.max(0, p.life);

        if (p.life <= 0) {
          particlesRef.current.splice(pIdx, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // --- In-Game Top HUD ---
      if (gameState === 'PLAYING') {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 4;
        ctx.font = '700 42px "Fredoka", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeText(currentScore.toString(), V_WIDTH / 2, 70);
        ctx.fillText(currentScore.toString(), V_WIDTH / 2, 70);

        const wingsBadge = `🪽 Kanatlar: ${wingCountRef.current} Adet`;
        ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0284C7';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.strokeText(wingsBadge, V_WIDTH / 2, 98);
        ctx.fillText(wingsBadge, V_WIDTH / 2, 98);

        ctx.restore();
      }

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    function checkCircleRectCollision(
      cx: number, cy: number, radius: number,
      rx: number, ry: number, rw: number, rh: number
    ): boolean {
      const closestX = Math.max(rx, Math.min(cx, rx + rw));
      const closestY = Math.max(ry, Math.min(cy, ry + rh));
      const distX = cx - closestX;
      const distY = cy - closestY;
      return (distX * distX + distY * distY) < (radius * radius);
    }

    function triggerDeath() {
      shakeRef.current = 14;
      sounds.hit();
      addExplosionParticles(birdRef.current.x, birdRef.current.y, selectedSkin.bodyColor);
      setGameState('GAMEOVER');
    }

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, selectedSkin, unlockAchievement]);

  // Helper: Stylized Pipe
  const drawPipeColumn = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    isTop: boolean
  ) => {
    if (h <= 0) return;

    ctx.save();
    const capHeight = 26;
    const capOverhang = 5;

    const bodyGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    bodyGrad.addColorStop(0, '#15803D');
    bodyGrad.addColorStop(0.18, '#22C55E');
    bodyGrad.addColorStop(0.45, '#86EFAC');
    bodyGrad.addColorStop(0.75, '#16A34A');
    bodyGrad.addColorStop(1, '#14532D');

    const shaftY = isTop ? 0 : y + capHeight;
    const shaftH = isTop ? Math.max(0, h - capHeight) : Math.max(0, h - capHeight);

    ctx.fillStyle = bodyGrad;
    ctx.fillRect(x, shaftY, w, shaftH);
    ctx.strokeStyle = '#0F5132';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, shaftY, w, shaftH);

    const capY = isTop ? h - capHeight : y;
    const capX = x - capOverhang;
    const capW = w + capOverhang * 2;

    const capGrad = ctx.createLinearGradient(capX, 0, capX + capW, 0);
    capGrad.addColorStop(0, '#15803D');
    capGrad.addColorStop(0.2, '#22C55E');
    capGrad.addColorStop(0.48, '#BBF7D0');
    capGrad.addColorStop(0.8, '#16A34A');
    capGrad.addColorStop(1, '#052E16');

    ctx.fillStyle = capGrad;
    roundRect(ctx, capX, capY, capW, capHeight, 4);
    ctx.fill();
    ctx.strokeStyle = '#052E16';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(capX + 10, capY + 3, 5, capHeight - 6);

    ctx.restore();
  };

  // Helper: Draw Soldier on the ground
  const drawSoldier = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    aimAngle: number,
    hasFired: boolean
  ) => {
    ctx.save();
    ctx.translate(x, y);

    // Asker taban gölgesi
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Üniforma gövdesi (Askeri Yeşil)
    ctx.fillStyle = '#15803D';
    ctx.fillRect(-6, -h * 0.58, 12, h * 0.58);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-6, -h * 0.58, 12, h * 0.58);

    // Kemer
    ctx.fillStyle = '#78350F';
    ctx.fillRect(-6, -h * 0.25, 12, 3);

    // Baş ve Kask
    ctx.fillStyle = '#FDE68A'; // Yüz
    ctx.beginPath();
    ctx.arc(0, -h * 0.72, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Askeri Kask
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(0, -h * 0.76, 7.5, Math.PI, Math.PI * 2);
    ctx.lineTo(8, -h * 0.72);
    ctx.lineTo(-8, -h * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Kask siperliği çizgisi
    ctx.fillStyle = '#14532D';
    ctx.fillRect(-7, -h * 0.74, 14, 2);

    // Tüfek (Kuştan tarafa nişan alır)
    ctx.save();
    ctx.translate(0, -h * 0.5);
    ctx.rotate(aimAngle);

    // Tüfek gövdesi
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, -2, 17, 4);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(0, -2, 17, 4);

    // Dipçik
    ctx.fillStyle = '#92400E';
    ctx.fillRect(-4, -1, 5, 3);

    // Ateş edildiyse namluda hafif duman
    if (hasFired) {
      ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
      ctx.beginPath();
      ctx.arc(19, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    ctx.restore();
  };

  // Helper: Draw Much More DETAILED Bird with Crest, Plumage, Cheeks, Tail, and Multi-Wings
  const drawDetailedBirdWithWings = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    angle: number,
    flapPhase: number,
    wingsCount: number,
    skin: Skin
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Gölge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.beginPath();
    ctx.ellipse(0, radius + 5, radius * 0.95, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. KUYRUK TÜYLERİ (Arka kuyruk yelpazesi)
    ctx.save();
    const tailWiggle = Math.sin(flapPhase * 0.8) * 0.12;
    ctx.translate(-radius * 0.85, 2);
    ctx.rotate(-0.15 + tailWiggle);
    for (let t = -1; t <= 1; t++) {
      ctx.save();
      ctx.rotate(t * 0.22);
      ctx.fillStyle = skin.crestColor;
      ctx.beginPath();
      ctx.ellipse(-10, 0, 11, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Kuyruk tüy ucu parıltısı
      ctx.fillStyle = skin.wingColor;
      ctx.beginPath();
      ctx.ellipse(-15, 0, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // 2. EKSTRA ARKA KANATLAR (Her basışta eklenen kanatlar)
    const totalExtraWings = Math.max(0, wingsCount - 1);
    for (let i = 0; i < totalExtraWings; i++) {
      ctx.save();
      const spreadAngle = (i % 2 === 0 ? 1 : -1) * (0.28 + Math.floor(i / 2) * 0.2);
      const wingOffset = -7 - (i * 2.2);
      const wingFlap = Math.sin(flapPhase + i * 0.75) * 0.65;

      ctx.translate(wingOffset, (i % 2 === 0 ? -2 : 3));
      ctx.rotate(spreadAngle + wingFlap);

      const wingW = radius * (0.8 + (i * 0.05));
      const wingH = radius * 0.44;

      ctx.fillStyle = (i % 2 === 0) ? skin.wingColor : '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 0, wingW, wingH, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Kanat tüy çizgisi
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-wingW * 0.5, 0);
      ctx.lineTo(wingW * 0.5, 0);
      ctx.stroke();

      ctx.restore();
    }

    // 3. KUŞUN GÖVDESİ (3D Gradyanlı Zengin Tüy Doku)
    const bodyGrad = ctx.createRadialGradient(-3, -4, 2, 0, 0, radius);
    bodyGrad.addColorStop(0, '#FFFFFF');
    bodyGrad.addColorStop(0.3, skin.bodyColor);
    bodyGrad.addColorStop(0.95, skin.crestColor);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // 4. KARIN TÜYLERİ (Yumuşak Göğüs Pulu)
    ctx.fillStyle = skin.bellyColor;
    ctx.beginPath();
    ctx.arc(-2, 4, radius * 0.68, 0.1, Math.PI * 0.9);
    ctx.fill();

    // Göğüs tüy deseni
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-2, 3, radius * 0.45, 0.3, Math.PI * 0.8);
    ctx.stroke();

    // 5. BAŞ ÜSTÜ İBİĞİ / TEPELİK TÜYLERİ (3 katmanlı zarif tepelik)
    ctx.save();
    ctx.translate(1, -radius + 2);
    const crestWiggle = Math.sin(flapPhase * 1.2) * 0.15;
    ctx.rotate(crestWiggle);

    for (let c = -1; c <= 1; c++) {
      ctx.save();
      ctx.rotate(c * 0.28 - 0.2);
      ctx.fillStyle = skin.crestColor;
      ctx.beginPath();
      ctx.ellipse(0, -6 - (1 - Math.abs(c)) * 3, 3.8, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(0, -11 - (1 - Math.abs(c)) * 3, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // 6. ANA ÖN KANAT (Detaylı Tüy Katmanları)
    ctx.save();
    const mainFlap = Math.sin(flapPhase) * 0.62;
    ctx.translate(-5, 0);
    ctx.rotate(mainFlap);

    // Arka kanat gölgesi
    ctx.fillStyle = skin.crestColor;
    ctx.beginPath();
    ctx.ellipse(2, 2, radius * 0.72, radius * 0.44, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Ana kanat yüzeyi
    ctx.fillStyle = skin.wingColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.72, radius * 0.42, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Kanat iç tüyleri
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.48, 0.1, Math.PI * 0.85);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(1, 1, radius * 0.28, 0.2, Math.PI * 0.85);
    ctx.stroke();
    ctx.restore();

    // 7. YANAK ALLIĞI (Sevimli pembe allık)
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath();
    ctx.arc(radius * 0.22, radius * 0.1, 4.8, 0, Math.PI * 2);
    ctx.fill();

    // 8. BÜYÜK VE IŞILTILI GÖZ
    const eyeX = radius * 0.48;
    const eyeY = -radius * 0.32;
    const eyeR = radius * 0.44;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // İris
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(eyeX + 2, eyeY, eyeR * 0.52, 0, Math.PI * 2);
    ctx.fill();

    // İris İçi Mavi Işıltı
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(eyeX + 2.5, eyeY + 1.5, eyeR * 0.26, 0, Math.PI * 2);
    ctx.fill();

    // Çift Işık Yansıması
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(eyeX + 3.5, eyeY - 2.5, eyeR * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eyeX + 1, eyeY + 3, eyeR * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // 9. FORM KAZANMIŞ DETAYLI GAGA
    ctx.fillStyle = skin.beakColor;
    ctx.beginPath();
    ctx.moveTo(radius * 0.7, -radius * 0.12);
    ctx.quadraticCurveTo(radius * 1.1, -radius * 0.15, radius * 1.52, radius * 0.14);
    ctx.quadraticCurveTo(radius * 1.05, radius * 0.42, radius * 0.7, radius * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Üst/Alt Gaga Ayrım Çizgisi
    ctx.strokeStyle = '#9A3412';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(radius * 0.72, radius * 0.12);
    ctx.lineTo(radius * 1.48, radius * 0.14);
    ctx.stroke();

    // Burun Deliği
    ctx.fillStyle = '#7C2D12';
    ctx.beginPath();
    ctx.arc(radius * 0.85, 0, 1, 0, Math.PI * 2);
    ctx.fill();

    // Gaga Parlaması
    ctx.fillStyle = '#FED7AA';
    ctx.beginPath();
    ctx.moveTo(radius * 0.8, -radius * 0.05);
    ctx.lineTo(radius * 1.25, 0);
    ctx.lineTo(radius * 0.8, radius * 0.08);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Medal determination based on score
  const getMedal = (pts: number) => {
    if (pts >= 150) return { title: 'Platin Usta', color: 'bg-indigo-500 text-indigo-50', border: 'border-indigo-300' };
    if (pts >= 100) return { title: 'Altın Kanat', color: 'bg-amber-400 text-amber-950', border: 'border-amber-200' };
    if (pts >= 50) return { title: 'Gümüş Uçucu', color: 'bg-slate-300 text-slate-800', border: 'border-slate-100' };
    if (pts >= 20) return { title: 'Bronz Çırak', color: 'bg-amber-700 text-amber-100', border: 'border-amber-600' };
    return null;
  };

  const currentMedal = getMedal(score);

  const handleShare = () => {
    const text = `Zıplayan Kuş oyununda ${score} puan topladım ve askerlerin mermilerinden sıyrıldım! 🐥🎖️ Sen de dene!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Filtrelenmiş Başarımlar Listesi
  const filteredAchievements = ALL_ACHIEVEMENTS.filter((ach) => {
    const isUnlocked = unlockedAchievements.includes(ach.id);
    if (achievementFilter === 'UNLOCKED') return isUnlocked;
    if (achievementFilter === 'LOCKED') return !isUnlocked;
    return true;
  });

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen bg-slate-950 text-white select-none overflow-hidden p-0 sm:p-4">
      {/* Dynamic Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/40 via-slate-950 to-slate-950 -z-10" />

      {/* Main Game Container */}
      <div className="relative w-full max-w-[420px] h-[100dvh] sm:h-[680px] flex flex-col items-center justify-between bg-sky-200 sm:rounded-3xl shadow-2xl overflow-hidden border-0 sm:border-4 border-slate-700/60">
        
        {/* Top Header Bar */}
        <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3.5 py-3 bg-gradient-to-b from-black/45 via-black/20 to-transparent pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="font-game font-bold text-lg sm:text-xl tracking-wide text-white drop-shadow-md flex items-center gap-1.5">
              <span className="text-amber-300 text-xl sm:text-2xl">🐤</span> Zıplayan Kuş
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* BAŞARIMLAR BÖLMESİ BUTONU */}
            <button
              onClick={() => setShowAchievementsDrawer(true)}
              aria-label="Başarımlar Bölmesi"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/80 to-yellow-500/80 hover:from-amber-500 hover:to-yellow-500 backdrop-blur-md text-amber-950 text-xs font-bold transition-all active:scale-95 shadow-md cursor-pointer border border-amber-300"
            >
              <Award className="w-4 h-4 text-amber-950 fill-amber-950" />
              <span>Başarımlar ({unlockedAchievements.length}/{ALL_ACHIEVEMENTS.length})</span>
            </button>

            {/* Speed Badge */}
            {speedMultiplier > 1 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/90 text-amber-950 text-xs font-bold rounded-full shadow-md backdrop-blur-sm animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                <span>%{Math.round((speedMultiplier - 1) * 100)}</span>
              </div>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-transform active:scale-95 shadow-md cursor-pointer border border-white/20"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-300" />}
            </button>
          </div>
        </header>

        {/* Başarım Açıldı Toast Bildirimi */}
        {currentUnlockedToast && (
          <div className="absolute top-14 z-40 pointer-events-none animate-bounce">
            <div className="px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-900 font-bold text-xs sm:text-sm rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2">
              <span className="text-xl">{currentUnlockedToast.icon}</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-extrabold text-amber-950">🏆 Başarım Açıldı!</span>
                <span className="font-extrabold text-slate-900">{currentUnlockedToast.title}</span>
              </div>
            </div>
          </div>
        )}

        {/* Speed Increase Pop Banner */}
        {showSpeedAlert && !currentUnlockedToast && (
          <div className="absolute top-16 z-30 pointer-events-none animate-bounce">
            <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-game font-bold text-sm rounded-full shadow-xl border-2 border-yellow-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-200 animate-spin" />
              <span>{showSpeedAlert}</span>
            </div>
          </div>
        )}

        {/* Canvas & Touch Area: Ekrana her dokunuş / tıklama kanat ekler ve zıplatır */}
        <div 
          className="relative w-full h-full flex items-center justify-center touch-none cursor-pointer"
          onPointerDown={(e) => {
            e.preventDefault();
            if (gameState === 'GAMEOVER') {
              restartGame();
            } else {
              handleUserFlap();
            }
          }}
        >
          <canvas
            ref={canvasRef}
            width={V_WIDTH}
            height={V_HEIGHT}
            className="w-full h-full object-cover sm:object-contain"
          />
        </div>

        {/* --- OVERLAY: START SCREEN (IDLE) --- */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 bg-black/25 backdrop-blur-[2px]">
            <div className="pt-12 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-400/30 border border-white/40 rounded-full text-xs font-semibold text-white drop-shadow mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Boşluk Tuşuyla Başla!
              </div>
              <h1 className="font-game font-bold text-4xl sm:text-5xl text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] tracking-wide">
                ZIPLAYAN KUŞ
              </h1>
              <p className="text-sky-100 text-sm font-medium mt-1 drop-shadow">
                Askerlerin mermilerinden süzül, kanat ekle ve rekor kır!
              </p>
            </div>

            {/* Skin Selector */}
            <div className="w-full max-w-xs bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30 text-center shadow-lg">
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider block mb-2">
                Karakterini Seç
              </span>
              <div className="grid grid-cols-4 gap-2">
                {SKINS.map((skin) => (
                  <button
                    key={skin.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSkin(skin);
                    }}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer ${
                      selectedSkin.id === skin.id
                        ? 'bg-white shadow-md scale-105 border-2 border-amber-400'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  >
                    <div 
                      className="w-7 h-7 rounded-full border border-black/30 shadow-inner mb-1" 
                      style={{ backgroundColor: skin.bodyColor }}
                    />
                    <span className={`text-[11px] font-bold ${selectedSkin.id === skin.id ? 'text-slate-800' : 'text-white'}`}>
                      {skin.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instruction Card & Start Button */}
            <div className="w-full max-w-xs flex flex-col items-center gap-3 pb-6">
              <div className="bg-white/95 text-slate-800 px-4 py-2.5 rounded-2xl shadow-lg text-xs font-medium flex items-center gap-2.5 border border-sky-100">
                <span className="p-1.5 bg-amber-100 rounded-xl text-amber-700 font-bold text-sm">🪖</span>
                <span><b>Boşluk</b> ile zıpla, kanat ekle ve yerdeki askerlerin yavaş mermilerinden kaç!</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserFlap();
                }}
                className="w-full py-4 px-6 rounded-2xl font-game font-bold text-2xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 active:scale-95 text-white shadow-[0_8px_0_#15803D] transition-all flex items-center justify-center gap-3 cursor-pointer border-2 border-emerald-200"
              >
                <Play className="w-6 h-6 fill-white" /> BAŞLAT (BOŞLUK)
              </button>

              <div className="flex items-center justify-between w-full px-2 text-xs font-bold text-white drop-shadow">
                {highScore > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>Rekor: {highScore} Puan</span>
                  </div>
                ) : <span />}

                {/* Başarımlar Bölmesi Linki */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAchievementsDrawer(true);
                  }}
                  className="flex items-center gap-1 text-amber-300 hover:text-white underline cursor-pointer"
                >
                  <Award className="w-4 h-4" /> Başarımlar Bölmesi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- OVERLAY: GAME OVER SCREEN --- */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/45 backdrop-blur-[3px]">
            <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 text-slate-800 flex flex-col items-center">
              
              <div className="px-4 py-1 -mt-10 mb-3 bg-red-500 text-white font-game font-bold text-xl rounded-full shadow-lg border-2 border-white tracking-wider">
                OYUN BİTTİ!
              </div>

              {/* Score summary panel */}
              <div className="w-full bg-slate-100 rounded-2xl p-4 border border-slate-200 flex flex-col gap-3 mb-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SKOR</span>
                  <span className="font-game font-bold text-3xl text-emerald-600">{score}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" /> EN YÜKSEK
                  </span>
                  <span className="font-game font-bold text-2xl text-amber-600">{highScore}</span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Geçilen Boru: {score / 10} adet</span>
                  <span className="text-sky-700 font-bold">🪽 Kanatlar: {wingCount} Adet</span>
                </div>
              </div>

              {/* Medal award */}
              {currentMedal && (
                <div className={`w-full py-2 px-3 rounded-xl mb-3 border flex items-center justify-center gap-2 ${currentMedal.color} ${currentMedal.border} shadow-sm`}>
                  <Medal className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-wide">
                    {currentMedal.title} Rozeti Kazandın!
                  </span>
                </div>
              )}

              {/* Action Buttons: YENİDEN BAŞLAT */}
              <div className="w-full flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    restartGame();
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl font-game font-bold text-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-95 text-white shadow-[0_6px_0_#C2410C] transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-200"
                >
                  <RotateCcw className="w-5 h-5 stroke-[2.5]" /> YENİDEN BAŞLAT
                </button>

                {/* Başarımlar Bölmesi Butonu */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAchievementsDrawer(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-amber-300 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Başarımlar Bölmesi ({unlockedAchievements.length}/{ALL_ACHIEVEMENTS.length})</span>
                </button>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetToIdle();
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Ana Menü</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopyalandı!' : 'Skoru Paylaş'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- BAŞARIMLAR BÖLMESİ (ÖZEL ÇEKMECE / BÖLME PANELİ) --- */}
        {showAchievementsDrawer && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-sm bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Başlık & Kapat */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-400/20 rounded-xl text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-game font-bold text-lg text-white">Başarımlar Bölmesi</h3>
                    <p className="text-[10px] text-slate-400">Kazanılan ödülleri ve hedefleri görüntüle</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAchievementsDrawer(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* İlerleme Çubuğu */}
              <div className="my-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">Genel İlerleme</span>
                  <span className="font-bold text-amber-400">{unlockedAchievements.length} / {ALL_ACHIEVEMENTS.length} (%{Math.round((unlockedAchievements.length / ALL_ACHIEVEMENTS.length) * 100)})</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                    style={{ width: `${(unlockedAchievements.length / ALL_ACHIEVEMENTS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Filtre Sekmeleri: Tümü / Kazanılanlar / Kilitliler */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-800 rounded-xl mb-3 text-xs font-bold">
                <button
                  onClick={() => setAchievementFilter('ALL')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${achievementFilter === 'ALL' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Tümü ({ALL_ACHIEVEMENTS.length})
                </button>
                <button
                  onClick={() => setAchievementFilter('UNLOCKED')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${achievementFilter === 'UNLOCKED' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Kazanılan ({unlockedAchievements.length})
                </button>
                <button
                  onClick={() => setAchievementFilter('LOCKED')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${achievementFilter === 'LOCKED' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Kilitli ({ALL_ACHIEVEMENTS.length - unlockedAchievements.length})
                </button>
              </div>

              {/* Başarımlar Listesi */}
              <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 pb-1 max-h-[50vh]">
                {filteredAchievements.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    Bu filtrede başarım bulunamadı.
                  </div>
                ) : (
                  filteredAchievements.map((ach) => {
                    const isUnlocked = unlockedAchievements.includes(ach.id);
                    return (
                      <div
                        key={ach.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                          isUnlocked
                            ? 'bg-amber-500/10 border-amber-400/50 text-white shadow-sm'
                            : 'bg-slate-800/40 border-slate-700/50 text-slate-500 opacity-65'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                          isUnlocked ? 'bg-amber-400/20 border border-amber-400/50' : 'bg-slate-800 border border-slate-700'
                        }`}>
                          {ach.icon}
                        </div>

                        <div className="flex flex-col text-left flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold truncate ${isUnlocked ? 'text-amber-300' : 'text-slate-300'}`}>
                              {ach.title}
                            </span>
                            {isUnlocked ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 leading-snug">
                            {ach.desc}
                          </span>
                        </div>

                        {isUnlocked && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider shrink-0">
                            Açıldı
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <button
                onClick={() => setShowAchievementsDrawer(false)}
                className="mt-3 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        {/* Bottom Rules & Info */}
        <footer className="absolute bottom-1 left-0 right-0 z-20 flex items-center justify-center px-4 py-1 pointer-events-none opacity-80">
          <div className="text-[10px] text-white/90 drop-shadow flex items-center gap-2.5">
            <span>🟢 Boru: +10 P</span>
            <span>🪖 Asker: 1 Mermi</span>
            <span>🪶 Yere Süzülme</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
