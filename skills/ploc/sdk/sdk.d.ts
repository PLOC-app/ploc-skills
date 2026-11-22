/**
 * PLOC SDK v1.0.0 - TypeScript declarations.
 *
 * The SDK (sdk.js) is injected by the PLOC app into scripts and mini apps:
 * you never load it yourself. These declarations only give you autocompletion
 * and type checking in your editor.
 *
 *     /// <reference path="path/to/types/sdk.d.ts" />
 *
 * Everything below is declared as a global, exactly like sdk.js does at runtime.
 *
 * Note: sdk.js replaces `globalThis.Document` with the PLOC `Document` model, so
 * this file declares it too. Type-check with `"lib": ["ES2022"]` (no "dom"), or with
 * `"skipLibCheck": true` if you need the DOM types: the DOM `Document` then conflicts.
 * Dates coming from the native app are expressed in seconds since epoch; the SDK
 * converts them to `Date` where documented.
 */

// ---------------------------------------------------------------------------
// Core
// ---------------------------------------------------------------------------

type SDKErrorCode =
    | "NO_SDK"
    | "NOT_FOUND"
    | "TIMEOUT"
    | "NO_BRIDGE"
    | "INVALID_PARAMS"
    | "INTERNAL_ERROR"
    | (string & {});

/**
 * Error thrown (rejected) by SDK calls, so always `await` them inside `try` / `catch`.
 * `code` tells why: `INVALID_PARAMS` (missing or malformed argument, checked before anything is sent),
 * `TIMEOUT`, `NOT_FOUND`, `NO_BRIDGE` / `NO_SDK` (outside the PLOC app) or `INTERNAL_ERROR`.
 *
 * Not every failure throws: some methods resolve `null` when the app returns nothing
 * (see "Resolve `null`" on each method). Check for `null` as well as catching.
 *
 * Not exposed as a global at runtime.
 */
interface SDKError extends Error {
    readonly name: "SDKError";
    readonly code: SDKErrorCode;
    toJSON(): { name: string; code: SDKErrorCode; message: string };
}

interface SDKLogger {
    enabled: boolean;
    info(...args: unknown[]): void;
    error(...args: unknown[]): void;
}

declare class Authorization {
    constructor(token?: string | null);
    token: string;
    static resolveToken(): string;
}

/** Structural type of a browser `Blob` / `File` (so these declarations compile without the DOM lib). */
interface SDKBlob {
    readonly size: number;
    readonly type: string;
    readonly name?: string;
}

