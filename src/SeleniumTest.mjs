import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

// Get the argument (default to 'local' if not provided)
const environment = process.argv[2] || 'local';

// URLs based on environment
// Obtain dev selenium server IP using: docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' selenium-server
const seleniumUrl = environment === 'github' 
  ? 'http://selenium:4444/wd/hub' 
  : 'http://localhost:4444/wd/hub';

// Note: Start the nodejs server before running the test locally
const serverUrl = environment === 'github' 
  ? 'http://testserver:3000' 
  : 'http://localhost:3000';

console.log(`Running tests in '${environment}' environment`);
console.log(`Selenium URL: ${seleniumUrl}`);
console.log(`Server URL: ${serverUrl}`);


(async function testValidateInputUI() {
    const driver = await new Builder()
        .forBrowser('chrome')
        .usingServer(seleniumUrl)
        .build();

    try {
        await driver.get(serverUrl);

        // Helper to test a value in the input and check the result
        async function testInput(value, expectAlert, expectCleared, expectSearchPage) {
            const input = await driver.findElement(By.css('input[type="text"]'));
            await input.clear();
            await input.sendKeys(value);
            const button = await driver.findElement(By.css('button'));
            await button.click();

            if (expectAlert) {
                // Wait for alert and accept it
                await driver.wait(until.alertIsPresent(), 2000);
                const alert = await driver.switchTo().alert();
                assert.strictEqual(await alert.getText(), "Potential XSS or SQL Injection detected. Input cleared.");
                await alert.accept();
            }

            if (expectCleared) {
                const inputAfter = await driver.findElement(By.css('input[type="text"]'));
                const valueAfter = await inputAfter.getAttribute('value');
                assert.strictEqual(valueAfter, "");
            }

            if (expectSearchPage) {
                // Wait for search results to appear
                await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'Search Results for:')]") ), 2000);
            }
        }

        // Test XSS input
        await testInput("<script>alert('xss')</script>", true, true, false);
        // Test SQL injection input
        await testInput("' OR 1=1 --", true, true, false);
        // Test safe input
        await testInput("hello world", false, false, true);

        console.log('All validateInput UI tests passed.');
    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        await driver.quit();
    }
})();
