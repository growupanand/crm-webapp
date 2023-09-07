import { getUser } from "@app/utils/storage";
import { Table, Title } from "@mantine/core";

function AccountPage() {
  const user = getUser();
  return (
    <>
      <Title order={3} mb="xs" fw="normal">
        Account
      </Title>
      <Table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{user.email}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default AccountPage;