/** A file produced or downloaded by the app. */
interface SDKFile {
    path: string;
    size: number;
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

/** Free-form options forwarded to the native app. */
type SDKOptions = Record<string, unknown>;

/** A string argument is shorthand for `{ id }`. */
type IdParams = string | { id: string };
/** A string argument is shorthand for `{ query }`. */
type QueryParams = string | ({ query?: string } & SDKOptions);

interface ShareParams {
    paths?: string[];
    base64?: string;
    text?: string;
}

declare class UIService {
    openPloud(): Promise<unknown>;
    openBackupCenter(): Promise<unknown>;
    openAbout(): Promise<unknown>;
    openUrl(params: string | { url: string }): Promise<unknown>;
    openWines(params?: QueryParams): Promise<unknown>;
    openWineFilters(params?: SDKOptions): Promise<unknown>;
    openRacks(params?: QueryParams): Promise<unknown>;
    openTastingNotes(params?: QueryParams): Promise<unknown>;
    openPreferences(): Promise<unknown>;
    openImplocation(): Promise<unknown>;
    openStatistics(): Promise<unknown>;
    openAccount(): Promise<unknown>;
    openObservintoire(params?: SDKOptions): Promise<unknown>;
    openSupportUs(): Promise<unknown>;
    openMyWineRequests(): Promise<unknown>;
    openDansTonPloc(): Promise<unknown>;
    openCsvExport(params?: SDKOptions): Promise<unknown>;
    openReportCenter(params?: SDKOptions): Promise<unknown>;
    openWine(params: IdParams): Promise<unknown>;
    openRack(params: IdParams): Promise<unknown>;
    openRackOnboarding(): Promise<unknown>;
    openTastingNotesOnboarding(): Promise<unknown>;
    openRackWizard(): Promise<unknown>;
    openRackEditor(params: IdParams): Promise<unknown>;
    openTastingNote(params: IdParams): Promise<unknown>;
    openOrder(params: IdParams): Promise<unknown>;
    openVendor(params: IdParams): Promise<unknown>;
    openOwner(params: IdParams): Promise<unknown>;
    openCurrencyPreferences(): Promise<unknown>;
    openFiveStarsDialog(): Promise<unknown>;
    openScriptEditorHost(params?: string | ({ script?: string } & SDKOptions)): Promise<unknown>;
    openDrops(): Promise<unknown>;
    openCommunity(params?: SDKOptions): Promise<unknown>;
    openMiniApps(): Promise<unknown>;
    /** Open the native share sheet. A string or an array is a shortcut for `shareFiles`. */
    share(params: string | string[] | ShareParams): Promise<unknown>;
    /** Share local files by path. */
    /** @throws {SDKError} `INVALID_PARAMS` if no path is given. */
    shareFiles(params: string | string[]): Promise<unknown>;
    /** @throws {SDKError} `INVALID_PARAMS` if `base64` is missing or empty. */
    shareImage(params: { base64: string }): Promise<unknown>;
    /** @throws {SDKError} `INVALID_PARAMS` if the text is missing or empty. */
    shareText(params: string | { text: string }): Promise<unknown>;
    openPop(params?: SDKOptions): Promise<unknown>;
    /** iOS only. */
    openIconPreferences(params?: SDKOptions): Promise<unknown>;
    closeWindow(): Promise<unknown>;
}

/** Repository of one model: get, getAll, find, findFirst. */
declare class Repository<T extends Model> {
    readonly model: new (data?: ModelData) => T;
    /** Resolve `null` when not found. */
    get(id: string): Promise<T | null>;
    getAll(): Promise<Collection<T>>;
    find(param: string | SDKOptions): Promise<Collection<T>>;
    findFirst(param: string | SDKOptions): Promise<T | null>;
}

interface CellarInfo {
    identifier: string | null;
    empty: boolean;
    /** A locked cellar prevents synchronization. */
    locked: boolean;
    /** ISO currency code, e.g. "EUR". */
    currency: string | null;
    /** Size in bytes. */
    size: number;
    counts: {
        wines: number;
        bottles: number;
        tastingNotes: number;
        racks: number;
        orders: number;
        documents: number;
        vendors: number;
        owners: number;
    };
}

declare class CellarService {
    readonly country: Repository<Country>;
    readonly region: Repository<Region>;
    readonly appellation: Repository<Appellation>;
    readonly grape: Repository<Grape>;
    readonly classification: Repository<Classification>;
    readonly color: Repository<Color>;
    readonly bottleFormat: Repository<BottleFormat>;
    readonly vendor: Repository<Vendor>;
    readonly owner: Repository<Owner>;
    readonly parameter: Repository<Parameter>;
    readonly wine: Repository<Wine>;
    readonly order: Repository<Order>;
    readonly rack: Repository<Rack>;
    readonly document: Repository<Document>;
    readonly tastingNotes: Repository<TastingNotes>;
    getInfo(): Promise<CellarInfo>;
}

/** `timeout` is in milliseconds (default 30000, `0` for no timeout). */
interface TimeoutOption {
    timeout?: number;
}

interface HttpResponse {
    status: number | null;
    headers: Record<string, string>;
    body: string | null;
}

declare class NetworkService {
    /**
     * Resolve `null` on failure.
     * @throws {SDKError} `INVALID_PARAMS` without `url` or with an invalid `timeout`; `TIMEOUT` when it expires.
     */
    fetchBase64(params: string | ({ url: string } & TimeoutOption)): Promise<{ base64: string } | null>;
    /**
     * Stream a URL to a local file. Resolve `null` on failure.
     * @throws {SDKError} `INVALID_PARAMS` without `url`.
     */
    download(params: string | { url: string; headers?: Record<string, string> }): Promise<SDKFile | null>;
    /**
     * Default method is GET. `body` must be a string. Resolve `null` on failure.
     * @throws {SDKError} `INVALID_PARAMS` without `url`, with a non-string `method` or `body`, or an invalid `timeout`; `TIMEOUT` when it expires.
     */
    request(
        params: string | ({
            url: string;
            method?: string;
            headers?: Record<string, string>;
            body?: string | null;
        } & TimeoutOption),
    ): Promise<HttpResponse | null>;
    /**
     * Stream a local file to a URL (default method PUT). Resolve `null` on failure.
     * @throws {SDKError} `INVALID_PARAMS` without `path` or `url`.
     */
    upload(params: {
        path: string;
        url: string;
        method?: string;
        headers?: Record<string, string>;
        fieldName?: string;
        fields?: Record<string, string>;
    }): Promise<{ status: number; body: string | null } | null>;
}

interface DialogMessageParams {
    message: string;
    title?: string;
    okLabel?: string;
}

interface PickItem {
    id: string;
    text?: string | null;
}

interface PickParams {
    items: Array<string | PickItem>;
    /** Ids selected by default. */
    selected?: string[];
    title?: string;
}

interface PickResult {
    id: string;
    text: string | null;
}

declare class DialogService {
    alert(params: string | DialogMessageParams): Promise<void>;
    /** Resolve `true` if confirmed. */
    confirm(params: string | (DialogMessageParams & { cancelLabel?: string })): Promise<boolean>;
    /** Resolve the entered text, or `null` if cancelled. */
    prompt(params: string | (DialogMessageParams & { placeholder?: string; defaultValue?: string })): Promise<string | null>;
    /** @throws {SDKError} `INVALID_PARAMS` if the text is missing or empty. */
    toast(params: string | { text: string }): Promise<void>;
    /** Resolve the chosen item, or `null` if cancelled. */
    pick(params: Array<string | PickItem> | PickParams): Promise<PickResult | null>;
    /** Resolve the chosen items, or `null` if cancelled. */
    pickMany(params: Array<string | PickItem> | PickParams): Promise<PickResult[] | null>;
}

type HapticType =
    | "success"
    | "warning"
    | "error"
    | "impact.light"
    | "impact.medium"
    | "impact.heavy"
    | "selection";

type HapticImpact = "light" | "medium" | "heavy";

declare class HapticsService {
    static readonly TYPE: Readonly<{
        SUCCESS: "success";
        WARNING: "warning";
        ERROR: "error";
        IMPACT_LIGHT: "impact.light";
        IMPACT_MEDIUM: "impact.medium";
        IMPACT_HEAVY: "impact.heavy";
        SELECTION: "selection";
    }>;
    static readonly IMPACT: Readonly<{ LIGHT: "light"; MEDIUM: "medium"; HEAVY: "heavy" }>;
    readonly TYPE: typeof HapticsService.TYPE;
    readonly IMPACT: typeof HapticsService.IMPACT;
    /** Resolve `true` if played, `false` if unsupported or disabled (never throws for that). */
    play(params: HapticType | { type: HapticType }): Promise<boolean>;
    success(): Promise<boolean>;
    warning(): Promise<boolean>;
    error(): Promise<boolean>;
    impact(style?: HapticImpact): Promise<boolean>;
    selection(): Promise<boolean>;
}

declare class ClipboardService {
    /** @throws {SDKError} `INVALID_PARAMS` without text. */
    copy(params: string | { text: string }): Promise<void>;
}

interface BackupInfo {
    enabled: boolean;
    canEnable: boolean;
    status: number;
    lastBackupDate: Date | null;
    lastManualBackupDate: Date | null;
}

declare class BackupService {
    static readonly STATUS: Readonly<{ IDLE: 0; FETCHING: 1; UPLOADING: 2; DOWNLOADING: 3; ERROR: 255 }>;
    readonly STATUS: typeof BackupService.STATUS;
    /** Resolve `true` if enabled. */
    enable(): Promise<boolean>;
    disable(): Promise<void>;
    getInfo(): Promise<BackupInfo>;
    backupNow(): Promise<unknown>;
    createBackupFile(): Promise<SDKFile | null>;
    /** Replace the user's data (the app asks for confirmation). Resolve `true` if restored. */
    restoreBackupFile(params: string | { path: string }): Promise<boolean>;
    open(): Promise<unknown>;
}

interface PloudInfo {
    enabled: boolean;
    canEnable: boolean;
    status: number;
    server: string | null;
    deviceIdentifier: string | null;
    lastSyncDate: Date | null;
    cellarLocked: boolean;
}

declare class PloudService {
    static readonly STATUS: Readonly<{ INACTIVE: 0; IDLE: 1; WORKING: 2; ERROR: 256 }>;
    readonly STATUS: typeof PloudService.STATUS;
    getInfo(): Promise<PloudInfo>;
    syncNow(): Promise<boolean>;
    open(): Promise<unknown>;
}

declare class CsvService {
    /** With `documents: true`, documents and JSON data are exported too. */
    createFiles(params?: { documents?: boolean }): Promise<SDKFile[] | null>;
    open(): Promise<unknown>;
}

declare class PdfService {
    /** Without argument, print all wines and racks. An empty array is rejected. */
    createFile(params?: Array<string | { id: string }> | { ids?: Array<string | { id: string }> }): Promise<SDKFile | null>;
    open(): Promise<unknown>;
}

declare class MiniAppService {
    install(params: string | { url: string }): Promise<unknown>;
    open(): Promise<unknown>;
}

declare class TranslationsService {
    /** A key returns a string, an array of keys returns a dictionary. Unknown keys give `defaultValue`. */
    get(params: string, defaultValue?: string | null): Promise<string | null>;
    get(params: string[], defaultValue?: string | null): Promise<Record<string, string | null>>;
}

declare class FilesService {
    /** Resolve `null` on failure. @throws {SDKError} `INVALID_PARAMS` without `path` or `base64`. */
    writeBase64(path: string, base64: string): Promise<SDKFile | null>;
    writeBase64(params: { path: string; base64: string }): Promise<SDKFile | null>;
    /** Resolve `null` on failure. @throws {SDKError} `INVALID_PARAMS` without `path` or `text`. */
    writeText(path: string, text: string): Promise<SDKFile | null>;
    writeText(params: { path: string; text: string }): Promise<SDKFile | null>;
    /** Resolve `null` when the file cannot be read. @throws {SDKError} `INVALID_PARAMS` without `path`. */
    readBase64(params: string | { path: string }): Promise<string | null>;
    /** Resolve `null` when the file cannot be read. @throws {SDKError} `INVALID_PARAMS` without `path`. */
    readText(params: string | { path: string }): Promise<string | null>;
    /** @throws {SDKError} `INVALID_PARAMS` without `path`. */
    exists(params: string | { path: string }): Promise<boolean>;
    /** @throws {SDKError} `INVALID_PARAMS` without `path`. */
    delete(params: string | { path: string }): Promise<boolean>;
}

interface AccountInfo {
    connected: boolean;
    /** Stable anonymous id derived from `key` (null without key or when not connected). */
    id: string | null;
}

declare class AccountService {
    getInfo(params?: string | { key?: string }): Promise<AccountInfo>;
    open(): Promise<unknown>;
}

interface AppInfo {
    name: string | null;
    version: string | null;
    build: string | null;
    platform: string | null;
    language: string | null;
    osVersion: string | null;
    locale: string | null;
}

declare class AppService {
    getInfo(): Promise<AppInfo>;
    /** Check before reading or modifying data to avoid a permission error. */
    getPermissions(): Promise<{ read: boolean; write: boolean }>;
}

declare class StorageService {
    /** Values are JSON-serialized. Resolve `defaultValue` when the key does not exist. */
    get<T = unknown>(key: string, defaultValue?: T | null): Promise<T | null>;
    /** @throws {SDKError} `INVALID_PARAMS` if the key is empty or longer than 128 characters, or the value is not JSON-serializable. */
    set(key: string, value: unknown): Promise<void>;
    has(key: string): Promise<boolean>;
    /** Resolve `true` if the key existed. */
    remove(key: string): Promise<boolean>;
}

/** Low-level access to the native bridge. Not documented, prefer the services above. */
declare class BridgeService {
    send(method: string, params?: unknown): Promise<unknown>;
}

declare class SDK {
    /** Require an `Authorization`. Uses a mock gateway when no native bridge is available. */
    constructor(auth: Authorization);
    static version: string;
    static versionCode: number;
    static logger: SDKLogger;
    /** `true` when running outside the PLOC app (no native bridge). */
    readonly isMock: boolean;

