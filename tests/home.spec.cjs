const { test, expect } = require('@playwright/test')

const BASE = 'http://localhost:3000'

// Collect page errors from the very first navigation
function trackErrors(page) {
  const errors = []
  page.on('pageerror', (err) => errors.push(err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  return errors
}

test('homepage loads', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto(BASE + '/')
  await expect(page.locator('h1')).toContainText('We turn bold ideas into')
  expect(errors).toHaveLength(0)
})

test('services page loads', async ({ page }) => {
  const errors = trackErrors(page)
  await page.addInitScript(() => localStorage.setItem('fikra-language', 'fr'))
  await page.goto(BASE + '/services')
  await expect(page.locator('h1')).toContainText('Développement web complet')
  expect(errors).toHaveLength(0)
})

test('solutions page loads', async ({ page }) => {
  const errors = trackErrors(page)
  await page.addInitScript(() => localStorage.setItem('fikra-language', 'fr'))
  await page.goto(BASE + '/solutions')
  await expect(page.locator('h1')).toContainText('Lancez plus vite avec des systèmes éprouvés')
  expect(errors).toHaveLength(0)
})

test('rtl support: Arabic sets dir=rtl', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto(BASE + '/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')

  const langSwitcher = page.locator('button').filter({ hasText: 'English' }).first()
  await langSwitcher.click()
  await page.locator('button').filter({ hasText: 'العربية' }).click()
  await page.waitForTimeout(300)

  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  expect(errors).toHaveLength(0)
})

test('dark mode toggle works', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto(BASE + '/')
  await page.locator('[data-testid="theme-toggle"]').first().click()
  await page.waitForTimeout(300)
  await expect(page.locator('html')).toHaveClass(/dark/)
  expect(errors).toHaveLength(0)
})

test('contact page renders translated form', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto(BASE + '/contact')
  await expect(page.locator('h1')).toContainText("Let's build something great together")
  await expect(page.getByText('What kind of project are you looking for?')).toBeVisible()
  expect(errors).toHaveLength(0)
})

test('unknown route shows 404', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto(BASE + '/definitely-not-a-page')
  await expect(page.locator('h1')).toContainText('wrong turn')
  expect(errors).toHaveLength(0)
})
