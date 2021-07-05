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
      const convertedHTML = changeVariables(html, record, module, selectedCatalogue);
      const convertedSubject = changeVariables(subjectMessage, record, module, selectedCatalogue);

      const messageObj = {
        formatDate: rawDate,
        from: messageFrom,
        html: convertedHTML || html,
        read: false,
        status: 'new',
        subject: convertedSubject || subjectMessage,
        timeStamp,
        to: messageTo
      };
      simplePost(collections.messages, messageObj);
    }
    if (!notificationDisabled) {
      const convertedMessage = changeVariables(messageNotification, record, module, selectedCatalogue);
      const convertedSubject = changeVariables(subjectNotification, record, module, selectedCatalogue);

      const notificationObj = {
        formatDate: rawDate,
        from: notificationFrom,
        icon,
        message: convertedMessage || messageNotification,
        read: false,
        status: 'new',
        subject: convertedSubject || subjectNotification,
        timeStamp,
        to: notificationTo
      };
      simplePost(collections.notifications, notificationObj);
    }
    if (!apiDisabled) {
      try {
        const convertedURL = changeVariables(urlAPI, record, module, selectedCatalogue);
        const validBody = JSON.parse(bodyAPI);
        const headers = { Authorization: `Bearer ${token}` };
        await axios.post(
          convertedURL || urlAPI,
          validBody,
          { ...(tokenEnabled ? { headers } : {}) }
        );
      } catch (error) {
        console.log(error);
      }
    }
  })
};

export const executeOnLoadPolicy = async (itemID, module, selectedCatalogue, policies, record = {}) => {
  const filteredPolicies = policies.find(
    (policy) => policy.selectedAction === 'OnLoad' && policy.selectedOnLoadCategory?.id === itemID && policy.selectedCatalogue === selectedCatalogue && policy.module === module
  );

  if (!filteredPolicies) return;

  const { onLoadDisabled, onLoadFields, tokenOnLoad, tokenOnLoadEnabled, urlOnLoad } = filteredPolicies;

  let res;

  if (!onLoadDisabled) {
    if (tokenOnLoadEnabled) {
      try {
        const convertedURL = changeVariables(urlOnLoad, record, module, selectedCatalogue);
        const { data } = await axios.get(convertedURL || urlOnLoad, {
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
        const convertedURL = changeVariables(urlOnLoad, record, module, selectedCatalogue);
        const { data } = await axios.get(convertedURL || urlOnLoad);
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
  for (i = 0; i < findArray.length; i++) {
    regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, '\\$1'));
    map[findArray[i]] = replaceArray[i];
  }
  regex = regex.join('|');
  str = str.replace(new RegExp(regex, 'g'), function (matched) {
    return map[matched];
  });

  return str;
}

const changeVariables = (text, record, module, selectedCatalogue) => {
  let convertedMessage = null;
  let newChars = [];
  const variables = getVariables(text);

  if (variables.length) {
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

    convertedMessage = replaceBulk(text, variables.map(({ varName }) => `%{${varName}}`), newChars);
  }

  return convertedMessage;
};
