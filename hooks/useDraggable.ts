import { useCallback } from "react";

export const useDraggable = ({
  id,
  onDragStart,
  currentWindow,
}: {
  id: string;
  onDragStart: (id: string) => void;
  currentWindow?: Window;
}) => {
  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      const w = currentWindow ?? window;
      const el = w.document.getElementById(id)!;
      const rect = el?.getBoundingClientRect()!;

      const x = Math.max(0, Math.round(event.pageX - rect.left - w.scrollX));

      const y = Math.max(0, Math.round(event.pageY - rect.top - w.scrollY));

      event.dataTransfer.setDragImage(el, x, y);
      event.dataTransfer.effectAllowed = "copyMove";
      onDragStart(id);
    },
    [id, onDragStart, currentWindow]
  );

  return {
    draggable: true,
    onDragStart: handleDragStart,
  };
};
