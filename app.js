/**
 * Cocolush — Coconut milk, made lovely
 * High-Performance Smooth Engine & Interactive Animation System
 */

(function () {
  'use strict';

  // Ensure deterministic scroll reset on page refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if (!window.location.hash || window.location.hash === '#home') {
    window.scrollTo(0, 0);
  }

  // Global State
  const state = {
    cartCount: 1,
    cartItems: {
      pack: '6pack',
      title: 'Cocolush Pure Original',
      desc: '6-Pack (850ml Glass Bottles) · Chilled',
      price: 29.99,
      qty: 1
    },
    isSubscription: false,
    selectedVariant: 'pure',
    soundPlaying: false,
    audioCtx: null,
    whiteNoiseNode: null,
    isWaveVisible: true
  };

  // Crisp Web Audio Tactile Micro-Click Synthesis
  function playTactileClick(freq = 600, type = 'sine', duration = 0.04) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!window.__cocolushClickCtx) {
        window.__cocolushClickCtx = new AudioCtx();
      }
      const ctx = window.__cocolushClickCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.45, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }

  // Pre-compiled Information Catalog for all interactive buttons & badges
  const infoData = {
    'preservatives': {
      title: 'Zero Preservatives & Cold Micro-Filtration',
      badge: 'Clean Label Certified · Non-GMO',
      text: 'Every drop of Cocolush is protected through ultra-sterile nitrogen bottling and low-temperature cold micro-filtration. We use zero sodium metabisulfite, zero potassium sorbate, and zero sulfur dioxide. You taste pure, raw coconut meat and fresh coconut water as if cracked seconds ago.',
      specs: [
        { label: 'Chemical Additives', val: '0% None' },
        { label: 'Sterile Nitrogen', val: '100% Sealed' },
        { label: 'Chilled Freshness', val: '45 Days' }
      ]
    },
    'organic': {
      title: '100% Certified Regenerative Organic',
      badge: 'USDA Organic · EU Bio Certified',
      text: 'Our coconuts are hand-harvested from certified organic coastal palm groves nourished only by coastal breezes and seasonal monsoon rains. We practice regenerative agroforestry without synthetic fertilizers, pesticides, or glyphosate.',
      specs: [
        { label: 'Soil Health', val: 'Bio-Living' },
        { label: 'Pesticides', val: '0% Detected' },
        { label: 'Palm Age', val: '15–20 Yrs' }
      ]
    },
    'estate': {
      title: 'Single-Estate Origin (Grove #42)',
      badge: 'Direct Farm-to-Bottle Traceability',
      text: 'Unlike commercial coconut milks made from bulk global commodity pastes, Cocolush is grown, pressed, and bottled at a single family-run coastal estate in the Pollachi valley. Each bottle can be traced back to its specific grove plot.',
      specs: [
        { label: 'Harvest-to-Press', val: '< 4 Hours' },
        { label: 'Estate Area', val: '320 Acres' },
        { label: 'Traceability', val: 'Plot #42' }
      ]
    },
    'lowfat': {
      title: 'Naturally Silky & Balanced MCTs',
      badge: 'Plant-Based Goodness',
      text: 'Cocolush preserves the natural lipid profile of ripe coconut flesh without heavy synthetic emulsifiers. It provides light, digestible medium-chain triglycerides (MCTs) that your body directly converts to sustained clean energy.',
      specs: [
        { label: 'Clean MCT Fats', val: '16g / Bottle' },
        { label: 'Total Calories', val: '45 kcal' },
        { label: 'Cholesterol', val: '0mg' }
      ]
    },
    'lab': {
      title: 'Purity Lab Analysis & Quality Certificate',
      badge: 'Certified Independent Testing 2026',
      text: 'Independent HPLC lab testing confirms 100% pure coconut emulsion with zero detected gums (no guar gum, no xanthan, no gellan, no carrageenan). Brix index measures a naturally sweet 7.4° with zero added refined cane sugars.',
      specs: [
        { label: 'Purity Score', val: '99.8%' },
        { label: 'Carrageenan', val: '0.00%' },
        { label: 'Added Sugar', val: '0g Pure' }
      ]
    },
    'gums': {
      title: 'Zero Gums, Emulsifiers, or Fillers',
      badge: 'Gut-Friendly Guarantee',
      text: 'Industrial plant milks rely on gums to prevent watery separation. Cocolush uses precision high-pressure homogenization that micronizes natural coconut cream droplets, giving you cloud-like silkiness without gut-irritating additives.',
      specs: [
        { label: 'Guar Gum', val: 'None' },
        { label: 'Xanthan Gum', val: 'None' },
        { label: 'Gut Digestibility', val: '10/10' }
      ]
    },
    'mct': {
      title: 'Clean Medium-Chain Triglycerides (MCTs)',
      badge: 'Metabolic Brain & Body Fuel',
      text: 'Naturally rich in Lauric Acid (C12), Caprylic Acid (C8), and Capric Acid (C10). These unique healthy fatty acids bypass digestion in the liver to deliver clean, crash-free fuel for your morning focus and sustained vitality.',
      specs: [
        { label: 'Lauric Acid', val: '52%' },
        { label: 'Caprylic (C8)', val: '18%' },
        { label: 'Capric (C10)', val: '12%' }
      ]
    },
    'nutrition': {
      title: 'Full Nutrition Facts (850ml Bottle)',
      badge: 'Clean Nutrient Density',
      text: 'Serving Size: 240ml (~3.5 servings per bottle). Calories: 110 kcal · Total Fat: 10g (13% DV) · Saturated Fat (MCT): 9g · Trans Fat: 0g · Cholesterol: 0mg · Sodium: 35mg (2% DV) · Potassium: 380mg (8% DV) · Total Carb: 4g (1% DV) · Dietary Fiber: 2g · Total Sugars: 1g (0g Added Sugar) · Protein: 2g · Calcium: 20mg · Iron: 1.2mg.',
      specs: [
        { label: 'Added Sugars', val: '0g' },
        { label: 'Natural Potassium', val: '380mg' },
        { label: 'Plant Protein', val: '2g' }
      ]
    },
    'meat': {
      title: '100% Whole Pressed Meat vs 90% Tap Water',
      badge: 'Kernel Extraction Purity',
      text: 'Commercial boxed coconut milks use up to 85–90% municipal tap water thickened with synthetic gums. Cocolush presses 100% whole fresh coconut kernel blended only with pure natural coconut water, delivering authentic cloud-like richness.',
      specs: [
        { label: 'Pure Kernel Meat', val: '100%' },
        { label: 'Tap Water Added', val: '0%' },
        { label: 'Natural Texture', val: 'Velvet' }
      ]
    },
    'barista': {
      title: 'Micro-Foam Thermal Stability Science',
      badge: 'Barista Reserve Formulation',
      text: 'Engineered specifically for specialty coffee steaming. With a balanced lipid ratio and zero artificial emulsifiers, Cocolush achieves tight micro-bubbles between 55°C–65°C without curdling, yielding mirror-gloss latte art.',
      specs: [
        { label: 'Steaming Temp', val: '60°–65°C' },
        { label: 'Bubble Density', val: 'Micro-Silk' },
        { label: 'Curdling Resistance', val: '100% Stable' }
      ]
    },
    'review-barista': {
      title: 'Barista Acclaim: Matteo Rossi',
      badge: 'Head Roaster & Barista Champion',
      text: '“Cocolush has revolutionized our plant-based espresso program. It stretches beautifully like dairy whole milk, without any chemical stabilizers or overpowering off-flavors. It lets the delicate terroir of our Ethiopian and Geisha coffees shine.”',
      specs: [
        { label: 'Steaming Rating', val: '10 / 10' },
        { label: 'Latte Art Crispness', val: 'Flawless' },
        { label: 'Cafe Program', val: 'Adopted' }
      ]
    },
    'review-nutrition': {
      title: 'Clinical Acclaim: Aria Chen',
      badge: 'Holistic Nutritionist & Author',
      text: '“The cleanest coconut milk on the market today. It genuinely tastes like you just cracked open a fresh coconut by the shore. Zero gums means zero digestive bloat, and the 16g of natural MCTs provides hours of sustained mental clarity.”',
      specs: [
        { label: 'Gut Digestibility', val: '100% Clean' },
        { label: 'MCT Potency', val: '16g / Bottle' },
        { label: 'Glycemic Impact', val: 'Ultra-Low' }
      ]
    },
    'review-chef': {
      title: 'Pastry Acclaim: Chef Émile Laurent',
      badge: 'Executive Pastry Chef, Le Jardin',
      text: '“In my pastry kitchen, fat stability and pure coconut aroma are paramount. Cocolush gives our panna cotta and vegan ganache an unrivaled luxury mouthfeel that other watered-down cartons could never replicate.”',
      specs: [
        { label: 'Emulsion Stability', val: 'Supreme' },
        { label: 'Baking Yield', val: 'Consistent' },
        { label: 'Aroma Index', val: 'Fresh Palm' }
      ]
    }
  };

  // Technical Stage Specs for Process Section
  const stageSpecs = [
    {
      title: 'Stage 01: Hand-Harvested at Peak Maturity',
      badge: 'Golden Palm Selection',
      text: 'Harvested only at 11–12 months maturity when the kernel achieves maximum natural oil concentration and a natural Brix of 7.4°. Ripe nuts are caught gently to prevent micro-fracturing before processing.',
      specs: [
        { label: 'Brix Level', val: '7.4°' },
        { label: 'Kernel Moisture', val: '48%' },
        { label: 'Selection Rate', val: 'Top 15%' }
      ]
    },
    {
      title: 'Stage 02: Gentle Cleaver Split & Cold Shaving',
      badge: 'Zero Oxidation Protocol',
      text: 'Opened under sterile air curtain. The tender, pearl-white inner meat is mechanically shaved within 2 hours of splitting, eliminating enzymatic browning and preserving delicate natural floral sweetness.',
      specs: [
        { label: 'Post-Crack Time', val: '< 120 mins' },
        { label: 'Oxidation Level', val: '0.0%' },
        { label: 'Air Purity', val: 'Class 100' }
      ]
    },
    {
      title: 'Stage 03: 12-Bar Hydraulic Cold Press',
      badge: 'Cold Extraction (< 26°C)',
      text: 'Pressed through multi-stage titanium mesh plates using hydraulic cold force without water dilution. Zero friction heat is applied, keeping heat-sensitive vitamins and fresh enzymatic aroma completely intact.',
      specs: [
        { label: 'Hydraulic Pressure', val: '12 Bar' },
        { label: 'Extraction Temp', val: '24°C' },
        { label: 'Added Water', val: '0.0%' }
      ]
    },
    {
      title: 'Stage 04: Sterile Nitrogen Amber Bottling',
      badge: 'Airtight Sealed Packaging',
      text: 'Bottled immediately in UV-filtering amber glass with an airtight sealed blue crown cap. An inert nitrogen bubble displaces oxygen inside the bottle headspace, locking in creamy perfection for 45 chilled days.',
      specs: [
        { label: 'Oxygen in Cap', val: '< 0.1%' },
        { label: 'Glass Bottle', val: '100% Recyclable' },
        { label: 'Net Volume', val: '850ml' }
      ]
    }
  ];

  // Recipe Catalog
  const recipes = {
    'coffee': {
      title: 'Velvet Cocolush Flat White',
      tag: 'Specialty Coffee',
      prep: '4 mins',
      difficulty: 'Barista Level',
      desc: 'Silky micro-foam with delicate coconut sweetness that complements espresso acidity without curdling.',
      ingredients: [
        '180ml Cocolush Barista Reserve (steamed to 60°C)',
        '36g Double shot specialty espresso (medium roast)',
        'Dusting of organic Ceylon cinnamon (optional)'
      ],
      steps: [
        'Extract a rich double shot of espresso into a preheated ceramic cup.',
        'Steam cold Cocolush milk with a gentle vortex until a glossy, velvety micro-foam forms.',
        'Tap the pitcher firmly and swirl to polish the foam texture.',
        'Pour from 5cm height, lowering the pitcher near the surface to cast crisp latte art.'
      ]
    },
    'smoothie': {
      title: 'Tropical Golden Mango Elixir',
      tag: 'Morning Glow',
      prep: '3 mins',
      difficulty: 'Easy',
      desc: 'An energizing, ultra-creamy tropical blend packed with medium-chain triglycerides (MCTs).',
      ingredients: [
        '250ml Cocolush Pure Original',
        '1 ripe Alphonso mango (fresh or frozen)',
        '1/2 frozen banana',
        '1 tsp raw turmeric powder + pinch black pepper',
        '1 tbsp chia seeds'
      ],
      steps: [
        'Add Cocolush coconut milk to the blender base first for effortless blending.',
        'Add the mango chunks, frozen banana, and turmeric.',
        'Blend on high speed for 45 seconds until silky smooth and radiant golden.',
        'Pour into a chilled glass and garnish with coconut flakes and chia seeds.'
      ]
    },
    'oats': {
      title: 'Overnight Spiced Coconut Bircher',
      tag: 'Superfood Breakfast',
      prep: '5 mins prep · Overnight chill',
      difficulty: 'Effortless',
      desc: 'Plump organic rolled oats soaked in rich coconut cream with vanilla and crisp apple matchsticks.',
      ingredients: [
        '200ml Cocolush Vanilla Bean Infusion',
        '80g Organic rolled whole oats',
        '1 tbsp flaxseeds',
        '1 crisp green apple (grated)',
        '1 tbsp toasted crushed pistachios'
      ],
      steps: [
        'In a glass jar, combine oats, flaxseeds, and grated apple.',
        'Pour Cocolush coconut milk over the mixture and stir thoroughly.',
        'Seal the jar and refrigerate overnight (minimum 6 hours).',
        'Top with toasted pistachios and fresh berries before serving.'
      ]
    },
    'dessert': {
      title: 'Cardamom Coconut Panna Cotta',
      tag: 'Artisanal Dessert',
      prep: '15 mins · 3 hrs chill',
      difficulty: 'Intermediate',
      desc: 'A naturally dairy-free Italian classic with an unmistakable silky wobble and exotic fragrance.',
      ingredients: [
        '400ml Cocolush Pure Original',
        '45ml Pure maple syrup or agave',
        '3 crushed green cardamom pods',
        '1.5 tsp agar-agar powder',
        'Fresh passionfruit pulp for topping'
      ],
      steps: [
        'Gently heat Cocolush with maple syrup and crushed cardamom pods in a small saucepan.',
        'Whisk in agar-agar powder and simmer on low for 3 minutes to activate.',
        'Strain through a fine sieve into glass ramekins.',
        'Chill in the refrigerator for 3 hours until gently set. Spoon fresh passionfruit on top.'
      ]
    }
  };

  // Variants Data
  const variants = {
    'pure': {
      name: 'Pure Original (850ml)',
      tagline: 'Naturally sweet & velvety',
      glow: 'rgba(72, 169, 223, 0.45)',
      color: '#1b74a8',
      gradient: 'linear-gradient(90deg, #48a9df 0%, #1b74a8 100%)',
      mct: '16g per bottle',
      notes: 'Freshly cracked coconut · Light sweetness · Clean finish',
      radar: { cream: '92%', creamVal: '92%', sweet: '65%', sweetVal: '65%', foam: '88%', foamVal: '88%', mct: '72%', mctVal: '16g' }
    },
    'barista': {
      name: 'Barista Reserve (850ml)',
      tagline: 'Micro-foam perfection for latte art',
      glow: 'rgba(212, 163, 115, 0.5)',
      color: '#a35d20',
      gradient: 'linear-gradient(90deg, #d4a373 0%, #a35d20 100%)',
      mct: '18g per bottle',
      notes: 'Dense micro-bubbles · High thermal stability · Zero curdling',
      radar: { cream: '96%', creamVal: '96%', sweet: '45%', sweetVal: '45%', foam: '99%', foamVal: '99%', mct: '78%', mctVal: '18g' }
    },
    'vanilla': {
      name: 'Madagascar Vanilla (850ml)',
      tagline: 'Infused with organic Bourbon beans',
      glow: 'rgba(235, 190, 120, 0.5)',
      color: '#b8861c',
      gradient: 'linear-gradient(90deg, #ebbe78 0%, #b8861c 100%)',
      mct: '15g per bottle',
      notes: 'Floral vanilla aroma · Custard undertones · Dessert luxury',
      radar: { cream: '94%', creamVal: '94%', sweet: '78%', sweetVal: '78%', foam: '85%', foamVal: '85%', mct: '68%', mctVal: '15g' }
    },
    'keto': {
      name: 'Raw Keto Pure (850ml)',
      tagline: '0g Sugar · Maximum MCT Energy',
      glow: 'rgba(47, 138, 100, 0.45)',
      color: '#238350',
      gradient: 'linear-gradient(90deg, #52b788 0%, #238350 100%)',
      mct: '24g per bottle',
      notes: 'Ultra-dense richness · Zero carbohydrates · Sustained focus',
      radar: { cream: '98%', creamVal: '98%', sweet: '10%', sweetVal: '10%', foam: '82%', foamVal: '82%', mct: '98%', mctVal: '24g' }
    }
  };

  /* ========================================================================
     1. PERFORMANCE-OPTIMIZED HARMONIC MILK WAVES
     ======================================================================== */
  const waveConfigs = [
    { base: 110, amp: 85, f1: 2.2, f2: 3.9, s1: 0.9, s2: -0.55, phase: 0, fill: "rgba(255, 255, 255, 0.55)" },
    { base: 190, amp: 72, f1: 1.7, f2: 3.1, s1: -0.7, s2: 0.8, phase: 2.1, fill: "rgba(236, 246, 251, 0.92)" },
    { base: 270, amp: 62, f1: 1.3, f2: 2.6, s1: 0.6, s2: -0.9, phase: 4.2, fill: "#fbf8f0" }
  ];

  let cachedScrollP = 0;

  function buildWavePathOptimized(cfg, timeSec, scrollP, ampMult) {
    const isMob = window.innerWidth <= 860;
    const mobileAmpScale = isMob ? 0.32 : 1.0;
    const n = (2 * Math.PI) / 1440;
    let d = "";
    for (let x = 0; x <= 1440; x += 12) {
      const y = cfg.base + (cfg.amp * mobileAmpScale) * ampMult * (
        0.65 * Math.sin(x * n * cfg.f1 + timeSec * cfg.s1 + cfg.phase + 9 * scrollP) +
        0.35 * Math.sin(x * n * cfg.f2 + timeSec * cfg.s2 - 6 * scrollP)
      );
      d += `${x === 0 ? "M" : "L"}${x},${y.toFixed(1)}`;
    }
    return d;
  }

  function initMilkWave() {
    const waveSvg = document.querySelector('.milk-wave');
    if (!waveSvg) return;

    const waveGroups = waveSvg.querySelectorAll('g');
    const startTime = performance.now();

    function updateWaves(now) {
      const timeSec = (now - startTime) / 1000;
      const h = Math.min(1, Math.max(0, cachedScrollP / 0.7));
      const ampMult = 0.45 + 0.75 * Math.sin(Math.PI * h);

      waveConfigs.forEach((cfg, idx) => {
        const g = waveGroups[idx];
        if (!g) return;
        const fillPath = g.querySelector('path:first-child');
        const crestPath = g.querySelector('.milk-crest');

        const lineD = buildWavePathOptimized(cfg, timeSec, cachedScrollP, ampMult);
        if (fillPath) fillPath.setAttribute('d', `${lineD}L1440,404L0,404Z`);
        if (crestPath) crestPath.setAttribute('d', lineD);
      });

      requestAnimationFrame(updateWaves);
    }

    requestAnimationFrame(updateWaves);
  }

  /* ========================================================================
     2. HERO INTRO CHOREOGRAPHY (AUTHENTIC COCONUT-CRACKING ENTRANCE)
     ======================================================================== */
  function initHeroEntrance() {
    const leftNut = document.getElementById('leftNutIntro');
    const rightNut = document.getElementById('rightNutIntro');
    const bottle = document.getElementById('bottleIntro');
    const heroTitle = document.getElementById('hero-title');
    const heroLabels = document.querySelectorAll('.hero-label');
    const inspectBtn = document.getElementById('inspectBottleBtn');

    if (!leftNut || !rightNut || !bottle || !heroTitle) return;

    // Fast-path ONLY if user explicitly loaded a direct section hash (e.g. #story)
    const hasTargetHash = window.location.hash && window.location.hash !== '#home' && window.location.hash !== '#';
    if (hasTargetHash) {
      leftNut.classList.remove('intro-hidden');
      rightNut.classList.remove('intro-hidden');
      bottle.classList.remove('intro-hidden');
      heroTitle.classList.remove('intro-hidden');
      heroLabels.forEach(l => {
        l.style.opacity = '1';
        l.style.transform = 'translate3d(0, 0, 0) scale(1)';
      });
      if (inspectBtn) inspectBtn.style.opacity = '1';
      return;
    }

    // Reset scroll position to top so geometry calculation is 100% stable
    window.scrollTo(0, 0);

    // Geometry calculation: calculate exact vector deltas from elements' natural CSS positions to center of screen
    const midX = window.innerWidth / 2;
    const midY = window.innerHeight / 2;

    const calcDelta = (el, offsetMult) => {
      const r = el.getBoundingClientRect();
      return {
        dx: midX - (r.left + r.width / 2) + offsetMult * r.width,
        dy: midY - (r.top + r.height / 2),
        r: r
      };
    };

    const leftD = calcDelta(leftNut, -0.02);
    const rightD = calcDelta(rightNut, 0.12);

    // Make visible for hardware-accelerated Web Animations API execution
    leftNut.classList.remove('intro-hidden');
    rightNut.classList.remove('intro-hidden');

    // 1. Left Coconut Half: Flies from offscreen-left -> meets in center (0.8s) -> holds crack impact -> parts to hero resting spot (2.1s)
    const animLeft = leftNut.animate([
      { opacity: 1, transform: `translate3d(${-leftD.r.right - 60}px, ${leftD.dy}px, 0) rotate(-50deg)`, offset: 0 },
      { opacity: 1, transform: `translate3d(${leftD.dx}px, ${leftD.dy}px, 0) rotate(12deg)`, offset: 0.38 },
      { opacity: 1, transform: `translate3d(${leftD.dx}px, ${leftD.dy}px, 0) rotate(12deg)`, offset: 0.50 },
      { opacity: 1, transform: 'translate3d(0, 0, 0) rotate(0deg)', offset: 1.0 }
    ], {
      duration: 2100,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards'
    });
    animLeft.onfinish = () => {
      animLeft.cancel();
      leftNut.style.transform = 'translate3d(0, 0, 0)';
    };

    // 2. Right Coconut Half: Flies from offscreen-right -> crashes together in center -> parts to hero resting spot
    const animRight = rightNut.animate([
      { opacity: 1, transform: `translate3d(${window.innerWidth - rightD.r.left + 60}px, ${rightD.dy}px, 0) rotate(50deg)`, offset: 0 },
      { opacity: 1, transform: `translate3d(${rightD.dx}px, ${rightD.dy}px, 0) rotate(-12deg)`, offset: 0.38 },
      { opacity: 1, transform: `translate3d(${rightD.dx}px, ${rightD.dy}px, 0) rotate(-12deg)`, offset: 0.50 },
      { opacity: 1, transform: 'translate3d(0, 0, 0) rotate(0deg)', offset: 1.0 }
    ], {
      duration: 2100,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards'
    });
    animRight.onfinish = () => {
      animRight.cancel();
      rightNut.style.transform = 'translate3d(0, 0, 0)';
    };

    // 3. The 850ml Bottle: Pops up between cracked coconut halves at 1.05s with bounce
    setTimeout(() => {
      bottle.classList.remove('intro-hidden');
      const animBottle = bottle.animate([
        { opacity: 0, transform: 'translate3d(0, 60px, 0) scale(0.45)', offset: 0 },
        { opacity: 1, transform: 'translate3d(0, -10px, 0) scale(1.06)', offset: 0.6 },
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', offset: 1.0 }
      ], {
        duration: 1100,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      });
      animBottle.onfinish = () => {
        animBottle.cancel();
        bottle.style.transform = 'translate3d(0, 0, 0) scale(1)';
      };
    }, 1050);

    // 4. Hero Title ("Coconut milk"): Unblurs and fades into backdrop at 1.3s
    setTimeout(() => {
      heroTitle.classList.remove('intro-hidden');
      const animTitle = heroTitle.animate([
        { opacity: 0, filter: 'blur(14px)', offset: 0 },
        { opacity: 1, filter: 'blur(0px)', offset: 1.0 }
      ], {
        duration: 1400,
        easing: 'ease-out',
        fill: 'forwards'
      });
      animTitle.onfinish = () => {
        animTitle.cancel();
        heroTitle.style.filter = 'none';
      };
    }, 1300);

    // 5. Certification Pills & Inspect Button: Spring in at 2.1s
    setTimeout(() => {
      heroLabels.forEach((label, idx) => {
        label.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        label.style.transitionDelay = `${idx * 0.18}s`;
        label.style.opacity = '1';
        label.style.transform = 'translate3d(0, 0, 0) scale(1)';
      });
      if (inspectBtn) {
        inspectBtn.style.transition = 'opacity 0.6s ease, transform 0.6s var(--transition-bounce)';
        inspectBtn.style.opacity = '1';
      }
    }, 2100);
  }

  /* ========================================================================
     3. INTERACTIVE 3D MOUSE PARALLAX ON HERO BOTTLE
     ======================================================================== */
  function init3DBottleParallax() {
    const heroSection = document.getElementById('home');
    const bottleFloat = document.querySelector('.bottle-float');
    if (!heroSection || !bottleFloat) return;

    heroSection.addEventListener('mousemove', (e) => {
      if (window.scrollY < 400) {
        const rect = heroSection.getBoundingClientRect();
        const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
        const yPercent = (e.clientY - rect.top) / rect.height - 0.5;
        bottleFloat.style.transform = `rotateY(${xPercent * 16}deg) rotateX(${-yPercent * 14}deg) translate3d(${xPercent * 12}px, ${yPercent * 10}px, 0)`;
      }
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      bottleFloat.style.transform = 'rotateY(0deg) rotateX(0deg) translate3d(0, 0, 0)';
    });
  }

  /* ========================================================================
     4. BUTTER-SMOOTH CONTINUOUS SCROLL (ZERO DEAD ZONES OR STUCK FRAMES)
     ======================================================================== */
  function initSceneScroll() {
    const sceneTrack = document.getElementById('home');
    const bottle = document.querySelector('.bottle');
    const leftNut = document.querySelector('.coconut-left');
    const rightNut = document.querySelector('.coconut-right');
    const heroCopy = document.querySelector('.hero-copy');
    const heroPanel = document.querySelector('.hero-panel');
    const heroLabels = document.querySelector('.hero-labels');
    const storyPanel = document.querySelector('.story-panel');
    const spotlightTitleSpans = document.querySelectorAll('.spotlight-title .mask-line > span');
    const spotlightText = document.querySelector('.spotlight-copy > div');
    const spotlightBadge = document.querySelector('.spotlight-badge');
    const calloutLines = document.querySelectorAll('.callout-line');
    const calloutBodies = document.querySelectorAll('.callout-body');
    const marquee = document.querySelector('.marquee');

    if (!sceneTrack || !bottle || !storyPanel) return;

    let isMobile = window.innerWidth <= 860;
    let cachedTotal = sceneTrack.offsetHeight - window.innerHeight;
    let cachedTrackTop = sceneTrack.offsetTop;

    window.addEventListener('resize', () => {
      isMobile = window.innerWidth <= 860;
      cachedTotal = sceneTrack.offsetHeight - window.innerHeight;
      cachedTrackTop = sceneTrack.offsetTop;
    }, { passive: true });

    let ticking = false;

    function renderScroll() {
      const scrollY = window.scrollY;
      const relativeY = scrollY - cachedTrackTop;

      if (cachedTotal > 0) {
        cachedScrollP = Math.min(1, Math.max(0, relativeY / cachedTotal));
      }

      // Map scroll progress 0..0.7 to 0..1 (matching Cocuket reference choreography)
      const t = Math.min(1, Math.max(0, cachedScrollP / 0.7));

      // Hero Elements Fade
      const heroOpacity = Math.max(0, 1 - cachedScrollP / (0.8 * 0.7));
      if (heroCopy) {
        heroCopy.style.opacity = heroOpacity;
        heroCopy.style.pointerEvents = heroOpacity <= 0.05 ? 'none' : 'auto';
      }
      if (heroPanel) {
        heroPanel.style.opacity = heroOpacity;
        heroPanel.style.pointerEvents = heroOpacity <= 0.05 ? 'none' : 'auto';
      }
      if (heroLabels) {
        heroLabels.style.opacity = heroOpacity;
        if (heroOpacity <= 0.05) {
          heroLabels.style.pointerEvents = 'none';
          heroLabels.style.display = 'none';
        } else {
          heroLabels.style.pointerEvents = 'none';
          heroLabels.style.display = 'block';
        }
      }

      // Coconut Pieces Movement (Exact Cocuket trajectory: P=[-7vw], S=[-6vh], T=[-14deg], M=[7vw], k=[-10vh], A=[16deg])
      if (leftNut) {
        leftNut.style.transform = `translate3d(${-7 * t}vw, ${-6 * t}vh, 0) rotate(${-14 * t}deg)`;
      }
      if (rightNut) {
        rightNut.style.transform = `translate3d(${7 * t}vw, ${-10 * t}vh, 0) rotate(${16 * t}deg)`;
      }

      // Bottle Motion: Hero center -> Spotlight right position
      const bottleTargetX = isMobile ? 22 : 8;
      const bottleTargetY = isMobile ? 19 : 4;
      const bottleScale = 1 - (isMobile ? 0.36 : 0.2) * t;
      const bottleX = bottleTargetX * t;
      const bottleY = bottleTargetY * t;

      let bottleRot = -10;
      if (t < 0.6) {
        bottleRot = -10 + (14 * (t / 0.6));
      } else {
        bottleRot = 4 - (4 * ((t - 0.6) / 0.4));
      }

      bottle.style.transform = `translate3d(${bottleX}vw, ${bottleY}vh, 0) scale(${bottleScale}) rotate(${bottleRot}deg)`;

      // Story Panel Sliding Up (145% -> 0%) completes smoothly by scroll = 0.7
      const storyY = (1 - t) * 145;
      storyPanel.style.transform = `translate3d(0, ${storyY.toFixed(2)}%, 0)`;

      // Spotlight Copy Masked Reveal
      if (t > 0.65) {
        spotlightTitleSpans.forEach(span => {
          span.style.transform = 'translate3d(0, 0%, 0)';
        });
        if (spotlightText) {
          spotlightText.style.opacity = '1';
          spotlightText.style.transform = 'translate3d(0, 0, 0)';
          spotlightText.style.transition = 'all 0.5s ease 0.1s';
        }
        if (spotlightBadge) {
          spotlightBadge.style.opacity = '1';
          spotlightBadge.style.transform = 'scale(1)';
          spotlightBadge.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s';
        }
        if (marquee) {
          marquee.style.opacity = '0.85';
        }
      } else {
        spotlightTitleSpans.forEach(span => {
          span.style.transform = 'translate3d(0, 110%, 0)';
        });
        if (spotlightText) {
          spotlightText.style.opacity = '0';
          spotlightText.style.transform = 'translate3d(0, 24px, 0)';
        }
        if (spotlightBadge) {
          spotlightBadge.style.opacity = '0';
          spotlightBadge.style.transform = 'scale(0.6)';
        }
        if (marquee) marquee.style.opacity = '0';
      }

      // Callouts Reveal
      if (t > 0.8) {
        calloutLines.forEach(line => line.style.transform = 'scaleX(1)');
        calloutBodies.forEach((body, i) => {
          body.style.opacity = '1';
          body.style.transform = 'translate3d(0, 0, 0)';
          body.style.transitionDelay = `${0.08 + i * 0.1}s`;
        });
      } else {
        calloutLines.forEach(line => line.style.transform = 'scaleX(0)');
        calloutBodies.forEach(body => {
          body.style.opacity = '0';
          body.style.transform = 'translate3d(30px, 0, 0)';
        });
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(renderScroll);
        ticking = true;
      }
    }, { passive: true });

    renderScroll();
  }

  /* ========================================================================
     5. PROCESS SECTION (RESPONSIVE 240svh STAGE PACING)
     ======================================================================== */
  const processSteps = [
    { n: "01", key: "pick", title: "Picked", text: "We hand-select mature golden coconuts from sustainable coastal groves — only the richest, cream-dense nuts make the grade.", spec: "Estate Harvested · Brix: 7.4°" },
    { n: "02", key: "crack", title: "Cracked", text: "Each coconut is opened and its fresh pearl-white meat is gently shaved within hours of harvest.", spec: "Zero Oxidation · Pure Kernel" },
    { n: "03", key: "press", title: "Pressed", text: "Hydraulic cold-press extraction gently draws out pure, silky coconut milk with zero added water and zero heat.", spec: "12-Bar Cold Press · < 26°C" },
    { n: "04", key: "pour", title: "Poured", text: "Bottled directly into UV-protective glass with zero preservatives or gums. Just pure coconut, ready to pour.", spec: "Nitrogen Sealed · Clean Label" }
  ];

  let currentProcessIdx = 0;

  function initProcessSection() {
    const processTrack = document.getElementById('process');
    if (!processTrack) return;

    const stages = document.querySelectorAll('.process-stage .stage');
    const stepNum = document.querySelector('.process-step-num');
    const stepTitle = document.querySelector('.process-copy h3');
    const stepText = document.querySelector('.process-copy p');
    const stepSpec = document.querySelector('.process-spec-tag');
    const lineFill = document.querySelector('.process-line-fill');
    const dots = document.querySelectorAll('.process-dot');
    const currentCount = document.querySelector('.process-count strong');

    function applyStep(idx) {
      if (idx === currentProcessIdx && stages[idx]?.classList.contains('is-active')) return;
      currentProcessIdx = idx;

      stages.forEach((st, i) => st.classList.toggle('is-active', i === idx));

      const data = processSteps[idx];
      if (stepNum) stepNum.textContent = data.n;
      if (stepTitle) stepTitle.textContent = data.title;
      if (stepText) stepText.textContent = data.text;
      if (stepSpec) stepSpec.innerHTML = `<span>★</span> ${data.spec} &nbsp;ⓘ`;
      if (currentCount) currentCount.textContent = data.n;

      dots.forEach((dot, i) => dot.classList.toggle('is-on', i === idx));
      if (lineFill) lineFill.style.transform = `scaleX(${idx / (processSteps.length - 1)})`;
    }

    let processTicking = false;
    window.addEventListener('scroll', () => {
      if (!processTicking) {
        requestAnimationFrame(() => {
          const rect = processTrack.getBoundingClientRect();
          const total = processTrack.offsetHeight - window.innerHeight;
          if (total > 0) {
            const progress = Math.min(1, Math.max(0, -rect.top / total));
            const stepIdx = Math.min(processSteps.length - 1, Math.floor(progress * processSteps.length));
            applyStep(stepIdx);
          }
          processTicking = false;
        });
        processTicking = true;
      }
    }, { passive: true });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const total = processTrack.offsetHeight - window.innerHeight;
        const targetScroll = processTrack.offsetTop + (idx / processSteps.length) * total + 10;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        applyStep(idx);
        showToast(`Jumped to Stage 0${idx + 1}: ${processSteps[idx].title}`);
      });
    });

    if (stepSpec) {
      stepSpec.addEventListener('click', () => {
        openStageSpecModal(currentProcessIdx);
      });
    }

    applyStep(0);
  }

  function openStageSpecModal(idx) {
    const data = stageSpecs[idx];
    if (!data) return;
    openUniversalModal(data.title, data.badge, data.text, data.specs, 'Explore Full Process');
  }

  /* ========================================================================
     6. WAYS TO ENJOY (CURSOR-FOLLOWING FLOATING PREVIEWS)
     ======================================================================== */
  function initUsesHover() {
    const usesList = document.querySelector('.uses-list');
    const floatEl = document.querySelector('.use-float');
    if (!usesList || !floatEl) return;

    const floatImages = floatEl.querySelectorAll('img');
    const rows = usesList.querySelectorAll('.use-row');

    let mouseX = 0, mouseY = 0;
    let currX = 0, currY = 0;
    let isHovering = false;
    let activeIdx = null;
    const rotations = [-6, 5, -4, 6];

    usesList.addEventListener('pointermove', (e) => {
      const rect = usesList.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isHovering = true;
    }, { passive: true });

    usesList.addEventListener('pointerleave', () => {
      isHovering = false;
      floatEl.style.opacity = '0';
      floatImages.forEach(img => img.classList.remove('is-shown'));
      rows.forEach(r => {
        r.classList.remove('is-hovered');
        r.classList.remove('is-dimmed');
      });
    });

    rows.forEach((row, idx) => {
      row.addEventListener('pointerenter', () => {
        activeIdx = idx;
        rows.forEach((r, i) => {
          r.classList.toggle('is-hovered', i === idx);
          r.classList.toggle('is-dimmed', i !== idx);
        });

        floatImages.forEach((img, i) => {
          img.classList.toggle('is-shown', i === idx);
        });

        floatEl.style.opacity = '1';
        floatEl.style.transform = `translate3d(${currX}px, ${currY}px, 0) scale(1) rotate(${rotations[idx]}deg)`;
      });

      row.addEventListener('click', (e) => {
        e.preventDefault();
        const recipeKeys = ['coffee', 'smoothie', 'oats', 'dessert'];
        openRecipeModal(recipeKeys[idx]);
      });
    });

    function animateFloat() {
      if (isHovering) {
        currX += (mouseX - currX) * 0.18;
        currY += (mouseY - currY) * 0.18;
        const rot = activeIdx !== null ? rotations[activeIdx] : 0;
        floatEl.style.transform = `translate3d(${currX}px, ${currY}px, 0) scale(1) rotate(${rot}deg)`;
      }
      requestAnimationFrame(animateFloat);
    }
    requestAnimationFrame(animateFloat);
  }

  /* ========================================================================
     7. UNIVERSAL MODAL SYSTEM (PROVIDES ANIMATED INFO ON ALL BUTTON CLICKS)
     ======================================================================== */
  function openUniversalModal(title, badge, text, specs, actionBtnText = 'Add to Bag &rarr;') {
    const modalOverlay = document.getElementById('appInfoModalOverlay');
    const modalTitle = document.getElementById('infoModalTitle');
    const modalBadge = document.getElementById('infoModalBadge');
    const modalText = document.getElementById('infoModalText');
    const modalSpecs = document.getElementById('infoModalSpecs');
    const actionBtn = document.getElementById('infoModalActionBtn');

    if (!modalOverlay) return;

    if (modalTitle) modalTitle.textContent = title;
    if (modalBadge) modalBadge.textContent = badge;
    if (modalText) modalText.textContent = text;

    if (modalSpecs && specs && specs.length) {
      modalSpecs.innerHTML = specs.map(sp => `
        <div style="padding: 14px; background: var(--cream); border-radius: 16px; border: 1px solid rgba(23, 59, 84, 0.08); text-align: center;">
          <div style="font-family: var(--font-display); font-size: 20px; font-weight: 800; color: var(--blue-deep);">${sp.val}</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--ink-soft); margin-top: 4px;">${sp.label}</div>
        </div>
      `).join('');
    } else if (modalSpecs) {
      modalSpecs.innerHTML = '';
    }

    if (actionBtn) {
      actionBtn.innerHTML = `<span>${actionBtnText}</span>`;
      actionBtn.onclick = () => {
        modalOverlay.classList.remove('is-open');
        addItemToCart();
        openCart();
      };
    }

    modalOverlay.classList.add('is-open');
  }

  function initUniversalModals() {
    const modalOverlay = document.getElementById('appInfoModalOverlay');
    if (!modalOverlay) return;

    const closeBtn = modalOverlay.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modalOverlay.classList.remove('is-open'));
    }
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('is-open');
    });

    // 1. Hero floating badges (Zero preservatives, 100% Organic, Single-Estate)
    document.querySelectorAll('.hero-label').forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = badge.dataset.info;
        if (infoData[key]) {
          const item = infoData[key];
          openUniversalModal(item.title, item.badge, item.text, item.specs);
        }
      });
    });

    // 2. Story panel Callouts 01, 02, 03
    document.querySelectorAll('.callout').forEach(callout => {
      callout.addEventListener('click', () => {
        const key = callout.dataset.info;
        if (infoData[key]) {
          const item = infoData[key];
          openUniversalModal(item.title, item.badge, item.text, item.specs);
        }
      });
    });

    // 3. Rotating badge & Lab report buttons
    const badgeBtn = document.getElementById('spotlightBadgeBtn');
    if (badgeBtn) {
      badgeBtn.addEventListener('click', () => {
        const item = infoData['lab'];
        openUniversalModal(item.title, item.badge, item.text, item.specs);
      });
    }

    const labBtn = document.getElementById('viewLabReportBtn');
    if (labBtn) {
      labBtn.addEventListener('click', () => {
        const item = infoData['lab'];
        openUniversalModal(item.title, item.badge, item.text, item.specs);
      });
    }

    const purityBadgeBtn = document.getElementById('purityLabBadgeBtn');
    if (purityBadgeBtn) {
      purityBadgeBtn.addEventListener('click', () => {
        const item = infoData['lab'];
        openUniversalModal(item.title, item.badge, item.text, item.specs);
      });
    }

    // 4. Purity Stat Items
    document.querySelectorAll('.purity-stat-item').forEach(item => {
      item.addEventListener('click', () => {
        const statKey = item.dataset.stat;
        if (statKey && infoData[statKey]) {
          const d = infoData[statKey];
          openUniversalModal(d.title, d.badge, d.text, d.specs);
        }
      });
    });

    // 5. Nutrition Facts button
    const nutritionBtn = document.getElementById('viewNutritionFactsBtn');
    if (nutritionBtn) {
      nutritionBtn.addEventListener('click', () => {
        const d = infoData['nutrition'];
        openUniversalModal(d.title, d.badge, d.text, d.specs);
      });
    }

    // 6. Benchmark Comparison Table Rows
    document.querySelectorAll('.clickable-row').forEach(row => {
      row.addEventListener('click', () => {
        const stat = row.dataset.stat;
        if (stat && infoData[stat]) {
          const d = infoData[stat];
          openUniversalModal(d.title, d.badge, d.text, d.specs);
        }
      });
    });

    // 7. Verified Critic & Barista Review Cards
    document.querySelectorAll('.review-card').forEach(card => {
      card.addEventListener('click', () => {
        const rKey = 'review-' + (card.dataset.review || card.dataset.category);
        if (infoData[rKey]) {
          const d = infoData[rKey];
          openUniversalModal(d.title, d.badge, d.text, d.specs, 'Order Cocolush Chilled &rarr;');
        }
      });
    });

    // 8. Process Step Number & Farmer Illustration
    const processStepNum = document.querySelector('.process-step-num');
    if (processStepNum) {
      processStepNum.style.cursor = 'pointer';
      processStepNum.title = 'Click to inspect stage protocol';
      processStepNum.addEventListener('click', () => {
        openStageSpecModal(currentProcessIdx);
      });
    }

    const farmerSvg = document.querySelector('.farmer-svg');
    if (farmerSvg) {
      farmerSvg.style.cursor = 'pointer';
      farmerSvg.setAttribute('title', 'Click to inspect artisanal process step');
      farmerSvg.addEventListener('click', () => {
        openStageSpecModal(currentProcessIdx);
      });
    }
  }

  /* ========================================================================
     8. 3D BOTTLE SHOWCASE MODAL (INSPECT 850ML BOTTLE)
     ======================================================================== */
  function initBottleShowcase() {
    const trigger = document.getElementById('inspectBottleBtn');
    const modalOverlay = document.getElementById('bottleShowcaseModalOverlay');
    if (!trigger || !modalOverlay) return;

    const closeBtn = modalOverlay.querySelector('.modal-close-btn');
    const addBtn = document.getElementById('showcaseAddBagBtn');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      modalOverlay.classList.add('is-open');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modalOverlay.classList.remove('is-open'));
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('is-open');
    });

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('is-open');
        addItemToCart();
        openCart();
      });
    }
  }

  /* ========================================================================
     9. RECIPE MODAL HANDLER
     ======================================================================== */
  function openRecipeModal(key) {
    const data = recipes[key];
    if (!data) return;

    const modalOverlay = document.getElementById('recipeModalOverlay');
    const modalTitle = document.getElementById('recipeModalTitle');
    const modalTag = document.getElementById('recipeModalTag');
    const modalPrep = document.getElementById('recipeModalPrep');
    const modalDiff = document.getElementById('recipeModalDiff');
    const modalDesc = document.getElementById('recipeModalDesc');
    const ingredientsList = document.getElementById('recipeIngredientsList');
    const stepsList = document.getElementById('recipeStepsList');

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalTag) modalTag.textContent = data.tag;
    if (modalPrep) modalPrep.textContent = `⏱ Prep: ${data.prep}`;
    if (modalDiff) modalDiff.textContent = `★ ${data.difficulty}`;
    if (modalDesc) modalDesc.textContent = data.desc;

    if (ingredientsList) {
      ingredientsList.innerHTML = data.ingredients.map(ing => `<li>✔ ${ing}</li>`).join('');
    }
    if (stepsList) {
      stepsList.innerHTML = data.steps.map(s => `<li>${s}</li>`).join('');
    }

    if (modalOverlay) modalOverlay.classList.add('is-open');
  }

  function initRecipeModal() {
    const modalOverlay = document.getElementById('recipeModalOverlay');
    const closeBtn = document.querySelector('.recipe-modal-close');
    const addBtn = document.getElementById('recipeAddToCartBtn');
    if (!modalOverlay) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modalOverlay.classList.remove('is-open'));
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('is-open');
    });

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('is-open');
        addItemToCart();
        openCart();
      });
    }
  }

  /* ========================================================================
     10. VARIANT SWITCHER WITH LIVE ACCENTS & SENSORY RADAR
     ======================================================================== */
  function animateCounter(el, targetValStr) {
    if (!el || !targetValStr) return;
    const isGrams = targetValStr.includes('g');
    const isPercent = targetValStr.includes('%');
    const targetNum = parseInt(targetValStr, 10);
    if (isNaN(targetNum)) {
      el.textContent = targetValStr;
      return;
    }
    const currNum = parseInt(el.textContent, 10) || 0;
    const suffix = isGrams ? 'g' : (isPercent ? '%' : '');

    const startTime = performance.now();
    const duration = 420;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(currNum + (targetNum - currNum) * ease);
      el.textContent = `${val}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = targetValStr;
      }
    }
    requestAnimationFrame(step);
  }

  function initVariantSwitcher() {
    const pills = document.querySelectorAll('.variant-pill');
    const bottleGlow = document.querySelector('.bottle-glow');

    const radarCream = document.getElementById('radarCream');
    const valCream = document.getElementById('valCream');
    const radarSweet = document.getElementById('radarSweet');
    const valSweet = document.getElementById('valSweet');
    const radarFoam = document.getElementById('radarFoam');
    const valFoam = document.getElementById('valFoam');
    const radarMct = document.getElementById('radarMct');
    const valMct = document.getElementById('valMct');

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const vKey = pill.dataset.variant;
        if (!variants[vKey]) return;

        playTactileClick(640);

        pills.forEach(p => {
          const isActive = p === pill;
          p.classList.toggle('is-active', isActive);
          p.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        state.selectedVariant = vKey;

        const vData = variants[vKey];
        if (bottleGlow) {
          bottleGlow.style.background = `radial-gradient(closest-side, ${vData.glow}, transparent)`;
        }

        // Dynamically tint radar bars to match active flavor theme
        const sensoryFills = document.querySelectorAll('.sensory-fill');
        sensoryFills.forEach(fill => {
          fill.style.background = vData.gradient;
        });

        // Live Sensory Radar Bars Animation with 21st.dev Animated Number Rolling Ticker
        if (vData.radar) {
          if (radarCream) radarCream.style.width = vData.radar.cream;
          if (valCream) animateCounter(valCream, vData.radar.creamVal);
          if (radarSweet) radarSweet.style.width = vData.radar.sweet;
          if (valSweet) animateCounter(valSweet, vData.radar.sweetVal);
          if (radarFoam) radarFoam.style.width = vData.radar.foam;
          if (valFoam) animateCounter(valFoam, vData.radar.foamVal);
          if (radarMct) radarMct.style.width = vData.radar.mct;
          if (valMct) animateCounter(valMct, vData.radar.mctVal);
        }

        showToast(`★ Selected: ${vData.name} — ${vData.tagline}`);
      });
    });
  }

  /* ========================================================================
     11. SHOPPING CART DRAWER & BUNDLE SELECTOR (SYNCHRONIZED QUANTITY & BADGE)
     ======================================================================== */
  function openCart() {
    const drawerBackdrop = document.querySelector('.drawer-backdrop');
    const drawer = document.querySelector('.cart-drawer');
    if (drawerBackdrop && drawer) {
      drawerBackdrop.classList.add('is-open');
      drawer.classList.add('is-open');
    }
  }

  function closeCart() {
    const drawerBackdrop = document.querySelector('.drawer-backdrop');
    const drawer = document.querySelector('.cart-drawer');
    if (drawerBackdrop && drawer) {
      drawerBackdrop.classList.remove('is-open');
      drawer.classList.remove('is-open');
    }
  }

  function syncCartState(newQty) {
    state.cartItems.qty = Math.max(0, newQty);
    state.cartCount = state.cartItems.qty;

    // Update Header Badge (.cart-badge)
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = state.cartCount;
      badge.classList.toggle('is-empty', state.cartCount === 0);

      // Trigger bump animation
      badge.classList.remove('is-bumped');
      void badge.offsetWidth;
      badge.classList.add('is-bumped');
      setTimeout(() => badge.classList.remove('is-bumped'), 300);
    }

    // Update Drawer Title & Count
    const drawerCountEl = document.getElementById('drawerCountVal');
    if (drawerCountEl) drawerCountEl.textContent = state.cartCount;

    const activeItemEl = document.getElementById('cartActiveItem');
    const emptyStateEl = document.getElementById('cartEmptyState');
    const footerEl = document.getElementById('cartDrawerFooter');

    if (state.cartCount === 0) {
      if (activeItemEl) activeItemEl.style.display = 'none';
      if (emptyStateEl) emptyStateEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'none';
    } else {
      if (activeItemEl) activeItemEl.style.display = 'grid';
      if (emptyStateEl) emptyStateEl.style.display = 'none';
      if (footerEl) footerEl.style.display = 'block';
    }

    const descEl = document.getElementById('cartItemPackDesc');
    const qtyEl = document.getElementById('cartItemQtyVal');
    const priceEl = document.getElementById('cartItemPriceVal');
    const subtotalEl = document.getElementById('cartSubtotalVal');

    if (descEl) descEl.textContent = state.cartItems.desc;
    if (qtyEl) qtyEl.textContent = state.cartItems.qty;

    // Subscription math (15% discount when subscription active)
    const isSub = state.isSubscription;
    const basePrice = state.cartItems.price;
    const unitPrice = isSub ? basePrice * 0.85 : basePrice;
    const total = (unitPrice * state.cartItems.qty).toFixed(2);

    if (priceEl) priceEl.textContent = `$${unitPrice.toFixed(2)}`;
    if (subtotalEl) {
      if (isSub) {
        subtotalEl.innerHTML = `$${total} <span style="font-size: 11px; color: #2f8a64; font-weight: 700;">(-15% Sub)</span>`;
      } else {
        subtotalEl.textContent = `$${total}`;
      }
    }

    // Dynamic Free Shipping threshold calculation ($35.00)
    const shippingThreshold = 35.00;
    const currentSubtotal = parseFloat(total) || 0;
    const shippingProgressFill = document.getElementById('shippingProgressFill');
    const shippingBadgeText = document.getElementById('shippingBadgeText');

    if (shippingProgressFill && shippingBadgeText) {
      if (currentSubtotal === 0) {
        shippingProgressFill.style.width = '0%';
        shippingProgressFill.classList.remove('free-shipping-unlocked');
        shippingBadgeText.innerHTML = `🚚 Add <strong>$35.00</strong> for <strong>FREE Chilled Delivery</strong>`;
      } else if (currentSubtotal < shippingThreshold) {
        const remaining = (shippingThreshold - currentSubtotal).toFixed(2);
        const percent = Math.min(100, Math.round((currentSubtotal / shippingThreshold) * 100));
        shippingProgressFill.style.width = `${percent}%`;
        shippingProgressFill.classList.remove('free-shipping-unlocked');
        shippingBadgeText.innerHTML = `🚚 Add <strong>$${remaining}</strong> more for <strong>FREE Chilled Delivery</strong>`;
      } else {
        shippingProgressFill.style.width = '100%';
        shippingProgressFill.classList.add('free-shipping-unlocked');
        shippingBadgeText.innerHTML = `🎉 <strong>FREE Chilled Delivery Unlocked!</strong> (Tomorrow, 10 AM)`;
      }
    }

    // Sync drawer checkbox
    const subCheckbox = document.getElementById('drawerSubscribeCheckbox');
    if (subCheckbox) subCheckbox.checked = isSub;

    // Sync CTA frequency buttons
    const btnOneTime = document.getElementById('btnFreqOneTime');
    const btnSub = document.getElementById('btnFreqSubscribe');
    if (btnOneTime && btnSub) {
      btnOneTime.classList.toggle('is-active', !isSub);
      btnSub.classList.toggle('is-active', isSub);
    }
  }

  function addItemToCart(num = 1) {
    playTactileClick(760);
    syncCartState(state.cartItems.qty + num);
    showToast(`Added to Bag! Total: ${state.cartCount} in chilled bag.`);
  }

  function removeItemFromCart() {
    playTactileClick(420);
    syncCartState(0);
    showToast('Removed item from your chilled bag.');
  }

  function initCartDrawer() {
    const cartToggle = document.querySelector('.cart-toggle-btn');
    const drawerBackdrop = document.querySelector('.drawer-backdrop');
    const drawerClose = document.querySelector('.drawer-close');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const packBtns = document.querySelectorAll('.cta-pack-btn');
    const ctaBuyBtn = document.getElementById('ctaOrderChilledBtn');
    const headerBuyBtn = document.querySelector('.buy-button');
    const removeBtn = document.getElementById('cartItemRemoveBtn');
    const shopNowBtn = document.getElementById('cartShopNowBtn');
    const subCheckbox = document.getElementById('drawerSubscribeCheckbox');
    const btnFreqOneTime = document.getElementById('btnFreqOneTime');
    const btnFreqSubscribe = document.getElementById('btnFreqSubscribe');

    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (drawerClose) drawerClose.addEventListener('click', closeCart);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeCart);

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        removeItemFromCart();
      });
    }

    if (shopNowBtn) {
      shopNowBtn.addEventListener('click', () => {
        closeCart();
        scrollToTarget('#cta');
      });
    }

    // Subscription Toggles
    if (subCheckbox) {
      subCheckbox.addEventListener('change', () => {
        state.isSubscription = subCheckbox.checked;
        syncCartState(state.cartItems.qty);
        showToast(state.isSubscription ? '⚡ Subscribed! 15% discount applied.' : 'One-time order selected.');
      });
    }

    if (btnFreqOneTime && btnFreqSubscribe) {
      btnFreqOneTime.addEventListener('click', () => {
        playTactileClick(520);
        state.isSubscription = false;
        syncCartState(state.cartItems.qty);
        showToast('One-Time Purchase selected.');
      });

      btnFreqSubscribe.addEventListener('click', () => {
        playTactileClick(600);
        state.isSubscription = true;
        syncCartState(state.cartItems.qty);
        showToast('★ Subscribe & Save 15% activated! Auto-delivers every 2 weeks.');
      });
    }

    // Pack Selector
    packBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playTactileClick(580);
        packBtns.forEach(b => b.classList.toggle('is-active', b === btn));
        const pack = btn.dataset.pack;

        if (pack === 'single') {
          state.cartItems.pack = 'single';
          state.cartItems.desc = 'Single 850ml Glass Bottle · Chilled';
          state.cartItems.price = 5.99;
        } else if (pack === '6pack') {
          state.cartItems.pack = '6pack';
          state.cartItems.desc = '6-Pack (850ml Glass Bottles) · Chilled';
          state.cartItems.price = 29.99;
        } else if (pack === '12pack') {
          state.cartItems.pack = '12pack';
          state.cartItems.desc = '12-Pack (850ml Glass Bottles) · Chilled';
          state.cartItems.price = 54.99;
        }

        // If bag was 0, selecting a pack brings it to 1
        if (state.cartItems.qty === 0) {
          syncCartState(1);
        } else {
          syncCartState(state.cartItems.qty);
        }

        showToast(`Selected: ${state.cartItems.desc}`);
      });
    });

    if (ctaBuyBtn) {
      ctaBuyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addItemToCart(1);
        openCart();
      });
    }

    if (headerBuyBtn) {
      headerBuyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addItemToCart(1);
        openCart();
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (state.cartCount === 0) {
          showToast('Your bag is empty. Please select a pack to continue.');
          return;
        }
        closeCart();
        const msg = state.isSubscription
          ? '🎉 Thank you! Your Cocolush 2-week subscription is confirmed. First chilled box is on its way!'
          : '🎉 Thank you! Your Cocolush order is confirmed. Chilled delivery initiated.';
        showToast(msg);
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('#cartQtyPlusBtn') || e.target.classList.contains('qty-plus')) {
        playTactileClick(720);
        syncCartState(state.cartItems.qty + 1);
        showToast(`Quantity: ${state.cartItems.qty}`);
      } else if (e.target.closest('#cartQtyMinusBtn') || e.target.classList.contains('qty-minus')) {
        playTactileClick(540);
        if (state.cartItems.qty > 1) {
          syncCartState(state.cartItems.qty - 1);
          showToast(`Quantity: ${state.cartItems.qty}`);
        } else {
          removeItemFromCart();
        }
      }
    });

    // Initial sync
    syncCartState(state.cartItems.qty);
  }

  /* ========================================================================
     12. INTERACTIVE REVIEWS FILTER
     ======================================================================== */
  function initReviewsFilter() {
    const filterBtns = document.querySelectorAll('.review-filter-btn');
    const cards = document.querySelectorAll('.review-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.toggle('is-active', b === btn));
        const filter = btn.dataset.filter;

        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('is-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translate3d(0, 10px, 0)';
            setTimeout(() => {
              card.style.transition = 'all 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translate3d(0, 0, 0)';
            }, 50);
          } else {
            card.classList.add('is-hidden');
          }
        });

        showToast(`Filtered: ${btn.textContent}`);
      });
    });
  }

  /* ========================================================================
     13. FAQ ACCORDION
     ======================================================================== */
  function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      const q = item.querySelector('.faq-question');
      if (q) {
        q.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-expanded');
          items.forEach(it => it.classList.remove('is-expanded'));
          if (!isOpen) {
            item.classList.add('is-expanded');
          }
        });
      }
    });
  }

  /* ========================================================================
     14. AMBIENT NATURE SOUNDSCAPE
     ======================================================================== */
  function initAmbientAudio() {
    const soundBtn = document.querySelector('.sound-toggle-btn');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
      if (!state.soundPlaying) {
        startSound();
        soundBtn.classList.add('is-playing');
        soundBtn.setAttribute('title', 'Mute ambient soundscape');
        showToast('🔊 Ambient nature breeze & milk pour soundscape enabled');
      } else {
        stopSound();
        soundBtn.classList.remove('is-playing');
        soundBtn.setAttribute('title', 'Play ambient soundscape');
        showToast('🔇 Soundscape muted');
      }
    });

    function startSound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        state.audioCtx = new AudioCtx();

        const bufferSize = state.audioCtx.sampleRate * 2;
        const noiseBuffer = state.audioCtx.createBuffer(1, bufferSize, state.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.025;
          b6 = white * 0.115926;
        }

        const whiteNoise = state.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = state.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, state.audioCtx.currentTime);

        const gainNode = state.audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.01, state.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.12, state.audioCtx.currentTime + 2);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(state.audioCtx.destination);

        whiteNoise.start();
        state.whiteNoiseNode = whiteNoise;
        state.soundPlaying = true;
      } catch (err) {
        console.warn('Audio synthesis not permitted:', err);
      }
    }

    function stopSound() {
      if (state.audioCtx) {
        state.audioCtx.close();
        state.audioCtx = null;
        state.soundPlaying = false;
      }
    }
  }

  /* ========================================================================
     15. UTILITIES & TOAST NOTIFICATION
     ======================================================================== */
  function showToast(msg) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('is-active');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('is-active');
    }, 3000);
  }

  // Header scroll spy
  let headerTicking = false;
  window.addEventListener('scroll', () => {
    if (!headerTicking) {
      requestAnimationFrame(() => {
        const header = document.querySelector('.site-header');
        if (header) {
          if (window.scrollY > 40) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
        }
        headerTicking = false;
      });
      headerTicking = true;
    }
  }, { passive: true });

  /* ========================================================================
     16. INTELLIGENT NAVIGATION & DEEP LINK ROUTER
     ======================================================================== */
  function scrollToTarget(hash) {
    if (!hash || hash === '#' || hash === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const sceneTrack = document.getElementById('home');

    // Handle #story and #goodness which live inside the pinned .scene-track
    if (hash === '#story') {
      if (sceneTrack) {
        const total = sceneTrack.offsetHeight - window.innerHeight;
        const targetScroll = sceneTrack.offsetTop + total * 0.92;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
      return;
    }

    if (hash === '#goodness') {
      if (sceneTrack) {
        const total = sceneTrack.offsetHeight - window.innerHeight;
        const targetScroll = sceneTrack.offsetTop + total * 0.98;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
      return;
    }

    const cleanId = hash.replace(/^#/, '');
    const targetEl = document.getElementById(cleanId);
    if (targetEl) {
      const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function initSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        if (hash && hash.length > 1) {
          e.preventDefault();
          scrollToTarget(hash);
        }
      });
    });

    // Check for initial URL hash on direct page load
    const hash = window.location.hash;
    if (hash && hash !== '#home' && hash !== '#') {
      scrollToTarget(hash);
    }
  }

  /* ========================================================================
     15. 21st.dev TASTE QUIZ & PROMO CODE COPY SYSTEM
     ======================================================================== */
  function initTasteQuizModal() {
    const trigger = document.getElementById('tasteQuizBtn');
    const modalOverlay = document.getElementById('tasteQuizModalOverlay');
    if (!modalOverlay) return;

    const closeBtn = modalOverlay.querySelector('.quiz-modal-close');
    const cards = modalOverlay.querySelectorAll('.quiz-card');
    const resultBox = document.getElementById('quizResultBox');
    const resultTitle = document.getElementById('quizResultTitle');
    const resultDesc = document.getElementById('quizResultDesc');
    const applyBtn = document.getElementById('quizApplyBtn');
    const addCartBtn = document.getElementById('quizAddCartBtn');

    let currentSelectedVariant = 'barista';

    if (trigger) {
      trigger.addEventListener('click', () => {
        modalOverlay.classList.add('is-open');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modalOverlay.classList.remove('is-open'));
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('is-open');
    });

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const matchKey = card.dataset.match;
        currentSelectedVariant = matchKey;

        cards.forEach(c => c.classList.toggle('is-selected', c === card));

        if (variants[matchKey]) {
          const v = variants[matchKey];
          if (resultBox) resultBox.style.display = 'block';
          if (resultTitle) resultTitle.textContent = `${v.name} (${v.tagline})`;
          if (resultDesc) {
            resultDesc.textContent = `Optimized for your routine. Features ${v.radar.creamVal} creaminess, ${v.radar.foamVal} micro-foam stability, and ${v.radar.mctVal} pure MCT fats.`;
          }
        }
      });
    });

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('is-open');
        const pill = document.querySelector(`.variant-pill[data-variant="${currentSelectedVariant}"]`);
        if (pill) pill.click();
        scrollToTarget('#story');
      });
    }

    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('is-open');
        const pill = document.querySelector(`.variant-pill[data-variant="${currentSelectedVariant}"]`);
        if (pill) pill.click();
        addItemToCart();
        openCart();
      });
    }
  }

  function initPromoCodeCopy() {
    const promoBtn = document.getElementById('promoCodeBtn');
    if (!promoBtn) return;

    promoBtn.addEventListener('click', () => {
      const code = 'LUSH15';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
      showToast('✓ Code LUSH15 copied! Extra 15% discount applied');
      // Automatically toggle subscription mode for extra savings
      state.isSubscription = true;
      syncCartState(state.cartCount);
    });
  }

  /* ========================================================================
     BOOTSTRAP
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initMilkWave();
    initHeroEntrance();
    init3DBottleParallax();
    initSceneScroll();
    initProcessSection();
    initUsesHover();
    initUniversalModals();
    initBottleShowcase();
    initRecipeModal();
    initVariantSwitcher();
    initCartDrawer();
    initReviewsFilter();
    initFaqAccordion();
    initAmbientAudio();
    initSmoothNavigation();
    initTasteQuizModal();
    initPromoCodeCopy();
  });

})();
