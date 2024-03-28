import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  //await page.goto("https://www.ryanair.com/gb/en");
  await page.goto(
    "https://www.ryanair.com/gb/en/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut=2024-04-02&dateIn=&isConnectedFlight=false&discount=0&promoCode=&isReturn=false&originIata=ABZ&destinationIata=ALC&tpAdults=1&tpTeens=0&tpChildren=0&tpInfants=0&tpStartDate=2024-04-02&tpEndDate=&tpDiscount=0&tpPromoCode=&tpOriginIata=ABZ&tpDestinationIata=ALC"
  );
  //await page.screenshot({ path: 'screenshot.png' });
  //const content = await page.content();
  //console.log(content);
  //await page.getByText("Yes, I agree").click();
  await page.getByRole("button", { name: /Yes, I agree/i }).click();
  await new Promise((resolve) => setTimeout(resolve, 60000));
  await browser.close();
})();
