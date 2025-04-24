// utils/domCleaner.ts
import { JSDOM } from 'jsdom';

type FontTag = Element & {
  color?: string;
  face?: string;
  size?: string;
};

export function cleanHtml(html: string): string {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Convert each <font> into <span> with inline styles
  document.querySelectorAll('font').forEach((fontEl: Element) => {
    const tag = fontEl as FontTag;
    const span = document.createElement('span');

    // Transfer attributes to CSS
    if (tag.getAttribute('color')) {
      span.style.color = tag.getAttribute('color')!;
    }
    if (tag.getAttribute('face')) {
      span.style.fontFamily = tag.getAttribute('face')!;
    }
    if (tag.getAttribute('size')) {
      const sizeVal = parseInt(tag.getAttribute('size')!, 10);
      // Simple mapping: size 1–7 → 0.75rem–1.75rem
      span.style.fontSize = `${0.25 * sizeVal + 0.5}rem`;
    }

    // Preserve inner HTML
    span.innerHTML = fontEl.innerHTML;
    fontEl.replaceWith(span);
  });

  // You can add more cleanup here (e.g. strip deprecated tags, fix inline styles...)

  return document.body.innerHTML;
}
