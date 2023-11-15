import { Component } from "@/utils/editor";
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
};

export const useEditorStore = create<EditorState>((set) => ({
  tree: {
    id: "root",
    type: "Container",
    props: {
      p: "md",
      bg: "white",
      h: "100%",
      w: "100%",
    },
    children: [],
  },
  setTree: (tree) => set({ tree }),
  setComponentToAdd: (componentToAdd) => set({ componentToAdd }),
  setSelectedId: (id) => set({ selectedId: id }),
  setCurrentTargetId: (currentTargetId) => set({ currentTargetId }),
}));
