import React, { useState, useEffect } from 'react';
import { getDB } from '../../../../../crud/api';

const useSettingsList = () => {
	const [settingsList, setSettingsList] = useState([]);

	useEffect(() => {
		getDB('settingsLists')
			.then((response) => response.json())
			.then((data) => setSettingsList(data.response))
			.catch((error) => console.log(error));
	}, []);

	return settingsList;
};

const useSettingsConstants = () => {
	const [settingsConstants, setSettingsConstants] = useState([]);

	useEffect(() => {
		getDB('settingsConstants')
			.then((response) => response.json())
			.then((data) => setSettingsConstants(data.response))
			.catch((error) => console.log(error));
	}, []);

	return settingsConstants;
};

export {
	useSettingsConstants,
	useSettingsList
};
