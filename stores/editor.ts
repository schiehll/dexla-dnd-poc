import { GRID_SIZE } from "@/utils/config";
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
  gridUpdates: { [key: string]: any };
  setGridUpdates: (gridUpdates: { [key: string]: any }) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  tree: {
    id: "root",
    type: "Container",
    children: [
      {
        id: nanoid(),
        type: "Grid",
        props: {
          bg: "white",
          m: 0,
          p: 0,
          gridSize: GRID_SIZE,
          style: {
            width: "100%",
            height: "auto",
            minHeight: "50px",
          },
        },
        children: [
          {
            id: nanoid(),
            type: "GridColumn",
            props: {
              span: GRID_SIZE,
              bg: "white",
              style: {
                height: "auto",
                minHeight: "50px",
                border: "2px dotted #ddd",
              },
            },
          },
        ],
      },
    ],
  },
  setTree: (tree) => set({ tree }),
  setComponentToAdd: (componentToAdd) => set({ componentToAdd }),
  setSelectedId: (id) => set({ selectedId: id }),
  setCurrentTargetId: (currentTargetId) => set({ currentTargetId }),
  setIsResizing: (isResizing) => set({ isResizing }),
  gridUpdates: {},
  setGridUpdates: (gridUpdates) => set({ gridUpdates }),
}));
