import { GRID_SIZE_X, GRID_SIZE_Y, useEditorStore } from "@/stores/editor";
import { Component, updateTreeComponentProps } from "@/utils/editor";
import { Box, ButtonProps, Button as MantineButton } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import { Resizable } from "re-resizable";
import { ReactElement, forwardRef, useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  controls?: any;
} & ButtonProps &
  ReactElement<"Button">;

export const Button = forwardRef(
  (
    { renderTree, component, style: _style, controls, ...props }: Props,
    ref
  ) => {
    const tree = useEditorStore((state) => state.tree);
    const setTree = useEditorStore((state) => state.setTree);
    const setIsResizing = useEditorStore((state) => state.setIsResizing);
    const selectedId = useEditorStore((state) => state.selectedId);
    const [snap, setSnap] = useState();
    const { children, loading, style, ...componentProps } =
      component.props as any;

    const styles = {
      ..._style,
      ...style,
    };

    const width = `${componentProps?.gridX * GRID_SIZE_X}px`;
    const height = `${componentProps?.gridY * GRID_SIZE_Y}px`;

    useEffect(() => {
      const root = window.document.getElementById("root");
      if (root) {
        const rect = root.getBoundingClientRect();
        const xGrid: any[] = [];
        [...new Array(500)].forEach((_, i) => {
          xGrid.push(rect.left + GRID_SIZE_X * i);
        });

        const yGrid: any[] = [];
        [...new Array(500)].forEach((_, i) => {
          yGrid.push(rect.top + GRID_SIZE_Y * i);
        });

        setSnap({ x: xGrid, y: yGrid } as any);
      }
    }, []);

    return (
      <Box
        top={`${styles?.top}px`}
        left={`${styles?.left}px`}
        component={Resizable}
        size={{ height, width }}
        style={{
          position: "absolute",
          padding: 0,
        }}
        enable={{
          top: false,
          right: selectedId === component.id ? true : false,
          bottom: selectedId === component.id ? true : false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        // @ts-ignore
        onResizeStart={(e: any, direction: any, ref: any, delta: any) => {
          setIsResizing(true);
        }}
        // @ts-ignore
        onResize={(e: DragEvent, direction: any, ref: any, delta: any) => {
          if (direction === "right") {
            const rect = ref.getBoundingClientRect();
            const newGridX = Math.ceil(rect.width / GRID_SIZE_X);
            const treeCopy = cloneDeep(tree);
            updateTreeComponentProps(treeCopy, component.id!, {
              gridX: newGridX,
            });
            setTree(treeCopy);
          } else if (direction === "bottom") {
            const rect = ref.getBoundingClientRect();
            const newGridY = Math.floor(rect.height / GRID_SIZE_Y);
            const treeCopy = cloneDeep(tree);
            updateTreeComponentProps(treeCopy, component.id!, {
              gridY: newGridY,
            });
            setTree(treeCopy);
          }
        }}
        onResizeStop={() => {
          setIsResizing(false);
        }}
        snap={snap}
        snapGap={0}
        boundsByDirection
        bounds="parent"
      >
        <MantineButton
          ref={ref}
          loading={loading}
          {...componentProps}
          {...props}
          w="100%"
          h="100%"
        >
          {controls}
          {children}
        </MantineButton>
      </Box>
    );
  }
);
