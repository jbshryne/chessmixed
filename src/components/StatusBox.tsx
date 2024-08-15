import "../styles/components/StatusBox.css";

type StatusBoxProps = {
  children: React.ReactNode;
};

const StatusBox = ({ children }: StatusBoxProps) => {
  return <h2 className="status-box">{children}</h2>;
};

export default StatusBox;
