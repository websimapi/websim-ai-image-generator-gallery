import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
const ForkModal = ({ selectedImage, setSelectedImage, forkPrompt, setForkPrompt, forkImage, isGenerating }) => {
  if (!selectedImage) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg p-6 max-w-2xl w-full mx-4", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-semibold", children: "Fork Image" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 10,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setSelectedImage(null),
          className: "text-gray-500 hover:text-gray-700 text-xl",
          children: "\xD7"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 11,
          columnNumber: 21
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 17
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxDEV(
        "img",
        {
          src: selectedImage.data.url,
          alt: "Original",
          className: "w-full h-48 object-cover rounded-lg"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 20,
          columnNumber: 21
        }
      ),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mt-2", children: [
        'Original: "',
        selectedImage.data.prompt,
        '"'
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 25,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 19,
      columnNumber: 17
    }),
    /* @__PURE__ */ jsxDEV(
      "textarea",
      {
        value: forkPrompt,
        onChange: (e) => setForkPrompt(e.target.value),
        placeholder: "Describe how you want to modify this image...",
        className: "w-full h-24 border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4",
        disabled: isGenerating
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 30,
        columnNumber: 17
      }
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "flex space-x-3", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setSelectedImage(null),
          className: "flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors",
          children: "Cancel"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 39,
          columnNumber: 21
        }
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => forkImage(selectedImage, selectedImage.userId),
          disabled: isGenerating || !forkPrompt.trim(),
          className: "flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors",
          children: isGenerating ? "Forking..." : "Fork Image"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 45,
          columnNumber: 21
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 38,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 8,
    columnNumber: 13
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 7,
    columnNumber: 9
  });
};
var stdin_default = ForkModal;
export {
  stdin_default as default
};
