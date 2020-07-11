import React from "react";
import Box from "@material-ui/core/Box";

interface TabPanelPropsType {
  value: number;
  index: number;
  className: string;
}

const TabPanel: React.FC<TabPanelPropsType> = (props) => {
  const { children, value, index, className } = props;
  return (
    <div role="tabpanel" hidden={value !== index} className={className}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export default TabPanel