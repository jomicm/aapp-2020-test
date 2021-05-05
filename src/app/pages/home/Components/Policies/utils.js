import axios from 'axios';
import { getCurrentDateTime, simplePost } from '../../utils';
import { collections } from '../../constants';

export const executePolicies = (actionName, module, selectedCatalogue, policies) => {
  const { dateFormatted, rawDate, timeFormatted } = getCurrentDateTime();
  const timeStamp = `${dateFormatted} ${timeFormatted}`;
  const filteredPolicies = policies.filter(
    (policy) => policy.selectedAction === actionName && policy.selectedCatalogue === selectedCatalogue && policy.module === module
  );

  debugger

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
    tokenDisabled
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
    if (!apiDisabled) {
      try {
        const validBody = JSON.parse(bodyAPI);
        
        if (!tokenDisabled) {
          await axios.post(urlAPI, validBody, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          await axios.post(urlAPI, validBody);
        }
      } catch (error) {
        console.log(error);
      }
    }
  })
};
