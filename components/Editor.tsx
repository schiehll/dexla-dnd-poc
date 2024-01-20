import {
  Component,
  getComponentById,
  getComponentParent,
  removeComponent,
} from "@/utils/editor";
import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { Box, Paper, useMantineTheme } from "@mantine/core";
import { componentMapper } from "@/utils/componentMapper";
import {
  DEFAULT_GRID_SIZE_X,
  DEFAULT_GRID_SIZE_Y,
  useEditorStore,
} from "@/stores/editor";
import { useHotkeys, useMediaQuery } from "@mantine/hooks";
import cloneDeep from "lodash.clonedeep";
import { useCallback, useEffect } from "react";

export const Editor = () => {
  const tree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const selectedComponentId = useEditorStore((state) => state.selectedId);
  const setSelectedId = useEditorStore((state) => state.setSelectedId);
  const previewPosition = useEditorStore((state) => state.previewPosition);
  const componentToAdd = useEditorStore((state) => state.componentToAdd);
  const gridSize = useEditorStore((state) => state.gridSize);
  const setGridSize = useEditorStore((state) => state.setGridSize);
  const theme = useMantineTheme();
  const isSmallerThanLg = useMediaQuery(
    theme.fn.smallerThan("lg").replace("@media ", "")
  );
  const isSmallerThanSm = useMediaQuery(
    theme.fn.smallerThan("sm").replace("@media ", "")
  );
  const isLargerThanLg = useMediaQuery(
    theme.fn.largerThan("lg").replace("@media ", "")
  );

  useEffect(() => {
    // Change the grid values here for each screen size to match the wanted new grid size and all grid components will resize
    if (isSmallerThanSm) {
      setGridSize({ x: DEFAULT_GRID_SIZE_X - 40, y: DEFAULT_GRID_SIZE_Y - 8 });
    } else if (isSmallerThanLg) {
      setGridSize({ x: DEFAULT_GRID_SIZE_X - 20, y: DEFAULT_GRID_SIZE_Y - 5 });
    } else if (isLargerThanLg) {
      setGridSize({ x: DEFAULT_GRID_SIZE_X, y: DEFAULT_GRID_SIZE_Y });
    }
  }, [isSmallerThanLg, isSmallerThanSm, isLargerThanLg, setGridSize]);

  const deleteComponent = useCallback(() => {
    if (selectedComponentId) {
      const copy = cloneDeep(tree);

      const comp = getComponentById(copy, selectedComponentId);
      const parent = getComponentParent(copy, selectedComponentId);
      const grantParent = getComponentParent(copy, parent!.id!);

      if (
        comp?.type === "GridColumn" &&
        parent?.type === "Grid" &&
        parent.children?.length === 1 &&
        grantParent?.id === "root"
      ) {
        return;
      }

      removeComponent(copy, selectedComponentId);

      if (
        comp?.type === "GridColumn" &&
        parent?.type === "Grid" &&
        parent.children?.length === 0
      ) {
        removeComponent(copy, parent.id!);
      }

      setEditorTree(copy);
      setSelectedId(undefined);
    }
  }, [tree, selectedComponentId, setEditorTree, setSelectedId]);

  useHotkeys([
    ["backspace", deleteComponent],
    ["delete", deleteComponent],
  ]);

  const renderTree = (component: Component) => {
    if (component.id === "root") {
      return (
        <Droppable id={component.id} m={0} p={2}>
          <Paper shadow="xs" bg="gray.0" display="flex" mih="200px">
            {component.children?.map((child) => renderTree(child))}
          </Paper>
        </Droppable>
      );
    }

    const componentToRender = componentMapper[component.type];

    if (!componentToRender) {
      return (
        <DroppableDraggable
          key={component.id}
          id={component.id!}
          component={component}
        >
          {component.children?.map((child) => renderTree(child))}
        </DroppableDraggable>
      );
    }

    return (
      <DroppableDraggable
        key={component.id}
        id={component.id!}
        component={component}
      >
        {componentToRender?.Component({ component, renderTree })}
      </DroppableDraggable>
    );
  };

  const comp = componentToAdd
    ? componentToAdd
    : selectedComponentId
    ? getComponentById(tree, selectedComponentId!)
    : null;

  return (
    <>
      {renderTree(tree)}
      {previewPosition && comp && (
        <Box
          w={`${comp.props?.gridX * gridSize.x}px`}
          h={`${comp.props?.gridY * gridSize.y}px`}
          bg="blue"
          pos="absolute"
          top={`${previewPosition.top}px`}
          left={`${previewPosition.left}px`}
          sx={{
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
};
