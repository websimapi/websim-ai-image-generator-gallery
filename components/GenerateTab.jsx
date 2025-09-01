import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import ImageCard from "./ImageCard.jsx";
const GenerateTab = React.memo(({
  currentUser,
  prompt,
  setPrompt,
  isGenerating,
  referenceImage,
  setReferenceImage,
  generateImage,
  handleFileUpload,
  fileInputRef,
  isUploading,
  getUserImages,
  setSelectedImage
}) => /* @__PURE__ */ jsxDEV("div", { className: "max-w-2xl mx-auto", children: [
  /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold mb-4", children: "Generate New Image" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 20,
      columnNumber: 13
    }),
    referenceImage && /* @__PURE__ */ jsxDEV("div", { className: "mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: referenceImage.url,
            alt: "Reference",
            className: "w-12 h-12 object-cover rounded"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 26,
            columnNumber: 29
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-medium text-blue-800", children: "Reference Image" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 32,
            columnNumber: 33
          }),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-blue-600", children: referenceImage.name }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 33,
            columnNumber: 33
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 31,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 25,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setReferenceImage(null),
          className: "text-blue-600 hover:text-blue-800",
          children: "\xD7"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 36,
          columnNumber: 25
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 24,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 23,
      columnNumber: 17
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDEV(
        "textarea",
        {
          value: prompt,
          onChange: (e) => setPrompt(e.target.value),
          placeholder: referenceImage ? "Describe how you want to modify the reference image..." : "Describe the image you want to generate...",
          className: "w-full h-32 border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          disabled: isGenerating
        },
        "prompt-textarea",
        false,
        {
          fileName: "<stdin>",
          lineNumber: 47,
          columnNumber: 17
        }
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex space-x-3", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: generateImage,
            disabled: isGenerating || !prompt.trim(),
            className: "flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors",
            children: isGenerating ? "Generating... (10s)" : referenceImage ? "Generate from Reference" : "Generate Image"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 56,
            columnNumber: 21
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => fileInputRef.current?.click(),
            disabled: isUploading || isGenerating,
            className: "px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50",
            title: "Upload reference image",
            children: /* @__PURE__ */ jsxDEV("span", { className: "text-xl", children: isUploading ? "\u23F3" : "\u{1F4C1}" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 69,
              columnNumber: 25
            })
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 63,
            columnNumber: 21
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            onChange: handleFileUpload,
            className: "hidden"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 71,
            columnNumber: 21
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 55,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 46,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 19,
    columnNumber: 9
  }),
  currentUser && /* @__PURE__ */ jsxDEV("div", { className: "mt-8", children: [
    /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-semibold mb-4", children: "Your Images" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 84,
      columnNumber: 17
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: getUserImages(currentUser.id).map((image) => /* @__PURE__ */ jsxDEV(
      ImageCard,
      {
        image,
        showFork: false,
        showVersions: true,
        currentUser,
        setSelectedImage
      },
      image.id,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 87,
        columnNumber: 25
      }
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 85,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 83,
    columnNumber: 13
  })
] }, void 0, true, {
  fileName: "<stdin>",
  lineNumber: 18,
  columnNumber: 5
}));
var stdin_default = GenerateTab;
export {
  stdin_default as default
};
