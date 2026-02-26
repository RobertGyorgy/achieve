/**
 * Safari iOS transparent address bar.
 *
 * The correct approach is architectural, not dynamic:
 * - html, body, all global wrappers stay background-color: transparent
 * - Each <section> carries its own background-color
 * - Safari naturally blurs the actual rendered section pixels through its glass bar
 * - No JS should ever set html/body background — doing so forces a tint color
 * - No <meta name="theme-color"> — its absence lets Safari use native glass
 *
 * This file exports no-op stubs so main.ts doesn't need changes.
 */

export function initThemeColor() {}
export function resetThemeColor() {}
export function cleanupThemeColor() {}
