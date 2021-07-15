import axios from 'axios';
import { getCurrentDateTime, simplePost, getVariables } from '../../utils';
import { collections, allBaseFields, modulesCatalogues } from '../../constants';
import { extractCustomFieldValues } from '../../Reports/reportsHelpers';
import objectPath from 'object-path';

export const executePolicies = (actionName, module, selectedCatalogue, policies, record = {}) => {
  const { dateFormatted, rawDate, timeFormatted } = getCurrentDateTime();
  const timeStamp = `${dateFormatted} ${timeFormatted}`;
  const filteredPolicies = policies.filter(
    (policy) => policy.selectedAction === actionName && policy.selectedCatalogue === selectedCatalogue && policy.module === module
  );

  filteredPolicies.forEach(({
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
    send(
      record,
      messageDisabled,
      notificationDisabled,
      apiDisabled,
      rawDate,
      timeStamp,
      html,
      module,
      selectedCatalogue,
      messageFrom,
      subjectMessage,
      messageTo,
      notificationFrom,
      icon,
      messageNotification,
      subjectNotification,
      notificationTo,
      urlAPI,
      bodyAPI,
      token,
      tokenEnabled
    );
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

export const executeOnFieldPolicy = (module, selectedCatalogue, policies, record = {}) => {
  const { dateFormatted, rawDate, timeFormatted } = getCurrentDateTime();
  const timeStamp = `${dateFormatted} ${timeFormatted}`;
  const filteredPolicies = policies.filter(
    (policy) => policy.selectedAction === 'OnField' && ['ruleTwo', 'ruleThree'].includes(policy.selectedRule) && policy.selectedCatalogue === selectedCatalogue && policy.module === module
  );

  if (!filteredPolicies) return;

  filteredPolicies.forEach(({
    OnFieldApiDisabled,
    onFieldBodyAPI,
    onFieldLayout: html,
    onFieldSelectedIcon: icon,
    onFieldMessageDisabled,
    onFieldMessageFrom,
    onFieldMessageInternal,
    onFieldMessageMail,
    onFieldMessageNotification,
    onFieldMessageSubject,
    onFieldMessageTo,
    onFieldNotificationDisabled,
    onFieldNotificationFrom,
    onFieldNotificationSubject,
    onFieldNotificationTo,
    onFieldToken,
    onFieldTokenEnabled,
    onFieldUrlAPI,
    ruleTwo,
    ruleThree,
    selectedRule
  }) => {
    if (selectedRule === 'ruleTwo') {
      const customFieldsValues = getCustomFieldValues(record);
      Object.entries(customFieldsValues || {}).forEach((field) => {
        if (`%{${field[0]}}` === ruleTwo?.field && new Date(field[1]).toISOString() === ruleTwo?.value) {
          send(
            record,
            onFieldMessageDisabled,
            onFieldNotificationDisabled,
            OnFieldApiDisabled,
            rawDate,
            timeStamp,
            html,
            module,
            selectedCatalogue,
            onFieldMessageFrom,
            onFieldMessageSubject,
            onFieldMessageTo,
            onFieldNotificationFrom,
            icon,
            onFieldMessageNotification,
            onFieldNotificationSubject,
            onFieldNotificationTo,
            onFieldUrlAPI,
            onFieldBodyAPI,
            onFieldToken,
            onFieldTokenEnabled
          );
        }
      });
    }
    else if (selectedRule === 'ruleThree') {
      let flag = true;
      Object.entries(allBaseFields[modulesCatalogues[module][selectedCatalogue]] || {}).forEach((field) => {
        const recordField = field[1]?.validationId;
        if (`%{${recordField}}` === ruleThree?.field && record[recordField] === ruleThree?.value) {
          flag = false;
          send(
            record,
            onFieldMessageDisabled,
            onFieldNotificationDisabled,
            OnFieldApiDisabled,
            rawDate,
            timeStamp,
            html,
            module,
            selectedCatalogue,
            onFieldMessageFrom,
            onFieldMessageSubject,
            onFieldMessageTo,
            onFieldNotificationFrom,
            icon,
            onFieldMessageNotification,
            onFieldNotificationSubject,
            onFieldNotificationTo,
            onFieldUrlAPI,
            onFieldBodyAPI,
            onFieldToken,
            onFieldTokenEnabled
          );
        }
      });
      if (flag) {
        const customFieldsValues = getCustomFieldValues(record);
        Object.entries(customFieldsValues || {}).forEach((field) => {
          if (`%{${field[0]}}` === ruleThree?.field && field[1] === ruleThree?.value) {
            send(
              record,
              onFieldMessageDisabled,
              onFieldNotificationDisabled,
              OnFieldApiDisabled,
              rawDate,
              timeStamp,
              html,
              module,
              selectedCatalogue,
              onFieldMessageFrom,
              onFieldMessageSubject,
              onFieldMessageTo,
              onFieldNotificationFrom,
              icon,
              onFieldMessageNotification,
              onFieldNotificationSubject,
              onFieldNotificationTo,
              onFieldUrlAPI,
              onFieldBodyAPI,
              onFieldToken,
              onFieldTokenEnabled
            );
          }
        });
      }
    }
  });
};

const send = async (
  record,
  messageDisabled,
  notificationDisabled,
  apiDisabled,
  rawDate,
  timeStamp,
  html,
  module,
  selectedCatalogue,
  messageFrom,
  subjectMessage,
  messageTo,
  notificationFrom,
  icon,
  messageNotification,
  subjectNotification,
  notificationTo,
  urlAPI,
  bodyAPI,
  token,
  tokenEnabled
) => {
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
  let customFields = [];
  const variables = getVariables(text);
  var regex = /^[0-9a-f]{12}/i;

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
      } else if (regex.test(varName)) {
        customFields.push(varName);
      } else {
        newChars.push('N/A');
      }
    });

    const customFieldsValues = getCustomFieldValues(record);
    console.log(customFieldsValues)

    Object.entries(customFieldsValues || {}).forEach((field) => {
      if (customFields.includes(field[0])) {
        const index = variables.findIndex(({ varName }) => varName === field[0]);
        newChars.splice(index, 0, field[1]);
      }
    });
    console.log(newChars);

    convertedMessage = replaceBulk(text, variables.map(({ varName }) => `%{${varName}}`), newChars);
  }

  return convertedMessage;
};

const getCustomFieldValues = (record) => {
  let filteredCustomFields = {};
  Object.values(record.customFieldsTab || {}).forEach(tab => {
    const allCustomFields = [...tab.left, ...tab.right];
    allCustomFields.map(field => {
      filteredCustomFields = { ...filteredCustomFields, ...extractCustomFieldValues(field) };
    });
  });

  return filteredCustomFields;
};
