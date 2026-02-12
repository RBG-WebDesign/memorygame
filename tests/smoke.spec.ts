import { test, expect } from '@playwright/test';

test('has title and start button', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Samsung Memory Flip/i);

    // Check for start button
    const startButton = page.getByRole('button', { name: /Start Game/i });
    await expect(startButton).toBeVisible();
});

test('can navigate to game screen', async ({ page }) => {
    await page.goto('/');

    const startButton = page.getByRole('button', { name: /Start Game/i });
    await startButton.click();

    // Verify we are on the game screen (looking for board)
    await expect(page).toHaveURL(/.*game/i);
});
