import { getCurrentDateTime, simplePost } from '../../utils';
import { collections } from '../../constants';
import axios from 'axios';
import objectPath from 'object-path';

export const executePolicies = (actionName, module, selectedCatalogue, policies) => {
  const { dateFormatted, rawDate, timeFormatted } = getCurrentDateTime();
  const timeStamp = `${dateFormatted} ${timeFormatted}`;
  const filteredPolicies = policies.filter(
    (policy) => policy.selectedAction === actionName && policy.selectedCatalogue === selectedCatalogue && policy.module === module
  );

  filteredPolicies.forEach(({
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
    subjectNotification
  }) => {
    if (!messageDisabled) {
      const messageObj = {
        from: messageFrom,
        html,
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
  })
};

export const executeOnLoadPolicy = async (itemID, module, selectedCatalogue, policies) => {
  const filteredPolicies = policies.find(
    (policy) => policy.selectedAction === 'OnLoad' && policy.selectedOnLoadCategory?.id === itemID && policy.selectedCatalogue === selectedCatalogue && policy.module === module
  );

  debugger

  if (!filteredPolicies) return;

  const { onLoadDisabled, onLoadFields, tokenOnLoad, tokenOnLoadEnabled, urlOnLoad } = filteredPolicies;

  let res;

  if (!onLoadDisabled) {
    if (tokenOnLoadEnabled) {
      try {
        const { data: { response } } = await axios.get(urlOnLoad, {
          headers: {
            Authorization: `Bearer ${tokenOnLoad}`,
          }
        });
        res = handlePathResponse(response, onLoadFields);
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const { data: { response } } = await axios.get(urlOnLoad);
        res = handlePathResponse(response, onLoadFields);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return res;
};

const handlePathResponse = (response, onLoadFields, res = {}) => {
  Object.entries(onLoadFields).forEach((customField) => {
    const pathResponse = objectPath.get(response, customField[1]);
    res = { ...res, [customField[0]]: pathResponse };
  });

  return res;
};
