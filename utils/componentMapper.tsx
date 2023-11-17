import { Grid } from "@/components/mapper/Grid";
import { GridColumn } from "@/components/mapper/GridColumn";
import { Container } from "@/components/mapper/Container";
import { Component } from "./editor";
import { schema as ContainerSchema } from "@/components/schemas/Container";
import { schema as GridSchema } from "@/components/schemas/Grid";
import { schema as GridColumnSchema } from "@/components/schemas/GridColumn";

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

export type SchemaMapper = {
  [key: string]: any;
};

export const schemaMapper: SchemaMapper = {
  Container: ContainerSchema,
  Grid: GridSchema,
  GridColumn: GridColumnSchema,
};
