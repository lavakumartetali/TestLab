import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowDownToLine, ArrowDownUp, ArrowRight, Bell,
  Blocks, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, Code2, Copy, Download, ExternalLink, Eye, EyeOff,
  FileText, Filter, Globe2, LayoutDashboard, LoaderCircle, LogOut,
  Menu, MoreHorizontal, MousePointer2, PanelTop, Plus, Search, Settings2,
  ShieldCheck, Sparkles, Sun, Moon, Table2, Trash2, Upload, UserRound, Server,
  X, Zap,
} from "lucide-react";
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const demoCredentials = { email: "demo@testlab.dev", password: "Test123!" };
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

function DeveloperCredit() {
  return <span className="developer-credit"><span>Developed by Lava Kumar</span><a href="mailto:lavakumartetali@gmail.com">lavakumartetali@gmail.com</a><a href="https://github.com/lavakumartetali" target="_blank" rel="noreferrer">GitHub: lavakumartetali</a></span>;
}

const navigation = [
  { label: "Overview", path: "/home", icon: LayoutDashboard, section: "WORKSPACE" },
  { label: "Dynamic elements", path: "/dynamic", icon: Zap, section: "TEST SCENARIOS" },
  { label: "Data tables", path: "/tables", icon: Table2 },
  { label: "Dialogs & alerts", path: "/dialogs", icon: PanelTop },
  { label: "Form widgets", path: "/widgets", icon: Settings2 },
  { label: "Browser tools", path: "/browser-tools", icon: Globe2 },
  { label: "API workbench", path: "/api-workbench", icon: Server, section: "API TESTING" },
  { label: "Automation code", path: "/automation-code", icon: Code2, section: "TEST AUTOMATION" },
];

const automationExamples = {
  "Selenium · Python": {
    language: "python",
    install: "python -m pip install selenium requests",
    file: "tests/test_testlab_e2e.py",
    structure: `selenium-python/
  tests/
    test_testlab_e2e.py`,
    run: "python -m unittest discover -s tests -v",
    code: `import os
import json
import requests
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait


class TestLabEndToEnd(unittest.TestCase):
    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_argument("--headless=new")
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 10)
        self.base_url = os.getenv("TESTLAB_URL", "http://localhost:5173")

    def open_page(self, path):
        self.driver.find_element(
            By.CSS_SELECTOR, f".side-nav a[href='{path}']"
        ).click()

    def tearDown(self):
        self.driver.quit()

    def test_full_playground_journey(self):
        self.driver.get(f"{self.base_url}/login")
        self.driver.find_element(By.ID, "login-email").send_keys("demo@testlab.dev")
        self.driver.find_element(By.ID, "login-password").send_keys("Test123!")
        self.driver.find_element(
            By.XPATH, "//button[contains(., 'Sign in to your workspace')]"
        ).click()
        self.wait.until(EC.url_contains("/home"))
        session_user = json.loads(self.driver.execute_script(
            "return sessionStorage.getItem('testlab-user')"
        ))
        self.assertEqual(session_user["email"], "demo@testlab.dev")

        self.open_page("/dynamic")
        self.driver.find_element(
            By.XPATH, "//button[contains(., 'Load after 1.7 seconds')]"
        ).click()
        delayed = self.wait.until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, '[data-testid="delayed-element"]')
            )
        )
        self.assertIn("delayed content", delayed.text.lower())

        self.open_page("/tables")
        search = self.driver.find_element(
            By.CSS_SELECTOR, "input[aria-label='Search table']"
        )
        search.send_keys("Olivia Chen")
        self.wait.until(
            EC.visibility_of_element_located(
                (By.XPATH, "//strong[normalize-space()='Olivia Chen']")
            )
        )

        self.open_page("/dialogs")
        self.driver.find_element(
            By.XPATH, "//button[contains(., 'Open modal dialog')]"
        ).click()
        dialog = self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "[role='dialog']"))
        )
        dialog.find_element(
            By.XPATH, ".//button[normalize-space()='Confirm']"
        ).click()
        self.wait.until(EC.invisibility_of_element_located(
            (By.CSS_SELECTOR, "[role='dialog']")))

        self.open_page("/widgets")
        Select(self.driver.find_element(By.NAME, "country")).select_by_visible_text(
            "Canada"
        )
        Select(self.driver.find_element(By.NAME, "role")).select_by_visible_text(
            "QA Engineer"
        )
        self.driver.find_element(
            By.CSS_SELECTOR, "input[name='experience'][value='Advanced']"
        ).click()
        self.driver.find_element(
            By.XPATH, "//button[contains(., 'Submit form')]"
        ).click()
        self.wait.until(EC.text_to_be_present_in_element(
            (By.CSS_SELECTOR, ".submission-summary"), "Form submitted"))

        self.open_page("/dialogs")
        original_window = self.driver.current_window_handle
        self.driver.find_element(By.LINK_TEXT, "Open test page").click()
        self.wait.until(lambda driver: len(driver.window_handles) == 2)
        popup = next(handle for handle in self.driver.window_handles
                     if handle != original_window)
        self.driver.switch_to.window(popup)
        self.wait.until(lambda driver: "Popup test page" in driver.page_source)
        self.assertIn("Popup test page", self.driver.page_source)
        self.driver.close()
        self.driver.switch_to.window(original_window)

        self.open_page("/browser-tools")
        self.driver.find_element(
            By.CSS_SELECTOR, "button[aria-label='Download sample CSV']"
        ).click()
        self.wait.until(EC.visibility_of_element_located(
            (By.CSS_SELECTOR, ".toast")))
        self.wait.until(
            EC.frame_to_be_available_and_switch_to_it(
                (By.CSS_SELECTOR, '[data-testid="practice-iframe"]')
            )
        )
        self.driver.find_element(By.ID, "frame-action").click()
        result = self.driver.find_element(By.ID, "result")
        self.assertIn("clicked successfully", result.text)
        self.driver.switch_to.default_content()

        health = requests.get(f"{self.base_url}/api/health", timeout=10)
        self.assertEqual(health.status_code, 200)
        self.assertEqual(health.json()["status"], "ok")

        users = requests.get(
            f"{self.base_url}/api/users",
            params={"search": "Olivia Chen"},
            timeout=10,
        )
        self.assertEqual(users.status_code, 200)
        self.assertEqual(users.json()["data"][0]["name"], "Olivia Chen")

        api_login = requests.post(
            f"{self.base_url}/api/auth/login",
            json={"email": "demo@testlab.dev", "password": "Test123!"},
            timeout=10,
        )
        self.assertEqual(api_login.status_code, 200)
        self.assertTrue(api_login.json()["token"])

        echo = requests.post(
            f"{self.base_url}/api/test/echo",
            json={"message": "selenium-python"},
            timeout=10,
        )
        self.assertEqual(echo.status_code, 200)
        self.assertEqual(echo.json()["body"]["message"], "selenium-python")

        self.open_page("/api-workbench")
        self.wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//h2[normalize-space()='Available test endpoints']")))
        self.open_page("/automation-code")
        self.wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//h1[normalize-space()='Automation code']")))


if __name__ == "__main__":
    unittest.main()`,
  },
  "Selenium · Java": {
    language: "java",
    install: "Add org.seleniumhq.selenium:selenium-java and org.junit.jupiter:junit-jupiter to your Maven project.",
    file: "src/test/java/TestLabEndToEndTest.java",
    structure: `selenium-java/
  pom.xml
  src/
    test/
      java/
        TestLabEndToEndTest.java`,
    run: "mvn test",
    code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

class TestLabEndToEndTest {
  private WebDriver driver;
  private WebDriverWait wait;
  private final HttpClient httpClient = HttpClient.newHttpClient();
  private final String baseUrl = System.getenv().getOrDefault(
      "TESTLAB_URL", "http://localhost:5173");

  private HttpResponse<String> apiRequest(String method, String path, String body)
      throws Exception {
    HttpRequest.Builder builder = HttpRequest.newBuilder()
        .uri(URI.create(baseUrl + path))
        .header("Content-Type", "application/json");
    if (body == null) {
      builder.GET();
    } else {
      builder.method(method, HttpRequest.BodyPublishers.ofString(body));
    }
    return httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
  }

  private void openPage(String path) {
    driver.findElement(By.CSS_SELECTOR,
        ".side-nav a[href='" + path + "']").click();
  }

  @BeforeEach
  void setUp() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless=new");
    driver = new ChromeDriver(options);
    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  }

  @AfterEach
  void tearDown() {
    if (driver != null) driver.quit();
  }

  @Test
  void loginAndExerciseDynamicTableAndIframe() {
    driver.get(baseUrl + "/login");
    driver.findElement(By.id("login-email")).sendKeys("demo@testlab.dev");
    driver.findElement(By.id("login-password")).sendKeys("Test123!");
    driver.findElement(By.cssSelector(".login-submit")).click();
    wait.until(ExpectedConditions.urlContains("/home"));
    String sessionUser = (String) ((JavascriptExecutor) driver).executeScript(
        "return sessionStorage.getItem('testlab-user')");
    Assertions.assertNotNull(sessionUser);
    Assertions.assertTrue(sessionUser.contains("demo@testlab.dev"));

    openPage("/dynamic");
    driver.findElement(By.xpath(
        "//button[contains(., 'Load after 1.7 seconds')]")).click();
    WebElement delayed = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.cssSelector("[data-testid='delayed-element']")));
    Assertions.assertTrue(delayed.getText().contains("delayed content"));

    openPage("/tables");
    WebElement search = driver.findElement(
        By.cssSelector("input[aria-label='Search table']"));
    search.sendKeys("Olivia Chen");
    WebElement row = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//strong[normalize-space()='Olivia Chen']")));
    Assertions.assertTrue(row.isDisplayed());

    openPage("/dialogs");
    driver.findElement(By.xpath(
        "//button[contains(., 'Open modal dialog')]")).click();
    WebElement dialog = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.cssSelector("[role='dialog']")));
    dialog.findElement(By.xpath(".//button[normalize-space()='Confirm']")).click();
    wait.until(ExpectedConditions.invisibilityOfElementLocated(
        By.cssSelector("[role='dialog']")));

    openPage("/widgets");
    new Select(driver.findElement(By.name("country"))).selectByVisibleText("Canada");
    new Select(driver.findElement(By.name("role"))).selectByVisibleText("QA Engineer");
    driver.findElement(By.cssSelector(
        "input[name='experience'][value='Advanced']")).click();
    driver.findElement(By.xpath("//button[contains(., 'Submit form')]")).click();
    wait.until(ExpectedConditions.textToBePresentInElementLocated(
        By.cssSelector(".submission-summary"), "Form submitted"));

    openPage("/dialogs");
    String originalWindow = driver.getWindowHandle();
    driver.findElement(By.linkText("Open test page")).click();
    wait.until(d -> d.getWindowHandles().size() == 2);
    String popup = driver.getWindowHandles().stream()
        .filter(handle -> !handle.equals(originalWindow)).findFirst().orElseThrow();
    driver.switchTo().window(popup);
    wait.until(d -> d.getPageSource().contains("Popup test page"));
    Assertions.assertTrue(driver.getPageSource().contains("Popup test page"));
    driver.close();
    driver.switchTo().window(originalWindow);

    openPage("/browser-tools");
    driver.findElement(By.cssSelector(
        "button[aria-label='Download sample CSV']")).click();
    wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.cssSelector(".toast")));
    wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(
        By.cssSelector("[data-testid='practice-iframe']")));
    driver.findElement(By.id("frame-action")).click();
    Assertions.assertTrue(driver.findElement(By.id("result"))
        .getText().contains("clicked successfully"));
    driver.switchTo().defaultContent();

    try {
      HttpResponse<String> health = apiRequest("GET", "/api/health", null);
      Assertions.assertEquals(200, health.statusCode());
      Assertions.assertTrue(health.body().contains("\\"status\\":\\"ok\\""));

      HttpResponse<String> users = apiRequest(
          "GET", "/api/users?search=Olivia%20Chen", null);
      Assertions.assertEquals(200, users.statusCode());
      Assertions.assertTrue(users.body().contains("Olivia Chen"));

      HttpResponse<String> apiLogin = apiRequest(
          "POST", "/api/auth/login",
          "{\\"email\\":\\"demo@testlab.dev\\",\\"password\\":\\"Test123!\\"}");
      Assertions.assertEquals(200, apiLogin.statusCode());
      Assertions.assertTrue(apiLogin.body().contains("\\"token\\""));

      HttpResponse<String> echo = apiRequest(
          "POST", "/api/test/echo", "{\\"message\\":\\"selenium-java\\"}");
      Assertions.assertEquals(200, echo.statusCode());
      Assertions.assertTrue(echo.body().contains("selenium-java"));
    } catch (Exception error) {
      throw new AssertionError("API checks failed", error);
    }

    openPage("/api-workbench");
    wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//h2[normalize-space()='Available test endpoints']")));
    openPage("/automation-code");
    wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.xpath("//h1[normalize-space()='Automation code']")));
  }
}`,
  },
  "Playwright · Python": {
    language: "python",
    install: "python -m pip install playwright pytest pytest-playwright\npython -m playwright install chromium",
    file: "tests/test_testlab_e2e.py",
    structure: `playwright-python/
  tests/
    test_testlab_e2e.py`,
    run: "pytest -v",
    code: `import os
