/**
 * Optional add-on for PLOC scripts (script editor).
 *
 * In a script, the app already provides an `sdk` instance. Reference this file
 * next to sdk.d.ts to get it typed. Do not use it in a mini app that creates its
 * own instance (`const sdk = new SDK(new Authorization())`).
 */
/// <reference path="./sdk.d.ts" />

declare const sdk: SDK;
