// stores/ui-store.ts
import { create } from 'zustand';

interface UIState {
  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  
  // Contact modal
  isContactModalOpen: boolean;
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  
  // Header visibility
  isHeaderVisible: boolean;
  lastScrollY: number;
  
  // Actions
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  
  openContactModal: () => void;
  closeContactModal: () => void;
  
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  setHeaderVisibility: (visible: boolean) => void;
  updateScrollPosition: (scrollY: number) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isSearchOpen: false,
  searchQuery: '',
  isContactModalOpen: false,
  isMobileMenuOpen: false,
  isHeaderVisible: true,
  lastScrollY: 0,

  // Search actions
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Contact modal actions
  openContactModal: () => set({ isContactModalOpen: true }),
  closeContactModal: () => set({ isContactModalOpen: false }),

  // Mobile menu actions
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Header visibility
  setHeaderVisibility: (visible) => set({ isHeaderVisible: visible }),
  updateScrollPosition: (scrollY) => {
    const { lastScrollY } = get();
    const scrollingDown = scrollY > lastScrollY;
    const scrollingUp = scrollY < lastScrollY;
    const atTop = scrollY < 50;

    if (atTop) {
      set({ isHeaderVisible: true, lastScrollY: scrollY });
    } else if (scrollingDown && scrollY > 100) {
      set({ isHeaderVisible: false, lastScrollY: scrollY });
    } else if (scrollingUp) {
      set({ isHeaderVisible: true, lastScrollY: scrollY });
    }
  },
}));
