"""Screenshots of the redesigned app in several states.
Usage: python shoot2.py <out_dir> <base_url> <shot> [<shot> ...]
A shot is name:key=value,key=value with keys:
  w, h      viewport (default 390 x 844); w >= 700 is a desktop (no touch)
  lang      ar | fr | en        theme   light | dark
  hash      the part after #    clip    1 = first screen only
  seed      1 = a visitor who passed 3 lessons and made a trade
"""
import json
import sys

from playwright.sync_api import sync_playwright

out, base, shots = sys.argv[1], sys.argv[2], sys.argv[3:]

FINISH = """async () => {
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 1900));
  document.getAnimations().forEach(a => { try { a.finish() } catch (e) { a.cancel() } });
  await new Promise(r => setTimeout(r, 250));
}"""

with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    for shot in shots:
        name, _, rest = shot.partition(":")
        o = dict(kv.split("=", 1) for kv in rest.split(",") if kv)
        w, h = int(o.get("w", 390)), int(o.get("h", 844))
        phone = w < 700
        ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=2 if phone else 1, is_mobile=phone, has_touch=phone)
        store = {"qirat.own": "1", "qirat.lang": o.get("lang", "ar")}
        if o.get("theme"):
            store["qirat.theme"] = o["theme"]
        ctx.add_init_script("const s=%s; for (const k in s) localStorage.setItem(k, s[k]);" % json.dumps(store))
        pg = ctx.new_page()
        errors = []
        pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.goto(base + ("#" + o["hash"] if o.get("hash") else ""), wait_until="networkidle")
        pg.evaluate(FINISH)
        clip = o.get("clip") == "1"
        if not clip:  # fixed bars would land mid-page in a full-page capture
            pg.add_style_tag(content="nav.fixed{display:none!important}")
        pg.screenshot(path=f"{out}/{name}.png", full_page=not clip)
        over = pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        print(name, pg.evaluate("document.documentElement.scrollHeight"), "px tall; sideways overflow", over, "px; errors:", errors[:3])
        ctx.close()
    b.close()
