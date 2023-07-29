import { ButtonProps, Button as MantineButton } from "@mantine/core";
import { To, useNavigate } from "react-router-dom";

/**
 * Here we are extending mantine button component for react-router-dom link,
 * this way we don't have to wrap button with <Link/> every time
 */

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonProps & {
    to?: To;
  };

export const Button = (props: Props) => {
  const { to, ...mantineButtonProps } = props;
  const navigate = useNavigate();
  if (to) {
    return (
      <MantineButton {...mantineButtonProps} onClick={() => navigate(to)} />
    );
  }
  return <MantineButton {...mantineButtonProps} />;
};