from playwright.sync_api import Page, expect

BASE_URL = os.getenv("TESTLAB_URL", "http://localhost:5173")


def open_page(page: Page, name: str):
    page.locator(".side-nav").get_by_role("link", name=name).click()


def test_full_playground_journey(page: Page):
    page.goto(f"{BASE_URL}/login")
    page.get_by_label("Email address").fill("demo@testlab.dev")
    page.get_by_label("Password").fill("Test123!")
    page.get_by_role("button", name="Sign in to your workspace").click()
    page.wait_for_url(f"{BASE_URL}/home")
    session_user = page.evaluate(
        "() => JSON.parse(sessionStorage.getItem('testlab-user'))"
    )
    assert session_user["email"] == "demo@testlab.dev"

    open_page(page, "Dynamic elements")
    page.get_by_role("button", name="Load after 1.7 seconds").click()
    expect(page.get_by_test_id("delayed-element")).to_contain_text(
        "The delayed content just arrived."
    )

    open_page(page, "Data tables")
    page.get_by_role("textbox", name="Search table").fill("Olivia Chen")
    expect(page.get_by_role("row").filter(has_text="Olivia Chen")).to_be_visible()

    open_page(page, "Dialogs & alerts")
    page.get_by_role("button", name="Open modal dialog").click()
    dialog = page.get_by_role("dialog")
    expect(dialog).to_be_visible()
    dialog.get_by_role("button", name="Confirm").click()
    expect(dialog).not_to_be_visible()

    open_page(page, "Form widgets")
    page.get_by_label("Country").select_option(label="Canada")
    page.get_by_label("Role").select_option(label="QA Engineer")
    page.get_by_label("Advanced").check()
    page.get_by_role("button", name="Submit form").click()
    expect(page.get_by_role("status").filter(has_text="Form submitted")).to_be_visible()

    open_page(page, "Dialogs & alerts")
    with page.expect_popup() as popup_info:
        page.get_by_role("link", name="Open test page").click()
    popup = popup_info.value
    expect(popup.get_by_role("heading", name="Popup test page")).to_be_visible()
    popup.close()

    open_page(page, "Browser tools")
    with page.expect_download() as download_info:
        page.get_by_role("button", name="Download sample CSV").click()
    assert download_info.value.suggested_filename == "testlab-sample.csv"
    frame = page.frame_locator('[data-testid="practice-iframe"]')
    frame.get_by_role("button", name="Click inside the frame").click()
    expect(frame.get_by_role("status")).to_contain_text("clicked successfully")

    health = page.request.get(f"{BASE_URL}/api/health")
    assert health.ok, f"API health check returned {health.status}"
    assert health.json()["status"] == "ok"

    users = page.request.get(
        f"{BASE_URL}/api/users", params={"search": "Olivia Chen"}
    )
    assert users.ok
    assert users.json()["data"][0]["name"] == "Olivia Chen"

    api_login = page.request.post(
        f"{BASE_URL}/api/auth/login",
        data={"email": "demo@testlab.dev", "password": "Test123!"},
    )
    assert api_login.status == 200
    assert api_login.json()["token"]

    echo = page.request.post(
        f"{BASE_URL}/api/test/echo", data={"message": "playwright-python"}
    )
    assert echo.ok
    assert echo.json()["body"]["message"] == "playwright-python"

    open_page(page, "API workbench")
    expect(page.get_by_role("heading", name="Available test endpoints")).to_be_visible()
    open_page(page, "Automation code")
    expect(page.get_by_role("heading", name="Automation code")).to_be_visible()`,
  },
  "Playwright · Java": {
    language: "java",
    install: "Add com.microsoft.playwright:playwright and org.junit.jupiter:junit-jupiter to your Maven project.",
    file: "src/test/java/TestLabEndToEndTest.java",
    structure: `playwright-java/
  pom.xml
  src/
    test/
      java/
        TestLabEndToEndTest.java`,
    run: "mvn test",
    code: `import com.microsoft.playwright.*;
