# EcoPinet Impact Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the blocky 02 · Impact cards on `ecopinet.html` with a calm, photo-led layout where real photos/logos carry the emphasis.

**Architecture:** Static HTML/CSS, no build. Rewrite the `#impact` section markup, replace the `.impact-wrap/.awards/.aw*/.numbers` rules in `css/style.css` with new `.imp-*` rules, reuse the existing `data-count` count-up in `js/main.js`.

**Tech Stack:** HTML, CSS, vanilla JS; ImageMagick (`magick`) for image prep; Playwright (python) for checks.

**Spec:** `docs/superpowers/specs/2026-11-18-ecopinet-impact-design.md`

## Global Constraints
- Images: JPEG ~82 quality, max ~1800px; logo PNG kept transparent/white.
- Bump `?v=` on `css/style.css` and `js/main.js` in every HTML file after CSS/JS edits.
- No pill-shaped chips, no emoji tags, no cheap zoom effects; hover = gentle lift on photos only.
- Fonts: Geist for text, Goudy Bookletter 1911 (`--mono`) for labels.
- Commit as Bua (`git -c user.name="Bua Gomutputra" -c user.email="BuaGomutputra1@users.noreply.github.com"`), push to `main`.

## Review Focus
- Phone (390px): no horizontal scroll; photo stacks above its text; numbers become 2×2.
- Laptop (~1190px): hero photo and headline don't collide; "1st place" doesn't wrap mid-word.
- Count-up still runs on the four numbers (`data-count` kept) and shows final values with reduced motion.
- Diamond logo (white background) sits cleanly on the section background (no visible white box).
- Validation (03) still renders its own photos unchanged.

---

### Task 1: Prepare images

**Files:**
- Create: `images/ecopinet/impact-aihm.jpg` (from chat image 1, 2000×1333 → 1800 wide, q82)
- Create: `images/ecopinet/impact-agrithon.jpg` (from chat image 3, 1500×2000 → keep, q82)
- Create: `images/ecopinet/logo-diamond.png` (from chat image 2, trimmed, max 600 wide)

- [ ] **Step 1:** Convert with `magick` as above; trim logo whitespace (`-trim +repage`).
- [ ] **Step 2:** Verify: `sips -g pixelWidth -g pixelHeight` on each; sizes ≤1800 and files < 500 KB.

### Task 2: Rebuild the Impact section

**Files:**
- Modify: `ecopinet.html` (`<section id="impact">`)
- Modify: `css/style.css` (replace lines for `.impact-wrap`, `.impact-sub`, `.awards`, `.aw*`, `.numbers*`, and their phone rules at ~801)

**Markup (classes the CSS relies on):** `.imp-hero` (figure `img` + `.imp-hero-text` with `.imp-big` "1st place", `h3`, `p`), `.imp-rows` > `.imp-row` ×2 (thumb `img` + `div` with `b` title + `p`), `.imp-nums` > 4 × `div` with `b > i[data-count]` + `span`.

**Copy (exact):**
- Hero: "1st place" / "AIHM Business Plan Competition 2025" / "Out of 35 teams across Asia, judged by hospitality executives."
- Row 1: "Top 20 · Diamond Challenge 2025" / "Social innovation track. 400+ teams from 56 countries."
- Row 2: "On national TV · Agrithon" / "The first youth-led team on the show, broadcast on GMM25 and Channel 3."
- Numbers: 300+ "people at our FarmExpo keynote", 45+ "farmers and students taught, across 3 provinces", 260 kg "of pineapple waste turned into paper", 2 "Bangkok hotels pitched with real products".

- [ ] **Step 1:** Write the check `$TMPDIR/impact_check.py` (Playwright): at 1440, 1190, 390 assert `scrollWidth <= innerWidth`, no console errors, `#impact img` all loaded (`naturalWidth>0`), `.imp-nums b` text ends with final values after scroll, no `.aw` elements remain.
- [ ] **Step 2:** Run it; expect FAIL (`.aw` still present, new images not referenced).
- [ ] **Step 3:** Replace markup and CSS. Hero grid `1.4fr 1fr`, photo radius 10px; rows separated by 1px rules `rgba(20,20,20,.1)`, thumbs 168×112 (logo `object-fit:contain`); numbers in one row with thin left borders, number color `var(--deep)`, label `#5e5e5e`. Section background plain. Phone: single column, nums 2×2.
- [ ] **Step 4:** Bump `?v=` in all HTML files; run the check; expect PASS. Screenshot 1440 and 390 and look.
- [ ] **Step 5:** Commit and push.

### Task 3: Mirror to Figma

- [ ] **Step 1:** In `EcoPinet — Desktop` (279:51), replace the `02 · IMPACT` frame contents with the same structure (Drop image boxes for `impact-aihm.jpg`, `logo-diamond.png`, `impact-agrithon.jpg`), re-stack sections below if height changed. Screenshot the frame.
