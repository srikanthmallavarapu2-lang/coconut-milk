# Cocolush — Pure Coconut Milk, Made Lovely 🥥✨

A high-end, responsive, animation-driven website replicated and enhanced from [Cocuket](https://cocuket.inishchithava.workers.dev/), elevated with a new luxury brand identity (**Cocolush**) and a suite of interactive premium features.

---

## 🌟 Key Enhancements & Replicated Highlights

### 1. Brand Transformation: **Cocolush**
- **New Name & Visual Identity**: Replaced *Cocuket* with **Cocolush** — evoking silky, indulgent, organic luxury.
- **Custom Brand Assets**:
  - Handcrafted modern vector wordmark and droplet emblem in `assets/logo.svg` and `assets/logo.png`.
  - Seamlessly re-branded bottle label (`assets/bottle.png`) with clean typography and custom iconography.
  - Large artistic brand watermark in the footer: `cocolush`.

### 2. Fluid Physics & Harmonic Waves
- **Real-Time SVG Harmonic Waves**: Dynamic multi-layer sine waves at the crest of the story panel that fluctuate in real time with continuous physics (`requestAnimationFrame`) and react to user scroll depth.
- **Hero Collision Animation**: Left and right coconut halves fly into the screen from opposite sides, collide playfully at the center, and settle to their hero coordinates.
- **Scroll-Driven Choreography**: The bottle glides with 3D rotation, scaling, and trajectory shifts from the hero center into the spotlight callout panel.

### 3. Interactive 4-Step Process Demonstration ("Palm to Pour")
- **Animated SVG Farmer Experience**:
  - **01 Picked**: Palm tree frond sway, coconut harvesting, nut dropping into the hand-woven basket.
  - **02 Cracked**: Cleaver impact on the chopping block, halves splitting with milk splashes and shockwave stars.
  - **03 Pressed**: Hydraulic cold-press frame, lever pull, and fresh milk dripping into the collector jug.
  - **04 Poured**: Silky milk pouring from the jug into the custom bottle with rising level and sparkling stars.
- **Scrubbing & Jump Controls**: Clickable step dots and progress fill bar allowing instant jumping to any stage.

### 4. Interactive Culinary Pairings & Recipes ("Ways to Enjoy")
- **Cursor-Tracking Float Preview**: Hovering over pairings (Coffee & lattes, Smoothies & shakes, Oats & cereal, Desserts & baking) summons an inertia-driven floating preview that rotates and springs to the cursor.
- **Artisanal Recipe Card Modal**: Clicking any pairing row opens a comprehensive barista/chef recipe card featuring prep times, difficulty ratings, ingredients checklists, and step-by-step master methods.

### 5. Interactive Flavor & Variant Profiler
- Real-time dock allowing customers to explore 4 signature editions:
  1. **Pure Original** (Everyday creamy sweetness)
  2. **Barista Reserve** (Engineered micro-foam stability for specialty latte art)
  3. **Madagascar Vanilla** (Organic Bourbon bean infusion)
  4. **Raw Keto Pure** (0g Sugar, 22g dense MCT energy)
- Live halo glow shift around the bottle and toast feedback.

### 6. Purity Lab & Clean Benchmark Matrix
- Comparative purity table comparing Cocolush against conventional coconut, almond, and dairy milks.
- Verification badges for 100% Organic, Zero Chemical Preservatives, Zero Industrial Gums (no guar, xanthan, or carrageenan), and Single-Estate traceability.

### 7. Slide-Over Chilled Bag & Bundle Selector
- Sliding cart drawer with free delivery meter, pack size selectors (Single 500ml, 6-Pack Taster, 12-Pack Pantry Stock), quantity controls, live subtotal updates, and an order confirmation flow.

### 8. Ambient Nature Soundscape
- Web Audio API synthesizer that generates a calming, gentle coastal palm breeze and ocean splash soundscape on demand (muted by default with an interactive header toggle).

---

## 🚀 How to Run & Preview

Open `index.html` in any modern web browser or spin up a local server:

```bash
# Using Node / npx:
npx serve -l 3000 .

# Using Python:
python -m http.server 3000
```

Then visit: `http://localhost:3000`
