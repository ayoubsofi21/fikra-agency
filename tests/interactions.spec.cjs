const { test, expect } = require('@playwright/test')

const BASE = 'http://localhost:3000'

function trackErrors(page) {
  const errors = []
  page.on('pageerror', (err) => errors.push(err.message))
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
  return errors
}

test.describe('navigation', () => {
  test('desktop nav links navigate via SPA (no full reload)', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto(BASE + '/')
    await page.evaluate(() => { window.__spaMarker = 1 })
    await page.locator('nav a[href="/services"]').first().click()
    await expect(page).toHaveURL(/\/services$/)
    await expect(page.locator('h1')).toContainText('Full-cycle web development')
    const marker = await page.evaluate(() => window.__spaMarker)
    expect(marker).toBe(1) // full reload would wipe it
    expect(errors).toHaveLength(0)
  })

  test('hero CTA navigates without full reload', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.evaluate(() => { window.__spaMarker = 1 })
    await page.locator('main a[href="/contact"]').first().click()
    await expect(page).toHaveURL(/\/contact$/)
    expect(await page.evaluate(() => window.__spaMarker)).toBe(1)
  })

  test('footer services link navigates', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.locator('footer a[href="/services#e-commerce"]').click()
    await expect(page).toHaveURL(/\/services/)
    await expect(page.locator('h1')).toContainText('Full-cycle web development')
  })

  test('mobile burger opens menu, navigates, closes', async ({ page }) => {
    const errors = trackErrors(page)
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(BASE + '/')
    await page.locator('button[aria-label="Menu"]').click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
    await dialog.locator('a[href="/pricing"]').click()
    await expect(page).toHaveURL(/\/pricing$/)
    await expect(dialog).not.toBeVisible()
    expect(errors).toHaveLength(0)
  })

  test('mobile menu closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(BASE + '/')
    await page.locator('button[aria-label="Menu"]').click()
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })
})

test.describe('i18n persistence', () => {
  test('language switch to FR persists across reload', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto(BASE + '/')
    await page.locator('button[aria-label="Change language"]').first().click()
    await page.locator('#lang-menu button[role="menuitemradio"]').filter({ hasText: 'Français' }).click()
    await expect(page.locator('nav')).toContainText('Obtenir un devis')
    await page.reload()
    // after reload the French UI must still be French
    await expect(page.locator('nav')).toContainText('Obtenir un devis', { timeout: 5000 })
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    expect(errors).toHaveLength(0)
  })

  test('language switch to AR sets rtl and persists', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.locator('button[aria-label="Change language"]').first().click()
    await page.locator('#lang-menu button[role="menuitemradio"]').filter({ hasText: 'العربية' }).click()
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl', { timeout: 5000 })
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  })
})

test.describe('theme', () => {
  test('dark mode actually changes colors', async ({ page }) => {
    await page.goto(BASE + '/')
    const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    await page.locator('[data-testid="theme-toggle"]').first().click()
    await page.waitForTimeout(400)
    const darkClass = await page.locator('html').evaluate((el) => el.classList.contains('dark'))
    expect(darkClass).toBe(true)
    const after = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    // Colors must visibly change in dark mode (not just the class)
    expect(after).not.toBe(before)
    // and dark page background should be the brand dark navy, not white
    const [r, g, b] = after.match(/\d+/g).map(Number)
    expect(r + g + b).toBeLessThan(400) // dark background
  })

  test('dark mode persists across reload', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.locator('[data-testid="theme-toggle"]').first().click()
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})

test.describe('search and filters', () => {
  test('portfolio search filters and shows empty state', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto(BASE + '/portfolio')
    const search = page.locator('input[aria-label*="Search"]')
    await search.fill('fintech')
    await expect(page.locator('main h2')).toHaveCount(1)
    await search.fill('zzzznotfound')
    await expect(page.getByText(/not found/i).first()).toBeVisible()
    await search.fill('')
    await expect(page.locator('main h2').first()).toBeVisible()
    expect(errors).toHaveLength(0)
  })

  test('blog category tab filters posts', async ({ page }) => {
    await page.goto(BASE + '/blog')
    await expect(page.locator('main h2').first()).toBeVisible()
    const all = await page.locator('main h2').count()
    expect(all).toBeGreaterThan(0)
    const designTab = page.locator('button[role="tab"]', { hasText: 'Design' })
    await expect(designTab.first()).toBeVisible()
    await designTab.first().click()
    const filtered = await page.locator('main h2').count()
    expect(filtered).toBeLessThanOrEqual(all)
    expect(filtered).toBeGreaterThan(0)
  })

  test('solutions search filters', async ({ page }) => {
    await page.goto(BASE + '/solutions')
    const search = page.locator('input[aria-label*="Search"], input[placeholder*="Search"]')
    await search.fill('invoice')
    await expect(page.locator('main h2').first()).toBeVisible()
    const count = await page.locator('main h2').count()
    expect(count).toBeLessThanOrEqual(3)
  })
})

test.describe('pricing', () => {
  test('billing toggle changes displayed prices', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto(BASE + '/pricing')
    const sw = page.locator('[role="switch"]')
    await expect(sw).toBeVisible()
    const priceBefore = await page.locator('main').innerText()
    await sw.click()
    await page.waitForTimeout(300)
    const priceAfter = await page.locator('main').innerText()
    expect(priceAfter).not.toBe(priceBefore)
    expect(await sw.getAttribute('aria-checked')).toBe('true')
    expect(errors).toHaveLength(0)
  })
})

