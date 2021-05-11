export const transformProcess = (processes, processId) => {
  const process = processes.find(process => process.id === processId);
  const { id, name, selectedProcessType, processStages } = process;

  const stages = processStages.reduce((acu, cur, ix) => {
    const { id: stageId, name: stageName, notifications: nots, approvals: apps, customFieldsTab } = cur;
    const notifications = nots.map((not) => ({ ...not, sent: false, sentDate: '' }));
    const approvals = apps.map((app) => ({ ...app, fulfilled: false, fulfillDate: '' }));
    const stage = { stageId, stageName, notifications, approvals, customFieldsTab,  stageFulfilled: false, stageInitialized: false };

    return { ...acu, [`stage_${ix + 1}`]: stage };
  }, {});

  return {
    currentStage: 0,
    id,
    name,
    selectedProcessType,
    stages,
    totalStages: processStages.length
  };
};
