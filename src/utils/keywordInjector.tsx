import { JSDOM } from 'jsdom';

export function injectKeywords(html: string, keywords: string[]): string {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Example 1: Add a keyword at the beginning
  const firstParagraph = document.querySelector('p, div, span');
  if (firstParagraph) {
    const keywordSpan = document.createElement('span');
    keywordSpan.textContent = `[${keywords[0]}] `;
    firstParagraph.prepend(keywordSpan);
  }

  // Example 2: Add another keyword at the end
  const keywordFooter = document.createElement('div');
  keywordFooter.textContent = ` 🔍 Popular: ${keywords.slice(1).join(', ')}`;
  document.body.appendChild(keywordFooter);

  return document.body.innerHTML;
}
