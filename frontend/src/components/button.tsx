import { ButtonProps, Button as MantineButton } from "@mantine/core";
import { Link, LinkProps } from "react-router-dom";

/**
 * Here we are extending mantine button component for react-router-dom link,
 * this way we don't have to wrap button with <Link/> every time
 */

type Props = ButtonProps & {
  to?: LinkProps["to"];
};

export const Button = (props: Props) => {
  const { to, ...mantineButtonProps } = props;
  if (to) {
    return (
      <Link to={to}>
        <MantineButton {...mantineButtonProps} />
      </Link>
    );
  }
  return <MantineButton {...mantineButtonProps} />;
};
