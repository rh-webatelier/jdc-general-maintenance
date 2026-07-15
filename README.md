# JDC General Maintenance — Landing Page

Clean, mobile-first, conversion-focused landing page for **JDC General Maintenance** (John Chadwick) —
handyman & plumbing across **Leeds & West Yorkshire**.

Built with the **real** business data, services, reviews, photos and branding recovered from the
MyBuilder profile (via the Internet Archive, since MyBuilder blocks direct scraping).

## Files
- `index.html` — page structure & content
- `style.css` — styling; brand colours live in `:root` (blue + teal, matching the JDC logo)
- `script.js` — mobile nav, scroll reveal, photo lightbox, form validation
- `assets/images/` — real optimised photos (web-ready)
- `assets/images/originals/` — full-resolution originals (19 photos), kept for future use

## Real data baked in
- **Owner:** John Chadwick
- **Phone:** 07733 776760  ·  **Email:** jdcgeneralmaintenance@gmail.com
- **Services** (from JDC's own flyer): Domestic Plumbing · Garden Landscaping · Jet Washing ·
  Garden Maintenance · TV/Picture/Mirror Hanging · Flat-Pack Assembly · Laminate Flooring · Repairs & Improvements
- **Reviews:** Tomasz (MyBuilder, 10/10) + Megan-Leigh Duckworth (Facebook) — both genuine
- **Photos:** 12 real jobs wired into the portfolio (plumbing, landscaping, jet-wash before/afters, etc.)

## Run it
```bash
cd jdc-general-maintenance
python3 -m http.server 8000   # then visit http://localhost:8000
```
Or just open `index.html`.

## Remaining to-dos before launch (search files for `TODO`)
1. ~~Facebook page URL~~ — done, links to `facebook.com/jdc.general.maintenance`.
2. ~~Contact form~~ — done for now: valid submissions open a pre-filled `mailto:` to `jdcgeneralmaintenance@gmail.com` (see `script.js`, no backend/account needed). Upgrade path if you want submissions to land without the visitor's mail app opening:
   - **Formspree:** `<form action="https://formspree.io/f/XXXX" method="POST">` and remove the `mailto:` handoff in `script.js`
   - **Netlify Forms:** add `netlify` to the `<form>` tag and remove the `mailto:` handoff
3. **Optional map** — one remaining placeholder in the *Areas* section; drop in a Google Map iframe if wanted.
4. ~~Confirm areas~~ — done: site now shows **Leeds & West Yorkshire only**. Google search turned up other
   similarly-named "JDC" businesses (a Liverpool-area "JDC Construction & Maintenance Ltd" with a different
   phone number, and a "JDC Painting and Decorating") — none of them match the MyBuilder profile we built this
   from. All content here is specifically John Chadwick's (Leeds), so the Liverpool framing from the original
   brief was dropped as inaccurate for this business.
5. **Higher-res hero (optional)** — hero/about photos are the profile's originals; swap for pro shots any time.

## Notes / honesty
- Trust badges reflect the **true** current standing (10/10 rating, ID-verified, recommended) — no inflated
  "500+ jobs / 10 years" claims, since JDC is a newer, growing business (joined MyBuilder Jan 2025).
- There are multiple unrelated "JDC ..." businesses in the UK (see #4 above) — double-check phone/email match
  John Chadwick's before sending anything, since names alone aren't a reliable match.

## Rebranding
All colours derive from two tokens in `style.css` `:root`: `--navy` (brand blue) and `--amber` (brand teal).
Change those two and the whole site re-themes.