import com.microsoft.playwright.options.RequestOptions;
import java.util.Map;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class TestLabEndToEndTest {
  private Playwright playwright;
  private Browser browser;
  private Page page;
  private final String baseUrl = System.getenv().getOrDefault(
      "TESTLAB_URL", "http://localhost:5173");

  private void openPage(String name) {
    page.locator(".side-nav").getByRole(AriaRole.LINK,
        new Page.GetByRoleOptions().setName(name)).click();
  }

  @BeforeEach
  void setUp() {
    playwright = Playwright.create();
    browser = playwright.chromium().launch(
        new BrowserType.LaunchOptions().setHeadless(true));
    page = browser.newPage();
  }

  @AfterEach
  void tearDown() {
    browser.close();
    playwright.close();
  }

  @Test
  void fullPlaygroundJourney() {
    page.navigate(baseUrl + "/login");
    page.getByLabel("Email address").fill("demo@testlab.dev");
    page.getByLabel("Password").fill("Test123!");
    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Sign in to your workspace")).click();
    page.waitForURL(baseUrl + "/home");
    String sessionUser = (String) page.evaluate(
        "() => sessionStorage.getItem('testlab-user')");
    assertNotNull(sessionUser);
    assertTrue(sessionUser.contains("demo@testlab.dev"));

    openPage("Dynamic elements");
    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Load after 1.7 seconds")).click();
    assertTrue(page.getByTestId("delayed-element").textContent()
        .contains("The delayed content just arrived."));

    openPage("Data tables");
    page.getByRole(AriaRole.TEXTBOX,
        new Page.GetByRoleOptions().setName("Search table")).fill("Olivia Chen");
    assertTrue(page.locator(".data-table").textContent().contains("Olivia Chen"));

    openPage("Dialogs & alerts");
    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Open modal dialog")).click();
    Locator dialog = page.getByRole(AriaRole.DIALOG);
    assertTrue(dialog.isVisible());
    dialog.getByRole(AriaRole.BUTTON,
        new Locator.GetByRoleOptions().setName("Confirm")).click();

    openPage("Form widgets");
    page.locator("select[name='country']").selectOption("Canada");
    page.locator("select[name='role']").selectOption("QA Engineer");
    page.getByLabel("Advanced").check();
    page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Submit form")).click();
    assertTrue(page.getByRole(AriaRole.STATUS).textContent().contains("Form submitted"));

    openPage("Dialogs & alerts");
    Page popup = page.waitForPopup(() -> page.getByRole(AriaRole.LINK,
        new Page.GetByRoleOptions().setName("Open test page")).click());
    assertTrue(popup.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Popup test page")).isVisible());
    popup.close();

    openPage("Browser tools");
    Download download = page.waitForDownload(() -> page.getByRole(AriaRole.BUTTON,
        new Page.GetByRoleOptions().setName("Download sample CSV")).click());
    assertTrue(download.suggestedFilename().equals("testlab-sample.csv"));
    FrameLocator frame = page.frameLocator("[data-testid='practice-iframe']");
    frame.getByRole(AriaRole.BUTTON,
        new FrameLocator.GetByRoleOptions().setName("Click inside the frame")).click();
    assertTrue(frame.getByRole(AriaRole.STATUS).textContent()
        .contains("clicked successfully"));

    APIResponse health = page.request().get(baseUrl + "/api/health");
    assertTrue(health.ok(), "API health check should succeed");
    assertTrue(health.text().contains("\\"status\\":\\"ok\\""));

    APIResponse users = page.request().get(
        baseUrl + "/api/users?search=Olivia%20Chen");
    assertTrue(users.ok());
    assertTrue(users.text().contains("Olivia Chen"));

    APIResponse apiLogin = page.request().post(
        baseUrl + "/api/auth/login",
        RequestOptions.create().setData(
            Map.of("email", "demo@testlab.dev", "password", "Test123!")));
    assertEquals(200, apiLogin.status());
    assertTrue(apiLogin.text().contains("\\"token\\""));

    APIResponse echo = page.request().post(
        baseUrl + "/api/test/echo",
        RequestOptions.create().setData(Map.of("message", "playwright-java")));
    assertTrue(echo.ok());
    assertTrue(echo.text().contains("playwright-java"));

    openPage("API workbench");
    assertTrue(page.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Available test endpoints")).isVisible());
    openPage("Automation code");
    assertTrue(page.getByRole(AriaRole.HEADING,
        new Page.GetByRoleOptions().setName("Automation code")).isVisible());
  }
}`,
  },
  "Playwright · JavaScript": {
  language: "javascript",
  install: "npm init -y\nnpm install --save-dev @playwright/test\nnpx playwright install chromium",
  file: "tests/testlab.spec.js",
  structure: `playwright-javascript/
  package.json
  tests/
    testlab.spec.js`,
  run: "npx playwright test",
  code: `import { test, expect } from "@playwright/test";

const baseURL = process.env.TESTLAB_URL ?? "http://localhost:5173";
const openPage = (page, path) =>
  page.locator(".side-nav").locator(\`a[href="\${path}"]\`).click();

test("exercise the full TestLab playground", async ({ page }) => {
  await page.goto(\`\${baseURL}/login\`);
  await page.getByLabel("Email address").fill("demo@testlab.dev");
  await page.getByLabel("Password").fill("Test123!");
  await page.getByRole("button", { name: "Sign in to your workspace" }).click();
  await expect(page).toHaveURL(\`\${baseURL}/home\`);
  const sessionUser = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("testlab-user") ?? "null")
  );
  expect(sessionUser.email).toBe("demo@testlab.dev");

  await openPage(page, "/dynamic");
  await page.getByRole("button", { name: "Load after 1.7 seconds" }).click();
  await expect(page.getByTestId("delayed-element"))
  .toContainText("The delayed content just arrived.");
  await page.locator(".hover-primary").hover();
  await expect(page.getByText("You found the hover state!")).toBeVisible();

  await openPage(page, "/tables");
  await page.getByRole("textbox", { name: "Search table" }).fill("Olivia Chen");
  await expect(page.getByRole("row").filter({ hasText: "Olivia Chen" })).toBeVisible();

  await openPage(page, "/dialogs");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Show alert" }).click();
  await page.getByRole("button", { name: "Open modal dialog" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Confirm" }).click();
  await expect(dialog).not.toBeVisible();

  await openPage(page, "/widgets");
  await page.getByLabel("Country").selectOption({ label: "Canada" });
  await page.getByLabel("Role").selectOption({ label: "QA Engineer" });
  await page.getByLabel("Advanced").check();
  await page.getByRole("button", { name: "Submit form" }).click();
  await expect(page.locator(".submission-summary")).toContainText("Form submitted");

  await openPage(page, "/dialogs");
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "Open test page" }).click();
  const popup = await popupPromise;
  await expect(popup.getByRole("heading", { name: "Popup test page" })).toBeVisible();
  await popup.close();

  await openPage(page, "/browser-tools");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download sample CSV" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe("testlab-sample.csv");
  const frame = page.frameLocator('[data-testid="practice-iframe"]');
  await frame.getByRole("button", { name: "Click inside the frame" }).click();
  await expect(frame.getByRole("status")).toContainText("clicked successfully");

  const health = await page.request.get(\`\${baseURL}/api/health\`);
  expect(health.ok()).toBeTruthy();
  expect((await health.json()).status).toBe("ok");

  const users = await page.request.get(
    \`\${baseURL}/api/users?search=Olivia%20Chen\`
  );
  expect(users.ok()).toBeTruthy();
  expect((await users.json()).data[0].name).toBe("Olivia Chen");

  const apiLogin = await page.request.post(\`\${baseURL}/api/auth/login\`, {
    data: { email: "demo@testlab.dev", password: "Test123!" },
  });
  expect(apiLogin.status()).toBe(200);
  expect((await apiLogin.json()).token).toBeTruthy();

  const echo = await page.request.post(\`\${baseURL}/api/test/echo\`, {
    data: { message: "playwright-javascript" },
  });
  expect(echo.ok()).toBeTruthy();
  expect((await echo.json()).body.message).toBe("playwright-javascript");

  await openPage(page, "/api-workbench");
  await expect(page.getByRole("heading", { name: "Available test endpoints" }))
  .toBeVisible();
  await openPage(page, "/automation-code");
  await expect(page.getByRole("heading", { name: "Automation code" })).toBeVisible();
});`,
  },
  "Playwright · TypeScript": {
  language: "typescript",
  install: "npm init -y\nnpm install --save-dev @playwright/test\nnpx playwright install chromium",
  file: "tests/testlab.spec.ts",
  structure: `playwright-typescript/
  package.json
  tests/
    testlab.spec.ts`,
  run: "npx playwright test",
  code: `import { test, expect, type Page } from "@playwright/test";

const baseURL = process.env.TESTLAB_URL ?? "http://localhost:5173";

async function openPage(page: Page, path: string): Promise<void> {
  await page.locator(".side-nav").locator(\`a[href="\${path}"]\`).click();
}

test("exercise the full TestLab playground", async ({ page }) => {
  await page.goto(\`\${baseURL}/login\`);
  await page.getByLabel("Email address").fill("demo@testlab.dev");
  await page.getByLabel("Password").fill("Test123!");
  await page.getByRole("button", { name: "Sign in to your workspace" }).click();
  await expect(page).toHaveURL(\`\${baseURL}/home\`);
  const sessionUser = await page.evaluate(() => {
    const storedUser = sessionStorage.getItem("testlab-user");
    return storedUser ? JSON.parse(storedUser) as { email: string } : null;
  });
  expect(sessionUser?.email).toBe("demo@testlab.dev");

  await openPage(page, "/dynamic");
  await page.getByRole("button", { name: "Load after 1.7 seconds" }).click();
  await expect(page.getByTestId("delayed-element"))
  .toContainText("The delayed content just arrived.");
  await page.locator(".hover-primary").hover();
  await expect(page.getByText("You found the hover state!")).toBeVisible();

  await openPage(page, "/tables");
  await page.getByRole("textbox", { name: "Search table" }).fill("Olivia Chen");
  await expect(page.getByRole("row").filter({ hasText: "Olivia Chen" })).toBeVisible();

  await openPage(page, "/dialogs");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Show alert" }).click();
  await page.getByRole("button", { name: "Open modal dialog" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Confirm" }).click();
  await expect(dialog).not.toBeVisible();

  await openPage(page, "/widgets");
  await page.getByLabel("Country").selectOption({ label: "Canada" });
  await page.getByLabel("Role").selectOption({ label: "QA Engineer" });
  await page.getByLabel("Advanced").check();
  await page.getByRole("button", { name: "Submit form" }).click();
  await expect(page.locator(".submission-summary")).toContainText("Form submitted");

  await openPage(page, "/dialogs");
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "Open test page" }).click();
  const popup = await popupPromise;
  await expect(popup.getByRole("heading", { name: "Popup test page" })).toBeVisible();
  await popup.close();

  await openPage(page, "/browser-tools");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download sample CSV" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe("testlab-sample.csv");
  const frame = page.frameLocator('[data-testid="practice-iframe"]');
  await frame.getByRole("button", { name: "Click inside the frame" }).click();
  await expect(frame.getByRole("status")).toContainText("clicked successfully");

  const health = await page.request.get(\`\${baseURL}/api/health\`);
  expect(health.ok()).toBeTruthy();
  expect((await health.json()).status).toBe("ok");

  const users = await page.request.get(
    \`\${baseURL}/api/users?search=Olivia%20Chen\`
  );
  expect(users.ok()).toBeTruthy();
  expect((await users.json()).data[0].name).toBe("Olivia Chen");

  const apiLogin = await page.request.post(\`\${baseURL}/api/auth/login\`, {
    data: { email: "demo@testlab.dev", password: "Test123!" },
  });
  expect(apiLogin.status()).toBe(200);
  expect((await apiLogin.json()).token).toBeTruthy();

  const echo = await page.request.post(\`\${baseURL}/api/test/echo\`, {
    data: { message: "playwright-typescript" },
  });
  expect(echo.ok()).toBeTruthy();
  expect((await echo.json()).body.message).toBe("playwright-typescript");

  await openPage(page, "/api-workbench");
  await expect(page.getByRole("heading", { name: "Available test endpoints" }))
  .toBeVisible();
  await openPage(page, "/automation-code");
  await expect(page.getByRole("heading", { name: "Automation code" })).toBeVisible();
});`,
  },
};

function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  return (
    <ToastContext.Provider value={setToast}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toast && <div className={`toast toast-${toast.type}`} role="status"><CheckCircle2 size={17} />{toast.message}<button onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={15} /></button></div>}
      </div>
    </ToastContext.Provider>
  );
}

