import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { API_URL } from './auth';

// Link Types based on API spec
export interface CreateLinkDto {
  originalUrl: string;
  description?: string;
  startDateTime?: string;
  endDateTime?: string;
  withLogo?: boolean;
  qrSubtitle?: string;
}

export interface UpdateLinkDto {
  originalUrl?: string;
  description?: string;
  enabled?: boolean;
  startDateTime?: string;
  endDateTime?: string;
  withLogo?: boolean;
  qrSubtitle?: string;
}

export interface User {
  id: number;
  username: string;
  displayName: string;
  email?: string;
  isAdmin: boolean;
}

export interface LinkEntry {
  id: number;
  shortCode: string;
  originalUrl: string;
  description?: string;
  enabled: boolean;
  pageTitle?: string;
  securityLevel: 'safe' | 'moderate' | 'risky' | 'dangerous';
  startDateTime?: string;
  endDateTime?: string;
  withLogo: boolean;
  qrSubtitle?: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
  securityLevelUpdatedAt?: string;
  createdBy: User;
  createdById: number;
}

export interface LinkAccessResponse {
  id: number;
  shortCode: string;
  originalUrl: string;
  description?: string;
  pageTitle?: string;
  securityLevel: 'safe' | 'moderate' | 'risky' | 'dangerous';
  securityLevelUpdatedAt?: string;
  isActive: boolean;
  accessCount: number;
}

export interface LinkStats {
  id: number;
  shortCode: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface PaginationParams {
  max?: number;
  offset?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

// Create API client
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return client;
};

// Link Store State
interface LinkState {
  links: LinkEntry[];
  currentLink: LinkEntry | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  pagination: PaginationParams;
  
  // CRUD Operations
  createLink: (data: CreateLinkDto) => Promise<LinkEntry>;
  getUserLinks: (params?: PaginationParams) => Promise<void>;
  getLinkById: (id: number) => Promise<LinkEntry>;
  updateLink: (id: number, data: UpdateLinkDto) => Promise<LinkEntry>;
  deleteLink: (id: number) => Promise<void>;
  
  // Ownership & Stats
  transferOwnership: (id: number, newOwnerId: number) => Promise<LinkEntry>;
  getLinkStats: (id: number) => Promise<LinkStats>;
  
  // Public Access (no auth required)
  accessLink: (shortCode: string) => Promise<LinkAccessResponse>;
  getRedirectUrl: (shortCode: string) => Promise<string>;
  
  // Admin Operations
  searchAllLinks: (params?: PaginationParams) => Promise<LinkEntry[]>;
  disableLinkByShortCode: (shortCode: string) => Promise<LinkEntry>;
  viewLinkByShortCode: (shortCode: string) => Promise<LinkEntry>;
  
