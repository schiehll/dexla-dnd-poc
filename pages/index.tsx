import { Draggable } from "@/components/Draggable";
import { Editor } from "@/components/Editor";
import { Component } from "@/utils/editor";
import { Box, Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { schema as ContainerSchema } from "@/components/schemas/Container";
import { schema as ButtonSchema } from "@/components/schemas/Button";

const Item = ({ id, data }: { data: Component; id: string }) => {
  return (
    <Draggable id={id} data={data} isDeletable={false}>
      <Flex justify="center" align="center">
        <Text size="sm">{data.type}</Text>
      </Flex>
    </Draggable>
  );
};

export default function Home() {
  const theme = useMantineTheme();

  return (
    <Flex justify="space-between" align="start">
      <Stack
        h="100vh"
        w="200px"
        p="md"
        sx={{ borderRight: `1px solid ${theme.colors.gray[3]}` }}
      >
        <Item id="Container" data={ContainerSchema} />
        <Item id="Button" data={ButtonSchema} />
      </Stack>
      <Box m={40} w={`calc(100vw - 200px)`}>
        <Editor />
      </Box>
    </Flex>
  );
}
