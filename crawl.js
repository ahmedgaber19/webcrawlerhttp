const { URL } = require("url");
const { JSDOM } = require("jsdom");

async function crawlPage(currentURL, baseURL, pagesMap) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (currentURLObj.hostname != baseURLObj.hostname) {
    return pagesMap;
  }
  const normalizedURL = normalizeURL(currentURL);
  if (normalizedURL in pagesMap) {
    pagesMap[normalizedURL] += 1;
    return pagesMap;
  }
  console.log(`actively crawling ${currentURL}`);
  pagesMap[normalizedURL] = 1;
  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.log(
        `error in fetch with status code: ${response.status} on page:${currentURL}`
      );
      return pagesMap;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `non html response with content type: ${contentType} on page:${currentURL}`
      );
      return pagesMap;
    }
    const html = await response.text();
    const newURLs = getURLsFromHTML(html, baseURL);
    for (const newURL of newURLs) {
      await crawlPage(newURL, baseURL, pagesMap);
    }
  } catch (err) {
    console.log(`error in fetch: ${err} on page:${currentURL} `);
  }
  return pagesMap;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href[0] === "/") {
      // relative
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(`${baseURL}${linkElement.href}`);
      } catch (err) {
        console.log(`error with relative url: ${err}`);
      }
    } else {
      //absolute
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(linkElement.href);
      } catch (err) {
        console.log(`error with absolute url: ${err}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}
module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
