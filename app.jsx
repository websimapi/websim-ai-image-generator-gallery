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
const GenerateTab = ({
  prompt,
  setPrompt,
  isGenerating,
  generateImage,
  referenceImage,
  setReferenceImage,
  fileInputRef,
  handleFileUpload,
  isUploading,
  currentUser,
  getUserImages
}) => /* @__PURE__ */ jsxDEV("div", { className: "max-w-2xl mx-auto", children: [
  /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold mb-4", children: "Generate New Image" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 90,
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
            lineNumber: 96,
            columnNumber: 29
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-medium text-blue-800", children: "Reference Image" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 102,
            columnNumber: 33
          }),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-blue-600", children: referenceImage.name }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 103,
            columnNumber: 33
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 101,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 95,
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
          lineNumber: 106,
          columnNumber: 25
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 94,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 93,
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
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 117,
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
            lineNumber: 125,
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
              lineNumber: 138,
              columnNumber: 25
            })
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 132,
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
            lineNumber: 140,
            columnNumber: 21
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 124,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 116,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 89,
    columnNumber: 9
  }),
  currentUser && /* @__PURE__ */ jsxDEV("div", { className: "mt-8", children: [
    /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-semibold mb-4", children: "Your Images" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 153,
      columnNumber: 17
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: getUserImages(currentUser.id).map((image) => /* @__PURE__ */ jsxDEV(ImageCard, { image, showFork: false, showVersions: true }, image.id, false, {
      fileName: "<stdin>",
      lineNumber: 156,
      columnNumber: 25
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 154,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 152,
    columnNumber: 13
  })
] }, void 0, true, {
  fileName: "<stdin>",
  lineNumber: 88,
  columnNumber: 5
});
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
        public_gallery: [...localData.public_gallery || [], ...updatedHistory.map((img) => img.id)],
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
    lineNumber: 466,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 465,
    columnNumber: 9
  }, this);
  const ImageCard2 = ({ image, showFork = true, showVersions = false }) => /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg overflow-hidden shadow-sm image-hover", children: [
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
          lineNumber: 481,
          columnNumber: 17
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "absolute top-2 right-2 version-badge text-white text-xs px-2 py-1 rounded", children: [
        "v",
        image.version
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 486,
        columnNumber: 17
      }, this),
      image.type === "forked" && /* @__PURE__ */ jsxDEV("div", { className: "absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded", children: "Forked" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 490,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 480,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mb-2 line-clamp-2", children: image.data.prompt }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 496,
        columnNumber: 17
      }, this),
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
              lineNumber: 499,
              columnNumber: 25
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-500 font-mono", children: image.userId }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 504,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 498,
          columnNumber: 21
        }, this),
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
            lineNumber: 507,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 497,
        columnNumber: 17
      }, this),
      showVersions && /* @__PURE__ */ jsxDEV("div", { className: "mt-2 text-xs text-gray-400", children: new Date(image.timestamp).toLocaleDateString() }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 516,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 495,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 479,
    columnNumber: 9
  }, this);
  const GalleryTab = () => {
    const publicImages = getAllPublicImages();
    return /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold mb-6", children: "Public Gallery" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 529,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: publicImages.map((image) => /* @__PURE__ */ jsxDEV(ImageCard2, { image }, `${image.userId}-${image.id}`, false, {
        fileName: "<stdin>",
        lineNumber: 532,
        columnNumber: 25
      }, this)) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 530,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 528,
      columnNumber: 13
    }, this);
  };
  const ForkModal = () => {
    if (!selectedImage) return null;
    const versions = getVersionHistory(selectedImage.id, selectedImage.userId);
    return /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto", children: /* @__PURE__ */ jsxDEV("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-semibold", children: "Fork Image" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 549,
          columnNumber: 29
        }, this),
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
            lineNumber: 550,
            columnNumber: 29
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 548,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "font-medium mb-2", children: "Original Image" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 560,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: selectedImage.data.url,
              alt: selectedImage.data.prompt,
              className: "w-full rounded-lg"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 561,
              columnNumber: 33
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mt-2", children: selectedImage.data.prompt }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 566,
            columnNumber: 33
          }, this),
          versions.length > 1 && /* @__PURE__ */ jsxDEV("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxDEV("h5", { className: "font-medium text-sm mb-2", children: "Version History" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 570,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 max-h-32 overflow-auto", children: versions.map((version, idx) => /* @__PURE__ */ jsxDEV("div", { className: "text-xs bg-gray-50 p-2 rounded", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-mono", children: [
                "v",
                version.version
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 574,
                columnNumber: 53
              }, this),
              " - ",
              version.data.prompt
            ] }, version.id, true, {
              fileName: "<stdin>",
              lineNumber: 573,
              columnNumber: 49
            }, this)) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 571,
              columnNumber: 41
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 569,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 559,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "font-medium mb-2", children: "Your Fork" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 583,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV(
            "textarea",
            {
              value: forkPrompt,
              onChange: (e) => setForkPrompt(e.target.value),
              placeholder: "Modify the prompt to create your fork...",
              className: "w-full h-32 border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 584,
              columnNumber: 33
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => forkImage(selectedImage, selectedImage.userId),
              disabled: isGenerating || !forkPrompt.trim(),
              className: "w-full mt-4 fork-button text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50",
              children: isGenerating ? "Creating Fork..." : "Create Fork"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 590,
              columnNumber: 33
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 582,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 558,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 547,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 546,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 545,
      columnNumber: 13
    }, this);
  };
  const LeaderboardTab = () => {
    const leaderboard = allUserGalleries?.map((gallery) => {
      const generatedCount = (gallery.generated_images || []).length;
      const forkedCount = (gallery.forked_images || []).length;
      const publicCount = (gallery.public_gallery || []).length;
      return {
        userId: gallery.id,
        generatedCount,
        forkedCount,
        publicCount,
        totalActivity: generatedCount + forkedCount,
        lastActivity: Math.max(
          ...(gallery.generated_images || []).map((img) => new Date(img.timestamp)),
          ...(gallery.forked_images || []).map((img) => new Date(img.timestamp))
        )
      };
    }).sort((a, b) => b.totalActivity - a.totalActivity) || [];
    return /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-semibold mb-6", children: "Leaderboard" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 626,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-lg shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm", children: [
          /* @__PURE__ */ jsxDEV("div", { children: "Rank" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 629,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: "User" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 630,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: "Generated" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 631,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: "Forked" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 632,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: "Public" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 633,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: "Last Activity" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 634,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 628,
          columnNumber: 21
        }, this),
        leaderboard.map((entry, idx) => /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-6 gap-4 p-4 border-t border-gray-100 hover:bg-gray-50", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "font-mono", children: [
            "#",
            idx + 1
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 638,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxDEV(
              "img",
              {
                src: `https://images.websim.com/avatar/${entry.userId}`,
                className: "w-6 h-6 rounded-full",
                alt: "Avatar"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 640,
                columnNumber: 33
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-sm", children: entry.userId }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 645,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 639,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: entry.generatedCount }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 647,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: entry.forkedCount }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 648,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: entry.publicCount }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 649,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-500", children: isNaN(entry.lastActivity) ? "Never" : new Date(entry.lastActivity).toLocaleDateString() }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 650,
            columnNumber: 29
          }, this)
        ] }, entry.userId, true, {
          fileName: "<stdin>",
          lineNumber: 637,
          columnNumber: 25
        }, this))
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 627,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 625,
      columnNumber: 13
    }, this);
  };
  if (!currentUser) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "loading-shimmer w-32 h-8 rounded" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 663,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 662,
      columnNumber: 13
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV(SyncIndicator, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 670,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("header", { className: "bg-white shadow-sm border-b", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto px-4 py-4", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl font-semibold", children: "AI Image Generator" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 674,
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
          lineNumber: 682,
          columnNumber: 33
        },
        this
      )) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 676,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 675,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 673,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 672,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "max-w-6xl mx-auto px-4 py-8", children: [
      activeTab === "generate" && /* @__PURE__ */ jsxDEV(
        GenerateTab,
        {
          prompt,
          setPrompt,
          isGenerating,
          generateImage,
          referenceImage,
          setReferenceImage,
          fileInputRef,
          handleFileUpload,
          isUploading,
          currentUser,
          getUserImages
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 701,
          columnNumber: 21
        },
        this
      ),
      activeTab === "gallery" && /* @__PURE__ */ jsxDEV(GalleryTab, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 715,
        columnNumber: 45
      }, this),
      activeTab === "leaderboard" && /* @__PURE__ */ jsxDEV(LeaderboardTab, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 716,
        columnNumber: 49
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 699,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(ForkModal, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 719,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 669,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 725,
  columnNumber: 13
}));
