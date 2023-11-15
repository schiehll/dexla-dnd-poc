import { Grid } from "@/components/mapper/Grid";
import { GridColumn } from "@/components/mapper/GridColumn";
import { Container } from "@/components/mapper/Container";
import { Component } from "./editor";

export type ComponentDefinition = {
  Component: any;
};

export type ComponentMapper = {
  [key: string]: ComponentDefinition;
};

export const componentMapper: ComponentMapper = {
  Container: {
    Component: (props: { component: Component; renderTree: any }) => {
      return <Container {...props} />;
    },
  },
  Grid: {
    Component: (props: { component: Component; renderTree: any }) => {
      // @ts-ignore
      return <Grid {...props} />;
    },
  },
  GridColumn: {
    Component: (props: { component: Component; renderTree: any }) => {
      // @ts-ignore
      return <GridColumn {...props} />;
    },
  },
};
