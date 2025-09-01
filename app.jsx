import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
const room = new WebsimSocket();
const createHistoryEntry = (data, action = "create", parentId = null) => ({
  id: crypto.randomUUID(),
  timestamp: (/* @__PURE__ */ new Date()).toISOString(),
  action,
  parentId,
  data,
  version: 1
});
const appendToHistory = (history = [], newData, action = "update", parentId = null) => {
  const lastVersion = history.length > 0 ? history[history.length - 1].version : 0;
  return [...history, {
    ...createHistoryEntry(newData, action, parentId),
    version: lastVersion + 1
  }];
};
const syncWithDatabase = async (localData, dbData, currentUserId) => {
  if (!localData && !dbData) return null;
  if (!localData) return dbData;
  if (!dbData) return localData;
  const localTimestamp = new Date(localData.last_sync || 0);
  const dbTimestamp = new Date(dbData.last_sync || 0);
  const mergeHistories = (localHist = [], dbHist = []) => {
    const combined = [...localHist, ...dbHist];
    const uniqueById = /* @__PURE__ */ new Map();
    combined.forEach((entry) => {
      const existing = uniqueById.get(entry.id);
      if (!existing || new Date(entry.timestamp) > new Date(existing.timestamp)) {
        uniqueById.set(entry.id, entry);
      }
    });
    return Array.from(uniqueById.values()).sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  };
  const merged = {
    generated_images: mergeHistories(localData.generated_images, dbData.generated_images),
    forked_images: mergeHistories(localData.forked_images, dbData.forked_images),
    public_gallery: [.../* @__PURE__ */ new Set([...localData.public_gallery || [], ...dbData.public_gallery || []])],
    last_sync: (/* @__PURE__ */ new Date()).toISOString()
  };
  return merged;
};
const saveToLocalStorage = (userId, data) => {
  localStorage.setItem(`gallery_${userId}`, JSON.stringify({
    ...data,
    last_sync: (/* @__PURE__ */ new Date()).toISOString()
  }));
};
const getFromLocalStorage = (userId) => {
  const stored = localStorage.getItem(`gallery_${userId}`);
  return stored ? JSON.parse(stored) : null;
};
const ImageCard = ({ image, showFork = true, showVersions = false, currentUser, setSelectedImage }) => /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg overflow-hidden shadow-sm image-hover", children: [
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
        lineNumber: 78,
        columnNumber: 13
      }
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute top-2 right-2 version-badge text-white text-xs px-2 py-1 rounded", children: [
      "v",
      image.version
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 83,
      columnNumber: 13
    }),
    image.type === "forked" && /* @__PURE__ */ jsxDEV("div", { className: "absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded", children: "Forked" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 87,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 77,
    columnNumber: 9
  }),
  /* @__PURE__ */ jsxDEV("div", { className: "p-4", children: [
    /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mb-2 line-clamp-2", children: image.data.prompt }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 93,
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
            lineNumber: 96,
            columnNumber: 21
          }
        ),
        /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-500 font-mono", children: image.userId }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 101,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 95,
        columnNumber: 17
      }),
      showFork && currentUser?.id !== image.userId && /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setSelectedImage(image),
          className: "fork-button text-white text-xs px-3 py-1 rounded",
          children: "Fork"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 104,
          columnNumber: 21
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 94,
      columnNumber: 13
    }),
    showVersions && /* @__PURE__ */ jsxDEV("div", { className: "mt-2 text-xs text-gray-400", children: new Date(image.timestamp).toLocaleDateString() }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 113,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 92,
    columnNumber: 9
  })
] }, void 0, true, {
  fileName: "<stdin>",
  lineNumber: 76,
  columnNumber: 5
});
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
      lineNumber: 138,
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
            lineNumber: 144,
            columnNumber: 29
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-medium text-blue-800", children: "Reference Image" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 150,
            columnNumber: 33
          }),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-blue-600", children: referenceImage.name }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 151,
            columnNumber: 33
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 149,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 143,
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
          lineNumber: 154,
          columnNumber: 25
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 142,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 141,
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
          lineNumber: 165,
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
            lineNumber: 174,
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
              lineNumber: 187,
              columnNumber: 25
            })
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 181,
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
            lineNumber: 189,
            columnNumber: 21
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 173,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 164,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 137,
    columnNumber: 9
  }),
  currentUser && /* @__PURE__ */ jsxDEV("div", { className: "mt-8", children: [
    /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-semibold mb-4", children: "Your Images" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 202,
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
        lineNumber: 205,
        columnNumber: 25
      }
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 203,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 201,
    columnNumber: 13
  })
] }, void 0, true, {
  fileName: "<stdin>",
  lineNumber: 136,
  columnNumber: 5
}));
const ForkModal = ({ selectedImage, setSelectedImage, forkPrompt, setForkPrompt, forkImage, isGenerating }) => {
  if (!selectedImage) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg p-6 max-w-2xl w-full mx-4", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-semibold", children: "Fork Image" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 227,
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
          lineNumber: 228,
          columnNumber: 21
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 226,
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
          lineNumber: 237,
          columnNumber: 21
        }
      ),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mt-2", children: [
        'Original: "',
        selectedImage.data.prompt,
        '"'
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 242,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 236,
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
        lineNumber: 247,
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
          lineNumber: 256,
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
          lineNumber: 262,
          columnNumber: 21
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 255,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 225,
    columnNumber: 13
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 224,
    columnNumber: 9
  });
};
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedImage, setSelectedImage] = useState(null);
  const [forkPrompt, setForkPrompt] = useState("");
  const [syncStatus, setSyncStatus] = useState("synced");
  const [referenceImage, setReferenceImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { data: allUserGalleries, loading } = useQuery(room.collection("user_gallery"));
  useEffect(() => {
    const initUser = async () => {
      const user = await window.websim.getCurrentUser();
      setCurrentUser(user);
      await performSync(user.id);
    };
    initUser();
  }, []);
  const performSync = async (userId) => {
    setSyncStatus("syncing");
    try {
      const localData = getFromLocalStorage(userId);
      const dbData = allUserGalleries?.find((g) => g.id === userId);
      const merged = await syncWithDatabase(localData, dbData, userId);
      if (merged) {
        saveToLocalStorage(userId, merged);
        await room.collection("user_gallery").upsert({
          id: userId,
          ...merged
        });
      }
      setSyncStatus("synced");
    } catch (error) {
      console.error("Sync error:", error);
      setSyncStatus("error");
    }
  };
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
  const getAllPublicImages = () => {
    if (!allUserGalleries) return [];
    const publicImages = [];
    allUserGalleries.forEach((gallery) => {
      const publicIds = gallery.public_gallery || [];
      (gallery.generated_images || []).forEach((entry) => {
        if (publicIds.includes(entry.id)) {
          publicImages.push({
            ...entry,
            userId: gallery.id,
            type: "generated"
          });
        }
      });
      (gallery.forked_images || []).forEach((entry) => {
        if (publicIds.includes(entry.id)) {
          publicImages.push({
            ...entry,
            userId: gallery.id,
            type: "forked"
          });
        }
      });
    });
    return publicImages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };
  const getUserImages = (userId) => {
    const gallery = allUserGalleries?.find((g) => g.id === userId);
    if (!gallery) return [];
    const images = [];
    (gallery.generated_images || []).forEach((entry) => images.push({ ...entry, type: "generated" }));
    (gallery.forked_images || []).forEach((entry) => images.push({ ...entry, type: "forked" }));
    return images.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };
  const getVersionHistory = (imageId, userId) => {
    const gallery = allUserGalleries?.find((g) => g.id === userId);
    if (!gallery) return [];
    const allImages = [...gallery.generated_images || [], ...gallery.forked_images || []];
    const targetImage = allImages.find((img) => img.id === imageId);
    if (!targetImage || !targetImage.parentId) return [targetImage];
    const versions = [targetImage];
    let currentParent = targetImage.parentId;
    while (currentParent) {
      const parentImage = allImages.find((img) => img.id === currentParent);
      if (parentImage) {
        versions.unshift(parentImage);
        currentParent = parentImage.parentId;
      } else {
        break;
      }
    }
    return versions;
  };
  const SyncIndicator = () => /* @__PURE__ */ jsxDEV("div", { className: "sync-indicator", children: /* @__PURE__ */ jsxDEV("div", { className: `px-3 py-1 rounded-full text-xs font-mono ${syncStatus === "synced" ? "bg-green-100 text-green-800" : syncStatus === "syncing" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`, children: [
    syncStatus === "synced" && "\u25CF Synced",
    syncStatus === "syncing" && "\u27F3 Syncing...",
    syncStatus === "error" && "\u26A0 Sync Error"
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 577,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 576,
    columnNumber: 9
  }, this);
  const GalleryTab = () => {
    const publicImages = getAllPublicImages();
    return /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold mb-6", children: "Public Gallery" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 594,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: publicImages.map((image) => /* @__PURE__ */ jsxDEV(
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
          lineNumber: 597,
          columnNumber: 25
        },
        this
      )) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 595,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 593,
      columnNumber: 13
    }, this);
  };
  const LeaderboardTab = () => {
    const { data: leaderboardData, loading: leaderboardLoading } = useQuery(room.query(`
            SELECT 
                ug.id as user_id,
                u.username,
                COALESCE(jsonb_array_length(ug.generated_images), 0) as generated_count,
                COALESCE(jsonb_array_length(ug.forked_images), 0) as forked_count,
                COALESCE(jsonb_array_length(ug.public_gallery), 0) as public_count,
                ug.last_sync as last_activity
            FROM public.user_gallery ug
            JOIN public.user u ON ug.id::uuid = u.id
            ORDER BY (COALESCE(jsonb_array_length(ug.generated_images), 0) + COALESCE(jsonb_array_length(ug.forked_images), 0)) DESC
        `));
    const leaderboard = leaderboardData?.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
      totalActivity: entry.generated_count + entry.forked_count
    })) || [];
    if (leaderboardLoading) {
      return /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold mb-6", children: "Leaderboard" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 632,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "loading-shimmer w-full h-64 rounded-lg" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 633,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 631,
        columnNumber: 17
      }, this);
    }
    return /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold mb-6", children: "Leaderboard" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 640,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm", children: [
          /* @__PURE__ */ jsxDEV("div", { children: "Rank" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 643,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: "User" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 644,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: "Generated" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 645,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: "Forked" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 646,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: "Public" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 647,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: "Last Activity" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 648,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 642,
          columnNumber: 21
        }, this),
        leaderboard.map((entry) => /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-6 gap-4 p-4 border-t border-gray-100 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "font-mono", children: [
            "#",
            entry.rank
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 652,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxDEV(
              "img",
              {
                src: `https://images.websim.com/avatar/${entry.username}`,
                className: "w-6 h-6 rounded-full",
                alt: "Avatar"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 654,
                columnNumber: 33
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("span", { className: "font-medium text-sm", children: entry.username }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 659,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 653,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: entry.generated_count }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 661,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: entry.forked_count }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 662,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: entry.public_count }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 663,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-500", children: entry.last_activity ? new Date(entry.last_activity).toLocaleDateString() : "Never" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 664,
            columnNumber: 29
          }, this)
        ] }, entry.user_id, true, {
          fileName: "<stdin>",
          lineNumber: 651,
          columnNumber: 25
        }, this))
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 641,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 639,
      columnNumber: 13
    }, this);
  };
  if (!currentUser) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "loading-shimmer w-32 h-8 rounded" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 677,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 676,
      columnNumber: 13
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV(SyncIndicator, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 684,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("header", { className: "bg-white shadow-sm border-b", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto px-4 py-4", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl font-semibold", children: "AI Image Generator" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 688,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("nav", { className: "mt-4", children: /* @__PURE__ */ jsxDEV("div", { className: "flex space-x-6", children: [
        { key: "generate", label: "Generate" },
        { key: "gallery", label: "Gallery" },
        { key: "leaderboard", label: "Leaderboard" }
      ].map((tab) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setActiveTab(tab.key),
          className: `pb-2 border-b-2 transition-colors ${activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-800"}`,
          children: tab.label
        },
        tab.key,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 696,
          columnNumber: 33
        },
        this
      )) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 690,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 689,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 687,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 686,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "max-w-6xl mx-auto px-4 py-8", children: [
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
          getUserImages,
          setSelectedImage
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 715,
          columnNumber: 21
        },
        this
      ),
      activeTab === "gallery" && /* @__PURE__ */ jsxDEV(GalleryTab, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 730,
        columnNumber: 45
      }, this),
      activeTab === "leaderboard" && /* @__PURE__ */ jsxDEV(LeaderboardTab, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 731,
        columnNumber: 49
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 713,
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
        lineNumber: 734,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 683,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 747,
  columnNumber: 13
}));