const ToastContext = createContext(() => {});
const useToast = () => useContext(ToastContext);
const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("testlab-theme");
    return savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("testlab-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0d1420" : "#f6f7f9");
  }, [theme]);

  const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const nextTheme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;
  return <button className={`theme-toggle ${className}`} type="button" onClick={toggleTheme} aria-label={`Switch to ${nextTheme} theme`} aria-pressed={theme === "dark"} title={`Switch to ${nextTheme} theme`}><Icon size={16} /><span>{theme === "dark" ? "Light" : "Dark"} mode</span></button>;
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/popup" element={<PopupPage />} />
          <Route path="/" element={<Navigate to={sessionStorage.getItem("testlab-user") ? "/home" : "/login"} replace />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/dynamic" element={<DynamicPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/dialogs" element={<DialogsPage />} />
            <Route path="/widgets" element={<WidgetsPage />} />
            <Route path="/browser-tools" element={<BrowserToolsPage />} />
            <Route path="/api-workbench" element={<ApiWorkbenchPage />} />
            <Route path="/automation-code" element={<AutomationCodePage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </ThemeProvider>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const notify = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("testlab-user")) navigate("/home", { replace: true });
  }, [navigate]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!event.currentTarget.reportValidity()) return;
    if (email.trim().toLowerCase() !== demoCredentials.email || password !== demoCredentials.password) {
      setError("Those credentials don't match. Try the demo account below.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      sessionStorage.setItem("testlab-user", JSON.stringify({ name: "Jordan Davis", email: demoCredentials.email }));
      notify({ type: "success", message: "Welcome back! You’re signed in." });
      navigate("/home", { replace: true });
    }, 650);
  }

  return (
    <main className="login-screen">
      <div className="login-decoration decor-one" /><div className="login-decoration decor-two" />
      <Link className="brand login-brand" to="/login"><span className="brand-mark"><Blocks size={19} /></span><span>Test<span className="brand-accent">Lab</span><small>AUTOMATION PLAYGROUND</small></span></Link>
      <ThemeToggle className="login-theme-toggle" />
      <div className="login-grid">
        <section className="login-story">
          <div className="eyebrow"><span className="eyebrow-pip" /> YOUR BROWSER AUTOMATION SANDBOX</div>
          <h1>Test smarter.<br /><span>Ship with</span><br /><em>confidence.</em></h1>
          <p>A hands-on playground for the real interactions your browser tests need to handle.</p>
          <div className="login-feature-list"><span><CheckCircle2 size={16} /> Realistic test scenarios</span><span><CheckCircle2 size={16} /> No backend required</span><span><CheckCircle2 size={16} /> Ready for your favorite tools</span></div>
          <div className="login-code-card"><span className="code-dots"><i /><i /><i /></span><code><b>await</b> page.<strong>getByLabel</strong>(<i>'Email'</i>)<br />&nbsp;&nbsp;.<strong>fill</strong>(<i>'demo@testlab.dev'</i>);<br /><b>await</b> page.<strong>getByRole</strong>(<i>'button'</i>)<br />&nbsp;&nbsp;.<strong>click</strong>();</code><span className="code-badge"><Zap size={12} /> PLAYWRIGHT READY</span></div>
        </section>
        <section className="login-card">
          <div className="login-card-icon"><ShieldCheck size={20} /></div>
          <div className="eyebrow">WELCOME BACK</div><h2>Sign in to TestLab</h2><p className="login-subtitle">Use the demo account to enter the playground.</p>
          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="login-email">Email address</label>
            <div className="input-wrap"><UserRound size={16} /><input id="login-email" data-testid="login-email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></div>
            <label className="field-label" htmlFor="login-password">Password</label>
            <div className="input-wrap"><ShieldCheck size={16} /><input id="login-password" data-testid="login-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required minLength={6} /><button className="icon-button password-eye" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            {error && <div className="form-alert" role="alert">{error}</div>}
            <button className="button button-primary login-submit" type="submit" disabled={loading}>{loading ? <><LoaderCircle size={16} className="spin" /> Signing you in…</> : <>Sign in to your workspace <ArrowRight size={16} /></>}</button>
          </form>
          <div className="login-divider"><span>DEMO ACCESS</span></div>
          <div className="demo-credentials"><div><span>EMAIL</span><code>demo@testlab.dev</code><button className="icon-button" type="button" onClick={() => { setEmail(demoCredentials.email); setPassword(demoCredentials.password); notify({ type: "info", message: "Demo credentials filled in." }); }} aria-label="Fill demo credentials"><Copy size={14} /></button></div><div><span>PASSWORD</span><code>Test123!</code><span className="ready-check"><Check size={14} /></span></div></div>
          <p className="privacy-note"><ShieldCheck size={13} /> Demo only. Nothing is sent to a server.</p>
        </section>
      </div>
      <footer className="login-footer"><span>© {new Date().getFullYear()} TestLab Playground</span><DeveloperCredit /><span>Built for better tests <Sparkles size={13} /></span></footer>
    </main>
  );
}

function ProtectedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileNav, setMobileNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("testlab-user") || "null"); } catch { return null; }
  });
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  function logout() {
    sessionStorage.removeItem("testlab-user");
    setUser(null);
    navigate("/login", { replace: true });
  }
  return (
    <div className="app-shell">
      <aside id="primary-sidebar" className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <Link className="brand app-brand" to="/home"><span className="brand-mark"><Blocks size={18} /></span><span>Test<span className="brand-accent">Lab</span><small>AUTOMATION PLAYGROUND</small></span></Link>
        <div className="side-workspace"><span className="workspace-avatar">T</span><span><strong>Test workspace</strong><small>Personal sandbox</small></span><ChevronDown size={14} /></div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item, index) => <div key={item.path}>{item.section && <span className={`side-section-label ${index ? "section-gap" : ""}`}>{item.section}</span>}<NavLink to={item.path} onClick={() => setMobileNav(false)} className={({ isActive }) => `side-link${isActive ? " side-link-active" : ""}`}><item.icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.path === "/dynamic" && <span className="new-badge">NEW</span>}</NavLink></div>)}
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-help"><span className="help-icon"><CircleHelp size={17} /></span><span><strong>Need a hand?</strong><small>Explore the test guides.</small></span><ArrowRight size={14} /></div><button className="side-link logout-button" onClick={logout}><LogOut size={16} /><span>Sign out</span></button><span className="sidebar-version">TESTLAB PLAYGROUND <span>v2.0</span></span></div>
      </aside>
      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
      <div className="app-main">
        <header className="topbar"><button className="mobile-menu-button icon-button" onClick={() => setMobileNav((value) => !value)} aria-label="Toggle navigation" aria-expanded={mobileNav} aria-controls="primary-sidebar"><Menu size={19} /></button><div className="breadcrumbs"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{navigation.find((item) => item.path === location.pathname)?.label || "Overview"}</strong></div><div className="topbar-actions"><span className="live-status"><i /> All systems operational</span><button className="theme-icon-toggle icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} aria-pressed={theme === "dark"} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button><button className="icon-button notification-button" onClick={() => window.alert("You're all caught up!")} aria-label="Notifications"><Bell size={17} /><i /></button><div className="profile-area"><button className="profile-button" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}><span className="profile-avatar">JD</span><span className="profile-name">{user.name}</span><ChevronDown size={14} /></button>{profileOpen && <div className="profile-menu"><strong>{user.name}</strong><small>{user.email}</small><button onClick={logout}><LogOut size={14} /> Sign out</button></div>}</div></div></header>
        <main className="page-content" key={location.pathname}><Outlet /><footer className="app-footer"><span>TestLab is a full-stack API and browser automation playground.</span><DeveloperCredit /><span>Demo data resets when the API server restarts.</span></footer></main>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, children, action }) {
  return <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-pip" />{eyebrow}</div><h1>{title}</h1><p>{children}</p></div>{action && <div className="page-heading-action">{action}</div>}</div>;
}

const scenarios = [
  { path: "/dynamic", title: "Dynamic elements", description: "Delayed loading, toggles, spinners and hover targets.", icon: Zap, color: "violet", label: "INTERACTIONS", count: "08 TESTS" },
  { path: "/tables", title: "Data tables", description: "Search, sorting, pagination, row selection and CRUD.", icon: Table2, color: "blue", label: "DATA & CONTROLS", count: "12 RECORDS" },
  { path: "/dialogs", title: "Dialogs & alerts", description: "Browser prompts, custom modals and toast notifications.", icon: PanelTop, color: "amber", label: "BROWSER EVENTS", count: "05 TESTS" },
  { path: "/widgets", title: "Form widgets", description: "Dropdowns, radio groups, dates and file uploads.", icon: Settings2, color: "green", label: "FORM CONTROLS", count: "06 INPUTS" },
  { path: "/browser-tools", title: "Browser tools", description: "Iframes, downloads, hover states and new tabs.", icon: Globe2, color: "rose", label: "BROWSER APIS", count: "05 TESTS" },
  { path: "/api-workbench", title: "API workbench", description: "Make HTTP requests and inspect real API responses.", icon: Server, color: "green", label: "REST API", count: "14 ROUTES" },
];

function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("testlab-user") || '{"name":"Tester"}');
  return <>
    <div className="welcome-banner"><div className="welcome-copy"><div className="eyebrow"><span className="eyebrow-pip" /> YOUR AUTOMATION SANDBOX</div><h1>Good to see you, {user.name.split(" ")[0]}<span className="wave">✳</span></h1><p>Your browser testing playground is ready. Pick a scenario and start exploring.</p><button className="button button-primary" onClick={() => navigate("/dynamic")}>Explore test scenarios <ArrowRight size={16} /></button><div className="welcome-decor">T</div></div><div className="welcome-side"><div className="welcome-side-orbit" /><div className="welcome-side-center"><Zap size={28} /></div><span className="orbit-chip chip-top"><CheckCircle2 size={13} /> READY</span><span className="orbit-chip chip-bottom"><Code2 size={13} /> TEST</span></div></div>
    <div className="stats-grid"><StatCard icon={Blocks} label="TEST SCENARIOS" value="06" note="Ready to explore" color="blue" /><StatCard icon={Server} label="API BACKEND" value="Express" note="REST endpoints available" color="green" /><StatCard icon={Activity} label="YOUR SESSION" value="Active" note="Demo account signed in" color="amber" /><StatCard icon={Clock3} label="SETUP TIME" value="Zero" note="Start testing right away" color="violet" /></div>
    <section className="scenario-section"><div className="section-title-row"><div><span className="eyebrow">SCENARIO LIBRARY</span><h2>What would you like to test?</h2><p>Real interactions for practicing robust browser and API automation.</p></div><span className="scenario-count">6 PRACTICE PAGES</span></div><div className="scenario-grid">{scenarios.map((scenario) => <ScenarioCard key={scenario.path} scenario={scenario} />)}</div></section>
    <section className="bottom-callout"><span className="callout-spark"><Sparkles size={18} /></span><div><strong>Test the frontend and a real REST API.</strong><p>Use the API workbench to send requests, trigger errors, and inspect responses from the Express backend.</p></div><button className="button button-soft" onClick={() => navigate("/api-workbench")}>Open API workbench <ArrowRight size={15} /></button></section>
  </>;
}

