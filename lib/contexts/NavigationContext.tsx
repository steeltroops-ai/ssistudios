"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";

// Performance optimization: Route preloading cache (simplified for Next.js app router)
const routeCache = new Map<string, Promise<any>>();

// Types
export type PageType =
  | "dashboard"
  | "templates"
  | "theme"
  | "userprofile"
  | "logo"
  | "poster-editor"
  | "canvas-tools"
  | "text-editor"
  | "posters"
  | "cards"
  | "certificates"
  | "media"
  | "fonts";

interface NavigationState {
  activePage: PageType;
  previousPage: PageType | null;
  pageHistory: PageType[];
  isLoading: boolean;
  loadingProgress: number;
  pageData: Record<PageType, any>;
  scrollPositions: Record<PageType, number>;
  preloadedPages: Set<PageType>;
}

interface NavigationOptions {
  preserveScroll?: boolean;
  preload?: boolean;
  data?: any;
}

// Actions
type NavigationAction =
  | {
      type: "NAVIGATE_TO";
      payload: { page: PageType; options?: NavigationOptions };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LOADING_PROGRESS"; payload: number }
  | { type: "SET_PAGE_DATA"; payload: { page: PageType; data: any } }
  | {
      type: "SET_SCROLL_POSITION";
      payload: { page: PageType; position: number };
    }
  | { type: "PRELOAD_PAGE"; payload: PageType }
  | { type: "GO_BACK" };

// Initial state
const initialState: NavigationState = {
  activePage: "dashboard",
  previousPage: null,
  pageHistory: ["dashboard"],
  isLoading: false,
  loadingProgress: 0,
  pageData: {
    dashboard: null,
    templates: null,
    theme: null,
    userprofile: null,
    logo: null,
    "poster-editor": null,
    "canvas-tools": null,
    "text-editor": null,
    posters: null,
    cards: null,
    certificates: null,
    media: null,
    fonts: null,
  },
  scrollPositions: {
    dashboard: 0,
    templates: 0,
    theme: 0,
    userprofile: 0,
    logo: 0,
    "poster-editor": 0,
    "canvas-tools": 0,
    "text-editor": 0,
    posters: 0,
    cards: 0,
    certificates: 0,
    media: 0,
    fonts: 0,
  },
  preloadedPages: new Set(["dashboard"]),
};

// Path mapping
const pathToPage: Record<string, PageType> = {
  "/dashboard": "dashboard",
  "/templates": "templates",
  "/theme": "theme",
  "/userprofile": "userprofile",
  "/logo": "logo",
  "/poster/editor/poster1editor": "poster-editor",
  "/tools/canvas": "canvas-tools",
  "/tools/text": "text-editor",
  "/content/posters": "posters",
  "/content/cards": "cards",
  "/assets/media": "media",
  "/assets/fonts": "fonts",
};

const pageToPath: Record<PageType, string> = {
  dashboard: "/dashboard",
  templates: "/templates",
  theme: "/theme",
  userprofile: "/userprofile",
  logo: "/logo",
  "poster-editor": "/poster/editor/poster1editor",
  "canvas-tools": "/tools/canvas",
  "text-editor": "/tools/text",
  posters: "/content/posters",
  cards: "/content/cards",
  certificates: "/certificates",
  media: "/assets/media",
  fonts: "/assets/fonts",
};

// Reducer
function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case "NAVIGATE_TO": {
      const { page, options } = action.payload;

      // Don't navigate if already on the same page
      if (state.activePage === page && !state.isLoading) {
        return state;
      }

      const newHistory = [...state.pageHistory];
      if (newHistory[newHistory.length - 1] !== page) {
        newHistory.push(page);
      }

      return {
        ...state,
        previousPage: state.activePage,
        activePage: page,
        pageHistory: newHistory,
        isLoading: true,
        loadingProgress: 0,
        pageData: options?.data
          ? { ...state.pageData, [page]: options.data }
          : state.pageData,
      };
    }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
        loadingProgress: action.payload ? 0 : 100,
      };

    case "SET_LOADING_PROGRESS":
      return {
        ...state,
        loadingProgress: action.payload,
        isLoading: action.payload < 100,
      };

    case "SET_PAGE_DATA":
      return {
        ...state,
        pageData: {
          ...state.pageData,
          [action.payload.page]: action.payload.data,
        },
      };

    case "SET_SCROLL_POSITION":
      return {
        ...state,
        scrollPositions: {
          ...state.scrollPositions,
          [action.payload.page]: action.payload.position,
        },
      };

    case "PRELOAD_PAGE":
      return {
        ...state,
        preloadedPages: new Set([...state.preloadedPages, action.payload]),
      };

    case "GO_BACK": {
      const history = [...state.pageHistory];
      if (history.length > 1) {
        history.pop(); // Remove current page
        const previousPage = history[history.length - 1];
        return {
          ...state,
          previousPage: state.activePage,
          activePage: previousPage,
          pageHistory: history,
          isLoading: true,
          loadingProgress: 0,
        };
      }
      return state;
    }

    default:
      return state;
  }
}

// Context
interface NavigationContextType {
  state: NavigationState;
  navigateTo: (page: PageType, options?: NavigationOptions) => void;
  goBack: () => void;
  preloadPage: (page: PageType) => void;
  preloadRoute: (path: string) => Promise<void>;
  prefetchComponent: (page: PageType) => Promise<void>;
  setPageData: (page: PageType, data: any) => void;
  setScrollPosition: (page: PageType, position: number) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

// Provider
interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  // Simplified - no URL syncing, Next.js handles routing

  // Simplified navigation - just updates internal state, no routing
  const navigateTo = (page: PageType, options?: NavigationOptions) => {
    // Update internal state only
    dispatch({ type: "NAVIGATE_TO", payload: { page, options } });
  };

  const goBack = () => {
    dispatch({ type: "GO_BACK" });
    // Note: URL navigation should be handled by Next.js router in components
  };

  // Simplified route preloading (Next.js handles this automatically)
  const preloadRoute = useCallback(async (path: string): Promise<void> => {
    // Next.js app router handles prefetching automatically
    return Promise.resolve();
  }, []);

  // Component prefetching for instant loading (simplified for Next.js app router)
  const prefetchComponent = useCallback(
    async (page: PageType): Promise<void> => {
      // Since we're using Next.js app router, we don't need to preload components
      // The router handles this automatically
      console.log(`Preloading ${page} (handled by Next.js router)`);
      return Promise.resolve();
    },
    []
  );

  const preloadPage = useCallback(
    (page: PageType) => {
      if (!state.preloadedPages.has(page)) {
        dispatch({ type: "PRELOAD_PAGE", payload: page });

        // Preload both route and component
        const path = pageToPath[page];
        if (path) {
          preloadRoute(path);
        }
        prefetchComponent(page);
      }
    },
    [state.preloadedPages, preloadRoute, prefetchComponent]
  );

  const setPageData = (page: PageType, data: any) => {
    dispatch({ type: "SET_PAGE_DATA", payload: { page, data } });
  };

  const setScrollPosition = (page: PageType, position: number) => {
    dispatch({ type: "SET_SCROLL_POSITION", payload: { page, position } });
  };

  const contextValue: NavigationContextType = {
    state,
    navigateTo,
    goBack,
    preloadPage,
    preloadRoute,
    prefetchComponent,
    setPageData,
    setScrollPosition,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

// Hook
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
