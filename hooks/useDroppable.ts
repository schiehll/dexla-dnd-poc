import { useEditorStore } from "@/stores/editor";
import { checkIfIsChildDeep, getComponentById } from "@/utils/editor";
import { useCallback, useState } from "react";

export type DropTarget = {
  id: string;
  edge: Edge;
};

export type Edge = "left" | "right" | "top" | "bottom" | "center";

export const getClosestEdge = (
  left: number,
  right: number,
  top: number,
  bottom: number
) => {
  const all = { left, right, top, bottom, center: Infinity };
  const closest = Math.min(...Object.values(all));
  const closestKey = Object.keys(all).find((key: string) => {
    return all[key as Edge] === closest;
  });

  return { edge: closestKey, value: all[closestKey as Edge] };
};

export const useDroppable = ({
  id,
  activeId,
  onDrop,
  currentWindow,
}: {
  id: string;
  onDrop: (droppedId: string, dropTarget: DropTarget) => void;
  activeId?: string;
  currentWindow?: Window;
}) => {
  const setCurrentTargetId = useEditorStore(
    (state) => state.setCurrentTargetId
  );
  const tree = useEditorStore((state) => state.tree);
  const setIsDragging = useEditorStore((state) => state.setIsDragging);
  const gridSize = useEditorStore((state) => state.gridSize);
  const setPreviewPosition = useEditorStore(
    (state) => state.setPreviewPosition
  );
  const [edge, setEdge] = useState<Edge>();

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const dropTarget = {
        id,
        edge: edge ?? "center",
      } as DropTarget;
      onDrop?.(activeId!, dropTarget);
      setCurrentTargetId(undefined);
      setIsDragging(false);
    },
    [activeId, id, edge, onDrop, setCurrentTargetId]
  );

  const handleEdgeSet = (
    distances: {
      leftDist: number;
      rightDist: number;
      topDist: number;
      bottomDist: number;
    },
    threshold: number
  ) => {
    const { leftDist, rightDist, topDist, bottomDist } = distances;
    if (
      leftDist > threshold &&
      rightDist > threshold &&
      topDist > threshold &&
      bottomDist > threshold
    ) {
      // If not within 5 pixels of top and bottom edge, set edge to center.
      setEdge("center");
    } else {
      // Check the closest edge and set it accordingly.
      const { edge } = getClosestEdge(leftDist, rightDist, topDist, bottomDist);
      setEdge(edge as Edge);
    }
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const { clientX: mouseX, clientY: mouseY } = event;
      const w = currentWindow ?? window;
      const rect = w.document.getElementById(id)?.getBoundingClientRect()!;

      if (!mouseX || !mouseY || !rect) return;

      const leftDist = mouseX - rect.left;
      const rightDist = rect.right - mouseX;
      const topDist = mouseY - rect.top;
      const bottomDist = rect.bottom - mouseY;

      handleEdgeSet({ leftDist, rightDist, topDist, bottomDist }, 5);

      const comp = getComponentById(tree, id);
      if (comp?.id === "root") {
        const gridX = gridSize.x;
        const gridY = gridSize.y;

        const xPos = Math.floor(leftDist / gridX);
        const yPos = Math.floor(topDist / gridY);

        const top = rect.top + yPos * gridY;
        const left = rect.left + xPos * gridX;

        setPreviewPosition?.({ top: top + 2, left: left + 2 });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, currentWindow, tree, gridSize]
  );

  const handleDragEnter = useCallback(
    (event: any) => {
      event.preventDefault();

      const activeComponent = getComponentById(tree, activeId!);
      const comp = getComponentById(tree, id);
      const isTryingToDropInsideItself =
        activeComponent && activeId !== id
          ? checkIfIsChildDeep(activeComponent!, id)
          : false;

      if (!isTryingToDropInsideItself && activeComponent) {
        setCurrentTargetId(id);
        event.stopPropagation();
      } else if (!activeComponent) {
        setCurrentTargetId(id);
        event.stopPropagation();
      }
    },
    [setCurrentTargetId, id, activeId, tree]
  );

  // TODO: Handle isOver differently to have better ux as currently
  // it remove the drop target even if hovering over a non droppable children
  const handleDragLeave = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      setEdge(undefined);
    },
    [setEdge]
  );

  const handleDragEnd = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      setEdge(undefined);
    },
    [setEdge]
  );

  return {
    edge,
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragEnd: handleDragEnd,
  };
};
