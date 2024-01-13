import { Container } from "@/components/mapper/Container";
import { Component } from "./editor";
import { schema as ContainerSchema } from "@/components/schemas/Container";
import { schema as ButtonSchema } from "@/components/schemas/Button";
import { Button } from "@/components/mapper/Button";

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
  Button: {
    Component: (props: { component: Component; renderTree: any }) => {
      // @ts-ignore
      return <Button {...props} />;
    },
  },
};

export type SchemaMapper = {
  [key: string]: any;
};

export const schemaMapper: SchemaMapper = {
  Container: ContainerSchema,
  Button: ButtonSchema,
};
