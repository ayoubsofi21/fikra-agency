const { chromium } = require('playwright')

const BASE = 'http://localhost:3000'

const ROUTES = [
  '/', '/services', '/solutions', '/portfolio', '/about', '/team',
  '/pricing', '/blog', '/contact', '/faq', '/privacy', '/terms',
  '/blog/building-scalable-saas', '/services/custom-web-development',
  '/portfolio/fintech-dashboard', '/solutions/invoice-management',
  '/nonexistent-page',
]

const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'wide-1920', width: 1920, height: 1080 },
]

// --- a11y checks run in-page (no axe dependency available offline) ---
const A11Y_FN = () => {
  const issues = []
  const add = (rule, detail) => issues.push({ rule, detail })

  // images must have alt
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) add('img-alt', img.getAttribute('src')?.slice(0, 60))
  })

  // buttons/links must have accessible names
  document.querySelectorAll('button, a[href]').forEach((el) => {
    const name = (el.textContent || '').trim() ||
      el.getAttribute('aria-label') || el.getAttribute('title') ||
      (el.querySelector('img[alt]')?.alt)
    if (!name) add('empty-name', el.tagName + '.' + (el.className || '').toString().slice(0, 50))
  })

  // form inputs must be labelled
  document.querySelectorAll('input:not([type=hidden]), select, textarea').forEach((el) => {
    const id = el.id
    const labelled = (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
      el.closest('label') || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') ||
      el.getAttribute('placeholder')
    if (!labelled) add('unlabelled-input', (el.name || el.type || el.tagName))
  })

  // single h1
  const h1s = document.querySelectorAll('h1')
  if (h1s.length !== 1) add('h1-count', String(h1s.length))

  // heading order (no skipping >1 level)
  let prev = 0
  document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
    const level = Number(h.tagName[1])
    if (prev && level > prev + 1) add('heading-skip', `h${prev}->h${level}: ${(h.textContent||'').slice(0,40)}`)
    prev = level
  })

  // html lang
  if (!document.documentElement.lang) add('html-lang', 'missing')

  // duplicate ids
  const seen = new Set()
  document.querySelectorAll('[id]').forEach((el) => {
    if (seen.has(el.id)) add('dup-id', el.id)
    seen.add(el.id)
  })

  // aria-labelledby / aria-describedby targets exist
  document.querySelectorAll('[aria-labelledby],[aria-describedby]').forEach((el) => {
    ;['aria-labelledby', 'aria-describedby'].forEach((a) => {
      const v = el.getAttribute(a)
      if (v && !v.split(/\s+/).every((id) => document.getElementById(id))) add('bad-aria-ref', a + '=' + v)
    })
  })

  // links with target=_blank need rel
  document.querySelectorAll('a[target=_blank]').forEach((a) => {
    if (!/noopener/.test(a.rel || '')) add('blank-noopener', a.href?.slice(0, 60))
  })

  return issues
}

const OVERFLOW_FN = () => {
  const doc = document.documentElement
  const overflowX = doc.scrollWidth - doc.clientWidth
  const culprits = []
  if (overflowX > 1) {
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.right > doc.clientWidth + 1 || r.left < -1) {
        const cs = getComputedStyle(el)
        // ignore intentionally scrollable/hidden containers
        if (cs.overflowX === 'auto' || cs.overflowX === 'scroll' || cs.overflowX === 'hidden') return
        if (cs.position === 'fixed' && el.getAttribute('aria-hidden') === 'true') return
        culprits.push({
          tag: el.tagName,
          cls: (el.className || '').toString().slice(0, 70),
          left: Math.round(r.left), right: Math.round(r.right),
        })
      }
    })
  }
  return { overflowX, culprits: culprits.slice(0, 5) }
}

async function main() {
  const browser = await chromium.launch()
  const results = { console: [], pageErrors: [], a11y: {}, overflow: {}, dir: {}, fail: [] }

  // ---------- pass 1: console + page errors + a11y (desktop, EN) ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    for (const route of ROUTES) {
      const page = await ctx.newPage()
      const errs = []
      page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message))
      page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()) })
      page.on('requestfailed', (r) => {
        const u = r.url()
        if (!u.includes('favicon')) errs.push('REQFAIL: ' + u.slice(0, 80) + ' ' + (r.failure()?.errorText || ''))
      })
      try {
        await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 20000 })
        await page.waitForTimeout(400)
        const issues = await page.evaluate(A11Y_FN)
        if (issues.length) results.a11y[route] = issues
        if (errs.length) results.console[route] = errs
      } catch (e) {
        results.fail.push(route + ' :: ' + e.message.split('\n')[0])
      }
      await page.close()
    }
    await ctx.close()
  }

  // ---------- pass 2: responsive overflow (4 viewports x routes) ----------
  {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
      for (const route of ROUTES) {
        const page = await ctx.newPage()
        try {
          await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 20000 })
          await page.waitForTimeout(300)
          const o = await page.evaluate(OVERFLOW_FN)
          if (o.overflowX > 1) results.overflow[vp.name + ' ' + route] = o
        } catch (e) {
          results.fail.push(vp.name + ' ' + route + ' :: ' + e.message.split('\n')[0])
        }
        await page.close()
      }
      await ctx.close()
    }
  }

  // ---------- pass 3: RTL (AR) + LTR (EN/FR) direction checks ----------
  {
    for (const lang of ['ar', 'en', 'fr']) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await ctx.newPage()
      await page.goto(BASE + '/', { waitUntil: 'networkidle' })
      // switch language via the LangSwitcher UI (aria-label is translated per locale)
      const trigger = page.locator('button[aria-haspopup="menu"]').first()
      if (await trigger.count()) {
        await trigger.click().catch(() => {})
        const opt = page.locator('[role="menuitemradio"]', { hasText: lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Français' : 'English' }).first()
        if (await opt.count()) await opt.click().catch(() => {})
        await page.waitForTimeout(500)
      }
      const dir = await page.evaluate(() => ({
        dir: document.documentElement.dir,
        lang: document.documentElement.lang,
      }))
      results.dir[lang] = dir

      // check a few routes in that language for dir + overflow
      for (const route of ['/', '/contact', '/blog', '/solutions']) {
        await page.goto(BASE + route, { waitUntil: 'networkidle' })
        await page.waitForTimeout(300)
        const d = await page.evaluate(() => document.documentElement.dir + '|' + document.documentElement.lang)
        const expected = (lang === 'ar' ? 'rtl' : 'ltr') + '|' + lang
        if (d !== expected) results.fail.push(`dir ${lang} ${route}: got ${d} want ${expected}`)
        const o = await page.evaluate(OVERFLOW_FN)
        if (o.overflowX > 1) results.overflow[`dir:${lang} ${route}`] = o
      }
      await page.close()
      await ctx.close()
    }
  }

  await browser.close()
  console.log(JSON.stringify(results, null, 1))
}

main().catch((e) => { console.error(e); process.exit(1) })
