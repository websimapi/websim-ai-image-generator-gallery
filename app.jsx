import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
import {
  appendToHistory,
  saveToLocalStorage,
  getFromLocalStorage,
  getAllPublicImages,
  getUserImages
} from "./utils.js";
import { useSync } from "./hooks/useSync.js";
import SyncIndicator from "./components/SyncIndicator.jsx";
import GenerateTab from "./components/GenerateTab.jsx";
import ForkModal from "./components/ForkModal.jsx";
import GalleryTab from "./components/GalleryTab.jsx";
import LeaderboardTab from "./components/LeaderboardTab.jsx";
const room = new WebsimSocket();
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedImage, setSelectedImage] = useState(null);
  const [forkPrompt, setForkPrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { data: allUserGalleries, loading } = useQuery(room.collection("user_gallery"));
  const { syncStatus, performSync } = useSync(room);
  useEffect(() => {
    const initUser = async () => {
      const user = await window.websim.getCurrentUser();
      setCurrentUser(user);
      await performSync(user.id, allUserGalleries);
    };
    initUser();
  }, []);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !currentUser) return;
    setIsUploading(true);
    try {
      const url = await websim.upload(file);
      const referenceData = {
        url,
        prompt: `Reference image: ${file.name}`,
        originalPrompt: `Reference image: ${file.name}`,
        isReference: true,
        isPublic: false
      };
      const localData = getFromLocalStorage(currentUser.id) || {
        generated_images: [],
        forked_images: [],
        public_gallery: []
      };
      const updatedHistory = appendToHistory(localData.forked_images, referenceData, "reference");
      const newData = {
        generated_images: localData.generated_images || [],
        forked_images: updatedHistory,
        public_gallery: localData.public_gallery || [],
        last_sync: (/* @__PURE__ */ new Date()).toISOString()
      };
      saveToLocalStorage(currentUser.id, newData);
      await room.collection("user_gallery").upsert({
        id: currentUser.id,
        ...newData
      });
      setReferenceImage({
        url,
        name: file.name
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };
  const generateImage = async () => {
    if (!prompt.trim() || !currentUser) return;
    setIsGenerating(true);
    try {
      const imageGenParams = {
        prompt,
        aspect_ratio: "1:1"
      };
      if (referenceImage) {
        const response = await fetch(referenceImage.url);
        const blob = await response.blob();
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        imageGenParams.image_inputs = [{
          url: dataUrl
        }];
      }
      const result = await websim.imageGen(imageGenParams);
      const imageData = {
        url: result.url,
        prompt,
        originalPrompt: referenceImage ? `${referenceImage.name}: ${prompt}` : prompt,
        isPublic: true,
        hasReference: !!referenceImage,
        referenceName: referenceImage?.name
      };
      const localData = getFromLocalStorage(currentUser.id) || {
        generated_images: [],
        forked_images: [],
        public_gallery: []
      };
      const targetHistory = referenceImage ? "forked_images" : "generated_images";
      const updatedHistory = appendToHistory(
        localData[targetHistory],
        imageData,
        referenceImage ? "fork" : "generate"
      );
      const imageId = updatedHistory[updatedHistory.length - 1].id;
      const newData = {
        generated_images: targetHistory === "generated_images" ? updatedHistory : localData.generated_images,
        forked_images: targetHistory === "forked_images" ? updatedHistory : localData.forked_images,
        public_gallery: [...localData.public_gallery || [], imageId],
        last_sync: (/* @__PURE__ */ new Date()).toISOString()
      };
      saveToLocalStorage(currentUser.id, newData);
      await room.collection("user_gallery").upsert({
        id: currentUser.id,
        ...newData
      });
      setPrompt("");
      setReferenceImage(null);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const forkImage = async (originalImage, originalUserId) => {
    if (!forkPrompt.trim() || !currentUser) return;
    setIsGenerating(true);
    try {
      const result = await websim.imageGen({
        prompt: forkPrompt,
        aspect_ratio: "1:1"
      });
      const forkData = {
        url: result.url,
        prompt: forkPrompt,
        originalPrompt: originalImage.data.originalPrompt || originalImage.data.prompt,
        parentImageId: originalImage.id,
        parentUserId: originalUserId,
        isPublic: true
      };
      const localData = getFromLocalStorage(currentUser.id) || {
        generated_images: [],
        forked_images: [],
        public_gallery: []
      };
      const updatedForks = appendToHistory(localData.forked_images, forkData, "fork", originalImage.id);
      const forkId = updatedForks[updatedForks.length - 1].id;
      const newData = {
        generated_images: localData.generated_images || [],
        forked_images: updatedForks,
        public_gallery: [...localData.public_gallery || [], forkId],
        last_sync: (/* @__PURE__ */ new Date()).toISOString()
      };
      saveToLocalStorage(currentUser.id, newData);
      await room.collection("user_gallery").upsert({
        id: currentUser.id,
        ...newData
      });
      setSelectedImage(null);
      setForkPrompt("");
      setActiveTab("gallery");
    } catch (error) {
      console.error("Fork error:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  if (!currentUser) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center mobile-padding", children: /* @__PURE__ */ jsxDEV("div", { className: "loading-shimmer w-32 h-8 rounded" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 223,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 222,
      columnNumber: 13
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV(SyncIndicator, { syncStatus }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 230,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("header", { className: "bg-white shadow-sm border-b sticky top-0 z-40", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto mobile-padding py-4", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl md:text-3xl font-semibold", children: "AI Image Generator" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 234,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("nav", { className: "mt-4", children: /* @__PURE__ */ jsxDEV("div", { className: "flex mobile-nav", children: [
        { key: "generate", label: "Generate" },
        { key: "gallery", label: "Gallery" },
        { key: "leaderboard", label: "Leaderboard" }
      ].map((tab) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setActiveTab(tab.key),
          className: `mobile-button pb-2 border-b-2 transition-colors touch-friendly ${activeTab === tab.key ? "border-blue-600 text-blue-600 font-medium" : "border-transparent text-gray-600 hover:text-gray-800"}`,
          children: tab.label
        },
        tab.key,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 242,
          columnNumber: 33
        },
        this
      )) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 236,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 235,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 233,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 232,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "max-w-6xl mx-auto mobile-padding py-4 md:py-8 pb-safe", children: [
      activeTab === "generate" && /* @__PURE__ */ jsxDEV(
        GenerateTab,
        {
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
          getUserImages: (userId) => getUserImages(userId, allUserGalleries),
          setSelectedImage
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 261,
          columnNumber: 21
        },
        this
      ),
      activeTab === "gallery" && /* @__PURE__ */ jsxDEV(
        GalleryTab,
        {
          getAllPublicImages: () => getAllPublicImages(allUserGalleries),
          currentUser,
          setSelectedImage
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 277,
          columnNumber: 21
        },
        this
      ),
      activeTab === "leaderboard" && /* @__PURE__ */ jsxDEV(LeaderboardTab, { room }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 283,
        columnNumber: 49
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 259,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      ForkModal,
      {
        selectedImage,
        setSelectedImage,
        forkPrompt,
        setForkPrompt,
        forkImage,
        isGenerating
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 286,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 229,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 299,
  columnNumber: 13
}));
