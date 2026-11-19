# Bua's portfolio site

Recruiter-facing portfolio for Bua Gomutputra (USC Iovine and Young Academy, Design, Technology & Entrepreneurship of Innovation). Bua leads creative direction in Figma; Claude builds and maintains the site.

- Live: https://buagomutputra1.github.io/bua-gomutputra/ (GitHub Pages from `main`, live ~1 min after push)
- Static HTML/CSS/JS, no build step: `index.html`, `about.html`, `sideby.html`, `duolingo-poker.html`, `ecopinet.html`, `buzztile.html`, `css/style.css`, `js/main.js`, images in `images/<project>/`.

## Every change
1. After editing CSS/JS, bump the `?v=<number>` on `css/style.css` and `js/main.js` in **every** HTML file (cache-busting), e.g. `V=$(date +%s); sed -i -E "s/style\.css\?v=[0-9]+/style.css?v=$V/; s/main\.js\?v=[0-9]+/main.js?v=$V/" *.html`
2. Check at 1440px **and on a phone (390px)**: no sideways scroll, nothing cut off, no console errors. Long photo rows become swipeable strips on phones.
3. Commit as Bua and push to `main`:
   `git -c user.name="Bua Gomutputra" -c user.email="BuaGomutputra1@users.noreply.github.com" commit -m "..."`
4. Mirror the change in Figma when possible and relevant (two-way sync), then tell Bua in a few lines what changed.

## Figma
- File key `N3jOTicxxLQXOPNjNI3eDV`, **Branding page** is the source of truth:
  Landing page mock up `203:451` · About Me `207:733` · SideBy — Desktop `247:36` · Duolingo Poker — Desktop `260:55` · EcoPinet — Desktop `279:51` · BuzzTile — Desktop `330:17`
- "Sync" / "sync figma" = update the site to match her mock-ups exactly (sizes from the 1440 frame written as `min(Xvw, Npx)`).
- Only edit her mock-up frames to mirror changes she asked for. Photos in Figma are "Drop image: <file>" boxes when uploading isn't possible.

## How Bua likes to work
- Keep her voice in all copy. Give honest, constructive feedback; push her to go further. Mark important questions with ★.
- Short, plain replies. She often sends voice-to-text: read for intent, and ask if something is truly unclear.
- Dislikes: AI-generated / flat looks, repeating SideBy patterns on other pages, Kiwi Maru font, cheap zoom effects, brown, pill-shaped ✓/✕ chips, rows with too many photos of people.
- Magnifier lens is SideBy only.

## Design system
- Fonts: Geist (headings, body); Goudy Bookletter 1911 for labels/accent (`--mono`, `--kiwi` both map to it, `font-size-adjust:.5`). Quotes in Geist Medium.
- Cursor: petal shape, #141414, turquoise #00A8CE on links, subtle light-cyan trail; "View X" pill on project tiles.
- Home: typewriter "is a designer who …", swirl parallax, 6 floating light-cyan flowers that scatter from the mouse, bouncy wobbly tiles. Top row: SideBy, DuoPoker (`cover-tile.jpg`), EcoPinet; BuzzTile under SideBy. Other tiles empty, waiting for photos.
- Case studies (`body.cs2` + theme class): sticky TOC on the left, back button, numbered sections ("02 · THE PROBLEM"), "Thanks for reading :)" + "More work" with 2 cards.
- Spacing: 96px between sections, 32px between blocks, label→H2 10px, H2→content 20px, sub-labels 48px above / 16px below, "Thanks for reading"→"More work" 36px.
- Themes: SideBy purples/deep blues · DuoPoker Duolingo greens (playable phone lesson, Tony stats) · EcoPinet greens + yellow (impact, validation timeline, problem panels, paper stack, products, app, community, press/video) · BuzzTile honey yellow + charcoal, green ✓ for what worked (piezo demo, energy matrix, auto-playing ideation rounds, playable honeycomb simulation, sketch→screen app viewer, animated architecture, EPQ video).

## Media
- HEIC photos: ImageMagick/ffmpeg can't open them directly here; parse the HEIF container, decode the HEVC tiles with ffmpeg, stitch the grid (or ask for JPG).
- Images: JPEG ~82 quality, max ~1800px. Videos: H.264 MP4 (`-preset veryfast -crf 27 -movflags +faststart`), `preload="none"` + poster.

## Open questions ★
- BuzzTile: "Hosted at www.rtx.com" in her diagram. rtx.com is a real company (RTX). Real host, or "Hosted online"?
- BuzzTile: real quotes from testing would strengthen section 08. Full 3:46 video, or a trimmed clip?
- Bangkok Post wording; full links for Forbes Thailand, Science Matters, pitch deck and concept.
- Section heading size: 28px in Figma vs 38px on the site.
- DuoPoker outcome heading; review Claude-written copy (Tony's lines, quiz, takeaways).
- FigJam board needs a higher-res export or link. Mobile Figma frames outdated; no BuzzTile mobile frame.

## Still to do
- Resume PDF (`resume.pdf`); real LinkedIn / Email / Instagram links (placeholders now).
- Photos for home tiles and the About page.
- New pages: Jim Thompson, PTT EV Station (later Ripple Analytics, Fruit AI).
- Bua in Figma: delete 2 extra header flowers (site uses 6); switch Home/About mock-ups from Geist Mono to Goudy.
