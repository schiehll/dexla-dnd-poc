import { Box, Button, Center, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  const isStreaming = useRef(false);

  const form = useForm({
    initialValues: {
      prompt: "",
    },
  });

  useEffect(() => {
    const onLoad = async () => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setMessage((state) => {
          try {
            return `${state}${chunkValue}`;
          } catch (error) {
            return state;
          }
        });
      }
    };

    if (!isStreaming.current && prompt) {
      isStreaming.current = true;
      onLoad();
    }
  }, [prompt]);

  const onSubmit = (values: any) => {
    setMessage("");
    isStreaming.current = false;
    setPrompt(values.prompt);
    form.reset();
  };

  return (
    <Center mt={100}>
      <Box w={400}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <Text size="sm">{message}</Text>
            <TextInput
              placeholder="Ask something"
              {...form.getInputProps("prompt")}
            />
            <Button type="submit">Send</Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
};

export default Chat;
