import { Card } from "@mui/material";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const BlankCard = ({ children, className }: Props) => {
  return (
    <Card
      sx={{ p: 0, position: "relative", backgroundColor: "#1e1e1e" }}
      className={className}
      elevation={9}
      variant={undefined}
    >
      {children}
    </Card>
  );
};

export default BlankCard;
