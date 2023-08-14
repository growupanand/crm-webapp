import React from "react";
import "../styles/App.css";
import { Button, Title } from "@mantine/core";
import { getUser } from "@app/utils/storage/user";
import { resetLocalStorage } from "@app/utils/storage";

function Home() {
  const user = getUser();
  const handleLogout = () => resetLocalStorage();
  return (
    <div>
      <Title>Welcome {user.name}</Title>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default Home;
