import axios from 'axios';
import { getCurrentDateTime, simplePost, getVariables } from '../../utils';
import { collections, allBaseFields, modulesCatalogues } from '../../constants';
import objectPath from 'object-path';

export const executePolicies = (actionName, module, selectedCatalogue, policies, record = {}) => {
  const { dateFormatted, rawDate, timeFormatted } = getCurrentDateTime();
  const timeStamp = `${dateFormatted} ${timeFormatted}`;
  const filteredPolicies = policies.filter(
    (policy) => policy.selectedAction === actionName && policy.selectedCatalogue === selectedCatalogue && policy.module === module
  );

  console.log(selectedCatalogue, module);

  filteredPolicies.forEach(async ({
    apiDisabled,
    bodyAPI,
    layout: html,
    messageDisabled,
    messageFrom,
    messageNotification,
    messageTo,
    notificationDisabled,
    notificationFrom,
    notificationTo,
    selectedIcon: icon,
    subjectMessage,
    subjectNotification,
    urlAPI,
    token,
    tokenEnabled
  }) => {
    if (!messageDisabled) {
      let convertedMessage;
      let newChars = [];
      const variables = getVariables(html);

      if (variables.length) {
        console.log(record);
        variables.forEach(({ varName }) => {
          const recordField = allBaseFields[modulesCatalogues[module][selectedCatalogue]][varName]?.realId;
          const newMessage = record[recordField] || record[varName];

          if (Array.isArray(newMessage)) {
            const values = newMessage.map(({ name, label }) => name || label).join(', ');
            newChars.push(values);
          } else if (typeof newMessage === 'object') {
            const value = newMessage.name || newMessage.label;
            newChars.push(value);
          } else if (typeof newMessage === 'string' || typeof newMessage === 'number') {
            newChars.push(newMessage.toString());
          } else {
            newChars.push('Data not found');
          }
        });

        convertedMessage = replaceBulk(html, variables.map(({ varName }) => `%{${varName}}`), newChars);
      }

      const messageObj = {
        formatDate: rawDate,
        from: messageFrom,
        html: convertedMessage || html,
        read: false,
        status: 'new',
        subject: subjectMessage,
        timeStamp,
        to: messageTo
      };
      simplePost(collections.messages, messageObj);
    }
    if (!notificationDisabled) {
      const notificationObj = {
        formatDate: rawDate,
        from: notificationFrom,
        icon,
        message: messageNotification,
        read: false,
        status: 'new',
        subject: subjectNotification,
        timeStamp,
        to: notificationTo
      };
      simplePost(collections.notifications, notificationObj);
    }
    if (!apiDisabled) {
      try {
        const validBody = JSON.parse(bodyAPI);
        const headers = { Authorization: `Bearer ${token}` };
        await axios.post(
          urlAPI,
          validBody,
          { ...(tokenEnabled ? { headers } : {}) }
        );
      } catch (error) {
        console.log(error);
      }
    }
  })
};

export const executeOnLoadPolicy = async (itemID, module, selectedCatalogue, policies) => {
  const filteredPolicies = policies.find(
    (policy) => policy.selectedAction === 'OnLoad' && policy.selectedOnLoadCategory?.id === itemID && policy.selectedCatalogue === selectedCatalogue && policy.module === module
  );

  if (!filteredPolicies) return;

  const { onLoadDisabled, onLoadFields, tokenOnLoad, tokenOnLoadEnabled, urlOnLoad } = filteredPolicies;

  let res;

  if (!onLoadDisabled) {
    if (tokenOnLoadEnabled) {      
      try {
        const { data } = await axios.get(urlOnLoad, {
          headers: {
            Authorization: `Bearer ${tokenOnLoad}`,
          }
        });
        res = handlePathResponse(data, onLoadFields);
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const { data } = await axios.get(urlOnLoad);
        res = handlePathResponse(data, onLoadFields);
      } catch (error) {
        console.log(error);
      }
    }
  }
  return res;
};

const handlePathResponse = (response, onLoadFields, res = {}) => {
  Object.entries(onLoadFields).forEach((customField) => {
    const pathResponse = objectPath.get(response, customField[1], 'Not Found');
    res = { ...res, [customField[0]]: pathResponse };
  });

  return res;
};

const replaceBulk = (str, findArray, replaceArray) => {
  var i, regex = [], map = {}; 
  for( i=0; i<findArray.length; i++ ){ 
    regex.push( findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g,'\\$1') );
    map[findArray[i]] = replaceArray[i]; 
  }
  regex = regex.join('|');
  str = str.replace( new RegExp( regex, 'g' ), function(matched) {
    return map[matched];
  });

  return str;
}
