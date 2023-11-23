import { useDraggable } from "@/hooks/useDraggable";
import { useDroppable } from "@/hooks/useDroppable";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { Component, addComponent } from "@/utils/editor";
import {
  Box,
  BoxProps,
  Button,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { PropsWithChildren, cloneElement, useRef } from "react";
import { schema as ColumnSchema } from "@/components/schemas/GridColumn";
import { schema as GridSchema } from "@/components/schemas/Grid";
import cloneDeep from "lodash.clonedeep";

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
  const selectedId = useEditorStore((state) => state.selectedId);
  const currentTargetId = useEditorStore((state) => state.currentTargetId);
  const setSelectedId = useEditorStore((state) => state.setSelectedId);
  const setComponentToAdd = useEditorStore((state) => state.setComponentToAdd);
  const tree = useEditorStore((state) => state.tree);
  const setTree = useEditorStore((state) => state.setTree);
  const isResizing = useEditorStore((state) => state.isResizing);
  const onDrop = useOnDrop();

  const draggable = useDraggable({
    id,
    onDragStart: (id: string) => {
      setSelectedId(id);
      setComponentToAdd(undefined);
    },
  });

  const { edge = "center", ...droppable } = useDroppable({
    id,
    activeId: selectedId,
    onDrop,
  });

  const baseShadow = `0 0 0 2px ${theme.colors.green[6]}`;
  const DROP_INDICATOR_WIDTH = 6;
  const isOver = currentTargetId === id && !isResizing;
  const isSelected = selectedId === id && !isResizing;
  const isColumn = component.type === "GridColumn";

  const shadows = isOver
    ? {
        boxShadow:
          edge === "top"
            ? `0 -${DROP_INDICATOR_WIDTH}px 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "bottom"
            ? `0 ${DROP_INDICATOR_WIDTH}px 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "left"
            ? `-${DROP_INDICATOR_WIDTH}px 0 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : edge === "right"
            ? `${DROP_INDICATOR_WIDTH}px 0 0 0 ${theme.colors.teal[6]}, ${baseShadow}`
            : baseShadow,
        background: edge === "center" ? theme.colors.teal[6] : "none",
        opacity: edge === "center" ? 0.4 : 1,
      }
    : isSelected
    ? { boxShadow: baseShadow }
    : {};

  const Child = () => {
    return (
      <>
        {/* @ts-ignore */}
        {children?.children}
        {selectedId === id && (
          <Group
            h={20}
            top={-20}
            left={0}
            noWrap
            pos="absolute"
            spacing="xs"
            style={{ zIndex: 9999 }}
          >
            <Box
              h={20}
              bg="green"
              {...(isColumn ? {} : draggable)}
              px={10}
              sx={{
                cursor: isColumn ? "default" : "move",
              }}
            >
              <Text size="xs" color="white">
                {component.type}
              </Text>
            </Box>
            {component.type === "Grid" && (
              <Button
                color="green"
                size="xs"
                compact
                onClick={() => {
                  const copy = cloneDeep(tree);
                  addComponent(copy, ColumnSchema, {
                    id: component.id!,
                    edge: "center",
                  });

                  setTree(copy);
                }}
              >
                Add Column
              </Button>
            )}
            {component.type === "GridColumn" && (
              <Button
                color="green"
                size="xs"
                compact
                onClick={() => {
                  const copy = cloneDeep(tree);
                  addComponent(copy, GridSchema, {
                    id: component.id!,
                    edge: "center",
                  });

                  setTree(copy);
                }}
              >
                Split Column
              </Button>
            )}
          </Group>
        )}
      </>
    );
  };

  return (
    <>
      {cloneElement(
        // @ts-ignore
        children,
        {
          ref: elRef,
          component,
          ...droppable,
          ...props,
          pos: "relative",
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
        Child()
      )}
    </>
  );
};
