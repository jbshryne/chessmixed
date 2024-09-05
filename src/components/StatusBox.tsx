import { motion, AnimatePresence } from "framer-motion";
import "../styles/components/StatusBox.css";

type StatusBoxProps = {
  isActive: boolean;
  children: React.ReactNode;
};

const StatusBox = ({ isActive, children }: StatusBoxProps) => {
  return (
    <>
      <h2 className="status-box">
        <AnimatePresence>
          {isActive && (
            <motion.span
              key="status-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </h2>
    </>
  );
};

export default StatusBox;
