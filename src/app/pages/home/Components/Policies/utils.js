import { getCurrentDateTime, simplePost } from '../../utils';
import { collections } from '../../constants';

export const executePolicies = (actionName, module, selectedCatalogue, policies) => {
  const { dateFormatted, rawDate, timeFormatted } = getCurrentDateTime();
  const timeStamp = `${dateFormatted} ${timeFormatted}`;
  debugger
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
