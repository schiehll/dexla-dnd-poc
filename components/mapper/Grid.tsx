import { useEditorStore } from "@/stores/editor";
import { GRID_SIZE } from "@/utils/config";
import { Component, updateTreeComponentProps } from "@/utils/editor";
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import { forwardRef, useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export const Grid = forwardRef(
  ({ renderTree, component, children, ...props }: Props, ref) => {
    const theme = useMantineTheme();
    const tree = useEditorStore((state) => state.tree);
    const setTree = useEditorStore((state) => state.setTree);
    const gridUpdates = useEditorStore((state) => state.gridUpdates);
    const setGridUpdates = useEditorStore((state) => state.setGridUpdates);
    // @ts-ignore
    const { style = {}, gridSize } = component.props;
    /* const updatedSize = gridUpdates[component.id]?.gridSize ?? gridSize;
    console.log({ id: component.id, gridSize, tree, gridUpdates });

    useEffect(() => {
      component.children?.forEach((child: any) => {
        if (
          child.type === "GridColumn" &&
          !gridUpdates.hasOwnProperty(child.id)
        ) {
          const copy = cloneDeep(tree);
          const span = child.props.span;
          const newSpan = (span * span) / updatedSize;
          console.log({ id: child.id, span, newSpan });
          updateTreeComponentProps(copy, child.id, {
            span: newSpan,
          });
          setTree(copy);
          setGridUpdates({
            ...gridUpdates,
            [child.id]: { span, parentGridSize: updatedSize, newSpan },
          });
        }
      });
    }, [updatedSize, component.children]); */

    return (
      <Box
        display="grid"
        ref={ref as any}
        {...component.props}
        {...props}
        id={component.id}
        pos="relative"
        style={{
          ...props.style,
          ...style,
          gap: theme.spacing.xs,
          gridTemplateColumns: `repeat(${gridSize ?? GRID_SIZE}, 1fr)`,
        }}
      >
        {children}
        {component.children &&
          component.children.length > 0 &&
          component.children?.map((child: Component) => renderTree(child))}
      </Box>
    );
  }
);
