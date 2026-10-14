"""Rebuild the read-only mascot inventory from the mobile app's actual artwork.
Run from any directory: python3 scripts/build_mascot_preview.py
No dependencies; does not modify mobile sources.
"""
from pathlib import Path
import html
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
MOBILE = ROOT / 'apps/mobile'
source = (MOBILE / 'src/screens/home/BlossomMascot.tsx').read_text()
looks = {}
for mood, block in re.findall(r'  (sad|sprout|steady|blooming): \{(.*?)\n  \}', source, re.S):
    looks[mood] = dict(re.findall(r"(\w+): '(.*?)'", block))
paths_block = source.split('const PATHS = {', 1)[1].split('\n};', 1)[0]
paths = dict(re.findall(r"(\w+):\s*'([^']+)'", paths_block))
assert len(looks) == 4 and len(paths) == 12, 'Mascot source changed; update the preview extractor.'

def svg(body, label, viewbox='14 8 92 104'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-label="{html.escape(label)}">{body}</svg>'

def mobile_svg(mood):
    body = ''
    for part, color in looks[mood].items():
        key = part + ('Sad' if mood == 'sad' else 'Happy') if part in ('cheeks', 'face') else part
        body += f'<path d="{paths[key]}" fill="{color}"/>'
    return svg(body, 'Blossom — ' + mood)

def widget_svg(mood):
    path = MOBILE / f'plugins/streak-widget/android/app/src/main/res/drawable/widget_blossom_{mood}.xml'
    tree = ET.parse(path).getroot()
    ns = '{http://schemas.android.com/apk/res/android}'
    body = ''.join(f'<path d="{p.attrib[ns + "pathData"]}" fill="{p.attrib[ns + "fillColor"]}"/>' for p in tree)
    return svg(body, 'Android widget Blossom — ' + mood, '0 0 120 120')

moods = [
    ('sad', 'A quiet pause', 'Resting', 'No recent activity', 'No activity date, or last activity was neither today nor yesterday (UTC).'),
    ('sprout', 'A new sprout', 'Beginning', 'Maintained · under 3 days', 'The streak is maintained and its count is below 3 days.'),
    ('steady', 'Growing steady', 'Growing', 'Maintained · 3–6 days', 'The streak is maintained and its count is between 3 and 6 days.'),
    ('blooming', 'In full bloom', 'Blooming', 'Maintained · 7+ days', 'The streak is maintained and its count is at least 7 days.'),
]

def card(art, title, tag, caption, source_path, number, extra='', animated=False):
    return f'''<article class="card"><div class="art {'floating' if animated else ''}">{art}<span class="art-number">{number}</span></div>
    <div class="card-body"><span class="tag">{tag}</span><h3>{title}</h3><p>{caption}</p>{extra}<details><summary>Source file</summary><code>{source_path}</code></details></div></article>'''

mobile_cards = ''.join(card(mobile_svg(m), title, tag, condition, 'apps/mobile/src/screens/home/BlossomMascot.tsx', f'0{i}', f'<p class="detail">{desc}</p>', True) for i, (m, title, tag, condition, desc) in enumerate(moods, 1))
widget_cards = ''.join(card(widget_svg(m), title, 'Widget · active', condition, f'apps/mobile/plugins/streak-widget/android/app/src/main/res/drawable/widget_blossom_{m}.xml', f'W{i}') for i, (m, title, tag, condition, desc) in enumerate(moods, 1))
widget_cards += card(widget_svg('happy'), 'Default happy', 'Layout default', 'Initial drawable in the widget layout. The widget provider replaces it with the current streak state.', 'apps/mobile/plugins/streak-widget/android/app/src/main/res/drawable/widget_blossom_happy.xml', 'W5')

def image(path, label):
    return f'<img src="apps/mobile/assets/{path}" alt="{label}" loading="lazy">'

icons = ''.join(card(image(f'{name}.png', f'{title} app icon'), title, 'Dynamic app icon', description, f'apps/mobile/assets/{name}.png', f'I{i}') for i, (name, title, description) in enumerate([
    ('morning', 'Morning', 'Maintained rhythm, before 17:00 local time. Also configured as the splash image.'),
    ('evening', 'Evening', 'Maintained rhythm, from 17:00 until midnight local time.'),
    ('irregular', 'Irregular', 'A rhythm that is not maintained, regardless of time of day.'),
], 1))
icons += card(image('icon.png', 'Default app icon'), 'Default icon', 'App configuration', 'Default app icon. The adaptive icon, favicon and legacy splash PNG currently have the same file contents.', 'apps/mobile/assets/icon.png · adaptive-icon.png · favicon.png · splash.png', 'I4')
legacy = card(image('images/blossom-home.png', 'Older illustrated Blossom artwork'), 'Blossom illustration', 'Asset only · not referenced', 'Present in the repository, but no current mobile code reference was found. Included for context, not as an active state.', 'apps/mobile/assets/images/blossom-home.png', 'A1')

# Translate the actual PetalMark SVG markup, not a newly drawn approximation.
petal_source = (MOBILE / 'src/design-system/PetalMark.tsx').read_text()
petal = re.search(r'<Svg viewBox="0 0 34 34"[^>]*>(.*?)</Svg>', petal_source, re.S).group(1)
for old, new in [('Defs', 'defs'), ('LinearGradient', 'linearGradient'), ('Stop', 'stop'), ('Rect', 'rect'), ('stopColor', 'stop-color')]:
    petal = petal.replace(old, new)
petal_card = card(svg(petal, 'Two-petal brand mark', '0 0 34 34'), 'Petal mark', 'Brand mark · not a mascot', 'Used in onboarding, the journal and the app lock screen.', 'apps/mobile/src/design-system/PetalMark.tsx', 'B1')
face_source = (MOBILE / 'src/design-system/MoodFacePicker.tsx').read_text()
faces = re.findall(r"bg: '([^']+)', stroke: '([^']+)', mouth: '([^']+)'", face_source)
face_art = '<div class="faces">' + ''.join('<div>' + svg(f'<circle cx="19" cy="19" r="17" fill="{bg}"/><path d="{mouth}" stroke="{stroke}" stroke-width="2" fill="none" stroke-linecap="round"/>', label, '0 0 38 38') + f'<span>{label}</span></div>' for (bg, stroke, mouth), label in zip(faces, ['Very low', 'Low', 'Neutral', 'Good', 'Very good'])) + '</div>'
face_card = card(face_art, 'Mood faces', 'UI symbols · not mascots', 'Five options in MoodFacePicker. These are separate from Blossom’s streak states.', 'apps/mobile/src/design-system/MoodFacePicker.tsx', 'B2')

page = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Swa · Blossom mascot inventory</title>
<style>
:root{color-scheme:light;--paper:#faf8f2;--ink:#303e33;--muted:#687065;--line:#e2e5d9;--green:#4d6345}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:28px}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6}button,a,summary{-webkit-tap-highlight-color:transparent}a{color:inherit}header{border-bottom:1px solid var(--line);padding:21px max(5vw,24px);display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{font-family:Georgia,serif;font-size:30px;font-weight:bold;letter-spacing:-2px;text-decoration:none}.brand span{display:inline-block;width:9px;height:9px;background:#87a778;border-radius:50%;margin-left:4px}.header-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}main{max-width:1440px;margin:auto;padding:52px max(5vw,24px) 36px}.intro{display:flex;justify-content:space-between;align-items:end;gap:28px;margin-bottom:32px}.eyebrow{font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;color:var(--green);margin:0 0 14px}h1{font:normal clamp(38px,5vw,62px)/1.12 Georgia,serif;letter-spacing:-2px;margin:0 0 18px}h1 em{color:#6c8661;font-weight:normal}.lead{font-size:15px;color:var(--muted);max-width:650px;margin:0;line-height:1.8}.inventory{border-left:1px solid #ced5c5;padding-left:26px;min-width:155px}.inventory strong{font:38px Georgia,serif;display:block}.inventory span{font-size:12px;color:var(--muted)}nav{display:flex;gap:10px;flex-wrap:wrap;padding:10px 0 30px}nav a{border:1px solid var(--line);border-radius:30px;padding:8px 16px;text-decoration:none;font-size:12px;background:#fffdfa}nav a:hover{background:#eaf0e4;border-color:#abbca0}nav a:first-child{background:var(--green);border-color:var(--green);color:white}section{margin-bottom:48px}.section-heading{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px}.section-heading h2{font:normal 27px Georgia,serif;margin:0}.section-heading h2 small{font:11px Arial,sans-serif;letter-spacing:1px;color:#7e8978;margin-right:12px}.section-heading p{color:var(--muted);margin:6px 0 0;font-size:13px}button{border:1px solid #cdd7c5;border-radius:25px;background:transparent;color:var(--green);padding:10px 15px;cursor:pointer;white-space:nowrap;font:12px Arial,sans-serif}button:hover{background:#eaf0e4}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.card{background:#fffefa;border:1px solid var(--line);border-radius:18px;overflow:hidden;min-width:0}.art{height:236px;position:relative;background:#f0f2e9;display:flex;align-items:center;justify-content:center;border-bottom:1px solid var(--line);padding:30px}.art>svg{width:166px;height:185px;overflow:visible}.art-number{position:absolute;top:16px;left:18px;font:11px monospace;color:#76826c}.card:first-child .art{background:#eeede7}.card-body{padding:21px}.tag{display:inline-block;text-transform:uppercase;font-size:9px;font-weight:bold;letter-spacing:1.1px;color:#607653;background:#eef2e8;border-radius:5px;padding:4px 7px}h3{font:normal 23px Georgia,serif;margin:10px 0 7px}.card p{color:#5e695c;font-size:12px;line-height:1.7;margin:0}.card .detail{font-size:11px;margin-top:9px;color:#788071}details{border-top:1px solid #edf0e6;margin-top:17px;padding-top:10px;font-size:11px;color:#697660}summary{cursor:pointer}code{display:block;font-size:10px;overflow-wrap:anywhere;line-height:1.8;margin-top:8px;color:#6b7366}.note{margin-top:18px;padding:16px 20px;border-left:3px solid #a1b594;background:#eff2e9;font-size:12px;color:#58644f;border-radius:0 10px 10px 0}.note strong{color:#43553b}#widgets .art{height:200px}#widgets .art>svg{height:165px;width:165px}#widgets .grid{grid-template-columns:repeat(5,minmax(0,1fr))}#widgets h3{font-size:20px}#widgets .card-body{padding:17px}.art img{max-width:100%;max-height:100%;object-fit:contain;border-radius:14px}#archive .grid{grid-template-columns:1fr 1fr 2fr}#archive .card:first-child .art{padding:0}#archive .card:first-child .art img{width:100%;height:100%;object-fit:contain;border-radius:0}#archive .card:nth-child(2) .art>svg{width:90px;height:90px;opacity:.9}.faces{display:flex;align-items:center;gap:10px;width:100%}.faces>div{flex:1;text-align:center;min-width:0}.faces svg{width:100%;max-width:62px}.faces span{display:block;font-size:9px;color:#6b7465;margin-top:6px}footer{border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:16px;color:#7b8275;font-size:11px}.floating>svg{animation:float 5.2s ease-in-out infinite}body.paused .floating>svg{animation:none}@keyframes float{0%,100%{transform:translateY(3px)}50%{transform:translateY(-3px)}}:focus-visible{outline:3px solid #788f64;outline-offset:4px}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.floating>svg{animation:none}}@media(max-width:1100px){#widgets .grid{grid-template-columns:repeat(3,minmax(0,1fr))}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}#archive .grid{grid-template-columns:repeat(2,minmax(0,1fr))}#archive .card:last-child{grid-column:1/-1}}@media(max-width:620px){main{padding-top:30px}.intro{display:block}.inventory{display:none}.header-label{font-size:9px;letter-spacing:1px}.section-heading{align-items:start}.section-heading h2{font-size:23px}.grid,#widgets .grid,#archive .grid{grid-template-columns:1fr}.art{height:250px}#widgets .art{height:230px}#archive .card:last-child{grid-column:auto}footer{display:block}.faces{gap:6px}nav{gap:7px}nav a{padding:7px 12px}}
</style></head><body>
<header><a class="brand" href="#">swa<span></span></a><div class="header-label">Mobile app / artwork inventory</div></header>
<main><div class="intro"><div><p class="eyebrow">Meet your little companion</p><h1>One Blossom.<br><em>Every little state.</em></h1><p class="lead">A visual inventory of the mascots in the current mobile app. Existing paths, existing colors, no redesigns — a place to review them together before deciding what comes next.</p></div><div class="inventory"><strong>01 / 04</strong><span>One mascot, four moods</span></div></div>
<nav aria-label="Inventory sections"><a href="#mobile">Mobile mascot</a><a href="#widgets">Android widget</a><a href="#icons">App icons</a><a href="#archive">Other artwork</a></nav>
<section id="mobile"><div class="section-heading"><div><h2><small>01</small>Blossom in the app</h2><p>The four states rendered on the Home screen.</p></div><button id="motion" type="button" aria-pressed="false">Pause motion</button></div><div class="grid">{{MOBILE}}</div><div class="note"><strong>Same character, a changing rhythm.</strong> Sprout, steady and blooming share the same silhouette and happy face; their greens change. Quiet pause uses a muted palette and a sad face. The app gently floats the whole illustration ±3 px over 5.2 seconds; this preview mirrors that motion and respects reduced-motion preferences.<br>State selection uses the effective streak. Home also treats a completed flow with its next day locked as activity today.</div></section>
<section id="widgets"><div class="section-heading"><div><h2><small>02</small>Blossom on the home-screen widget</h2><p>Actual Android vector drawables, including the initial layout artwork.</p></div></div><div class="grid">{{WIDGETS}}</div><div class="note"><strong>A small implementation difference:</strong> the widget’s active sprout uses different greens from the in-app sprout; the other three active states match. These are shown as stored, not normalized. The Android source and plugin copies of these drawables match. The widget artwork is static.</div></section>
<section id="icons"><div class="section-heading"><div><h2><small>03</small>App icons & rhythm marks</h2><p>Related mobile artwork — not additional Blossom characters.</p></div></div><div class="grid">{{ICONS}}</div></section>
<section id="archive"><div class="section-heading"><div><h2><small>04</small>Other artwork in the repository</h2><p>The older illustration, plus the active brand mark and mood symbols.</p></div></div><div class="grid">{{LEGACY}}{{PETAL}}{{FACES}}</div></section>
<footer><span>Swa · Current mobile artwork review</span><span>Read-only inventory. No mobile app behavior or artwork changed.</span></footer></main>
<script>
const button = document.getElementById('motion');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = false;
function updateMotion(){const stopped=paused||reducedMotion.matches;document.body.classList.toggle('paused',stopped);button.setAttribute('aria-pressed',String(stopped));button.disabled=reducedMotion.matches;button.textContent=reducedMotion.matches?'Reduced motion on':paused?'Play motion':'Pause motion';}
button.addEventListener('click',()=>{paused=!paused;updateMotion();});reducedMotion.addEventListener('change',updateMotion);updateMotion();
</script></body></html>'''
for key, value in {'MOBILE': mobile_cards, 'WIDGETS': widget_cards, 'ICONS': icons, 'LEGACY': legacy, 'PETAL': petal_card, 'FACES': face_card}.items():
    page = page.replace('{{' + key + '}}', value)
(ROOT / 'mascot-preview.html').write_text(page)
print('Built mascot-preview.html: 4 mobile states, 5 widget drawables, 4 icon cards, 3 related artwork cards.')
