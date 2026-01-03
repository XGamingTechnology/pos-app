"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=D%3A%5CMY%20Data%5Ckerjaan%5C2025%5Cpa%20abas%20project%5Cpos-structure%5Cpos-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMY%20Data%5Ckerjaan%5C2025%5Cpa%20abas%20project%5Cpos-structure%5Cpos-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=D%3A%5CMY%20Data%5Ckerjaan%5C2025%5Cpa%20abas%20project%5Cpos-structure%5Cpos-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMY%20Data%5Ckerjaan%5C2025%5Cpa%20abas%20project%5Cpos-structure%5Cpos-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_MY_Data_kerjaan_2025_pa_abas_project_pos_structure_pos_app_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"D:\\\\MY Data\\\\kerjaan\\\\2025\\\\pa abas project\\\\pos-structure\\\\pos-app\\\\app\\\\api\\\\auth\\\\[...nextauth]\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_MY_Data_kerjaan_2025_pa_abas_project_pos_structure_pos_app_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDTVklMjBEYXRhJTVDa2VyamFhbiU1QzIwMjUlNUNwYSUyMGFiYXMlMjBwcm9qZWN0JTVDcG9zLXN0cnVjdHVyZSU1Q3Bvcy1hcHAlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUQlM0ElNUNNWSUyMERhdGElNUNrZXJqYWFuJTVDMjAyNSU1Q3BhJTIwYWJhcyUyMHByb2plY3QlNUNwb3Mtc3RydWN0dXJlJTVDcG9zLWFwcCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD1zdGFuZGFsb25lJnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQzREO0FBQ3pJO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcG9zLWFwcC8/NjNlMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJEOlxcXFxNWSBEYXRhXFxcXGtlcmphYW5cXFxcMjAyNVxcXFxwYSBhYmFzIHByb2plY3RcXFxccG9zLXN0cnVjdHVyZVxcXFxwb3MtYXBwXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxbLi4ubmV4dGF1dGhdXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcInN0YW5kYWxvbmVcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFxNWSBEYXRhXFxcXGtlcmphYW5cXFxcMjAyNVxcXFxwYSBhYmFzIHByb2plY3RcXFxccG9zLXN0cnVjdHVyZVxcXFxwb3MtYXBwXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxbLi4ubmV4dGF1dGhdXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=D%3A%5CMY%20Data%5Ckerjaan%5C2025%5Cpa%20abas%20project%5Cpos-structure%5Cpos-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMY%20Data%5Ckerjaan%5C2025%5Cpa%20abas%20project%5Cpos-structure%5Cpos-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _lib_auth_options__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/auth-options */ \"(rsc)/./lib/auth-options.ts\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n// app/api/auth/[...nextauth]/route.ts\n // ✅ Ambil dari lib\n\n// ❌ HAPUS SEMUA KODE DI DALAM export const authOptions = { ... }\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_1___default()(_lib_auth_options__WEBPACK_IMPORTED_MODULE_0__.authOptions);\n // ✅ Hanya ini yang boleh diekspor\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUFzQztBQUNXLENBQUMsbUJBQW1CO0FBQ3BDO0FBRWpDLGlFQUFpRTtBQUVqRSxNQUFNRSxVQUFVRCxnREFBUUEsQ0FBQ0QsMERBQVdBO0FBQ08sQ0FBQyxrQ0FBa0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wb3MtYXBwLy4vYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHM/YzhhNCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50c1xyXG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gXCJAL2xpYi9hdXRoLW9wdGlvbnNcIjsgLy8g4pyFIEFtYmlsIGRhcmkgbGliXHJcbmltcG9ydCBOZXh0QXV0aCBmcm9tIFwibmV4dC1hdXRoXCI7XHJcblxyXG4vLyDinYwgSEFQVVMgU0VNVUEgS09ERSBESSBEQUxBTSBleHBvcnQgY29uc3QgYXV0aE9wdGlvbnMgPSB7IC4uLiB9XHJcblxyXG5jb25zdCBoYW5kbGVyID0gTmV4dEF1dGgoYXV0aE9wdGlvbnMpO1xyXG5leHBvcnQgeyBoYW5kbGVyIGFzIEdFVCwgaGFuZGxlciBhcyBQT1NUIH07IC8vIOKchSBIYW55YSBpbmkgeWFuZyBib2xlaCBkaWVrc3BvclxyXG4iXSwibmFtZXMiOlsiYXV0aE9wdGlvbnMiLCJOZXh0QXV0aCIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth-options.ts":
/*!*****************************!*\
  !*** ./lib/auth-options.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n// lib/auth-options.ts\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                username: {\n                    label: \"Username\",\n                    type: \"text\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                console.log(\"[NEXTAUTH][AUTHORIZE] Received credentials:\", {\n                    username: credentials?.username\n                });\n                if (!credentials?.username || !credentials?.password) {\n                    console.warn(\"[NEXTAUTH][AUTHORIZE] Missing username or password\");\n                    return null;\n                }\n                try {\n                    // ✅ Sesuaikan dengan URL backend Anda\n                    const res = await fetch(`${\"https://06ns6l3d-4000.asse.devtunnels.ms\"}/api/auth/login`, {\n                        method: \"POST\",\n                        headers: {\n                            \"Content-Type\": \"application/json\"\n                        },\n                        body: JSON.stringify({\n                            username: credentials.username,\n                            password: credentials.password\n                        })\n                    });\n                    const text = await res.text();\n                    let data;\n                    try {\n                        data = JSON.parse(text);\n                    } catch (err) {\n                        console.error(\"[NEXTAUTH][AUTHORIZE] Backend returned invalid JSON:\", text);\n                        return null;\n                    }\n                    if (res.ok && data.success === true) {\n                        const rawRole = data.user.role;\n                        if (rawRole !== \"cashier\" && rawRole !== \"admin\") {\n                            console.error(\"[NEXTAUTH][AUTHORIZE] Invalid role received:\", rawRole);\n                            return null;\n                        }\n                        return {\n                            id: data.user.id,\n                            username: data.user.username,\n                            role: rawRole,\n                            name: data.user.username,\n                            email: \"\",\n                            backendToken: data.accessToken ?? null,\n                            backendRefreshToken: data.refreshToken ?? null\n                        };\n                    } else {\n                        console.warn(\"[NEXTAUTH][AUTHORIZE] ❌ Backend login failed:\", data.message || data);\n                        return null;\n                    }\n                } catch (err) {\n                    console.error(\"[NEXTAUTH][AUTHORIZE] \\uD83C\\uDF10 Network error:\", err.message || err);\n                    return null;\n                }\n            }\n        })\n    ],\n    session: {\n        strategy: \"jwt\",\n        maxAge: 8 * 60 * 60\n    },\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                // Type assertion untuk user agar sesuai dengan tipe yang didefinisikan\n                const typedUser = user;\n                token.id = typedUser.id;\n                token.username = typedUser.username;\n                token.role = typedUser.role;\n                token.backendToken = typedUser.backendToken ?? null;\n                token.backendRefreshToken = typedUser.backendRefreshToken ?? null;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            // Type assertion untuk session agar sesuai dengan tipe yang didefinisikan\n            const customSession = {\n                ...session,\n                user: {\n                    ...session.user,\n                    id: token.id,\n                    username: token.username,\n                    role: token.role,\n                    name: token.username,\n                    email: \"\",\n                    backendToken: token.backendToken ?? null,\n                    backendRefreshToken: token.backendRefreshToken ?? null,\n                    isValid: Boolean(token.backendToken)\n                }\n            };\n            return customSession;\n        },\n        async redirect ({ url, baseUrl }) {\n            return `${baseUrl}/auth-redirect`;\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    debug: \"development\" === \"development\"\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1lBQzlCLDBFQUEwRTtZQUMxRSxNQUFNRSxnQkFBZ0I7Z0JBQ3BCLEdBQUdQLE9BQU87Z0JBQ1ZULE1BQU07b0JBQ0osR0FBR1MsUUFBUVQsSUFBSTtvQkFDZkUsSUFBSVksTUFBTVosRUFBRTtvQkFDWjVCLFVBQVV3QyxNQUFNeEMsUUFBUTtvQkFDeEIyQixNQUFNYSxNQUFNYixJQUFJO29CQUNoQjdCLE1BQU0wQyxNQUFNeEMsUUFBUTtvQkFDcEI2QixPQUFPO29CQUNQQyxjQUFjVSxNQUFNVixZQUFZLElBQUk7b0JBQ3BDRSxxQkFBcUJRLE1BQU1SLG1CQUFtQixJQUFJO29CQUNsRFcsU0FBU0MsUUFBUUosTUFBTVYsWUFBWTtnQkFDckM7WUFDRjtZQUNBLE9BQU9ZO1FBQ1Q7UUFFQSxNQUFNRyxVQUFTLEVBQUVDLEdBQUcsRUFBRUMsT0FBTyxFQUFFO1lBQzdCLE9BQU8sQ0FBQyxFQUFFQSxRQUFRLGNBQWMsQ0FBQztRQUNuQztJQUNGO0lBRUFDLE9BQU87UUFDTEMsUUFBUTtJQUNWO0lBRUFDLE9BQU94QyxrQkFBeUI7QUFDbEMsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL3Bvcy1hcHAvLi9saWIvYXV0aC1vcHRpb25zLnRzP2FhNzEiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL2F1dGgtb3B0aW9ucy50c1xyXG5pbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tIFwibmV4dC1hdXRoXCI7XHJcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gXCJuZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcclxuICBwcm92aWRlcnM6IFtcclxuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xyXG4gICAgICBuYW1lOiBcIkNyZWRlbnRpYWxzXCIsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiB7XHJcbiAgICAgICAgdXNlcm5hbWU6IHsgbGFiZWw6IFwiVXNlcm5hbWVcIiwgdHlwZTogXCJ0ZXh0XCIgfSxcclxuICAgICAgICBwYXNzd29yZDogeyBsYWJlbDogXCJQYXNzd29yZFwiLCB0eXBlOiBcInBhc3N3b3JkXCIgfSxcclxuICAgICAgfSxcclxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJbTkVYVEFVVEhdW0FVVEhPUklaRV0gUmVjZWl2ZWQgY3JlZGVudGlhbHM6XCIsIHsgdXNlcm5hbWU6IGNyZWRlbnRpYWxzPy51c2VybmFtZSB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFjcmVkZW50aWFscz8udXNlcm5hbWUgfHwgIWNyZWRlbnRpYWxzPy5wYXNzd29yZCkge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW05FWFRBVVRIXVtBVVRIT1JJWkVdIE1pc3NpbmcgdXNlcm5hbWUgb3IgcGFzc3dvcmRcIik7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAvLyDinIUgU2VzdWFpa2FuIGRlbmdhbiBVUkwgYmFja2VuZCBBbmRhXHJcbiAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19BUElfVVJMfS9hcGkvYXV0aC9sb2dpbmAsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgdXNlcm5hbWU6IGNyZWRlbnRpYWxzLnVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBjcmVkZW50aWFscy5wYXNzd29yZCxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzLnRleHQoKTtcclxuICAgICAgICAgIGxldCBkYXRhOiBhbnk7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZSh0ZXh0KTtcclxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW05FWFRBVVRIXVtBVVRIT1JJWkVdIEJhY2tlbmQgcmV0dXJuZWQgaW52YWxpZCBKU09OOlwiLCB0ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHJlcy5vayAmJiBkYXRhLnN1Y2Nlc3MgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgY29uc3QgcmF3Um9sZSA9IGRhdGEudXNlci5yb2xlO1xyXG4gICAgICAgICAgICBpZiAocmF3Um9sZSAhPT0gXCJjYXNoaWVyXCIgJiYgcmF3Um9sZSAhPT0gXCJhZG1pblwiKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIltORVhUQVVUSF1bQVVUSE9SSVpFXSBJbnZhbGlkIHJvbGUgcmVjZWl2ZWQ6XCIsIHJhd1JvbGUpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIGlkOiBkYXRhLnVzZXIuaWQsXHJcbiAgICAgICAgICAgICAgdXNlcm5hbWU6IGRhdGEudXNlci51c2VybmFtZSxcclxuICAgICAgICAgICAgICByb2xlOiByYXdSb2xlLFxyXG4gICAgICAgICAgICAgIG5hbWU6IGRhdGEudXNlci51c2VybmFtZSxcclxuICAgICAgICAgICAgICBlbWFpbDogXCJcIixcclxuICAgICAgICAgICAgICBiYWNrZW5kVG9rZW46IGRhdGEuYWNjZXNzVG9rZW4gPz8gbnVsbCxcclxuICAgICAgICAgICAgICBiYWNrZW5kUmVmcmVzaFRva2VuOiBkYXRhLnJlZnJlc2hUb2tlbiA/PyBudWxsLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW05FWFRBVVRIXVtBVVRIT1JJWkVdIOKdjCBCYWNrZW5kIGxvZ2luIGZhaWxlZDpcIiwgZGF0YS5tZXNzYWdlIHx8IGRhdGEpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIltORVhUQVVUSF1bQVVUSE9SSVpFXSDwn4yQIE5ldHdvcmsgZXJyb3I6XCIsIGVyci5tZXNzYWdlIHx8IGVycik7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG5cclxuICBzZXNzaW9uOiB7XHJcbiAgICBzdHJhdGVneTogXCJqd3RcIixcclxuICAgIG1heEFnZTogOCAqIDYwICogNjAsIC8vIDggamFtXHJcbiAgfSxcclxuXHJcbiAgY2FsbGJhY2tzOiB7XHJcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XHJcbiAgICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgLy8gVHlwZSBhc3NlcnRpb24gdW50dWsgdXNlciBhZ2FyIHNlc3VhaSBkZW5nYW4gdGlwZSB5YW5nIGRpZGVmaW5pc2lrYW5cclxuICAgICAgICBjb25zdCB0eXBlZFVzZXIgPSB1c2VyIGFzIHtcclxuICAgICAgICAgIGlkOiBzdHJpbmc7XHJcbiAgICAgICAgICB1c2VybmFtZTogc3RyaW5nO1xyXG4gICAgICAgICAgcm9sZTogXCJjYXNoaWVyXCIgfCBcImFkbWluXCI7XHJcbiAgICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgICBlbWFpbD86IHN0cmluZztcclxuICAgICAgICAgIGJhY2tlbmRUb2tlbj86IHN0cmluZyB8IG51bGw7XHJcbiAgICAgICAgICBiYWNrZW5kUmVmcmVzaFRva2VuPzogc3RyaW5nIHwgbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRva2VuLmlkID0gdHlwZWRVc2VyLmlkO1xyXG4gICAgICAgIHRva2VuLnVzZXJuYW1lID0gdHlwZWRVc2VyLnVzZXJuYW1lO1xyXG4gICAgICAgIHRva2VuLnJvbGUgPSB0eXBlZFVzZXIucm9sZTtcclxuICAgICAgICB0b2tlbi5iYWNrZW5kVG9rZW4gPSB0eXBlZFVzZXIuYmFja2VuZFRva2VuID8/IG51bGw7XHJcbiAgICAgICAgdG9rZW4uYmFja2VuZFJlZnJlc2hUb2tlbiA9IHR5cGVkVXNlci5iYWNrZW5kUmVmcmVzaFRva2VuID8/IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xyXG4gICAgICAvLyBUeXBlIGFzc2VydGlvbiB1bnR1ayBzZXNzaW9uIGFnYXIgc2VzdWFpIGRlbmdhbiB0aXBlIHlhbmcgZGlkZWZpbmlzaWthblxyXG4gICAgICBjb25zdCBjdXN0b21TZXNzaW9uID0ge1xyXG4gICAgICAgIC4uLnNlc3Npb24sXHJcbiAgICAgICAgdXNlcjoge1xyXG4gICAgICAgICAgLi4uc2Vzc2lvbi51c2VyLFxyXG4gICAgICAgICAgaWQ6IHRva2VuLmlkIGFzIHN0cmluZyxcclxuICAgICAgICAgIHVzZXJuYW1lOiB0b2tlbi51c2VybmFtZSBhcyBzdHJpbmcsXHJcbiAgICAgICAgICByb2xlOiB0b2tlbi5yb2xlIGFzIFwiY2FzaGllclwiIHwgXCJhZG1pblwiLFxyXG4gICAgICAgICAgbmFtZTogdG9rZW4udXNlcm5hbWUgYXMgc3RyaW5nLFxyXG4gICAgICAgICAgZW1haWw6IFwiXCIsXHJcbiAgICAgICAgICBiYWNrZW5kVG9rZW46IHRva2VuLmJhY2tlbmRUb2tlbiA/PyBudWxsLFxyXG4gICAgICAgICAgYmFja2VuZFJlZnJlc2hUb2tlbjogdG9rZW4uYmFja2VuZFJlZnJlc2hUb2tlbiA/PyBudWxsLFxyXG4gICAgICAgICAgaXNWYWxpZDogQm9vbGVhbih0b2tlbi5iYWNrZW5kVG9rZW4pLFxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIGN1c3RvbVNlc3Npb247XHJcbiAgICB9LFxyXG5cclxuICAgIGFzeW5jIHJlZGlyZWN0KHsgdXJsLCBiYXNlVXJsIH0pIHtcclxuICAgICAgcmV0dXJuIGAke2Jhc2VVcmx9L2F1dGgtcmVkaXJlY3RgO1xyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBwYWdlczoge1xyXG4gICAgc2lnbkluOiBcIi9sb2dpblwiLFxyXG4gIH0sXHJcblxyXG4gIGRlYnVnOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJkZXZlbG9wbWVudFwiLFxyXG59O1xyXG4iXSwibmFtZXMiOlsiQ3JlZGVudGlhbHNQcm92aWRlciIsImF1dGhPcHRpb25zIiwicHJvdmlkZXJzIiwibmFtZSIsImNyZWRlbnRpYWxzIiwidXNlcm5hbWUiLCJsYWJlbCIsInR5cGUiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsImNvbnNvbGUiLCJsb2ciLCJ3YXJuIiwicmVzIiwiZmV0Y2giLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfQVBJX1VSTCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInRleHQiLCJkYXRhIiwicGFyc2UiLCJlcnIiLCJlcnJvciIsIm9rIiwic3VjY2VzcyIsInJhd1JvbGUiLCJ1c2VyIiwicm9sZSIsImlkIiwiZW1haWwiLCJiYWNrZW5kVG9rZW4iLCJhY2Nlc3NUb2tlbiIsImJhY2tlbmRSZWZyZXNoVG9rZW4iLCJyZWZyZXNoVG9rZW4iLCJtZXNzYWdlIiwic2Vzc2lvbiIsInN0cmF0ZWd5IiwibWF4QWdlIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJ0eXBlZFVzZXIiLCJjdXN0b21TZXNzaW9uIiwiaXNWYWxpZCIsIkJvb2xlYW4iLCJyZWRpcmVjdCIsInVybCIsImJhc2VVcmwiLCJwYWdlcyIsInNpZ25JbiIsImRlYnVnIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth-options.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=D%3A%5CMY%20Data%5Ckerjaan%5C2025%5Cpa%20abas%20project%5Cpos-structure%5Cpos-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMY%20Data%5Ckerjaan%5C2025%5Cpa%20abas%20project%5Cpos-structure%5Cpos-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();