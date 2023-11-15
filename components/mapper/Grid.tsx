import { Component } from "@/utils/editor";
import { GridProps, Grid as MantineGrid } from "@mantine/core";
import { forwardRef } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & GridProps;

export const Grid = forwardRef(
  ({ renderTree, component, children, ...props }: Props, ref) => {
    // @ts-ignore
    const { gutter = "md" } = component.props;
    console.log({ component, props, gutter });

    return (
      <MantineGrid
        ref={ref as any}
        {...component.props}
        {...props}
        id={component.id}
        gutter={gutter}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child: any) => renderTree(child))
          : children}
      </MantineGrid>
    );
  }
);
