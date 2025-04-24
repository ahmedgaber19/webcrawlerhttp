const { test, expect } = require("@jest/globals");
const { normalizeURL } = require("./crawl");

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
