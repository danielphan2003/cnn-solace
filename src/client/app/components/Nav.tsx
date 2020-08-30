import React from 'preact';

import { useLocation } from 'wouter-preact';
import { Tab, TabProps } from "semantic-ui-react";

export const Nav = () => {
  const [ location, setLocation ] = useLocation();

  const pathMap = [
    "/",
    "/welcome",
    "/error"
  ];

  const onTabChange = (event, data: TabProps) => {
    if (location == pathMap[data.activeIndex]) {
      return;
    }
    setLocation(pathMap[data.activeIndex]);
  };

  const panes = [
    {
      menuItem: 'Home',
      pane: "",
    },
    {
      menuItem: 'Welcome',
      pane: "",
    },
  ]

  return (
    <Tab 
      menu={{ attached: false, borderless: true, pointing: true }} 
      panes={panes} 
      onTabChange={onTabChange} />
  );
};
