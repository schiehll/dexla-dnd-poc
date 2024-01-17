import { GRID_SIZE_X, GRID_SIZE_Y, useEditorStore } from "@/stores/editor";
import { Component, updateTreeComponentProps } from "@/utils/editor";
import { Box, ButtonProps, Button as MantineButton } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import { ReactElement, forwardRef } from "react";
import { ResizableBox } from "react-resizable";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  controls?: any;
} & ButtonProps &
  ReactElement<"Button">;

const ResizeHandle = forwardRef((props: any, ref: any) => {
  const { handleAxis, ...restProps } = props;

  let handleProps = {};
  if (handleAxis === "s") {
    handleProps = {
      pos: "absolute",
      bottom: "-10px",
      left: `calc(50% - 10px)`,
      w: 20,
      h: 4,
    };
  }

  if (handleAxis === "e") {
    handleProps = {
      pos: "absolute",
      top: `calc(50% - 10px)`,
      right: "-10px",
      h: 20,
      w: 4,
    };
  }

  return <Box ref={ref} bg="red" {...handleProps} {...restProps} />;
});

export const Button = forwardRef(
  (
    { renderTree, component, style: _style, controls, ...props }: Props,
    ref
  ) => {
    const tree = useEditorStore((state) => state.tree);
    const setTree = useEditorStore((state) => state.setTree);
    const setIsResizing = useEditorStore((state) => state.setIsResizing);
    const { children, loading, style, ...componentProps } =
      component.props as any;

    const styles = {
      ..._style,
      ...style,
    };

    return (
      <Box
        top={`${styles?.top}px`}
        left={`${styles?.left}px`}
        component={ResizableBox}
        height={componentProps?.gridY * GRID_SIZE_Y}
        width={componentProps?.gridX * GRID_SIZE_X}
        style={{
          position: "absolute",
          padding: 0,
        }}
        draggableOpts={{ grid: [GRID_SIZE_X, GRID_SIZE_Y] }}
        resizeHandles={["s", "e"]}
        handle={<ResizeHandle />}
        onResizeStart={() => {
          setIsResizing(true);
        }}
        onResizeStop={(_, data) => {
          setIsResizing(false);

          if (data.handle === "e") {
            const newGridX = Math.ceil(data.size.width / GRID_SIZE_X);
            const treeCopy = cloneDeep(tree);
            updateTreeComponentProps(treeCopy, component.id!, {
              gridX: newGridX,
            });
            setTree(treeCopy);
          } else if (data.handle === "s") {
            const newGridY = Math.floor(data.size.height / GRID_SIZE_Y);
            const treeCopy = cloneDeep(tree);
            updateTreeComponentProps(treeCopy, component.id!, {
              gridY: newGridY,
            });
            setTree(treeCopy);
          }
        }}
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
