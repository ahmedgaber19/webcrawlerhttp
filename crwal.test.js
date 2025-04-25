const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML } = require("./crawl");

test("normalizeUrl strip protocol", () => {
  const input = "https://boot.dev/path";
  const output = normalizeURL(input);
  const expected = "boot.dev/path";
  expect(output).toEqual(expected);
});

test("normalizeUrl strip trailing slash", () => {
  const input = "https://boot.dev/path/";
  const output = normalizeURL(input);
  const expected = "boot.dev/path";
  expect(output).toEqual(expected);
});

test("normalizeUrl capitals", () => {
  const input = "https://BoOt.dEv/path";
  const output = normalizeURL(input);
  const expected = "boot.dev/path";
  expect(output).toEqual(expected);
});

test("normalizeUrl strip http", () => {
  const input = "http://boot.dev/path";
  const output = normalizeURL(input);
  const expected = "boot.dev/path";
  expect(output).toEqual(expected);
});

test("getURLFromHTML absolute", () => {
  const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev">
                Boot.dev Blog
            </a>
        </body>
    </html>
`;
  const inputBaseURL = "http://blog.boot.dev";
  const output = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/"];
  expect(expected).toEqual(output);
});

test("getURLFromHTML relative", () => {
  const inputHTMLBody = `
      <html>
          <body>
              <a href="/path/">
                  Boot.dev Blog
              </a>
          </body>
      </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const output = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(expected).toEqual(output);
});
test("getURLFromHTML both", () => {
  const inputHTMLBody = `
        <html>
            <body>
                <a href="https://blog.boot.dev/path1/">
                    Boot.dev Blog
                </a>
                <a href="/path2/">
                    Boot.dev Blog
                </a>
            </body>
        </html>
    `;
  const inputBaseURL = "https://blog.boot.dev";
  const output = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/",
  ];
  expect(expected).toEqual(output);
});

test("getURLFromHTML invalid", () => {
  const inputHTMLBody = `
          <html>
              <body>
                  <a href="invalid">
                      Boot.dev Blog
                  </a>
              </body>
          </html>
      `;
  const inputBaseURL = "https://blog.boot.dev";
  const output = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(expected).toEqual(output);
});
