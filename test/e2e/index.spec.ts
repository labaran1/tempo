import { test, expect } from '@playwright/test';


test('should search for team', async ({ page }) => {
    await page.goto("/")
    await page.locator('#searchInput').fill("hi")
    await page.click("text=Search")
    expect(page.locator('span')).toContain("Beautiful White Moth")

})

test('should view team details', async ({ page }) => {
    await page.goto("/")
    await page.locator('#searchInput').fill("hi")
    await page.click("text=Search")
     const rows = await page.$$("text=View Details")
     await rows[0].click()
     await page.click("text=Members:6")
     await expect(page).toHaveURL("http://localhost:3000/team/de908363-1cc6-4417-b4e1-a24e845f9680")
     await expect(page.locator('h4')).toContainText('Team Lead')
     await expect(page.locator('h1')).toContainText('Team: Beautiful White Moth')



})