test.describe('accordions and tabs', () => {
  test('FAQ accordion expands and collapses', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto(BASE + '/faq')
    const buttons = page.locator('button[aria-expanded]')
    await expect(buttons.first()).toBeVisible()
    const first = buttons.first()
    const state1 = await first.getAttribute('aria-expanded')
    await first.click()
    const state2 = await first.getAttribute('aria-expanded')
    expect(state2).not.toBe(state1)
    expect(errors).toHaveLength(0)
  })
})

test.describe('contact workflow', () => {
  test('full multi-step submit shows success', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto(BASE + '/contact')
    // step 1: pick a project type (keyboard accessible)
    const radio = page.locator('[role="radio"]').first()
    await radio.click()
    expect(await radio.getAttribute('aria-checked')).toBe('true')
    await page.getByRole('button', { name: /next/i }).click()
    // step 2: budget + timeline
    await page.locator('[role="radiogroup"]').first().locator('[role="radio"]').first().click()
    await page.getByRole('button', { name: /next/i }).click()
    // step 3: description
    await page.locator('#description').fill('We need a booking platform for our clinics.')
    await page.getByRole('button', { name: /next/i }).click()
    // step 4: contact info
    await page.locator('#name').fill('Test User')
    await page.locator('#email').fill('test@example.com')
    const submitBtn = page.locator('#main-content form button[type="submit"]')
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()
    // success screen, not the page headline
    await expect(page.getByText(/Message sent/i)).toBeVisible({ timeout: 8000 })
    await expect(page.locator('#name')).toHaveCount(0)
    expect(errors).toHaveLength(0)
  })

  test('form validation blocks empty submit', async ({ page }) => {
    await page.goto(BASE + '/contact')
    await page.locator('[role="radio"]').first().click()
    await page.getByRole('button', { name: /next/i }).click()
    await page.getByRole('button', { name: /next/i }).click()
    await page.getByRole('button', { name: /next/i }).click()
    await expect(page.locator('#name')).toBeVisible()
    await page.locator('#main-content form button[type="submit"]').click()
    await page.waitForTimeout(300)
    // native validation should keep us on the form (no success screen)
    await expect(page.locator('#name')).toBeVisible()
    await expect(page.getByText(/Message sent/i)).toHaveCount(0)
  })
})

test.describe('solution request modal', () => {
  test('opens, validates, submits and closes', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto(BASE + '/solutions/invoice-management')
    await page.locator('main').getByRole('button', { name: /request|quote|get/i }).first().click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
    // submit empty -> zod validation errors visible
    await dialog.locator('button[type="submit"]').click()
    await page.waitForTimeout(300)
    await expect(dialog.locator('text=at least').first()).toBeVisible()
    // fill valid
    await dialog.locator('#request-name').fill('Jane Doe')
    await dialog.locator('#request-email').fill('jane@example.com')
    await dialog.locator('#request-message').fill('I would like to know more about this solution please.')
    await dialog.locator('#request-terms').check()
    await dialog.locator('button[type="submit"]').click()
    await expect(dialog.getByText(/24 hours|back to you|success/i).first()).toBeVisible({ timeout: 8000 })
    // auto-closes after 2s
    await expect(dialog).not.toBeVisible({ timeout: 6000 })
    expect(errors).toHaveLength(0)
  })
})

test.describe('footer newsletter', () => {
  test('newsletter submit does not reload the page', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto(BASE + '/')
    await page.evaluate(() => { window.__spaMarker = 1 })
    const form = page.locator('footer form')
    await form.locator('input[type="email"]').fill('reader@example.com')
    await form.locator('button[type="submit"]').click()
    // must NOT have navigated away (an unhandled form submit reloads the page)
    expect(await page.evaluate(() => window.__spaMarker)).toBe(1)
    await expect(page).toHaveURL(BASE + '/')
    // and the user gets feedback instead of a silent reload
    await expect(page.locator('footer [role="status"]')).toBeVisible()
    expect(errors).toHaveLength(0)
  })
})

test.describe('animations and counters', () => {
  test('stats counters reach their target values', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.evaluate(() => window.scrollTo(0, 600))
    await page.waitForTimeout(2600)
    const text = await page.locator('main').innerText()
    expect(text).toContain('87')
    expect(text).toContain('42')
  })

  test('tech stack lists all technologies', async ({ page }) => {
    await page.goto(BASE + '/')
    const stack = page.locator('[data-testid="tech-marquee"]')
    await expect(stack).toBeVisible()
    await expect(stack.locator('> div')).toHaveCount(12)
    // static grid: no looping transform (motion pass removed the marquee)
    const t1 = await stack.evaluate((el) => getComputedStyle(el).transform)
    await page.waitForTimeout(600)
    const t2 = await stack.evaluate((el) => getComputedStyle(el).transform)
    expect(t2).toBe(t1)
  })
})

test.describe('scroll to top', () => {
  test('appears after scrolling and returns to top', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.evaluate(() => window.scrollTo(0, 1200))
    await page.waitForTimeout(400)
    const btn = page.locator('button[aria-label="Scroll to top"]')
    await expect(btn).toBeVisible()
    await btn.click()
    await page.waitForTimeout(900)
    const y = await page.evaluate(() => window.scrollY)
    expect(y).toBeLessThan(50)
  })
})
