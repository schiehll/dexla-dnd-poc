import { Component } from "@/utils/editor";
import { GridProps, Grid as MantineGrid } from "@mantine/core";
import { forwardRef } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & GridProps;

export const GridColumn = forwardRef(
  ({ renderTree, component, children, ...props }: Props, ref) => {
    return (
      <MantineGrid.Col
        ref={ref as any}
        {...component.props}
        {...props}
        id={component.id}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child: any) => renderTree(child))
          : children}
      </MantineGrid.Col>
    );
  }
);
