import { getCurrentDateTime, simplePost } from '../../utils';
import { collections } from '../../constants';
import axios from 'axios';

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

export const executeOnLoadPolicy = (id, categoryId, module, selectedCatalogue, policies) => {
  const filteredPolicies = policies.filter(
    (policy) => policy.selectedAction === 'OnLoad' && policy.selectedOnLoadCategory?.id === categoryId && policy.selectedCatalogue === selectedCatalogue && policy.module === module
  );

  filteredPolicies.forEach(({
    onLoadDisabled,
    onLoadFields,
    tokenOnLoad,
    tokenOnLoadEnabled,
    urlOnLoad
  }) => {
    if (!onLoadDisabled) {
      if (tokenOnLoadEnabled) {
        try {

        } catch (error) {
          console.log(error);
        }
      }
    }
  });
};
