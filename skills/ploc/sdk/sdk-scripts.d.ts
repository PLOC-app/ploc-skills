/**
 * Optional add-on for PLOC scripts and mini apps.
 *
 * The app already provides an `sdk` instance in both. Reference this file next to
 * sdk.d.ts to get it typed. Do not use it in a page that creates its own instance
 * (`globalThis.sdk = new SDK(new Authorization())`).
 */
/// <reference path="./sdk.d.ts" />

declare const sdk: SDK;