    readonly ui: UIService;
    readonly cellar: CellarService;
    readonly network: NetworkService;
    readonly dialog: DialogService;
    readonly haptics: HapticsService;
    readonly backup: BackupService;
    readonly ploud: PloudService;
    readonly csv: CsvService;
    readonly pdf: PdfService;
    readonly files: FilesService;
    readonly translations: TranslationsService;
    readonly miniApps: MiniAppService;
    readonly account: AccountService;
    readonly app: AppService;
    readonly storage: StorageService;
    readonly clipboard: ClipboardService;
    readonly bridge: BridgeService;
}

// ---------------------------------------------------------------------------
// Collection
// ---------------------------------------------------------------------------

/**
 * Iterable result list. It has no `.length`: use `.count`, `.isEmpty`, `.first`
 * and `.toArray()`. `map` and `filter` return a Collection.
 */
declare class Collection<T = unknown> implements Iterable<T> {
    constructor(items?: T[]);
    [Symbol.iterator](): Iterator<T>;
    forEach(callback: (item: T, index: number, array: T[]) => void): this;
    map<U>(callback: (item: T, index: number, array: T[]) => U): Collection<U>;
    filter(callback: (item: T, index: number, array: T[]) => unknown): Collection<T>;
    /** `prop` accepts a dotted path ("color.name"). Default mode is "equals". */
    filterBy(
        prop: string,
        value: unknown,
        options?: { ignoreCase?: boolean; mode?: "equals" | "startsWith" },
    ): Collection<T>;
    /** First item whose property (dotted path allowed) equals `value`. */
    find(prop: string, value: unknown): T | undefined;
    /** New sorted Collection. Empty values go last. */
    sortBy(prop: string, direction?: "asc" | "desc"): Collection<T>;
    readonly count: number;
    readonly isEmpty: boolean;
    readonly first: T | undefined;
    readonly last: T | undefined;
    /** Negative indexes count from the end. */
    at(index: number): T | undefined;
    toArray(): T[];
}

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------

/** Raw data accepted by model constructors (nested objects become model instances). */
type ModelData = Record<string, any>;

/**
 * Base class of the cellar models. Not exposed as a global at runtime:
 * it is declared here only for typing.
 */
declare abstract class Model {
    constructor(data?: ModelData);
    id: string | null;
    name: string | null;
    /** Seconds since epoch. */
    timestamp: number | null;
    timeCreated: number | null;
    timeLastModified: number | null;

