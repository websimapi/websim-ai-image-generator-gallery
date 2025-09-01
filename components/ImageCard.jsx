import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const ImageCard = ({ image, showFork = true, showVersions = false, currentUser, setSelectedImage }) => /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg overflow-hidden shadow-sm mobile-card image-hover", children: [
  /* @__PURE__ */ jsxDEV("div", { className: "aspect-square relative", children: [
    /* @__PURE__ */ jsxDEV(
      "img",
      {
        src: image.data.url,
        alt: image.data.prompt,
        className: "w-full h-full object-cover"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 6,
        columnNumber: 13
      }
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute top-2 right-2 version-badge text-white text-xs px-2 py-1 rounded", children: [
      "v",
      image.version
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 11,
      columnNumber: 13
    }),
    image.type === "forked" && /* @__PURE__ */ jsxDEV("div", { className: "absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded", children: "Forked" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 15,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 5,
    columnNumber: 9
  }),
  /* @__PURE__ */ jsxDEV("div", { className: "p-3 md:p-4", children: [
    /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed", children: image.data.prompt }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 21,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: `https://images.websim.com/avatar/${image.userId || "anonymous"}`,
            className: "w-6 h-6 rounded-full",
            alt: "User avatar"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 24,
            columnNumber: 21
          }
        ),
        /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-500 font-mono truncate max-w-20", children: image.userId }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 29,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 23,
        columnNumber: 17
      }),
      showFork && currentUser?.id !== image.userId && /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setSelectedImage(image),
          className: "fork-button text-white text-xs px-3 py-2 rounded touch-friendly",
          children: "Fork"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 32,
          columnNumber: 21
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 22,
      columnNumber: 13
    }),
    showVersions && /* @__PURE__ */ jsxDEV("div", { className: "mt-2 text-xs text-gray-400", children: new Date(image.timestamp).toLocaleDateString() }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 41,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 20,
    columnNumber: 9
  })
] }, void 0, true, {
  fileName: "<stdin>",
  lineNumber: 4,
  columnNumber: 5
});
var stdin_default = ImageCard;
export {
  stdin_default as default
};
