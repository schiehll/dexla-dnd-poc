import { GRID_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import { Box, BoxProps, useMantineTheme } from "@mantine/core";
import { forwardRef } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export const Grid = forwardRef(
  ({ renderTree, component, children, ...props }: Props, ref) => {
    const theme = useMantineTheme();
    const { style = {}, gridSize } = component.props!;

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
          gap: Object.keys(theme.spacing).includes(component.props!.gap)
            ? theme.spacing[component.props!.gap ?? "xs"]
            : component.props!.gap ?? theme.spacing.xs,
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
