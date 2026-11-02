from pathlib import Path
import json
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,Image,PageBreak,KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
R=Path(__file__).resolve().parent.parent
OUT=R.parent/'SWA-Focus-Mobile-Design.pdf'
fontdir=Path('/usr/share/fonts/truetype/liberation')
for name,file in [('Sans','LiberationSans-Regular.ttf'),('SansB','LiberationSans-Bold.ttf'),('Serif','LiberationSerif-Regular.ttf'),('SerifI','LiberationSerif-Italic.ttf'),('Mono','LiberationMono-Regular.ttf')]:
 pdfmetrics.registerFont(TTFont(name,str(fontdir/file)))
pdfmetrics.registerFontFamily('Sans',normal='Sans',bold='SansB',italic='Sans',boldItalic='SansB')
INK=colors.HexColor('#2b3b2d'); MUTED=colors.HexColor('#65765a'); GREEN=colors.HexColor('#526f43'); LINE=colors.HexColor('#dfe5d5'); SOFT=colors.HexColor('#e9efdf'); BG=colors.HexColor('#f7f8f1'); PEACH=colors.HexColor('#f4e8da')
styles={
 'eyebrow':ParagraphStyle('eyebrow',fontName='SansB',fontSize=8,leading=13,textColor=MUTED,spaceAfter=14),
 'title':ParagraphStyle('title',fontName='Serif',fontSize=38,leading=42,textColor=INK,spaceAfter=17),
 'h1':ParagraphStyle('h1',fontName='Serif',fontSize=30,leading=35,textColor=INK,spaceAfter=16),
 'h2':ParagraphStyle('h2',fontName='Serif',fontSize=19,leading=24,textColor=INK,spaceBefore=14,spaceAfter=9),
 'body':ParagraphStyle('body',fontName='Sans',fontSize=10,leading=16,textColor=MUTED,spaceAfter=10),
 'small':ParagraphStyle('small',fontName='Sans',fontSize=8.4,leading=13,textColor=MUTED,spaceAfter=7),
 'cell':ParagraphStyle('cell',fontName='Sans',fontSize=8.5,leading=12,textColor=INK),
 'head':ParagraphStyle('head',fontName='SansB',fontSize=8,leading=11,textColor=GREEN),
 'code':ParagraphStyle('code',fontName='Mono',fontSize=8.1,leading=13,textColor=GREEN,spaceAfter=12),
}
W,H=595.28,841.89; CW=W-88
story=[]
def p(text,style='body'):return Paragraph(text,styles[style])
def add(text,style='body'):story.append(p(text,style))
def section(n,tag,title,subtitle):
 if story:story.append(PageBreak())
 add(f'{n:02d} / {tag.upper()}','eyebrow');add(title,'h1');add(subtitle)
def table(headers,rows,widths,fill=SOFT):
 data=[[p(escape(str(c)),'head') for c in headers]]+[[p(escape(str(c)),'cell') for c in row] for row in rows]
 t=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),fill),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),11),('BOTTOMPADDING',(0,0),(-1,-1),11),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,0),(-1,0),.7,LINE),('LINEBELOW',(0,1),(-1,-1),.4,LINE)]));story.append(t);story.append(Spacer(1,13))
def box(text,fill=SOFT):
 t=Table([[p(text,'small')]],colWidths=[CW]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),fill),('BOX',(0,0),(-1,-1),.5,LINE),('LEFTPADDING',(0,0),(-1,-1),15),('RIGHTPADDING',(0,0),(-1,-1),15),('TOPPADDING',(0,0),(-1,-1),14),('BOTTOMPADDING',(0,0),(-1,-1),10)]));story.append(t);story.append(Spacer(1,14))
def screen(name,width=149):return Image(str(R/'docs/screens'/f'{name}.png'),width=width,height=width*900/390)
def screens(names,captions):
 width=150 if len(names)==3 else 187
 rows=[[screen(n,width) for n in names],[p(c,'small') for c in captions]]
 t=Table(rows,colWidths=[CW/len(names)]*len(names));t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('ALIGN',(0,0),(-1,0),'CENTER'),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),13)]));story.append(t)
