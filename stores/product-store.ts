// stores/product-store.ts
import { create } from 'zustand';

interface ProductState {
  // Selected option values by option ID
  selectedOptions: Record<string, string>;
  
  // Current displayed image
  currentImage: string | null;
  
  // Actions
  setOption: (optionId: string, valueId: string) => void;
  setCurrentImage: (image: string | null) => void;
  resetOptions: () => void;
  initializeOptions: (defaultSelections: Record<string, string>) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  selectedOptions: {},
  currentImage: null,

  setOption: (optionId, valueId) =>
    set((state) => ({
      selectedOptions: {
        ...state.selectedOptions,
        [optionId]: valueId,
      },
    })),

  setCurrentImage: (image) => set({ currentImage: image }),

  resetOptions: () => set({ selectedOptions: {}, currentImage: null }),

  initializeOptions: (defaultSelections) =>
    set({ selectedOptions: defaultSelections }),
}));

// Selector to get all selected value IDs as array
export const getSelectedValueIds = (state: ProductState): string[] => {
  return Object.values(state.selectedOptions);
};
