import * as i18n from "./ducks/i18n";
import * as builder from "./ducks/builder";

/**
 * Reexports
 */
export * from "./utils/utils";
export * from "./layout/admin/LayoutContext";
export * from "./layout/admin/LayoutConfig";
export { default as LayoutConfig } from "./layout/admin/LayoutConfig";
export { default as mockAxios } from "./__mocks__/mockAxios";
export { default as LayoutInitializer } from "./layout/admin/LayoutInitializer";
export { default as I18nProvider } from "./i18n/I18nProvider";
export { default as ThemeProvider } from "./materialUIThemeProvider/ThemeProvider";

/**
 * Ducks
 */

export const metronic = { i18n, builder };
