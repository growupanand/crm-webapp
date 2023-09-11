import "../styles/App.css";
import { Text, Title } from "@mantine/core";
import { useAuthStore } from "@app/stores/authStore";
import { useOrganizationStore } from "@app/stores/organizationStore";

function Home() {
  const { user } = useAuthStore();
  const { currentOrganization } = useOrganizationStore();
  return (
    <div>
      <Title>Welcome {user.name}</Title>
      <Text size="xl">
        Currently you are in organization named{" "}
        <b>{currentOrganization.name}</b>
      </Text>
    </div>
  );
}

export default Home;
