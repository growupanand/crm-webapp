import { Customer } from "@app/types/customer";
import { Box, Text } from "@mantine/core";

type Props = {
  customers: Customer[];
};

function CustomersList(props: Props) {
  const { customers } = props;

  return (
    <Box my="md">
      {/* show total customer count */}
      <Text size="xs" color="gray">
        Customers ({customers.length})
      </Text>
      {customers.length === 0 && (
        <Text size="sm" color="gray">
          No customers found
        </Text>
      )}
      {customers.map((customer) => (
        <Box key={customer._id} mt="md">
          <Text size="xl">{customer.name}</Text>
          <Text size="md" color="gray">
            {customer.mobileNumber}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

export default CustomersList;
