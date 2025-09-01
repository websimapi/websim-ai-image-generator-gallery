import { useState } from 'react';
import { syncWithDatabase, saveToLocalStorage, getFromLocalStorage } from '../utils.js';

export const useSync = (room) => {
    const [syncStatus, setSyncStatus] = useState('synced');

    const performSync = async (userId, allUserGalleries) => {
        setSyncStatus('syncing');
        try {
            const localData = getFromLocalStorage(userId);
            const dbData = allUserGalleries?.find(g => g.id === userId);
            
            const merged = await syncWithDatabase(localData, dbData, userId);
            
            if (merged) {
                // Save to both local storage and database
                saveToLocalStorage(userId, merged);
                await room.collection('user_gallery').upsert({
                    id: userId,
                    ...merged
                });
            }
            
            setSyncStatus('synced');
        } catch (error) {
            console.error('Sync error:', error);
            setSyncStatus('error');
        }
    };

    return { syncStatus, performSync };
};

