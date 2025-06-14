/**
 * @file 分页状态管理
 * @module store/paginationStore
 * @description 管理不同页面的分页状态，支持持久化
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 分页状态接口
 */
interface PaginationState {
  /**
   * 页码状态映射 - key为页面标识，value为页码
   */
  pageStates: Record<string, number>;
  
  /**
   * 设置指定页面的页码
   * 
   * @param pageKey - 页面标识
   * @param page - 页码
   */
  setPage: (pageKey: string, page: number) => void;
  
  /**
   * 获取指定页面的页码
   * 
   * @param pageKey - 页面标识
   * @returns 页码，默认为1
   */
  getPage: (pageKey: string) => number;
  
  /**
   * 重置指定页面的页码为1
   * 
   * @param pageKey - 页面标识
   */
  resetPage: (pageKey: string) => void;
  
  /**
   * 清除所有页码状态
   */
  clearAll: () => void;
}

/**
 * 分页状态管理store
 * 
 * 使用持久化中间件保存页码状态到localStorage
 */
export const usePaginationStore = create<PaginationState>()(
  persist(
    (set, get) => ({
      pageStates: {},
      
      setPage: (pageKey: string, page: number) => {
        set((state) => ({
          pageStates: {
            ...state.pageStates,
            [pageKey]: page
          }
        }));
      },
      
      getPage: (pageKey: string) => {
        const state = get();
        return state.pageStates[pageKey] || 1;
      },
      
      resetPage: (pageKey: string) => {
        set((state) => ({
          pageStates: {
            ...state.pageStates,
            [pageKey]: 1
          }
        }));
      },
      
      clearAll: () => {
        set({ pageStates: {} });
      }
    }),
    {
      name: 'pagination-storage',
      // 只持久化pageStates
      partialize: (state) => ({ pageStates: state.pageStates }),
    }
  )
); 