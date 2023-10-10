import { useOrganizationStore } from "@app/stores/organizationStore";
import { Customer } from "@app/types/customer";
import { Box, Text, NavLink } from "@mantine/core";
import { useNavigate } from "react-router-dom";

type Props = {
  customers: Customer[];
};

function CustomersList(props: Props) {
  const { customers } = props;
  const { currentOrganization } = useOrganizationStore();
  const navigate = useNavigate();

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
        <NavLink
          key={customer._id}
          label={customer.name}
          description={customer.mobileNumber}
          onClick={() =>
            navigate(
              `/organization/${currentOrganization._id}/customers/${customer._id}`
            )
          }
          mt="md"
        />
      ))}
    </Box>
  );
}

export default CustomersList;
