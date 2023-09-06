import "../styles/App.css";
import { Button, Title } from "@mantine/core";
import { useAuthStore } from "@app/stores/authStore";

function Home() {
  const { user, logout } = useAuthStore();
  return (
    <div>
      <Title>Welcome {user.name}</Title>
    </div>
  );
}

export default Home;
