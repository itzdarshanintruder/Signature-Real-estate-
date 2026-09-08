import { test, expect, type Page } from '@playwright/test'

const AUTH_LOGIN = '**/api:admin/auth/login'
const AUTH_ME = '**/api:admin/auth/me'

/** Mock the Xano auth endpoints so the admin guard lets us through. */
async function mockAuth(page: Page) {
  await page.route(AUTH_LOGIN, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ authToken: 'test-token' }),
    }),
  )
  await page.route(AUTH_ME, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        email: 'admin@test.invalid',
        permissions: [],
        created_at: Date.now(),
      }),
    }),
  )
}

/**
 * Sign in via the login form. The session token lives in memory only, so all
 * further navigation in a test MUST use in-app links (never a hard reload).
 */
async function signIn(page: Page) {
  await page.goto('/admin/login')
  await page.getByLabel('Email').fill('admin@test.invalid')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/\/admin$/, { timeout: 10_000 })
}

/** Sign in and open the plot dashboard through the admin nav. */
async function openPlots(page: Page) {
  await signIn(page)
  await page.getByRole('link', { name: 'Plots' }).click()
  await expect(page).toHaveURL(/\/admin\/plots$/)
}

test.describe('Admin plot management', () => {
  test('login redirects to the admin dashboard', async ({ page }) => {
    await mockAuth(page)
    await signIn(page)
  })

  test('plot dashboard lists seeded plots with status badges', async ({ page }) => {
    await mockAuth(page)
    await openPlots(page)

    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible()
    await expect(page.getByText('Signature City — Phase One').first()).toBeVisible()
    await expect(page.getByText('Signature City — Lakeview Row').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /Add New Plot/ }).first()).toBeVisible()
    await expect(page.getByText('Available', { exact: true }).first()).toBeVisible()
  })

  test('plot form validates required fields, then creates a plot', async ({ page }) => {
    await mockAuth(page)
    await openPlots(page)
    await page.getByRole('button', { name: /Add New Plot/ }).first().click()
    await expect(page).toHaveURL(/\/admin\/plots\/new$/)
    await expect(page.getByRole('heading', { name: 'Add New Plot' })).toBeVisible()

    await page.getByRole('button', { name: 'Save Plot' }).click()
    await expect(page.getByText('Please enter a project or plot name')).toBeVisible()
    await expect(page.getByText('Please enter a location')).toBeVisible()
    await expect(page.getByText('Please enter a plot number')).toBeVisible()
    await expect(page.getByText('Enter a valid area')).toBeVisible()
    await expect(page.getByText('Enter a valid price')).toBeVisible()

    await page.getByLabel('Project / Plot Name').fill('Signature City — Test Plot')
    await page.getByLabel('Location').fill('Test District')
    await page.getByLabel('Plot Number').fill('SC-T-1')
    await page.getByLabel('Area (sq. ft.)').fill('2000')
    await page.getByLabel('Price (₹)').fill('1500000')
    await page.getByLabel('Amenities / Features').fill('Gated, Security')
    await page.getByRole('button', { name: 'Save Plot' }).click()

    await expect(page).toHaveURL(/\/admin\/plots$/, { timeout: 10_000 })
    await expect(page.getByText('Signature City — Test Plot')).toBeVisible()
  })

  test('edit form pre-fills the selected plot', async ({ page }) => {
    await mockAuth(page)
    await openPlots(page)

    await page.getByRole('button', { name: 'Edit' }).first().click()
    await expect(page).toHaveURL(/\/admin\/plots\/[\w-]+\/edit$/)
    await expect(page.getByRole('heading', { name: 'Edit Plot' })).toBeVisible()
    await expect(page.getByLabel('Project / Plot Name')).toHaveValue(/Signature City/)
  })

  test('gallery upload, cover badge and delete flow', async ({ page }) => {
    await mockAuth(page)
    await openPlots(page)

    // Lakeview Row (second row) starts with an empty gallery.
    await page.getByRole('button', { name: 'Gallery' }).nth(1).click()
    await expect(page).toHaveURL(/\/admin\/plots\/[\w-]+\/gallery$/)
    await expect(page.getByText('No gallery images yet')).toBeVisible()

    // Upload a PNG.
    await page.setInputFiles('input[type="file"]', {
      name: 'lakeview.png',
      mimeType: 'image/png',
      buffer: Buffer.from('89504e470d0a1a0a', 'hex'),
    })
    await expect(page.getByText('lakeview.png')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Cover', { exact: true })).toBeVisible()

    // Delete it back to the empty state.
    await page.getByRole('button', { name: /Delete lakeview/ }).click()
    await expect(page.getByRole('dialog', { name: 'Delete image?' })).toBeVisible()
    await page.getByRole('button', { name: 'Delete image' }).click()
    await expect(page.getByText('No gallery images yet')).toBeVisible({ timeout: 10_000 })
  })

  test('delete plot requires confirmation', async ({ page }) => {
    await mockAuth(page)
    await openPlots(page)

    const row = page.getByText('Signature City — Garden Homes').first()
    await expect(row).toBeVisible()

    await page.getByRole('button', { name: /Delete Signature City/ }).last().click()
    await expect(page.getByRole('dialog', { name: 'Delete plot?' })).toBeVisible()
    await page.getByRole('button', { name: 'Delete plot' }).click()
    await expect(page.getByRole('dialog', { name: 'Delete plot?' })).toBeHidden()
    await expect(page.locator('table').locator('p', { hasText: 'Garden Homes' })).toBeHidden({
      timeout: 10_000,
    })
  })
})
