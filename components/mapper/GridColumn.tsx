import {
  Component,
  getComponentParent,
  updateTreeComponentProps,
} from "@/utils/editor";
import { BoxProps } from "@mantine/core";
import { forwardRef, useEffect } from "react";
import { GridColumn as GridColumnComponent } from "@/components/GridColumn";
import { GRID_SIZE } from "@/utils/config";
import { useEditorStore } from "@/stores/editor";
import cloneDeep from "lodash.clonedeep";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & BoxProps;

export const GridColumn = forwardRef(
  ({ renderTree, component, children, ...props }: Props, ref) => {
    const tree = useEditorStore((state) => state.tree);
    const setTree = useEditorStore((state) => state.setTree);
    /* const setGridUpdates = useEditorStore((state) => state.setGridUpdates);
    const gridUpdates = useEditorStore((state) => state.gridUpdates);
    // @ts-ignore
    const updatedSpan =
      gridUpdates[component.id]?.newSpan ?? component.props.span;
    const span = updatedSpan ?? GRID_SIZE / 2;

    console.log({ id: component.id, updatedSpan, span, tree, gridUpdates });

    useEffect(() => {
      component.children?.forEach((child: any) => {
        if (
          child.type === "GridColumn" &&
          !gridUpdates.hasOwnProperty(child.id)
        ) {
          const copy = cloneDeep(tree);
          const newSpan = (span * span) / parentGridSize;
          console.log({ id: child.id, newSpan });
          updateTreeComponentProps(copy, child.id, {
            span: newSpan,
          });
          setTree(copy);
          setGridUpdates({
            ...gridUpdates,
            [child.id]: { span, parentGridSize, newSpan },
          });
        } else 
        if (child.type === "Grid" && !gridUpdates.hasOwnProperty(child.id)) {
          const copy = cloneDeep(tree);
          console.log({ GRID: child.id, span });
          updateTreeComponentProps(copy, child.id, {
            key: `${child.id}-${span}`,
            gridSize: span,
          });
          console.log({ GRID: child.id, copy });
          setTree(copy);
          setGridUpdates({
            ...gridUpdates,
            [child.id]: { gridSize: span },
          });
        }
      });
    }, [span, component.children, gridUpdates]); */

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
