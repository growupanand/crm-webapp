import { useParams } from "react-router-dom";
import { Customer } from "@app/types/customer";
import { useEffect, useState } from "react";
import useAPIClient from "@app/hooks/useAPIClient";
import { useOrganizationStore } from "@app/stores/organizationStore";
import { handleCachedError } from "@app/utils/errorHandlers";
import { Alert, Box, Flex, Loader, Text } from "@mantine/core";
import { Button } from "@app/components/button";
import { IconChevronLeft } from "@tabler/icons-react";

type State = {
  isLoading: boolean;
  customer: null | Customer;
};

function ViewCustomerPage() {
  const { client } = useAPIClient();
  const { currentOrganization } = useOrganizationStore();

  const [state, setState] = useState<State>({
    isLoading: false,
    customer: null,
  });
  const { isLoading, customer } = state;
  const { customerId } = useParams();

  const fetchCustomerDetails = async () => {
    const endpoint = `organizations/${currentOrganization._id}/customers/${customerId}`;
    setState((cs) => ({ ...cs, isLoading: true, customer: null }));
    try {
      const customer = await client<Customer>(endpoint, {});
      setState((cs) => ({ ...cs, customer }));
    } catch (error) {
      handleCachedError(error);
    } finally {
      setState((cs) => ({ ...cs, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  return (
    <>
      <Box>
        <Button
          leftIcon={<IconChevronLeft />}
          variant="white"
          to={`/organization/${currentOrganization._id}/customers`}
        >
          Customers
        </Button>
      </Box>
      {isLoading && <LoadingCustomer />}
      {!isLoading && !customer && <Alert>No customer found</Alert>}
      {customer && (
        <>
          <h1>{customer.name}</h1>
          <Text>{customer.mobileNumber}</Text>
        </>
      )}
    </>
  );
}

const LoadingCustomer = () => (
  <Flex justify="center" align="center" gap="md">
    <Text>Loading</Text>
    <Loader variant="dots" />
  </Flex>
);

export default ViewCustomerPage;
