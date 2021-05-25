import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Tab } from '@material-ui/core';
import { tabsConfig } from './constants';

export const TabsTitles = (module) => {
  const intl = useIntl();
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    const tabs = tabsConfig.modules.find((tab) => tab.name === module); 
    
    if (tabs) {
      const titles = tabs.titles.map((tab) => tabsConfig.titles.filter((tabTitle) => tabTitle.title === tab)[0]);
      console.log(titles);
      setTitles(titles);
    }
  }, [module]);
 
  return titles.map(({ title, translate }) => (
    <Tab 
      label={!translate ? title : intl.formatMessage({ id: translate, defaultMessage: title })}
    />
  ));
}
