import { Button } from "@app/components/button";
import ErrorBox from "@app/components/errorBox";
import useAPIClient from "@app/hooks/useAPIClient";
import getCreateCustomerModal from "@app/modals/createCustomer";
import { useOrganizationStore } from "@app/stores/organizationStore";
import { Customer } from "@app/types/customer";
import {
  Box,
  Container,
  Flex,
  Group,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import CustomersList from "./components/customersList";

type State = {
  loadingCustomers: boolean;
  customers: Customer[];
  error: string | null;
};

function CustomersPage() {
  const [state, setState] = useState<State>({
    loadingCustomers: false,
    customers: [],
    error: null,
  });
  const { loadingCustomers, customers, error } = state;
  const { currentOrganization } = useOrganizationStore();
  const { client } = useAPIClient();
  const newCustomerModal = getCreateCustomerModal({
    onSuccess: fetchCustomers,
  });

  const openNewCustomerModal = () => modals.open(newCustomerModal);

  async function fetchCustomers() {
    const endpoint = `organizations/${currentOrganization._id}/customers`;
    setState((cs) => ({ ...cs, loadingCustomers: true, error: null }));
    try {
      const customers = await client<Customer[]>(endpoint, {});
      setState((cs) => ({ ...cs, customers }));
    } catch (error) {
      setState((cs) => ({
        ...cs,
        error: error.message,
      }));
    } finally {
      setState((cs) => ({
        ...cs,
        loadingCustomers: false,
      }));
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Container size="xs" px="xs" mx={0} fluid>
      <Group position="apart">
        <Title order={1}>Customers</Title>

        <Button onClick={openNewCustomerModal}>New Customer</Button>
      </Group>
      <Box>
        {loadingCustomers && <LoadingCustomers />}
        {error && (
          <ErrorBox
            errorMessage="Unable to load customers"
            retry={fetchCustomers}
          />
        )}
        {!loadingCustomers && !error && <CustomersList customers={customers} />}
      </Box>
    </Container>
  );
}

const LoadingCustomers = () => (
  <Flex justify="center" align="center" gap="md">
    <Text>Loading customers</Text>
    <Loader variant="dots" />
  </Flex>
);

export default CustomersPage;