function StatCard({ icon: Icon, label, value, note, color }) {
  return <article className="stat-card"><span className={`stat-icon icon-${color}`}><Icon size={17} /></span><span className="stat-label">{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function ScenarioCard({ scenario }) {
  const Icon = scenario.icon;
  return <Link className="scenario-card" to={scenario.path}><div className="scenario-card-top"><span className={`scenario-icon icon-${scenario.color}`}><Icon size={18} /></span><span className="scenario-arrow"><ArrowUpRightIcon /></span></div><span className="scenario-label">{scenario.label}</span><h3>{scenario.title}</h3><p>{scenario.description}</p><span className="scenario-card-bottom"><span>{scenario.count}</span><span>Open scenario <ArrowRight size={14} /></span></span></Link>;
}
function ArrowUpRightIcon() { return <ExternalLink size={15} />; }

function Panel({ title, description, icon: Icon = Sparkles, children, className = "" }) {
  return <section className={`panel ${className}`}><div className="panel-heading"><div><h2>{title}</h2>{description && <p>{description}</p>}</div><span className="panel-icon"><Icon size={17} /></span></div>{children}</section>;
}
function Status({ children, tone = "" }) { return <div className={`inline-status ${tone ? `status-${tone}` : ""}`} role="status">{children}</div>; }
const Button = forwardRef(function Button({ children, variant = "secondary", className = "", ...props }, ref) {
  return <button ref={ref} className={`button button-${variant} ${className}`} {...props}>{children}</button>;
});

function DynamicPage() {
  const [shown, setShown] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("Everything is ready for your first interaction.");
  const [changes, setChanges] = useState(0);
  const [progress, setProgress] = useState(0);
  const timer = useRef(null);
  useEffect(() => () => window.clearInterval(timer.current), []);
  const notify = useToast();
  function simulateLoading() {
    if (loading) return;
    setLoading(true); setProgress(0);
    const start = Date.now();
    timer.current = window.setInterval(() => {
      const value = Math.min(100, Math.round(((Date.now() - start) / 2200) * 100));
      setProgress(value);
      if (value >= 100) {
        window.clearInterval(timer.current); setLoading(false);
        notify({ type: "success", message: "The async task completed successfully." });
      }
    }, 60);
  }
  function delayedContent() {
    setDelayed(false);
    window.setTimeout(() => setDelayed(true), 1700);
  }
  const messages = ["A new message, right on cue.", "That click changed the page.", "Automation can find this too."];
  return <>
    <PageHeader eyebrow="INTERACTIONS & TIMING" title="Dynamic elements">Practice waiting, hovering, loading, and interacting with content that changes.</PageHeader>
    <div className="content-grid">
      <Panel title="Show and hide" description="Reveal content or remove it from the page." icon={Eye}><div className="button-row"><Button variant="primary" onClick={() => setShown(true)}>Show element</Button><Button onClick={() => setShown(false)}>Hide element</Button></div><div className="dynamic-result" aria-live="polite">{shown ? <div className="revealed-box" data-testid="revealed-element"><CheckCircle2 size={17} /> Surprise! This element was added to the page.</div> : <span className="muted-text">The element is currently hidden.</span>}</div></Panel>
      <Panel title="Enable and disable" description="Toggle a target control’s interactive state." icon={MousePointer2}><div className="button-row"><Button onClick={() => setEnabled((value) => !value)}>{enabled ? "Disable button" : "Enable button"}</Button><Button variant="primary" disabled={!enabled} onClick={() => notify({ type: "success", message: "The enabled target button was clicked." })}>{enabled ? "Enabled button" : "Disabled button"}</Button></div><Status>Target button is {enabled ? "enabled" : "disabled"}.</Status></Panel>
      <Panel title="Delayed content" description="Wait for content that appears asynchronously." icon={Clock3}><div className="button-row"><Button variant="primary" onClick={delayedContent}><Clock3 size={14} /> Load after 1.7 seconds</Button></div><div className="dynamic-result" aria-live="polite">{delayed ? <div className="revealed-box" data-testid="delayed-element"><CheckCircle2 size={17} /> The delayed content just arrived.</div> : <span className="muted-text">Waiting to start.</span>}</div></Panel>
      <Panel title="Loading spinner" description="Trigger a task with a visible busy state and progress." icon={LoaderCircle}><Button variant="primary" disabled={loading} onClick={simulateLoading}>{loading ? <><LoaderCircle size={15} className="spin" /> Processing…</> : <>Start async task <ArrowRight size={15} /></>}</Button><div className="progress-track" role="progressbar" aria-label="Task progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div><Status>{loading ? `Processing task… ${progress}%` : progress === 100 ? "Task complete." : "Ready when you are."}</Status></Panel>
      <Panel title="Add and remove elements" description="Create uniquely labeled items and remove them." icon={Plus}><div className="button-row"><Button variant="primary" onClick={() => setItems((current) => [...current, current.length ? current[current.length - 1] + 1 : 1])}>Add item</Button><Button onClick={() => setItems((current) => current.slice(0, -1))}>Remove last</Button></div>{items.length ? <ul className="dynamic-list">{items.map((number) => <li key={number} data-testid="dynamic-list-item"><span>Dynamic item {number}</span><button className="icon-button" onClick={() => setItems((current) => current.filter((item) => item !== number))} aria-label={`Remove item ${number}`}><X size={14} /></button></li>)}</ul> : <div className="dynamic-result muted-text">No dynamic items yet.</div>}<Status>{items.length} items</Status></Panel>
      <Panel title="Hover to reveal" description="Move your pointer over each card to reveal its action." icon={MousePointer2}><div className="hover-demo-grid"><div className="hover-demo hover-primary" tabIndex={0}><span><Sparkles size={17} /></span><strong>Hover over me</strong><small>Discover the hidden details</small><div className="hover-reveal">You found the hover state! <ArrowRight size={13} /></div></div><div className="hover-demo hover-secondary" tabIndex={0}><span><Eye size={17} /></span><strong>Try keyboard focus</strong><small>Focusable hover interaction</small><div className="hover-reveal">Accessible for keyboard users <Check size={13} /></div></div></div></Panel>
      <Panel title="Change the message" description="Replace visible text and track each update." icon={Activity} className="panel-wide"><div className="message-box"><div><span className="eyebrow">CURRENT MESSAGE</span><p data-testid="changeable-message">{message}</p></div><span className="change-count">{changes} {changes === 1 ? "change" : "changes"}</span></div><Button onClick={() => { const next = changes + 1; setChanges(next); setMessage(messages[(next - 1) % messages.length]); }}>Change the message <ArrowRight size={14} /></Button></Panel>
    </div>
  </>;
}

const initialRows = [
  { id: 1, name: "Olivia Chen", email: "olivia.chen@example.com", role: "QA Engineer", department: "Engineering", status: "Active", joined: "2024-01-15" },
  { id: 2, name: "Noah Patel", email: "noah.patel@example.com", role: "Product Manager", department: "Product", status: "Active", joined: "2023-11-02" },
  { id: 3, name: "Ava Williams", email: "ava.williams@example.com", role: "Automation Tester", department: "Engineering", status: "Pending", joined: "2024-03-19" },
  { id: 4, name: "Liam Garcia", email: "liam.garcia@example.com", role: "UX Designer", department: "Design", status: "Active", joined: "2023-08-24" },
  { id: 5, name: "Sophia Kim", email: "sophia.kim@example.com", role: "Data Analyst", department: "Analytics", status: "Inactive", joined: "2022-12-05" },
  { id: 6, name: "Ethan Brown", email: "ethan.brown@example.com", role: "Developer", department: "Engineering", status: "Active", joined: "2024-02-12" },
  { id: 7, name: "Mia Johnson", email: "mia.johnson@example.com", role: "QA Engineer", department: "Quality", status: "Pending", joined: "2023-05-30" },
  { id: 8, name: "Lucas Martin", email: "lucas.martin@example.com", role: "Support Lead", department: "Support", status: "Active", joined: "2022-09-14" },
  { id: 9, name: "Amelia Davis", email: "amelia.davis@example.com", role: "Product Designer", department: "Design", status: "Inactive", joined: "2024-04-01" },
  { id: 10, name: "James Wilson", email: "james.wilson@example.com", role: "Developer", department: "Engineering", status: "Active", joined: "2023-06-21" },
  { id: 11, name: "Isabella Moore", email: "isabella.moore@example.com", role: "Recruiter", department: "People", status: "Active", joined: "2024-01-29" },
  { id: 12, name: "Benjamin Lee", email: "benjamin.lee@example.com", role: "Data Analyst", department: "Analytics", status: "Pending", joined: "2023-10-10" },
];

function TablesPage() {
  const [rows, setRows] = useState(() => {
    try { return JSON.parse(localStorage.getItem("testlab-table-records")) || initialRows; } catch { return initialRows; }
  });
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState({ key: "", direction: 1 });
  const [selected, setSelected] = useState([]);
  const notify = useToast();
  useEffect(() => { localStorage.setItem("testlab-table-records", JSON.stringify(rows)); }, [rows]);
  const filtered = useMemo(() => {
    const result = rows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase())));
    if (sort.key) result.sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key])) * sort.direction);
    return result;
  }, [rows, query, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function addRow() {
    const id = Math.max(0, ...rows.map((row) => row.id)) + 1;
    setRows((current) => [{ id, name: `New Tester ${id}`, email: `tester${id}@example.com`, role: "QA Tester", department: "Quality", status: "Active", joined: new Date().toISOString().slice(0, 10) }, ...current]);
    setPage(1);
    notify({ type: "success", message: "A new test record was added." });
  }
  function toggleSort(key) { setSort((current) => ({ key, direction: current.key === key ? current.direction * -1 : 1 })); setPage(1); }
  return <>
    <PageHeader eyebrow="DATA & CONTROLS" title="Data tables">Search, sort, select, paginate, and edit a realistic sample dataset.</PageHeader>
    <section className="panel table-panel"><div className="panel-heading table-panel-heading"><div><h2>Team directory</h2><p>Sample records with interactive table controls.</p></div><Button variant="primary" onClick={addRow}><Plus size={15} /> Add record</Button></div>
      <div className="table-toolbar"><label className="table-search"><Search size={15} /><input aria-label="Search table" placeholder="Search name, email or role…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label><label className="page-size-label">Show <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>5</option><option>10</option><option>20</option></select> entries</label></div>
      <div className="table-scroller"><table className="data-table"><thead><tr><th><input type="checkbox" aria-label="Select all visible rows" checked={visible.length > 0 && visible.every((row) => selected.includes(row.id))} onChange={(event) => setSelected((current) => event.target.checked ? [...new Set([...current, ...visible.map((row) => row.id)])] : current.filter((id) => !visible.some((row) => row.id === id)))} /></th>{[["name", "NAME"], ["role", "ROLE"], ["department", "DEPARTMENT"], ["status", "STATUS"], ["joined", "JOINED"]].map(([key, label]) => <th key={key}><button className="sort-button" onClick={() => toggleSort(key)}>{label}<ArrowDownUp size={12} className={sort.key === key ? "sort-active" : ""} />{sort.key === key && <span className="sr-only">{sort.direction === 1 ? "ascending" : "descending"}</span>}</button></th>)}<th>ACTION</th></tr></thead>
      <tbody>{visible.map((row) => <tr key={row.id}><td><input type="checkbox" aria-label={`Select ${row.name}`} checked={selected.includes(row.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, row.id] : current.filter((id) => id !== row.id))} /></td><td><div className="person-cell"><span className="person-avatar">{row.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span><strong>{row.name}</strong><small>{row.email}</small></span></div></td><td>{row.role}</td><td>{row.department}</td><td><span className={`status-badge badge-${row.status.toLowerCase()}`}><i />{row.status}</span></td><td>{row.joined}</td><td><button className="icon-button row-delete" aria-label={`Delete ${row.name}`} onClick={() => { setRows((current) => current.filter((item) => item.id !== row.id)); setSelected((current) => current.filter((id) => id !== row.id)); notify({ type: "info", message: `${row.name} was removed.` }); }}><Trash2 size={15} /></button></td></tr>)}</tbody></table>{visible.length === 0 && <div className="empty-table"><Search size={19} /><strong>No matching records</strong><span>Try another search term.</span></div>}</div>
      <div className="table-bottom"><span>{filtered.length ? <>Showing <strong>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> entries</> : "No matching entries"}{selected.length > 0 && <span className="selection-note"> · {selected.length} selected</span>}</span><div className="pagination"><button aria-label="Previous page" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={15} /></button>{Array.from({ length: pages }, (_, index) => index + 1).map((number) => <button key={number} aria-label={`Page ${number}`} aria-current={currentPage === number ? "page" : undefined} className={currentPage === number ? "page-current" : ""} onClick={() => setPage(number)}>{number}</button>)}<button aria-label="Next page" disabled={currentPage >= pages} onClick={() => setPage(currentPage + 1)}><ChevronRight size={15} /></button></div></div>
    </section>
  </>;
}

