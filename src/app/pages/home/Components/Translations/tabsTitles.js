import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Tab } from '@material-ui/core';
import { tabsConfig } from './constants';

export const TabsTitles = (module) => {
  const intl = useIntl();
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    const tabs = tabsConfig.modules.filter((tab) => tab.name === module); 
    
    if (tabs.length > 0) {
      const titles = tabs[0].titles.map((tab) => tabsConfig.titles.filter((tabTitle) => tabTitle.title === tab)[0]);
      setTitles(titles);
    }
  }, [module]);
 
  return titles.map(({ title, translate }) => (
    <Tab 
      label={!translate ? title : intl.formatMessage({ id: translate, defaultMessage: title })}
    />
  ));
}
