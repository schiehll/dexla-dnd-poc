import React, { PropsWithChildren } from "react";
import { BoxProps, Box, useMantineTheme } from "@mantine/core";
import { useDroppable } from "@/hooks/useDroppable";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";

type Props = {
  id: string;
} & BoxProps;

export const Droppable = ({
  id,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const selectedId = useEditorStore((state) => state.selectedId);

  const onDrop = useOnDrop();

  const { edge, ...droppable } = useDroppable({
    id,
    activeId: selectedId,
    onDrop,
  });

  const baseBorder = `1px solid ${theme.colors.teal[6]}`;
  const isOver = "currentTargetId" === id;

  const borders = isOver
    ? {
        borderTop:
          edge === "top" ? `${2}px solid ${theme.colors.teal[6]}` : baseBorder,
        borderBottom:
          edge === "bottom"
            ? `${2}px solid ${theme.colors.teal[6]}`
            : baseBorder,
        borderLeft:
          edge === "left" ? `${2}px solid ${theme.colors.teal[6]}` : baseBorder,
        borderRight:
          edge === "right"
            ? `${2}px solid ${theme.colors.teal[6]}`
            : baseBorder,
      }
    : {};

  return (
    <Box
      id={id}
      w="calc(100% - 4px)"
      {...props}
      style={{ ...borders }}
      {...droppable}
    >
      {children}
    </Box>
  );
};