    /** Create or update, then refresh the object with the stored data. */
    save(): Promise<this>;
    delete(): Promise<this>;

    /** Resolve `null` when not found. */
    static get<T extends Model>(this: new (data?: ModelData) => T, id: string): Promise<T | null>;
    static getAll<T extends Model>(this: new (data?: ModelData) => T): Promise<Collection<T>>;
    /** A string searches by name; an object searches by criteria. */
    static find<T extends Model>(this: new (data?: ModelData) => T, param: string | SDKOptions): Promise<Collection<T>>;
    static findFirst<T extends Model>(this: new (data?: ModelData) => T, param: string | SDKOptions): Promise<T | null>;
}

declare class Period {
    constructor(data?: { from?: number; to?: number });
    from: number | null;
    to: number | null;
}

declare class Country extends Model {
    createRegion(name: string): Region;
    getRegions(): Promise<Collection<Region>>;
}

declare class Region extends Model {
    countryId: string | null;
    get country(): Country | null;
    set country(value: Country | string | null);
    getCountry(): Promise<Country | null>;
    getAppellations(): Promise<Collection<Appellation>>;
    createAppellation(name: string): Appellation;
}

declare class Appellation extends Model {
    regionId: string | null;
    get region(): Region | null;
    set region(value: Region | string | null);
    getRegion(): Promise<Region | null>;
}

declare class Grape extends Model {}

declare class Classification extends Model {}

declare class Document extends Model {
    type?: number;
    size?: number;
    width?: number;
    height?: number;
    filename?: string;
    base64?: string | null;
    parentId?: string | null;
    set parent(value: Wine | TastingNotes | null);
    /** Load the content on demand when it is not already in memory. */
    getBase64(): Promise<string | null | undefined>;
    loadFromURL(url: string): Promise<string | null>;
    /** Accept a `File` or a `Blob`. */
    loadFromFile(file: SDKBlob): Promise<string>;
}

declare class Contact extends Model {
    contact?: string;
    address1?: string;
    address2?: string;
    city?: string;
    postalCode?: string;
    comments?: string;
    phone?: string;
    fax?: string;
    mobilePhone?: string;
    email?: string;
    website?: string;
    latitude?: number;
    longitude?: number;
    countryId: string | null;
    get country(): Country | null;
    set country(value: Country | string | null);
    getCountry(): Promise<Country | null>;
}

declare class Vendor extends Contact {}

declare class Owner extends Contact {}

declare class BottleFormat extends Model {
    /** Volume in liters. */
    volume?: number;
    formattedVolume?: string;
}

declare class Color extends Model {
    r?: number;
    g?: number;
    b?: number;
    ocValue?: number;
    readonly: boolean;
    /** "#rrggbb" */
    get hex(): string;
    get rgba(): string;
}

declare class Parameter extends Model {
    type?: number;
    value?: string;
}

declare class Wine extends Model {
    vintage?: number;
    note?: number;
    bottles?: number;
    meals?: number;
    isFavorite?: boolean;
    isPreSheet?: boolean;
    latitude?: number;
    longitude?: number;
    language?: string;
    degree?: number;
    estimatePrice?: number;
    inventoryMode?: number;
    reference?: string;
    comments?: string;
    cuvee?: string;
    tags?: string;
    grapes?: string;
    observintoire?: unknown;
    apogee?: Period;
    drinkPeriod?: Period;
    /** Serving temperature range in °C (`from` = min, `to` = max). Not a date range, unlike `apogee` and `drinkPeriod`. */
    service?: Period;
    orders?: Order[];
    documents?: Document[];
    rackItems?: RackItem[];
    tastingNotes?: TastingNotes[];

