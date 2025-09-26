const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
    // Reset database
    await request.post('http://localhost:3001/api/testing/reset')

    // Create test user
    const user = { name: 'Test User', username: 'test', password: 'secret' }
    await request.post('http://localhost:3001/api/users', { data: user })

    // Go to frontend
    await page.goto('http://localhost:5173')
  })

  // 5.17: Login form is shown
  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('text=Log in to application')).toBeVisible()
  })

  // 5.18: Login tests
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('input[name="username"]', 'test')
      await page.fill('input[name="password"]', 'secret')
      await page.click('button:text("login")')
      await expect(page.locator('text=Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('input[name="username"]', 'test')
      await page.fill('input[name="password"]', 'wrong')
      await page.click('button:text("login")')
      await expect(page.locator('.notification')).toContainText('Wrong username or password')
    })
  })

  // 5.19–5.23: Tests when logged in
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.fill('input[name="username"]', 'test')
      await page.fill('input[name="password"]', 'secret')
      await page.click('button:text("login")')
    })

    // 5.19: Create a new blog
    test('a new blog can be created', async ({ page }) => {
      await page.click('button:text("create new blog")')
      await page.fill('input[placeholder="title"]', 'E2E Blog')
      await page.fill('input[placeholder="author"]', 'Playwright')
      await page.fill('input[placeholder="url"]', 'http://e2e.com')
      await page.click('button:text("create")')
      await expect(page.locator('text=E2E Blog Playwright')).toBeVisible()
    })

    // 5.20: Blog can be liked
    test('a blog can be liked', async ({ page }) => {
      await page.click('button:text("create new blog")')
      await page.fill('input[placeholder="title"]', 'Like Test Blog')
      await page.fill('input[placeholder="author"]', 'Tester')
      await page.fill('input[placeholder="url"]', 'http://like.com')
      await page.click('button:text("create")')

      await page.click('button:text("view")')
      const likeButton = page.locator('button:text("like")')
      await likeButton.click()
      await expect(page.locator('text=likes 1')).toBeVisible()
    })

    // 5.21: Creator can delete blog
    test('the user who added a blog can delete it', async ({ page }) => {
      await page.click('button:text("create new blog")')
      await page.fill('input[placeholder="title"]', 'Delete Blog')
      await page.fill('input[placeholder="author"]', 'Tester')
      await page.fill('input[placeholder="url"]', 'http://delete.com')
      await page.click('button:text("create")')

      await page.click('button:text("view")')
      page.on('dialog', dialog => dialog.accept())
      await page.click('button:text("remove")')
      await expect(page.locator('text=Delete Blog Tester')).toHaveCount(0)
    })

    // 5.22: Only creator sees delete button
    test('only creator sees the delete button', async ({ page, request }) => {
      const otherUser = { name: 'Other', username: 'other', password: 'secret' }
      await request.post('http://localhost:3001/api/users', { data: otherUser })

      await page.click('button:text("logout")')
      await page.fill('input[name="username"]', 'other')
      await page.fill('input[name="password"]', 'secret')
      await page.click('button:text("login")')

      await page.click('button:text("view")')
      await expect(page.locator('button:text("remove")')).toHaveCount(0)
    })

    // 5.23: Blogs sorted by likes
    test('blogs are ordered according to likes', async ({ page, request }) => {
      const blogs = [
        { title: 'Most liked', author: 'A', url: 'http://a.com', likes: 10 },
        { title: 'Least liked', author: 'B', url: 'http://b.com', likes: 2 }
      ]

      for (const b of blogs) {
        await request.post('http://localhost:3001/api/blogs', { data: b })
      }

      await page.reload()
      const titles = await page.locator('.blog > div:first-child').allTextContents()
      expect(titles[0]).toContain('Most liked')
      expect(titles[1]).toContain('Least liked')
    })
  })
})
