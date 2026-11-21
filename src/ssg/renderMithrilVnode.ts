/**
 * @license MIT
 * ============================================================================
 * src/ssg/renderMithrilVnode.ts — Zero-Dependency Mithril 2 Vnode-to-HTML Engine
 * Property: https://waystation.raggiesoft.com (raggiesoft-waystation)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL VIRTUAL DOM INTERNALS GUIDE):
 *   How does Mithril.js represent UI in memory before touching the browser DOM?
 *     Every `m(...)` call returns a plain JavaScript object called a **Vnode**
 *     ("Virtual DOM Node") with just four core properties:
 *       - `tag`      : `'div'`, `'section'`, `'#'` (plain text), `'['` (fragment),
 *                      or a Component object `{ view(vnode) { ... } }`!
 *       - `attrs`    : `{ id: '...', className: '...', href: '...', onclick: fn }`
 *       - `text`     : Optimization used when an element has a single string child
 *                      (e.g. `m('h1', 'Hello')` sets `vnode.text = 'Hello'`).
 *       - `children` : Array of child Vnodes when multiple children are passed.
 *
 *   By walking that tree recursively at build time in Node.js, we serialize the
 *   exact same Mithril Hyperscript components into clean, semantic HTML5 with
 *   zero third-party SSR wrapper dependencies!
 * ============================================================================
 */

import type m from 'mithril';

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]);

const BOOLEAN_ATTRIBUTES = new Set([
  'checked',
  'disabled',
  'readonly',
  'required',
  'selected',
  'multiple',
  'hidden',
  'novalidate'
]);

export function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escapeHtmlAttr(value: string): string {
  return escapeHtmlText(value).replace(/"/g, '&quot;');
}

export function renderMithrilVnode(node: unknown): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return escapeHtmlText(String(node));
  }

  if (Array.isArray(node)) {
    return node.map((child) => renderMithrilVnode(child)).join('');
  }

  const vnode = node as m.Vnode<Record<string, unknown>, unknown> & { text?: string | number };

  // 1. Plain text Vnode (`tag === '#'`):
  if (vnode.tag === '#') {
    const raw = vnode.children !== undefined ? vnode.children : vnode.text ?? '';
    return escapeHtmlText(String(raw));
  }

  // 2. Fragment Vnode (`tag === '['`):
  if (vnode.tag === '[') {
    return renderMithrilVnode(vnode.children);
  }

  // 3. Component Vnode (`m(Component)` where `tag` has a `.view()` method):
  if (typeof vnode.tag === 'object' && vnode.tag !== null && 'view' in vnode.tag) {
    const comp = vnode.tag as { view: (v: unknown) => unknown };
    return renderMithrilVnode(comp.view(vnode));
  }

  if (typeof vnode.tag !== 'string') {
    return '';
  }

  // 4. Standard HTML Element Vnode (`tag === 'section'`, `'input'`, etc.):
  const tagName = vnode.tag;
  const attrs = (vnode.attrs || {}) as Record<string, unknown>;

  // Merge selector classes (`className`) with any explicit `class` attribute cleanly
  const classParts: string[] = [];
  if (typeof attrs.className === 'string' && attrs.className.trim()) {
    classParts.push(attrs.className.trim());
  }
  if (typeof attrs.class === 'string' && attrs.class.trim()) {
    for (const token of attrs.class.trim().split(/\s+/)) {
      if (!classParts.includes(token)) classParts.push(token);
    }
  }

  const attrStrings: string[] = [];
  if (classParts.length > 0) {
    attrStrings.push(`class="${escapeHtmlAttr(classParts.join(' '))}"`);
  }

  for (const [key, val] of Object.entries(attrs)) {
    if (
      key === 'className' ||
      key === 'class' ||
      key === 'key' ||
      key.startsWith('on') ||
      typeof val === 'function' ||
      val === undefined ||
      val === null ||
      val === false
    ) {
      continue;
    }

    if (BOOLEAN_ATTRIBUTES.has(key)) {
      if (val === true) {
        attrStrings.push(key);
      }
      continue;
    }

    attrStrings.push(`${key}="${escapeHtmlAttr(String(val))}"`);
  }

  const openAttrs = attrStrings.length > 0 ? ` ${attrStrings.join(' ')}` : '';
  if (VOID_ELEMENTS.has(tagName)) {
    return `<${tagName}${openAttrs} />`;
  }

  const innerHtml =
    vnode.text !== undefined && vnode.text !== null
      ? escapeHtmlText(String(vnode.text))
      : renderMithrilVnode(vnode.children);

  return `<${tagName}${openAttrs}>${innerHtml}</${tagName}>`;
}
