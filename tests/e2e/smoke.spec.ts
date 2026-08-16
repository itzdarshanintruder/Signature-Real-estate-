import { test, expect } from '@playwright/test'

test.describe('Signature City — functional smoke', () => {
  test('home page renders all key sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Own Your')
    await expect(page.getByRole('heading', { name: /Signature Projects/ })).toBeVisible()
    await expect(page.getByText('DTCP Approved', { exact: true }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /Reserved for the Discerning/ })).toBeVisible()
    await expect(page.getByText('Amenities That Make It Home')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Land Planned With a Rare Kind of Care/ })).toBeVisible()
    await expect(page.getByText('Growth History').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /Your Legacy Awaits/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Explore Projects/ })).toBeVisible()
  })

  test('mobile drawer opens, navigates and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')

    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()

    await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL(/\/projects$/)
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden()
  })

  test('projects page filters by status', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.getByRole('tab', { name: 'All Projects' })).toBeVisible()

    await page.getByRole('tab', { name: 'Premium' }).click()
    await expect(page.locator('main a[href="/projects/the-golden-grove"]')).toBeVisible()
    await expect(page.locator('main a[href="/projects/signature-city-phase-one"]')).toBeHidden()

    await page.getByRole('tab', { name: 'Sold Out' }).click()
    await expect(page.locator('main a[href="/projects/ivory-courts"]')).toBeVisible()
    await expect(page.locator('main a[href="/projects/the-golden-grove"]')).toBeHidden()
  })

  test('projects page search, filters, sort and pagination', async ({ page }) => {
    await page.goto('/projects')

    await page.getByLabel('Search projects').fill('golden')
    await expect(page.locator('main a[href="/projects/the-golden-grove"]')).toBeVisible()
    await expect(page.locator('main a[href="/projects/signature-city-phase-one"]')).toBeHidden()
    await page.getByRole('button', { name: 'Clear search' }).click()

    await page.getByLabel('District').selectOption('Premium Zone')
    await expect(page.locator('main a[href="/projects/the-golden-grove"]')).toBeVisible()
    await expect(page.locator('main a[href="/projects/the-estate-block"]')).toBeVisible()
    await expect(page.locator('main a[href="/projects/signature-city-phase-one"]')).toBeHidden()

    await page.getByRole('button', { name: 'Clear filters' }).click()
    await page.getByLabel('Budget').selectOption('lt-10')
    await expect(page.locator('main a[href="/projects/heritage-avenues"]')).toBeVisible()
    await expect(page.locator('main a[href="/projects/the-estate-block"]')).toBeHidden()

    await page.getByRole('button', { name: 'Clear filters' }).click()
    await page.getByLabel('Sort By').selectOption('price-asc')
    await expect(page.locator('main a[href^="/projects/"]').first()).toHaveAttribute(
      'href',
      '/projects/heritage-avenues',
    )

    await page.getByLabel('Sort By').selectOption('featured')
    await expect(page.locator('main a[href="/projects/signature-city-phase-one"]')).toBeVisible()
    await expect(page.locator('main a[href="/projects/the-estate-block"]')).toBeHidden()
    await page.getByRole('button', { name: 'Next page' }).click()
    await expect(page.locator('main a[href="/projects/the-estate-block"]')).toBeVisible()
    await expect(page.locator('main a[href="/projects/signature-city-phase-one"]')).toBeHidden()
    await page.getByRole('button', { name: 'Page 1' }).click()
    await expect(page.locator('main a[href="/projects/signature-city-phase-one"]')).toBeVisible()
  })

  test('project details renders the full experience', async ({ page }) => {
    await page.goto('/projects/signature-city-phase-one')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Phase One')

    const firstImage = page.locator('button[aria-label^="Open gallery image"]').first()
    await firstImage.click()
    const dialog = page.getByRole('dialog', { name: /gallery image/ })
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('1 / 6')
    await page.keyboard.press('ArrowRight')
    await expect(dialog).toContainText('2 / 6')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()

    await expect(page.getByRole('heading', { name: 'About this phase' })).toBeVisible()
    await expect(page.getByText('Highlights')).toBeVisible()
    await expect(page.getByText('Life, Taken Care Of')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Secure Your Address' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Enquire Now' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sold' })).toBeVisible()
    await expect(page.getByText('Transparent Price Points')).toBeVisible()
    await expect(page.getByText('From ₹9.0 Lakh').first()).toBeVisible()
    await expect(page.getByText('Built for Long-Term Value')).toBeVisible()
    await expect(page.getByText('Project timeline')).toBeVisible()
    await expect(page.getByText('In the Heart of the Growth Corridor')).toBeVisible()
    await expect(page.getByText('Sanskriti International School')).toBeVisible()
    await expect(page.getByRole('link', { name: 'View on Google Maps' })).toBeVisible()
    await expect(page.getByText('The Layout at a Glance')).toBeVisible()

    await page.getByRole('button', { name: 'Can I get a home loan for a plot here?' }).click()
    await expect(page.getByText(/bank-loan eligible/)).toBeVisible()

    await expect(page.getByText('Your Legacy Awaits')).toBeVisible()
  })

  test('project details opens from a card', async ({ page }) => {
    await page.goto('/projects')
    await page.locator('main a[href="/projects/signature-city-phase-one"]').click()
    await expect(page).toHaveURL(/\/projects\/signature-city-phase-one$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Phase One')
    await expect(page.getByText('Highlights')).toBeVisible()
  })

  test('amenities page renders premium sections', async ({ page }) => {
    await page.goto('/amenities')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Life, Elevated')
    await expect(page.getByRole('heading', { name: 'Everything You Need, Designed In' })).toBeVisible()
    await expect(page.getByText('24×7 Security')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Water Harvesting' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Security & Privacy' })).toBeVisible()
    await expect(page.getByText('Manned gated entry')).toBeVisible()
    await expect(page.getByText('Rain-water harvesting')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Your Legacy Awaits/ })).toBeVisible()
  })

  test('gallery lightbox opens, navigates and closes', async ({ page }) => {
    await page.goto('/gallery')
    const first = page.locator('button[aria-label^="View larger"]').first()
    await first.click()

    const dialog = page.getByRole('dialog', { name: /gallery image/ })
    await expect(dialog).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(dialog).toContainText('2 / 9')

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('FAQ accordion expands and collapses', async ({ page }) => {
    await page.goto('/faq')
    const bankLoan = page.getByRole('button', { name: 'Can I take a bank loan for a plot?' })
    await bankLoan.click()
    await expect(page.getByText(/Loan eligibility is evaluated/)).toBeVisible()
    await bankLoan.click()
    await expect(page.getByText(/Loan eligibility is evaluated/)).toBeHidden()
  })

  test('contact form validates then submits successfully', async ({ page }) => {
    await page.goto('/contact')

    await page.getByRole('button', { name: 'Submit Enquiry' }).click()
    await expect(page.getByText('Please enter your full name')).toBeVisible()
    await expect(page.getByText('Enter a valid 10-digit mobile number')).toBeVisible()

    await page.getByLabel('Full Name').fill('Test Buyer')
    await page.getByLabel('Mobile Number').fill('9876543210')
    await page.getByLabel('I am interested in').selectOption('brochure')
    await page.getByLabel('I agree to be contacted by Signature City').check()
    await page.getByRole('button', { name: 'Submit Enquiry' }).click()

    await expect(page.getByText(/Thank you!/)).toBeVisible({ timeout: 10_000 })
  })

  test('404 page renders for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page.getByRole('heading', { level: 1, name: /This Plot Doesn't Exist/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Back to Home/ })).toBeVisible()
  })

  test('JSON-LD structured data stays unique across SPA navigations', async ({ page }) => {
    const countLd = () =>
      page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.length)

    await page.goto('/faq')
    // index.html Organization/WebSite graph + FAQPage = 2
    await expect.poll(countLd).toBe(2)

    await page.getByRole('link', { name: 'Projects' }).first().click()
    await page.waitForURL(/\/projects$/)
    // Projects listing carries no page-level JSON-LD
    await expect.poll(countLd).toBe(1)

    await page.getByRole('link', { name: 'Phase One' }).first().click()
    await page.waitForURL(/\/projects\/signature-city-phase-one$/)
    // static graph + RealEstateListing = 2 (never duplicates)
    await expect.poll(countLd).toBe(2)

    await page.getByRole('link', { name: 'FAQ' }).first().click()
    await page.waitForURL(/\/faq$/)
    await expect.poll(countLd).toBe(2)
  })
})