function DialogsPage() {
  const [modal, setModal] = useState(false);
  const notify = useToast();
  const modalTrigger = useRef(null);
  const closeModal = () => {
    setModal(false);
    window.setTimeout(() => modalTrigger.current?.focus(), 0);
  };
  useEffect(() => {
    if (!modal) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modal]);
  function nativeAlert() { window.alert("This is a native browser alert."); }
  function nativeConfirm() { const result = window.confirm("Do you want to confirm this action?"); notify({ type: result ? "success" : "info", message: result ? "You clicked OK." : "You clicked Cancel." }); }
  function nativePrompt() { const result = window.prompt("Enter a value to display:", "TestLab"); notify({ type: result === null ? "info" : "success", message: result === null ? "Prompt dismissed." : `You entered: ${result}` }); }
  return <>
    <PageHeader eyebrow="BROWSER EVENTS" title="Dialogs & alerts">Practice native browser prompts, accessible modals, notifications, and popups.</PageHeader>
    <div className="content-grid">
      <Panel title="Native browser dialogs" description="JavaScript alerts, confirm prompts, and input prompts." icon={Bell}><div className="dialog-action"><span><strong>Simple alert</strong><small>Dismiss the browser alert.</small></span><Button onClick={nativeAlert}>Show alert</Button></div><div className="dialog-action"><span><strong>Confirmation</strong><small>Choose OK or Cancel.</small></span><Button onClick={nativeConfirm}>Show confirm</Button></div><div className="dialog-action"><span><strong>Text prompt</strong><small>Enter a value or dismiss.</small></span><Button onClick={nativePrompt}>Show prompt</Button></div></Panel>
      <Panel title="Accessible modal" description="Test overlay, close, cancel, and confirm interactions." icon={PanelTop}><div className="modal-preview"><span className="scenario-icon icon-violet"><Sparkles size={18} /></span><div><strong>Custom modal dialog</strong><small>With keyboard escape-to-close.</small></div></div><Button ref={modalTrigger} variant="primary" onClick={() => setModal(true)}>Open modal dialog <ArrowRight size={14} /></Button></Panel>
      <Panel title="Toast notifications" description="Transient notices that appear and dismiss automatically." icon={CheckCircle2} className="panel-wide"><div className="button-row"><Button variant="primary" onClick={() => notify({ type: "success", message: "Action completed successfully." })}>Success toast</Button><Button onClick={() => notify({ type: "info", message: "Here is a little more information." })}>Info toast</Button><Button variant="danger" onClick={() => notify({ type: "error", message: "Something needs your attention." })}>Error toast</Button></div></Panel>
      <Panel title="Browser tab" description="Try new-tab navigation and browser context switching." icon={ExternalLink}><a className="button button-secondary" href="/popup" target="_blank" rel="noreferrer">Open test page <ExternalLink size={14} /></a><Status>A simple demo page opens in a new browser tab.</Status></Panel>
    </div>
    {modal && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}><section className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-heading" aria-describedby="modal-copy"><button className="icon-button modal-close" aria-label="Close modal" autoFocus onClick={closeModal}><X size={18} /></button><span className="scenario-icon icon-violet"><Sparkles size={19} /></span><h2 id="modal-heading">Ready to continue?</h2><p id="modal-copy">This is a sample accessible dialog. Choose an action to practice overlays and confirmation states.</p><div className="modal-actions"><Button onClick={() => { closeModal(); notify({ type: "info", message: "You cancelled the dialog." }); }}>Cancel</Button><Button variant="primary" onClick={() => { closeModal(); notify({ type: "success", message: "You confirmed the dialog." }); }}>Confirm</Button></div></section></div>}
  </>;
}

function PopupPage() {
  return <main className="popup-page"><div className="popup-card"><span className="brand-mark"><Blocks size={19} /></span><div className="eyebrow"><span className="eyebrow-pip" /> NEW BROWSER TAB</div><h1>Popup test page</h1><p>This separate page was opened from the dialogs scenario. Practice switching between tabs and verifying navigation.</p><button className="button button-primary" onClick={() => window.close()}><X size={15} /> Close this tab</button><span className="popup-url">/popup</span></div></main>;
}

function WidgetsPage() {
  const [submitted, setSubmitted] = useState(null);
  const [fileNames, setFileNames] = useState([]);
  const notify = useToast();
  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = { country: form.get("country") || "Not selected", role: form.get("role") || "Not selected", experience: form.get("experience") || "Not selected", areas: form.getAll("areas"), date: form.get("date") || "Not selected", tool: form.get("tool") || "Not entered" };
    setSubmitted(result);
    notify({ type: "success", message: "Form selections captured." });
  }
  return <>
    <PageHeader eyebrow="FORM CONTROLS" title="Form widgets">Explore native browser inputs, selection controls, autocomplete, and file inputs.</PageHeader>
    <form className="widget-grid" onSubmit={handleSubmit} onReset={() => { setSubmitted(null); setFileNames([]); }}>
      <Panel title="Choices & selections" description="Selects, radios, and multi-select checkboxes." icon={Filter}><div className="form-grid"><label className="control-label">Country<select className="form-control" name="country" defaultValue=""><option value="">Select a country</option><option>Australia</option><option>Canada</option><option>India</option><option>United Kingdom</option><option>United States</option></select></label><label className="control-label">Role<select className="form-control" name="role" defaultValue=""><option value="">Choose your role</option><optgroup label="Engineering"><option>QA Engineer</option><option>Developer</option><option>Automation Tester</option></optgroup><optgroup label="Other"><option>Product Manager</option><option>Student</option></optgroup></select></label></div><fieldset className="choice-fieldset"><legend>Testing experience</legend><div className="choice-options">{["Beginner", "Intermediate", "Advanced"].map((value) => <label className="choice-label" key={value}><input type="radio" name="experience" value={value} />{value}</label>)}</div></fieldset><fieldset className="choice-fieldset"><legend>Areas to practice</legend><div className="choice-options">{["Forms", "Tables", "Dialogs", "Dynamic content"].map((value) => <label className="choice-label" key={value}><input type="checkbox" name="areas" value={value} />{value}</label>)}</div></fieldset></Panel>
      <Panel title="Date & autocomplete" description="Native date fields and a suggestion list." icon={Clock3}><div className="form-grid"><label className="control-label">Preferred date<input className="form-control" name="date" type="date" /></label><label className="control-label">Preferred time<input className="form-control" name="time" type="time" /></label><label className="control-label form-span">Favorite testing tool<input className="form-control" name="tool" list="tool-suggestions" placeholder="Type to see suggestions" /><datalist id="tool-suggestions"><option value="Playwright" /><option value="Selenium" /><option value="Cypress" /><option value="WebdriverIO" /><option value="Puppeteer" /></datalist></label></div><div className="range-control"><label htmlFor="confidence-range">Confidence level <span>{submitted?.confidence || "50"}%</span></label><input id="confidence-range" name="confidence" type="range" min="0" max="100" defaultValue="50" onChange={(event) => { event.currentTarget.closest(".range-control").querySelector("span").textContent = `${event.target.value}%`; }} /></div></Panel>
      <Panel title="File selection" description="Choose local files to practice upload input handling." icon={Upload}><label className="file-drop" htmlFor="widget-files"><Upload size={20} /><strong>Choose files to attach</strong><small>Selected files never leave your browser.</small><input id="widget-files" type="file" multiple onChange={(event) => setFileNames(Array.from(event.target.files).map((file) => file.name))} /><span className="button button-secondary">Browse files</span></label><div className="file-summary" aria-live="polite">{fileNames.length ? `${fileNames.length} file${fileNames.length === 1 ? "" : "s"}: ${fileNames.join(", ")}` : "No files selected."}</div></Panel>
      <section className="panel widget-submit"><div className="panel-heading"><div><h2>Submit test form</h2><p>Capture and review your selections—nothing is submitted to a server.</p></div><span className="panel-icon"><CheckCircle2 size={17} /></span></div><div className="button-row"><Button variant="primary" type="submit">Submit form <ArrowRight size={15} /></Button><Button type="reset">Reset fields</Button></div>{submitted && <div className="submission-summary" role="status"><strong>Form submitted</strong><p>Country: {submitted.country} · Role: {submitted.role} · Experience: {submitted.experience} · Areas: {submitted.areas.join(", ") || "None selected"} · Date: {submitted.date} · Tool: {submitted.tool}</p></div>}</section>
    </form>
  </>;
}