    countryId: string | null;
    regionId: string | null;
    appellationId: string | null;
    classificationId: string | null;
    bottleFormatId: string | null;
    colorId: string | null;
    ownerId: string | null;

    get country(): Country | null;
    set country(value: Country | string | null);
    get region(): Region | null;
    set region(value: Region | string | null);
    get appellation(): Appellation | null;
    set appellation(value: Appellation | string | null);
    get classification(): Classification | null;
    set classification(value: Classification | string | null);
    get color(): Color | null;
    set color(value: Color | string | null);
    get bottleFormat(): BottleFormat | null;
    set bottleFormat(value: BottleFormat | string | null);
    get owner(): Owner | null;
    set owner(value: Owner | string | null);
    get image(): Document | null;
    set image(value: Document | string | null);
    get coverImage(): Document | null;
    set coverImage(value: Document | string | null);

    getCountry(): Promise<Country | null>;
    getRegion(): Promise<Region | null>;
    getAppellation(): Promise<Appellation | null>;
    getClassification(): Promise<Classification | null>;
    getColor(): Promise<Color | null>;
    getBottleFormat(): Promise<BottleFormat | null>;
    getOwner(): Promise<Owner | null>;
    getImage(): Promise<Document | null>;
    getCoverImage(): Promise<Document | null>;
}

declare class Order extends Model {
    static readonly OCCASION: Readonly<{
        NONE: 0;
        ENJOY: 1;
        PARTY: 2;
        GIFT: 4;
        SALE: 8;
        LOST: 16;
        VINDREDI: 32;
        BECAUSE: 64;
        INVENTORY: 128;
        EPHEMERAL_COVID: 200;
    }>;
    comments: string | null;
    currency: string | null;
    purchases: number | null;
    consumptions: number | null;
    unitPrice: number | null;
    amount: number | null;
    occasion: number;
    vendorId?: string | null;
    wineId?: string | null;
    /** Reads a `Date`; writes accept a `Date` or seconds since epoch. */
    get date(): Date | null;
    set date(value: Date | number | null);
    get vendor(): Vendor | null;
    set vendor(value: Vendor | string | null);
    get wine(): Wine | null;
    set wine(value: Wine | string | null);
    getVendor(): Promise<Vendor | null>;
    getWine(): Promise<Wine | null>;
}

declare class TastingNotes extends Model {
    static readonly MOOD: Readonly<{
        NONE: 0;
        NASTY: 1;
        BLAH: 2;
        ANGRY: 3;
        BANAL: 4;
        SURPRISED: 5;
        HAPPY: 6;
        LOVE: 7;
    }>;
    static readonly TEMPLATES: Readonly<{ SIMPLE: "PLOC-010"; EXPERT: "PLOC-001" }>;
    template: string;
    vintage?: number;
    note?: number;
    mood: number;
    latitude?: number;
    longitude?: number;
    language?: string;
    comments?: string;
    place?: string;
    meals?: string;
    people?: string;
    color: Color | null;
    wineId: string | null;
    observintoire?: unknown;
    documents?: Document[];
    /** Reads a `Date`; writes accept a `Date` or seconds since epoch. */
    get date(): Date | null;
    set date(value: Date | number | null);
    get wine(): Wine | null;
    set wine(value: Wine | string | null);
    get image(): Document | null;
    set image(value: Document | string | null);
    getWine(): Promise<Wine | null>;
    getImage(): Promise<Document | null>;
}

interface RackCustomNaming {
    x: number | null;
    y: number | null;
}

declare class RackInterval {
    constructor(data?: { type?: number; value?: number });
    static readonly TYPE: Readonly<{ ROW: 0; COLUMN: 1 }>;
    type: number | null;
    value: number | null;
}

declare class Rack extends Model {
    static readonly GRID_LABEL: Readonly<{
        NONE: 0;
        BOTH_LETTER: 2;
        BOTH_NUMERIC: 4;
        X_LETTER_Y_NUMBER: 8;
        X_NUMBER_Y_LETTER: 16;
    }>;
    static readonly GRID_DIRECTION: Readonly<{ DEFAULT: 1; REVERSE_X: 2; REVERSE_Y: 3; REVERSE_XY: 4 }>;
    static readonly GRID_SIZE_MODE: Readonly<{ DEFAULT: 1 }>;
    rows: number | null;
    columns: number | null;
    model: string | null;
    comments: string | null;
    gridLabel: number;
    gridDirection: number;
    gridSizeMode: number;
    gridCustomNaming: RackCustomNaming | null;
    rackItems: RackItem[] | null;
    intervals: RackInterval[] | null;

