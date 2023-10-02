import { Alert, Group, Text } from "@mantine/core";
import { Button } from "./button";

type Props = {
  errorMessage: string;
  retry?: () => void;
};

/**
 * ErrorBox is a component that displays an error message and optionally a retry button.
 * @param errorMessage The error message to display.
 * @param retry An optional function to call when the retry button is clicked.
 */
function ErrorBox(props: Props) {
  const { errorMessage, retry } = props;
  return (
    <Alert color="red" my="xl">
      <Group position="apart">
        <Text size="lg">{errorMessage}</Text>
        {retry && (
          <Button onClick={retry} variant="subtle" color="red">
            Retry
          </Button>
        )}
      </Group>
    </Alert>
  );
}

export default ErrorBox;
