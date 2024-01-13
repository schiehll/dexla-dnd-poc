import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import { create } from "zustand";

type EditorState = {
  tree: Component;
  selectedId?: string;
  setSelectedId: (id?: string) => void;
  setTree: (tree: Component) => void;
  componentToAdd?: Component;
  setComponentToAdd: (component?: Component) => void;
  currentTargetId?: string;
  setCurrentTargetId: (currentTargetId?: string) => void;
  isResizing?: boolean;
  setIsResizing: (isResizing?: boolean) => void;
  isDragging?: boolean;
  setIsDragging: (isDragging?: boolean) => void;
  previewPosition?: { top: number; left: number };
  setPreviewPosition?: (previewPosition?: {
    top: number;
    left: number;
  }) => void;
};

export const GRID_SIZE_Y = 10;
export const GRID_SIZE_X = 60;

export const useEditorStore = create<EditorState>((set) => ({
  tree: {
    id: "root",
    type: "Container",
    children: [
      {
        id: nanoid(),
        type: "Container",
        props: {
          w: "100%",
          bg: "white",
          style: {
            height: "calc(100vh - 200px)",
          },
          grid: {
            style: {
              position: "relative",
              top: 0,
              left: 0,
              width: "100%",
              height: "calc(100vh - 200px)",
              backgroundImage: `
                repeating-linear-gradient( 
                  0deg, transparent, transparent calc(${GRID_SIZE_Y}px - 1px), 
                  #ddd calc(${GRID_SIZE_Y}px - 1px), 
                  #ddd ${GRID_SIZE_Y}px ),
                repeating-linear-gradient( 
                  -90deg, transparent, transparent calc(${GRID_SIZE_X}px - 1px), 
                  #ddd calc(${GRID_SIZE_X}px - 1px), #ddd ${GRID_SIZE_X}px )`,
              backgroundSize: `${GRID_SIZE_X}px ${GRID_SIZE_Y}px`,
              zIndex: 0,
              pointerEvents: "none",
            },
          },
        },
        children: [],
      },
    ],
  },
  setTree: (tree) => set({ tree }),
  setComponentToAdd: (componentToAdd) => set({ componentToAdd }),
  setSelectedId: (id) => set({ selectedId: id }),
  setCurrentTargetId: (currentTargetId) => set({ currentTargetId }),
  setIsResizing: (isResizing) => set({ isResizing }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setPreviewPosition: (previewPosition) => set({ previewPosition }),
}));
