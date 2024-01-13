import { useEditorStore } from "@/stores/editor";
import { Box } from "@mantine/core";
import { forwardRef } from "react";

export const Container = forwardRef(
  ({ children, component, renderTree, ...props }: any, ref) => {
    const isDragging = useEditorStore((state) => state.isDragging);
    const isResizing = useEditorStore((state) => state.isResizing);
    const { grid } = component.props;
    const style = {
      ...props.style,
      ...(isDragging || isResizing ? grid.style : {}),
    };

    return (
      <Box
        ref={ref}
        {...component.props}
        {...props}
        id={component.id}
        style={style}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child: any) => renderTree(child))
          : children}
      </Box>
    );
  }
);
