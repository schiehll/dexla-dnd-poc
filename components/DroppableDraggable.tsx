import { useDraggable } from "@/hooks/useDraggable";
import { useDroppable } from "@/hooks/useDroppable";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { Box, BoxProps, Text, useMantineTheme } from "@mantine/core";
import { PropsWithChildren, cloneElement, useEffect, useRef } from "react";

type Props = {
  id: string;
  component: Component;
} & BoxProps;

export const DroppableDraggable = ({
  id,
  component,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const elRef = useRef(null);
  const draggableRef = useRef(null);
  const selectedId = useEditorStore((state) => state.selectedId);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const setSelectedId = useEditorStore((state) => state.setSelectedId);
  const setComponentToAdd = useEditorStore((state) => state.setComponentToAdd);
  const onDrop = useOnDrop();

  const draggable = useDraggable({
    id,
    onDragStart: (id: string) => {
      setSelectedId(id);
      setComponentToAdd(undefined);
    },
  });

  const { edge, ...droppable } = useDroppable({
    id,
    activeId: selectedId,
    onDrop,
  });

  useEffect(() => {
    if (elRef.current && draggableRef.current) {
      // @ts-ignore
      const elRect = elRef.current.getBoundingClientRect();

      const top = elRect.top;
      const left = elRect.left;

      // @ts-ignore
      draggableRef.current.style.top = `${top - 20}px`;
      // @ts-ignore
      draggableRef.current.style.left = `${left}px`;
    }
  }, [selectedId, id]);

  const baseShadow = `0 0 0 2px ${theme.colors.green[6]}`;
  const DROP_INDICATOR_WIDTH = 3;
  const isOver = currentTargetId === id;

  console.log({ edge });

  const shadows = isOver
    ? {
        boxShadow:
          edge === "top"
            ? `inset 0 ${DROP_INDICATOR_WIDTH}px 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "bottom"
            ? `inset 0 -${DROP_INDICATOR_WIDTH}px 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "left"
            ? `inset ${DROP_INDICATOR_WIDTH}px 0 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "right"
            ? `inset -${DROP_INDICATOR_WIDTH}px 0 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : baseShadow,
        background: edge === "center" ? theme.colors.teal[6] : "none",
        opacity: edge === "center" ? 0.4 : 1,
      }
    : selectedId === id
    ? { boxShadow: baseShadow }
    : {};

  return (
    <>
      {selectedId === id && (
        <Box
          h={20}
          bg="green"
          ref={draggableRef}
          {...draggable}
          pos="absolute"
          px={10}
          sx={{
            cursor: "move",
          }}
        >
          <Text size="xs" color="white">
            {component.type}
          </Text>
        </Box>
      )}
      {cloneElement(
        // @ts-ignore
        children,
        {
          ref: elRef,
          component,
          ...droppable,
          ...props,
          style: {
            ...props.style,
            ...(component.props?.style ?? {}),
            ...shadows,
          },
          onClick: (e: any) => {
            // @ts-ignore
            props.onClick?.(e);
            e.stopPropagation();
            setSelectedId(id);
          },
        },
        // @ts-ignore
        children?.children
      )}
    </>
  );
};
