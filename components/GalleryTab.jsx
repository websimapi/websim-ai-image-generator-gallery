import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import ImageCard from "./ImageCard.jsx";
const GalleryTab = ({ getAllPublicImages, currentUser, setSelectedImage }) => {
  const publicImages = getAllPublicImages();
  return /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-xl md:text-2xl font-semibold mb-4 md:mb-6", children: "Public Gallery" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "mobile-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: publicImages.map((image) => /* @__PURE__ */ jsxDEV(
      ImageCard,
      {
        image,
        currentUser,
        setSelectedImage
      },
      `${image.userId}-${image.id}`,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 12,
        columnNumber: 21
      }
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 10,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 8,
    columnNumber: 9
  });
};
var stdin_default = GalleryTab;
export {
  stdin_default as default
};
