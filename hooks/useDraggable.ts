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
      const hidden = w.document.createElement("div");
      hidden.style.width = "100px";
      hidden.style.height = "100px";
      hidden.style.opacity = "0";
      w.document.body.appendChild(hidden);

      event.dataTransfer.setDragImage(hidden, 0, 0);
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