    getRackItem(row: number, column: number): RackItem | null;
    /** Throw INVALID_PARAMS when the position is outside the rack. */
    addRackItemAt(row: number, column: number, wine?: Wine | null): RackItem;
    findRackItemByQrCode(qrCode: string): RackItem | null;
    findRackItemByTag(tag: string): RackItem | null;
    /** Create the missing empty slots for the whole grid. */
    populateRackItems(): this;
    isValidPosition(row: number, column: number): boolean;
}

declare class RackItem {
    constructor(data?: ModelData);
    static readonly DISPLAY: Readonly<{ DEFAULT: 0; SMALL: 1; LARGE: 2 }>;
    static readonly SHAPE: Readonly<{ ROUND: 0; SQUARE: 1; HEXAGON: 2; BOX: 3; CUSTOM: 254 }>;
    static readonly CONTENT_ALIGNMENT: Readonly<{
        TOP_LEFT: 0;
        TOP_CENTER: 1;
        TOP_RIGHT: 2;
        MIDDLE_LEFT: 3;
        MIDDLE_CENTER: 4;
        MIDDLE_RIGHT: 5;
        BOTTOM_LEFT: 6;
        BOTTOM_CENTER: 7;
        BOTTOM_RIGHT: 8;
    }>;
    id: string | null;
    tags: string | null;
    qrCode: string | null;
    timestamp: number | null;
    row: number | null;
    column: number | null;
    contentAlignment: number;
    shape: number;
    display: number;
    rack: Rack | null;
    wine: Wine | null;
    deleted: boolean;

    markDeleted(): this;
    unmarkDeleted(): this;
    toggleDeleted(): this;
    isEmpty(): boolean;
    isNotEmpty(): boolean;
    isDeleted(): boolean;
    /** Take the wine out of the slot (consumption). */
    consume(): Promise<this>;
    /** Put a saved wine (with an id) into the slot. */
    store(wine: Wine): Promise<this>;
}