# cover
add('SWA FOCUS / MOBILE INTEGRATION KIT','eyebrow')
add('Small challenges.<br/>Thirty thoughtful levels.','title')
add('React Native screens. On-device Rust rules.<br/>A calm space to notice, respond and pause.')
story.append(Spacer(1,12))
cover_left=[p('3 games · 10 levels each','h2'),p('Stroop Color Word<br/>Selective attention','body'),p('Schulte Table<br/>Visual scanning','body'),p('Go / No-Go<br/>Response inhibition','body'),p('Actual mobile source, native bridge adapters, reproducible rules and tests. A playable preview uses the same React Native UI and Rust engine.','small')]
t=Table([[cover_left,screen('home',174)]],colWidths=[CW-198,198]);t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),8)]));story.append(t)
story.append(Spacer(1,13))
box('<b>Readiness:</b> production-oriented integration candidate. Shared UI/rules and native C-ABI checks pass; Kotlin/Swift app builds, host linkage and physical-device QA remain open. Build-tool security advisories also require host review.',PEACH)
add('DESIGN + LEVEL RULES + NATIVE INTEGRATION / VERSION 1','eyebrow')
# interaction
section(2,'Mobile interaction','One clear moment.','Quick to understand, touch-first and optional. Every round can be paused, replayed or left without pressure.')
screens(['instructions','stroop','pause'],['<b>Ready.</b> The exact level rule and duration are explained before starting.','<b>Active.</b> Prominent stimuli, large named controls and neutral feedback.','<b>Paused.</b> Active time freezes. The user decides when to resume.'])
add('A consistent session flow','h2')
add('Choose game → choose level → instructions → active → optional pause → completion → replay / next level / exit. Go / No-Go begins with a short, unscored three-letter warm-up on first play.')
box('No daily streaks, locked levels, penalties tied to guilt, global rankings or clinical labels. Motion is subtle: a pop, ±3px shake and 12 particles; reduced motion disables it. Sound/haptics are host opt-ins, off by default.')
add('Accessibility intent: safe areas, scrollable screens, named controls and at least 44px advanced-grid targets at 320px in emulation. VoiceOver/TalkBack, large text and physical-device accessibility still require native testing.','small')
# Stroop
L=json.loads((R/'levels.json').read_text())
section(3,'Game 01','Stroop Color Word','Ignore the word. Identify the ink. Four labelled responses: red, blue, green and yellow. Difficulty increases through interference and response windows, never changes mid-round.')
rows=[[l['number'],l['title'],f"{l['durationMs']//1000}s",f"{l['stimulusMs']/1000:g}s",f"{l['congruentPercent']}%"]for l in L[:10]]
table(['LEVEL','TITLE','ROUND','WINDOW','MATCHING'],rows,[47,206,61,70,CW-384])
add('Resolution and feedback','h2')
add('Word and ink are randomized; matching and conflicting pairs both occur. Each answer or timeout reveals brief feedback, then advances after 240ms. The correct ink is never disclosed in instructions during the active trial.')
box('<b>Score:</b> round(correct × 100 × answered accuracy). Accuracy is correct / answered. Missed trials are separate, not silently included as incorrect. Valid-response averages include correct and incorrect answers; timeouts are excluded.')
add('This task requires distinguishing ink colours. Named buttons do not fully solve colour-vision differences; offer Schulte or Go / No-Go as alternatives. Global catalogue IDs: 1–10.','small')
# Schulte
section(4,'Game 02','Schulte Table','Find the next number shown on a fixed, randomized board. One complete sequence is one round; elapsed time is visible but there is no countdown or failure deadline.')
orders={'ascending':'Ascending','descending':'Descending','oddsFirst':'Odds, then evens','outsideIn':'Outside-in'}
rows=[[l['number'],l['title'],f"{l['gridSize']} × {l['gridSize']}",orders[l['order']]]for l in L[10:20]]
table(['LEVEL','TITLE','GRID','PATH'],rows,[47,221,69,CW-337],PEACH)
add('Paths are explicit, not hidden tests','h2')
add('Ascending: 1, 2, 3… Descending: N, N−1… Odds first: 1, 3, 5… then 2, 4, 6… Outside-in: 1, N, 2, N−1… The next target remains visible. Wrong taps never advance or reshuffle the board; found cells become check marks.')
box('<b>Score:</b> round(10,000 × correct / attempted). Save only after the entire sequence is completed. Compare times within the same level only. The three 5×5 levels can be hidden with allowAdvancedGrid=false.')
add('Larger grids and new paths are deliberate extensions beyond the original ascending 3×3/4×4 MVP. Validate their usability before enabling them in a production rollout. Global IDs: 11–20.','small')
# Go
section(5,'Game 03','Go / No-Go','Respond to X. Let A, B, K and O pass. Shorter displays and higher target frequency practise noticing before responding. The rule and pace stay fixed during a round.')
rows=[[l['number'],l['title'],f"{l['durationMs']//1000}s",f"{l['stimulusMs']/1000:g}s",f"{l['gapMs']/1000:g}s",f"{l['targetPercent']}%"]for l in L[20:]]
table(['LEVEL','TITLE','ROUND','LETTER','GAP','TARGETS'],rows,[42,187,57,66,65,CW-417],colors.HexColor('#e6eff0'))
add('Responding and withholding stay separate','h2')
add('Target + response = hit. Target + no response = miss. Non-target + response = false alarm. Non-target + no response = correct withholding. Each stimulus accepts at most one response. Randomized 20-trial bags match the configured target ratio over a full bag; partial rounds may differ.')
box('<b>Results:</b> hit rate and false-alarm rate are shown independently. Composite score = round((hits + correct withholds) × 100 × overall trial accuracy). Mean response uses successful hits only. The X/A/X warm-up is never stored or ranked.')
add('An unfinished final trial is explicitly finalized at the end of the session. Global IDs: 21–30.','small')
# Architecture
section(6,'Engineering','Native by design.','No WebView and no Rust HTTP service: React Native renders the game; Rust runs locally in the mobile app.')
box('<b>Host app</b> — navigation, account scope, theme, safe areas, secure storage<br/><br/><b>React Native FocusZone</b> — touch UI, accessible controls, native-driven feedback<br/><br/><b>FocusClient</b> — ordered commands, typed errors, protocol/schema validation<br/><br/><b>TurboModule</b> — dispatch(JSON) → Promise&lt;JSON&gt;<br/><br/><b>Android:</b> Kotlin serial executor → UniFFI/JNA<br/><b>iOS:</b> ObjC++ serial queue → Swift → UniFFI/C ABI<br/><br/><b>Rust FocusEngine</b> — mutex-owned session, monotonic timing, rules, RNG, scoring')
add('One catalogue. One source of truth.','h2')
add('levels.json is imported by TypeScript and compiled into Rust. Both artifacts must be rebuilt together; catalogue mismatches are rejected. Session and trial IDs prevent stale/duplicate inputs. New starts discard unfinished rounds; completed result IDs deduplicate save retries.')
add('Pause, backgrounding and performance','h2')
add('Rust Instant is authoritative on device. Pause stops active duration; returning to the app does not auto-resume. Host route blur, RN AppState and native Android/iOS lifecycle hooks interrupt rounds. Returning never auto-resumes. Snapshot polling is single-flight at up to 12.5Hz; visual animation is independent and native-driven.')
box('<b>Timing caveat:</b> UI presentation may lag a native stimulus by roughly one 80ms poll interval plus bridge/render latency. Response averages start at native stimulus generation. They are practice feedback, not calibrated display-onset or clinical measurements.',PEACH)
# QA
section(7,'Validation','Tested source. Explicit gates.','Verified in this environment, with the boundary between code validation and a shipping native app kept clear.')
rows=[['33 Rust tests','Passed','Rules, scoring, sequences, timing and input protections'],['12 TypeScript tests','Passed','Ordering, typed errors, scoped storage and retry'],['Typecheck + Clippy','Passed','Strict TS; Rust warnings treated as errors'],['Rust iOS / Android checks','Passed','Cross-target type checking, not full native builds'],['Native C-ABI calls','Passed','Linux UniFFI; real engine, concurrent polling'],['RN spec generation','Passed','Android Java and iOS ObjC++ interface contracts'],['Shared UI / all 30 levels','Passed','RN Web + Rust WASM, touch emulation'],['Native app integration','Open','Kotlin/Swift compilation, autolinking, release linkage'],['Physical accessibility / FPS','Open','Real device, screen reader, font and latency testing']]
table(['CHECK','STATUS','WHAT IT MEANS'],rows,[160,57,CW-217])
add('Frame scheduling, not a device guarantee','h2')
add('Active RN Web + Rust WASM games measured about 59.7fps over 180 intervals on desktop/mobile emulation, with p95 frame intervals around 16.7–16.8ms. Native device performance is not certified by those numbers.')
box('<b>Security review remains open:</b> npm audit reports high-severity affected package entries in the Metro/micromatch/braces tooling graph. No safe automatic fix was available; the suggested force fix downgraded RN and was not applied. Review/mitigate in host CI; do not expose Metro or feed untrusted patterns. Rust advisory and license scans are still required.',PEACH)
# Integration & privacy
section(8,'Integration','Ready for your host project.','The source package includes native adapters, generated bindings, build scripts, test evidence and detailed integration/release documents. No existing SWA project was supplied or modified.')
add('Android','h2')
add('Install the local/workspace package. Set ANDROID_NDK_HOME, install cargo-ndk, then run scripts/build-android.sh. The script builds ARM64 and x86_64 native libraries with 16KB alignment for Rust. Rebuild the real RN host, verify codegen, R8 and all dependency ABIs/page sizes.')
add('iOS','h2')
add('On macOS/Xcode run scripts/build-ios.sh to generate Swift bindings and a device/simulator XCFramework. Install the local CocoaPods target and rebuild the host. Verify module-map visibility, Swift/ObjC++ headers, ReactCodegen paths, autolinking and release dead stripping.')
add('Mount through the app’s existing services','h2')
add('Use one FocusClient per native engine. Inject a repository keyed to the real account/profile, reuse the app’s SafeAreaProvider and call onExit through existing navigation. Remount on account change. Reuse secure/SQLite/AsyncStorage services according to the host’s established architecture; no new database is imposed.')
box('<b>Privacy:</b> up to 300 completed, non-practice results per scope. IDs, level/version, wall-clock start/end metadata, active duration and task metrics only; no raw stimulus sequences. Writes are ordered and idempotent; corruption is reported instead of overwritten. A storage namespace is not authentication or encryption.')
add('Before shipping','h2')
add('Finish native builds, physical-device timing and accessibility QA, dependency/security review, account-switch/privacy tests, advanced-grid usability and the supplied release checklist. Keep Focus optional and separate from morning/evening reflection.')
add('These tasks do not measure self-awareness, diagnose mental-health conditions or prove improvements in everyday concentration. The appropriate promise is a short, meaningful practice moment.','small')

def paint(c,doc):
 c.setFillColor(BG);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setStrokeColor(LINE);c.line(44,44,W-44,44)
 c.setFont('Sans',7);c.setFillColor(MUTED);c.drawString(44,29,'SWA FOCUS / REACT NATIVE + ON-DEVICE RUST')
 c.drawRightString(W-44,29,f'{doc.page:02d}')
 if doc.page>1:
  c.setFont('SansB',7);c.drawString(44,H-30,'30 LEVELS · PERSONAL PRACTICE · NO PRESSURE')

doc=SimpleDocTemplate(str(OUT),pagesize=(W,H),rightMargin=44,leftMargin=44,topMargin=60,bottomMargin=62,title='SWA Focus — 30-Level Mobile Design & Integration',author='SWA Focus',pageCompression=1)
doc.build(story,onFirstPage=paint,onLaterPages=paint)
print(OUT)
