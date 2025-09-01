import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const SyncIndicator = ({ syncStatus }) => /* @__PURE__ */ jsxDEV("div", { className: "sync-indicator", children: /* @__PURE__ */ jsxDEV("div", { className: `px-3 py-1 rounded-full text-xs font-mono ${syncStatus === "synced" ? "bg-green-100 text-green-800" : syncStatus === "syncing" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`, children: [
  syncStatus === "synced" && "\u25CF Synced",
  syncStatus === "syncing" && "\u27F3 Syncing...",
  syncStatus === "error" && "\u26A0 Sync Error"
] }, void 0, true, {
  fileName: "<stdin>",
  lineNumber: 5,
  columnNumber: 9
}) }, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 4,
  columnNumber: 5
});
var stdin_default = SyncIndicator;
export {
  stdin_default as default
};
