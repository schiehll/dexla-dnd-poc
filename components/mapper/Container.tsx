import { Box } from "@mantine/core";
import { forwardRef } from "react";

export const Container = forwardRef(
  ({ children, component, renderTree, ...props }: any, ref) => {
    return (
      <Box ref={ref} {...component.props} {...props} id={component.id}>
        {component.children && component.children.length > 0
          ? component.children?.map((child: any) => renderTree(child))
          : children}
      </Box>
    );
  }
);
