import { test, expect, type Page } from '@playwright/test'

/** Full breakpoint matrix from the foundation document. */
const WIDTHS = [320, 360, 375, 390, 430, 480, 576, 768, 992, 1024, 1280, 1366, 1440, 1600, 1920]

const ROUTES = [
  '/',
  '/projects',
  '/projects/signature-city-phase-one',
  '/projects/the-estate-block',
  '/projects/heritage-avenues',
  '/gallery',
  '/amenities',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/does-not-exist',
]

function trackErrors(page: Page, errors: string[]) {
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
}

for (const route of ROUTES) {
  test(`zero horizontal scroll + clean console on ${route}`, async ({ page }) => {
    const errors: string[] = []
    trackErrors(page, errors)

    await page.goto(route, { waitUntil: 'domcontentloaded' })

    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 })
      // Allow reveal/observer and layout to settle.
      await page.waitForTimeout(60)

      const { scrollWidth, bodyScrollWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
      }))

      expect(
        scrollWidth,
        `document overflows horizontally at ${width}px on ${route} (scrollWidth=${scrollWidth})`,
      ).toBeLessThanOrEqual(width + 1)
      expect(
        bodyScrollWidth,
        `body overflows horizontally at ${width}px on ${route} (scrollWidth=${bodyScrollWidth})`,
      ).toBeLessThanOrEqual(width + 1)
    }

    expect(errors, `console errors on ${route}: ${errors.join(' | ')}`).toEqual([])
  })
}
