import { Button } from "@app/components/button";
import getCreateCustomerModal from "@app/modals/createCustomer";
import { Container, Group, Title } from "@mantine/core";
import { modals } from "@mantine/modals";

function CustomersPage() {
  const newCustomerModal = getCreateCustomerModal({});

  const openNewCustomerModal = () => modals.open(newCustomerModal);

  return (
    <Container size="xs" px="xs" mx={0} fluid>
      <Group position="apart">
        <Title order={1}>Customers</Title>
        <Button onClick={openNewCustomerModal}>New Customer</Button>
      </Group>
    </Container>
  );
}

export default CustomersPage;