  // UI State Management
  setCurrentLink: (link: LinkEntry | null) => void;
  setPagination: (params: PaginationParams) => void;
  clearError: () => void;
  reset: () => void;
}

// Create Link Store
const useLinkStore = create<LinkState>()(
  persist(
    (set, get) => {
      const api = createApiClient();

      return {
        links: [],
        currentLink: null,
        isLoading: false,
        error: null,
        totalCount: 0,
        pagination: {
          max: 50,
          offset: 0,
          sort: 'createdAt',
          order: 'DESC',
        },

        // Create a new link
        createLink: async (data: CreateLinkDto) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.post<LinkEntry>('/links', data);
            const newLink = response.data;
            
            // Add to local state
            set((state) => ({
              links: [newLink, ...state.links],
              isLoading: false,
            }));
            
            return newLink;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create link';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Get user's links with pagination
        getUserLinks: async (params?: PaginationParams) => {
          set({ isLoading: true, error: null });
          try {
            const queryParams = params || get().pagination;
            const response = await api.get<LinkEntry[]>('/links', {
              params: queryParams,
            });
            
            set({
              links: response.data,
              isLoading: false,
              pagination: queryParams,
            });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch links';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Get link by ID
        getLinkById: async (id: number) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get<LinkEntry>(`/links/${id}`);
            const link = response.data;
            
            set({
              currentLink: link,
              isLoading: false,
            });
            
            return link;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch link';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Update a link
        updateLink: async (id: number, data: UpdateLinkDto) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.put<LinkEntry>(`/links/${id}`, data);
            const updatedLink = response.data;
            
            // Update in local state
            set((state) => ({
              links: state.links.map((link) =>
                link.id === id ? updatedLink : link
              ),
              currentLink: state.currentLink?.id === id ? updatedLink : state.currentLink,
              isLoading: false,
            }));
            
            return updatedLink;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update link';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Delete a link
        deleteLink: async (id: number) => {
          set({ isLoading: true, error: null });
          try {
            await api.delete(`/links/${id}`);
            
            // Remove from local state
            set((state) => ({
              links: state.links.filter((link) => link.id !== id),
              currentLink: state.currentLink?.id === id ? null : state.currentLink,
              isLoading: false,
            }));
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete link';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Transfer ownership
        transferOwnership: async (id: number, newOwnerId: number) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.put<LinkEntry>(
              `/links/${id}/transfer`,
              { newOwnerId }
            );
            const updatedLink = response.data;
            
            // Update in local state
            set((state) => ({
              links: state.links.map((link) =>
                link.id === id ? updatedLink : link
              ),
              currentLink: state.currentLink?.id === id ? updatedLink : state.currentLink,
              isLoading: false,
            }));
            
            return updatedLink;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to transfer ownership';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Get link statistics
        getLinkStats: async (id: number) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get<LinkStats>(`/links/${id}/stats`);
            set({ isLoading: false });
            return response.data;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch stats';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Access link (public endpoint)
        accessLink: async (shortCode: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get<LinkAccessResponse>(
              `/links/access/${shortCode}`
            );
            set({ isLoading: false });
            return response.data;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Link not found';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Get redirect URL
        getRedirectUrl: async (shortCode: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get<{ url: string; redirect: boolean }>(
              `/links/redirect/${shortCode}`
            );
            set({ isLoading: false });
            return response.data.url;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Link not found';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Admin: Search all links
        searchAllLinks: async (params?: PaginationParams) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get<LinkEntry[]>('/links/admin/search', {
              params,
            });
            set({ isLoading: false });
            return response.data;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to search links';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Admin: Disable link by short code
        disableLinkByShortCode: async (shortCode: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.put<LinkEntry>(
              `/links/admin/${shortCode}/disable`
            );
            const updatedLink = response.data;
            
            // Update in local state if the link exists
            set((state) => ({
              links: state.links.map((link) =>
                link.shortCode === shortCode ? updatedLink : link
              ),
              isLoading: false,
            }));
            
            return updatedLink;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to disable link';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // Admin: View link by short code
        viewLinkByShortCode: async (shortCode: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get<LinkEntry>(
              `/links/admin/${shortCode}/view`
            );
            set({ isLoading: false });
            return response.data;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to view link';
            set({ isLoading: false, error: errorMessage });
            throw error;
          }
        },

        // UI State Management
        setCurrentLink: (link: LinkEntry | null) => {
          set({ currentLink: link });
        },

        setPagination: (params: PaginationParams) => {
          set((state) => ({
            pagination: { ...state.pagination, ...params },
          }));
        },

        clearError: () => {
          set({ error: null });
        },

        reset: () => {
          set({
            links: [],
            currentLink: null,
            isLoading: false,
            error: null,
            totalCount: 0,
            pagination: {
              max: 50,
              offset: 0,
              sort: 'createdAt',
              order: 'DESC',
            },
          });
        },
      };
    },
    {
      name: 'link-storage',
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      // Only persist UI state, not data
      partialize: (state) => ({
        pagination: state.pagination,
      }),
    }
  )
);

// Export for debugging in development
if (typeof window !== 'undefined' && import.meta.env.MODE === 'development') {
  (window as any).linkStore = useLinkStore;
}

export default useLinkStore;