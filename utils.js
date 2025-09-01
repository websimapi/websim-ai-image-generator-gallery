// Utility functions for blockchain-like JSON management
export const createHistoryEntry = (data, action = 'create', parentId = null) => ({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    parentId,
    data,
    version: 1
});

export const appendToHistory = (history = [], newData, action = 'update', parentId = null) => {
    const lastVersion = history.length > 0 ? history[history.length - 1].version : 0;
    return [...history, {
        ...createHistoryEntry(newData, action, parentId),
        version: lastVersion + 1
    }];
};

// Advanced sync algorithm
export const syncWithDatabase = async (localData, dbData, currentUserId) => {
    if (!localData && !dbData) return null;
    if (!localData) return dbData;
    if (!dbData) return localData;

    const localTimestamp = new Date(localData.last_sync || 0);
    const dbTimestamp = new Date(dbData.last_sync || 0);

    // Merge histories by timestamp, keeping all unique entries
    const mergeHistories = (localHist = [], dbHist = []) => {
        const combined = [...localHist, ...dbHist];
        const uniqueById = new Map();
        
        combined.forEach(entry => {
            const existing = uniqueById.get(entry.id);
            if (!existing || new Date(entry.timestamp) > new Date(existing.timestamp)) {
                uniqueById.set(entry.id, entry);
            }
        });
        
        return Array.from(uniqueById.values()).sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );
    };

    const merged = {
        generated_images: mergeHistories(localData.generated_images, dbData.generated_images),
        forked_images: mergeHistories(localData.forked_images, dbData.forked_images),
        public_gallery: [...new Set([...(localData.public_gallery || []), ...(dbData.public_gallery || [])])],
        last_sync: new Date().toISOString()
    };

    return merged;
};

// Local storage management
export const saveToLocalStorage = (userId, data) => {
    localStorage.setItem(`gallery_${userId}`, JSON.stringify({
        ...data,
        last_sync: new Date().toISOString()
    }));
};

export const getFromLocalStorage = (userId) => {
    const stored = localStorage.getItem(`gallery_${userId}`);
    return stored ? JSON.parse(stored) : null;
};

// Gallery data helpers
export const getAllPublicImages = (allUserGalleries) => {
    if (!allUserGalleries) return [];
    
    const publicImages = [];
    
    allUserGalleries.forEach(gallery => {
        const publicIds = gallery.public_gallery || [];
        
        // Get generated images
        (gallery.generated_images || []).forEach(entry => {
            if (publicIds.includes(entry.id)) {
                publicImages.push({
                    ...entry,
                    userId: gallery.id,
                    type: 'generated'
                });
            }
        });
        
        // Get forked images
        (gallery.forked_images || []).forEach(entry => {
            if (publicIds.includes(entry.id)) {
                publicImages.push({
                    ...entry,
                    userId: gallery.id,
                    type: 'forked'
                });
            }
        });
    });
    
    return publicImages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getUserImages = (userId, allUserGalleries) => {
    const gallery = allUserGalleries?.find(g => g.id === userId);
    if (!gallery) return [];
    
    const images = [];
    (gallery.generated_images || []).forEach(entry => images.push({...entry, type: 'generated'}));
    (gallery.forked_images || []).forEach(entry => images.push({...entry, type: 'forked'}));
    
    return images.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getVersionHistory = (imageId, userId, allUserGalleries) => {
    const gallery = allUserGalleries?.find(g => g.id === userId);
    if (!gallery) return [];
    
    const allImages = [...(gallery.generated_images || []), ...(gallery.forked_images || [])];
    const targetImage = allImages.find(img => img.id === imageId);
    
    if (!targetImage || !targetImage.parentId) return [targetImage];
    
    // Build version chain
    const versions = [targetImage];
    let currentParent = targetImage.parentId;
    
    while (currentParent) {
        const parentImage = allImages.find(img => img.id === currentParent);
        if (parentImage) {
            versions.unshift(parentImage);
            currentParent = parentImage.parentId;
        } else {
            break;
        }
    }
    
    return versions;
};