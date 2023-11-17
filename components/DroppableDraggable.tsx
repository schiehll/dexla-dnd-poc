import { useDraggable } from "@/hooks/useDraggable";
import { useDroppable } from "@/hooks/useDroppable";
import { useOnDrop } from "@/hooks/useOnDrop";
import { useEditorStore } from "@/stores/editor";
import { Component, updateTreeComponentChildren } from "@/utils/editor";
import {
  Box,
  BoxProps,
  Button,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { PropsWithChildren, cloneElement, useEffect, useRef } from "react";
import { schema } from "./schemas/GridColumn";
import { nanoid } from "nanoid";
import cloneDeep from "lodash.clonedeep";
import { GRID_SIZE } from "@/utils/config";

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

  /* useEffect(() => {
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
  }, [selectedId, id]); */

  const baseShadow = `0 0 0 2px ${theme.colors.green[6]}`;
  const DROP_INDICATOR_WIDTH = 3;
  const isOver = currentTargetId === id && !isResizing;
  const isSelected = selectedId === id && !isResizing;

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
    : isSelected
    ? { boxShadow: baseShadow }
    : {};

  const Child = () => {
    return (
      <>
        {/* @ts-ignore */}
        {children?.children}
        {selectedId === id && (
          <Group h={20} top={-20} left={0} noWrap pos="absolute" spacing="xs">
            <Box
              h={20}
              bg="green"
              {...draggable}
              px={10}
              sx={{
                cursor: "move",
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
                  const childs = (component.children ?? [])
                    .concat({ ...schema, id: nanoid() })
                    .map((child) => {
                      return {
                        ...child,
                        props: {
                          ...child.props,
                          span: Math.floor(
                            // @ts-ignore
                            component.props.gridSize /
                              ((component.children?.length ?? 1) + 1)
                          ),
                        },
                      };
                    });
                  updateTreeComponentChildren(copy, id, childs);
                  setTree(copy);
                }}
              >
                Add Column
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
