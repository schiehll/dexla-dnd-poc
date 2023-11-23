import { Component } from "@/utils/editor";
import { BoxProps } from "@mantine/core";
import { forwardRef } from "react";
import { GridColumn as GridColumnComponent } from "@/components/GridColumn";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export const GridColumn = forwardRef(
  ({ renderTree, component, children, ...props }: Props, ref) => {
    return (
      <GridColumnComponent
        ref={ref as any}
        {...component.props}
        {...props}
        id={component.id}
      >
        {children}
        {component.children &&
          component.children.length > 0 &&
          component.children?.map((child: any) => renderTree(child))}
      </GridColumnComponent>
    );
  }
);
