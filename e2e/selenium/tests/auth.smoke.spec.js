const path = require('node:path');
const dotenv = require('dotenv');
const { expect } = require('chai');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const baseUrl = process.env.E2E_BASE_URL || 'http://127.0.0.1:4173';
const isHeadless = process.env.HEADLESS !== 'false';

describe('Frontend smoke con Selenium', function () {
    this.timeout(60000);

    let driver;

    before(async () => {
        const options = new chrome.Options();

        if (isHeadless) {
            options.addArguments('--headless=new');
        }

        options.addArguments('--window-size=1440,900');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    it('carga autenticacion y cambia a registro', async () => {
        await driver.get(baseUrl);

        const loginTitle = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Bienvenido de vuelta')]")),
            15000
        );

        expect(await loginTitle.isDisplayed()).to.equal(true);

        const registerToggle = await driver.findElement(By.xpath("//button[contains(., 'Reg')]"));
        await registerToggle.click();

        const registerTitle = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Crear nueva cuenta')]")),
            15000
        );

        expect(await registerTitle.isDisplayed()).to.equal(true);
    });
});
