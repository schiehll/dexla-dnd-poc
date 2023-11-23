import { useCallback } from "react";
import { DropTarget } from "./useDroppable";
import { useEditorStore } from "@/stores/editor";
import cloneDeep from "lodash.clonedeep";
import {
  Component,
  addComponent,
  getComponentById,
  getComponentParent,
  moveComponent,
  moveComponentToDifferentParent,
  removeComponent,
  removeComponentFromParent,
} from "@/utils/editor";
import { componentMapper } from "@/utils/componentMapper";

export const useOnDrop = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const setSelectedId = useEditorStore((state) => state.setSelectedId);
  const setComponentToAdd = useEditorStore((state) => state.setComponentToAdd);
  const componentToAdd = useEditorStore((state) => state.componentToAdd);
  const isResizing = useEditorStore((state) => state.isResizing);

  const onDrop = useCallback(
    (_droppedId: string, dropTarget: DropTarget) => {
      if (isResizing) return;
      const droppedId = _droppedId ?? componentToAdd?.id;
      const copy = cloneDeep(editorTree);
      const activeComponent = getComponentById(copy, droppedId);
      let targetComponent = getComponentById(copy, dropTarget.id);
      const isMoving = !!activeComponent;

      if (!isMoving && droppedId && componentToAdd) {
        handleComponentAddition(
          copy,
          dropTarget,
          targetComponent,
          componentToAdd
        );
      } else if (dropTarget.id !== "root") {
        const isDopopingInVerticalAxis =
          dropTarget.edge === "top" || dropTarget.edge === "bottom";
        let useParentInstead = false;
        if (
          isMoving &&
          isDopopingInVerticalAxis &&
          targetComponent?.type === "GridColumn"
        ) {
          useParentInstead = true;
        }
        handleReorderingOrMoving(
          copy,
          droppedId,
          targetComponent,
          dropTarget,
          useParentInstead
        );
      } else {
        handleRootDrop(copy, droppedId, activeComponent, dropTarget);
      }

      setEditorTree(copy);
    },
    [
      componentToAdd,
      editorTree,
      setEditorTree,
      handleComponentAddition,
      handleReorderingOrMoving,
      handleRootDrop,
      isResizing,
    ]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleComponentAddition(
    copy: Component,
    dropTarget: DropTarget,
    targetComponent: Component | null,
    componentToAdd: Component
  ) {
    const targetParent = getComponentParent(copy, dropTarget.id);
    const allowedParentTypes =
      componentMapper[componentToAdd.type].allowedParentTypes;
    if (allowedParentTypes?.includes(targetComponent?.type as string)) {
      const newSelectedId = addComponent(copy, componentToAdd, dropTarget);
      setSelectedId(newSelectedId);
    } else {
      if (targetParent && allowedParentTypes?.includes(targetParent.type)) {
        const newSelectedId = addComponent(copy, componentToAdd, {
          id: targetParent.id as string,
          edge: dropTarget.edge,
        });
        setSelectedId(newSelectedId);
      }
    }

    setComponentToAdd(undefined);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleReorderingOrMoving(
    copy: Component,
    droppedId: string,
    targetComponent: Component | null,
    dropTarget: DropTarget,
    useParentInstead?: boolean
  ) {
    if (dropTarget.id === "root") {
      return;
    }

    const activeParent = getComponentParent(copy, droppedId);
    const targetParent = getComponentParent(copy, targetComponent?.id!);
    const p = getComponentParent(copy, targetParent?.id!);

    const isSameParent = useParentInstead
      ? activeParent?.id === p?.id
      : activeParent?.id === targetParent?.id;

    if (isSameParent) {
      moveComponent(copy, droppedId, dropTarget);
    } else {
      let newParentId = targetParent!.id;
      if (dropTarget.edge === "center") {
        newParentId = dropTarget.id;
      }
      moveComponentToDifferentParent(
        copy,
        droppedId,
        dropTarget,
        newParentId as string
      );
      removeComponentFromParent(copy, droppedId, activeParent!.id as string);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleRootDrop(
    copy: Component,
    droppedId: string,
    activeComponent: Component | null,
    dropTarget: DropTarget
  ) {
    removeComponent(copy, droppedId);
    const newSelectedId = addComponent(
      copy,
      activeComponent as unknown as Component,
      dropTarget
    );
    setSelectedId(newSelectedId);
  }

  return onDrop;
};