const iframeMarkup = (label, dark) => `<!doctype html><html><head><style>body{font:14px 'DM Sans',sans-serif;margin:0;padding:22px;background:${dark ? "#151f2e" : "#f8faff"};color:${dark ? "#e3eaf4" : "#26344b"}}h2{font-size:18px;margin:0 0 8px}p{color:${dark ? "#a2afc1" : "#738096"};line-height:1.65}button{border:0;border-radius:6px;background:#5875cf;color:white;padding:9px 13px;cursor:pointer}#result{margin-top:12px;color:#62b99b}small{display:block;margin-top:16px;color:${dark ? "#8796aa" : "#98a3b1"}}</style></head><body><h2>${label}</h2><p>This content is running inside a sandboxed iframe. Automate frame switching to interact with its button.</p><button id="frame-action" onclick="document.getElementById('result').textContent='Button inside iframe clicked successfully!'">Click inside the frame</button><div id="result" role="status"></div><small>iframe locator target: #frame-action</small></body></html>`;

function BrowserToolsPage() {
  const { theme } = useContext(ThemeContext);
  const [frameTab, setFrameTab] = useState("welcome");
  const [hoverCount, setHoverCount] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dropMessage, setDropMessage] = useState("Drop the draggable item here");
  const notify = useToast();
  function downloadFile(filename, contents, type) {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify({ type: "success", message: `${filename} downloaded.` });
  }
  const frameSrcDoc = frameTab === "welcome" ? iframeMarkup("Welcome to the iframe", theme === "dark") : iframeMarkup("Second iframe tab", theme === "dark");
  return <>
    <PageHeader eyebrow="BROWSER APIS & ADVANCED" title="Browser tools">Practice iframe switching, downloadable files, hover states, drag and drop, and clipboard actions.</PageHeader>
    <div className="content-grid">
      <Panel title="Iframe navigation" description="Switch between iframe tabs and interact with framed content." icon={Globe2} className="panel-wide"><div className="frame-browser"><div className="frame-tabs"><button className={frameTab === "welcome" ? "frame-tab-active" : ""} onClick={() => setFrameTab("welcome")}><PanelTop size={14} /> Welcome frame</button><button className={frameTab === "second" ? "frame-tab-active" : ""} onClick={() => setFrameTab("second")}><PanelTop size={14} /> Second frame</button><span className="frame-origin"><ShieldCheck size={13} /> Sandbox</span></div><iframe key={frameTab} title={frameTab === "welcome" ? "Welcome test iframe" : "Second test iframe"} data-testid="practice-iframe" sandbox="allow-scripts" srcDoc={frameSrcDoc} /></div><Status>Use your automation framework’s frame locator to target the iframe content.</Status></Panel>
      <Panel title="File downloads" description="Generate browser-downloaded test fixtures." icon={Download}><div className="download-list"><div><span className="file-type-icon type-csv"><Table2 size={16} /></span><span><strong>Sample CSV data</strong><small>test-data.csv · 3 records</small></span><Button onClick={() => downloadFile("testlab-sample.csv", "id,name,email,status\n1,Alex Morgan,alex@example.com,Active\n2,Jamie Lee,jamie@example.com,Pending\n3,Taylor Kim,taylor@example.com,Active\n", "text/csv;charset=utf-8")} aria-label="Download sample CSV"><ArrowDownToLine size={15} /></Button></div><div><span className="file-type-icon type-json"><Code2 size={16} /></span><span><strong>Sample JSON data</strong><small>test-data.json · JSON</small></span><Button onClick={() => downloadFile("testlab-sample.json", JSON.stringify([{ id: 1, name: "Alex Morgan", role: "QA Engineer" }, { id: 2, name: "Jamie Lee", role: "Developer" }], null, 2), "application/json")} aria-label="Download sample JSON"><ArrowDownToLine size={15} /></Button></div><div><span className="file-type-icon type-txt"><FileText size={16} /></span><span><strong>Test document</strong><small>readme.txt · Plain text</small></span><Button onClick={() => downloadFile("testlab-readme.txt", "TestLab Automation Playground\\n\\nA sample file for download automation practice.\\n", "text/plain;charset=utf-8")} aria-label="Download text file"><ArrowDownToLine size={15} /></Button></div></div></Panel>
      <Panel title="Hover interactions" description="Hover or focus cards to reveal content and actions." icon={MousePointer2}><div className="hover-demo-grid"><div className="hover-demo hover-primary" tabIndex={0} onMouseEnter={() => setHoverCount((value) => value + 1)}><span><Eye size={17} /></span><strong>Hover over this card</strong><small>Try your mouse or keyboard</small><div className="hover-reveal">Hidden content revealed <Check size={13} /></div></div><div className="hover-demo hover-secondary" tabIndex={0}><span><MoreHorizontal size={18} /></span><strong>Hover for an action</strong><small>Secondary hover target</small><div className="hover-reveal">Context menu available <ArrowRight size={13} /></div></div></div><Status>Hover events detected: {hoverCount}</Status></Panel>
      <Panel title="Drag and drop" description="Move the draggable target into its drop zone." icon={Blocks}><div className="drag-stage"><button className={`drag-chip ${dragging ? "dragging" : ""}`} draggable onDragStart={(event) => { setDragging(true); event.dataTransfer.setData("text/plain", "TestLab card"); }} onDragEnd={() => setDragging(false)} onClick={() => setDragging((value) => !value)}>⠿ &nbsp; Drag me</button><div className={`drop-zone ${dragging ? "drop-ready" : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); setDropMessage(`Dropped: ${event.dataTransfer.getData("text/plain")}`); setDragging(false); }}>{dropMessage}</div></div></Panel>
      <Panel title="Copy to clipboard" description="Test clipboard feedback and permission behavior." icon={Copy}><div className="copy-code"><code>testlab-automation-ready</code><Button onClick={async () => { try { await navigator.clipboard.writeText("testlab-automation-ready"); notify({ type: "success", message: "Text copied to clipboard." }); } catch { notify({ type: "error", message: "Clipboard unavailable here. Use HTTPS or localhost." }); } }}><Copy size={14} /> Copy text</Button></div><Status>Requires a secure context such as localhost.</Status></Panel>
      <Panel title="External navigation" description="Open and verify an external link in a new tab." icon={ExternalLink}><a className="button button-secondary" href="https://pentrax-advanced-port-scanner.netlify.app/" target="_blank" rel="noreferrer">Open Pentrax Port Scanner <ExternalLink size={14} /></a><Status>External link: target=_blank</Status></Panel>
    </div>
  </>;
}

function AutomationCodePage() {
  const [selectedExample, setSelectedExample] = useState("Playwright · TypeScript");
  const notify = useToast();
  const example = automationExamples[selectedExample];

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(example.code);
      notify({ type: "success", message: `${selectedExample} example copied.` });
    } catch {
      notify({ type: "error", message: "Clipboard unavailable. Copy the code directly from the example." });
    }
  }

  return <>
    <PageHeader eyebrow="READY-TO-ADAPT TEST SCRIPTS" title="Automation code">Choose your browser automation framework and run an end-to-end journey through the playground’s browser scenarios and API pages.</PageHeader>
    <section className="automation-intro panel">
      <span className="automation-intro-icon"><Code2 size={22} /></span>
      <div><h2>One journey through the playground</h2><p>Examples cover login, delayed elements, searchable tables, modals, form widgets, popups, downloads, iframe interactions, the API workbench, and the automation-code page.</p></div>
      <span className="automation-runtime">FULL APP JOURNEY</span>
    </section>
    <section className="automation-code-panel panel" aria-label="Automation code examples">
      <div className="automation-toolbar">
        <div className="automation-language-tabs" role="tablist" aria-label="Automation languages">
          {Object.keys(automationExamples).map((name) => <button key={name} id={`language-${name.replaceAll(/[^a-z0-9]+/gi, "-").toLowerCase()}`} role="tab" aria-selected={selectedExample === name} className={selectedExample === name ? "automation-language-active" : ""} onClick={() => setSelectedExample(name)}>{name}</button>)}
        </div>
        <button className="button button-secondary automation-copy" onClick={copyCode}><Copy size={15} /> Copy code</button>
      </div>
      <div className="automation-code-meta"><span>{example.language.toUpperCase()}</span><span>{example.file}</span></div>
      <pre className="automation-code"><code>{example.code}</code></pre>
      <div className="automation-project-details">
        <section className="automation-structure"><h3>Project structure</h3><pre>{example.structure}</pre></section>
        <section className="automation-setup"><h3>Install dependencies</h3><code>{example.install}</code><h3>Run this test</h3><code>{example.run}</code><p>For a deployed Render site, set <code>TESTLAB_URL</code> to its URL before running the test.</p></section>
      </div>
    </section>
    <section className="automation-notes">
      <div><strong>Run against your local app</strong><code>npm run dev</code><p>Set <code>TESTLAB_URL</code> to your deployed Render URL to run the same test against production.</p></div>
      <div><strong>Authentication is a demo</strong><p>The playground login stores the signed-in user in sessionStorage under <code>testlab-user</code>; all six browser examples assert that value. Use the separate REST API login endpoint for API authentication practice.</p></div>
    </section>
  </>;
}

const apiExamples = [
  { label: "API health check", method: "GET", path: "/api/health", body: "" },
  { label: "List users (search + pagination)", method: "GET", path: "/api/users?page=1&limit=5&search=engineer", body: "" },
  { label: "Get one user", method: "GET", path: "/api/users/1", body: "" },
  { label: "Create a user", method: "POST", path: "/api/users", body: '{\n  "name": "Alex Morgan",\n  "email": "alex.morgan@example.com",\n  "role": "QA Engineer",\n  "department": "Quality",\n  "status": "Active"\n}' },
  { label: "Replace a user (PUT)", method: "PUT", path: "/api/users/1", body: '{\n  "name": "Olivia Chen",\n  "email": "olivia.chen@example.com",\n  "role": "Senior QA Engineer",\n  "department": "Quality",\n  "status": "Active"\n}' },
  { label: "Update a user (PATCH)", method: "PATCH", path: "/api/users/1", body: '{\n  "status": "Pending"\n}' },
  { label: "Delete a user", method: "DELETE", path: "/api/users/12", body: "" },
  { label: "Demo login endpoint", method: "POST", path: "/api/auth/login", body: '{\n  "email": "demo@testlab.dev",\n  "password": "Test123!"\n}' },
  { label: "Echo request (any method)", method: "POST", path: "/api/test/echo?source=workbench", body: '{\n  "message": "Hello, API!",\n  "automation": true\n}' },
  { label: "Inspect request headers", method: "GET", path: "/api/test/headers", body: "" },
  { label: "Delayed response (1.5 sec)", method: "GET", path: "/api/test/delay/1500", body: "" },
  { label: "Simulate HTTP 418 error", method: "GET", path: "/api/test/status/418", body: "" },
  { label: "Simulate server error (500)", method: "GET", path: "/api/test/error", body: "" },
  { label: "Request a missing resource (404)", method: "GET", path: "/api/users/99999", body: "" },
  { label: "Download CSV response", method: "GET", path: "/api/test/download/sample.csv", body: "" },
  { label: "Download JSON response", method: "GET", path: "/api/test/download/sample.json", body: "" },
];

function ApiWorkbenchPage() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [method, setMethod] = useState(apiExamples[0].method);
  const [path, setPath] = useState(apiExamples[0].path);
  const [body, setBody] = useState(apiExamples[0].body);
  const [headersText, setHeadersText] = useState('{\n  "Accept": "application/json"\n}');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [responseTab, setResponseTab] = useState("body");
  const [requestError, setRequestError] = useState("");
  const [apiHealth, setApiHealth] = useState("checking");
  const notify = useToast();
  const hasRequestBody = ["POST", "PUT", "PATCH"].includes(method);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/health`, { signal: controller.signal })
      .then(async (result) => {
        if (!result.ok) throw new Error(`HTTP ${result.status}`);
        const health = await result.json();
        if (health.status !== "ok") throw new Error("Unexpected API health response");
        setApiHealth("online");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setApiHealth("offline");
      });
    return () => controller.abort();
  }, []);

  function chooseExample(event) {
    const index = Number(event.target.value);
    setExampleIndex(index);
    setMethod(apiExamples[index].method);
    setPath(apiExamples[index].path);
    setBody(apiExamples[index].body);
    setRequestError("");
  }

  async function sendRequest(event) {
    event.preventDefault();
    setRequestError("");
    let headers;
    try {
      headers = JSON.parse(headersText || "{}");
      if (!headers || Array.isArray(headers) || typeof headers !== "object") throw new Error("Headers must be a JSON object.");
      if (hasRequestBody && body.trim()) JSON.parse(body);
    } catch (error) {
      setRequestError(`Invalid JSON: ${error.message}`);
      return;
    }
    const requestPath = path.trim();
    if (!requestPath.startsWith("/api/") || requestPath.startsWith("//")) {
      setRequestError("Use a local API path beginning with /api/.");
      return;
    }
    setLoading(true);
    setResponse(null);
    const startedAt = performance.now();
    try {
      const result = await fetch(`${apiBaseUrl}${requestPath}`, {
        method,
        headers: {
          ...headers,
          ...(hasRequestBody && body.trim() ? { "Content-Type": headers["Content-Type"] || "application/json" } : {}),
        },
        ...(hasRequestBody && body.trim() ? { body } : {}),
      });
      const text = await result.text();
      let responseBody = text;
      if (text) {
        try { responseBody = JSON.parse(text); } catch { /* Preserve plain-text and download responses. */ }
      }
      setResponse({
        status: result.status,
        statusText: result.statusText,
        ok: result.ok,
        duration: Math.round(performance.now() - startedAt),
        size: new Blob([text]).size,
        headers: Object.fromEntries(result.headers.entries()),
        body: responseBody,
      });
      setResponseTab("body");
    } catch (error) {
      setRequestError(`Request failed: ${error.message}. Check that the Express API is running on port 3001.`);
      setResponse({
        networkError: true,
        duration: Math.round(performance.now() - startedAt),
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const responseText = response?.body === undefined
    ? JSON.stringify(response, null, 2)
    : typeof response.body === "string" ? response.body : JSON.stringify(response.body, null, 2);

  return <>
    <PageHeader eyebrow="EXPRESS BACKEND · REST API" title="API workbench">Send real HTTP requests to the local Express server. Inspect status codes, response headers, timing, and JSON data.</PageHeader>
    <div className="api-health-strip"><span className={`health-indicator health-${apiHealth}`}><i /> API {apiHealth === "checking" ? "CHECKING" : apiHealth === "online" ? "ONLINE" : "OFFLINE"}</span><code>{apiBaseUrl || "Same origin · /api"}</code><span>14 routes</span><Link to="/home">View scenarios <ArrowRight size={13} /></Link></div>
    <section className="api-workbench panel">
      <div className="panel-heading"><div><h2>Request builder</h2><p>Choose an example or build your own API request.</p></div><span className="panel-icon"><Code2 size={17} /></span></div>
      <form onSubmit={sendRequest}>
        <label className="api-example-label" htmlFor="api-example">QUICK START EXAMPLES</label>
        <select id="api-example" className="api-example-select" value={exampleIndex} onChange={chooseExample}>
          {apiExamples.map((example, index) => <option key={example.label} value={index}>{example.method} · {example.label}</option>)}
        </select>
        <div className="api-request-line">
          <select aria-label="HTTP method" className={`method-select method-${method.toLowerCase()}`} value={method} onChange={(event) => setMethod(event.target.value)}>
            {["GET", "POST", "PUT", "PATCH", "DELETE"].map((value) => <option key={value}>{value}</option>)}
          </select>
          <input aria-label="Request URL path" className="api-path-input" value={path} onChange={(event) => setPath(event.target.value)} placeholder="/api/users" spellCheck="false" />
          <Button variant="primary" type="submit" disabled={loading} className="send-request-button">{loading ? <><LoaderCircle size={15} className="spin" /> Sending</> : <>Send request <ArrowRight size={14} /></>}</Button>
        </div>
        <div className="api-editor-grid">
          <label className="api-editor-label">HEADERS <span>JSON</span><textarea aria-label="Request headers JSON" spellCheck="false" value={headersText} onChange={(event) => setHeadersText(event.target.value)} rows={5} /></label>
          <label className={`api-editor-label ${!hasRequestBody ? "editor-disabled" : ""}`}>REQUEST BODY <span>{hasRequestBody ? "JSON" : "OPTIONAL · SELECT POST / PUT / PATCH"}</span><textarea aria-label="Request body JSON" spellCheck="false" value={body} onChange={(event) => setBody(event.target.value)} rows={5} disabled={!hasRequestBody} placeholder="Request body is not used for this method." /></label>
        </div>
        {requestError && <div className="api-error-message" role="alert">{requestError}</div>}
      </form>
    </section>
    <section className="api-response panel">
      <div className="response-heading"><div><div><h2>Response</h2><p>HTTP result returned from your Express API.</p></div></div>{response && !response.networkError && <div className="response-meta"><span className={`response-status ${response.ok ? "response-ok" : "response-fail"}`}><i />{response.status} {response.statusText}</span><span><Clock3 size={13} /> {response.duration} ms</span><span>{response.size} B</span></div>}</div>
      {response ? <><div className="response-tabs"><button className={responseTab === "body" ? "response-tab-active" : ""} onClick={() => setResponseTab("body")}>Response body</button><button className={responseTab === "headers" ? "response-tab-active" : ""} onClick={() => setResponseTab("headers")}>Response headers <span>{Object.keys(response.headers || {}).length}</span></button></div><pre className={`response-code ${response.networkError ? "response-code-error" : ""}`}>{response.networkError ? response.message : responseTab === "body" ? responseText || "(empty response body)" : JSON.stringify(response.headers, null, 2)}</pre></> : <div className="response-empty"><span><ArrowDownToLine size={20} /></span><strong>Ready for your first request</strong><small>Pick an example above and press Send request.</small></div>}
    </section>
    <section className="api-endpoints"><div className="section-title-row"><div><span className="eyebrow">ENDPOINT REFERENCE</span><h2>Available test endpoints</h2><p>Use these routes to test success, validation, and failure cases.</p></div></div><div className="endpoint-list">{[
      ["GET", "/api/health", "Health check and API uptime"],
      ["GET", "/api/users?page=1&limit=5&search=qa", "Searchable, sortable, paginated user collection"],
      ["GET · POST", "/api/users", "List users or create a user (201)"],
      ["GET · PUT · PATCH · DELETE", "/api/users/:id", "Read, replace, update, or remove a user"],
      ["POST", "/api/auth/login", "Demo credentials: demo@testlab.dev / Test123!"],
      ["ANY", "/api/test/echo", "Reflect request method, headers, query, and body"],
      ["ANY", "/api/test/delay/:ms", "Delayed response from 0–10000 ms"],
      ["ANY", "/api/test/status/:code", "Trigger HTTP error responses from 400–599"],
      ["ANY", "/api/test/error", "Intentional 500 response"],
      ["GET", "/api/test/download/sample.csv", "Download a CSV file from the API"],
      ["GET", "/api/test/download/sample.json", "Download a JSON file from the API"],
    ].map(([verb, route, description]) => <div className="endpoint-row" key={route}><span className={`endpoint-verb ${verb.startsWith("GET") ? "verb-get" : verb.startsWith("POST") ? "verb-post" : "verb-any"}`}>{verb}</span><code>{route}</code><span>{description}</span></div>)}</div></section>
  </>;
}

export default App;
