import React from "react";
import SearchDropdown from "../../../app/partials/layout/SearchDropdown";
import UserNotifications from "../../../app/partials/layout/functional/UserNotifications";
import MyCart from "../../../app/partials/layout/MyCart";
import QuickActionsPanel from "../../../app/partials/layout/QuickActionsPanel";
import QuickPanelToggler from "./QuickPanelToggle";
import LanguageSelector from "../../../app/partials/layout/LanguageSelector";
import UserProfile from "../../../app/partials/layout/UserProfile";
import Help from '../../../app/partials/layout/HelpTopBar'
import Messages from '../../../app/partials/layout/MessagesTopBar'
import MessagesTopBar from '../../../app/partials/layout/MessagesTopBar'
import { toAbsoluteUrl } from "../../utils/utils";

export default class Topbar extends React.Component {
  render() {
    return (
      <div className="kt-header__topbar">
        <SearchDropdown useSVG="true" />

        <UserNotifications
          bgImage={toAbsoluteUrl("/media/misc/bg-1.jpg")}
          pulse="true"
          pulseLight="false"
          skin="dark"
          iconType=""
          type="success"
          useSVG="true"
          dot="false"
        />
         
          <MessagesTopBar
            bgImage={toAbsoluteUrl("/media/misc/bg-1.jpg")}
            skin="dark"
            iconType=''
            useSVG='true'
            type="success"
          />

          <Help
            iconType=''
            useSVG='true'
          />
          
          <LanguageSelector iconType="" />
          
        <UserProfile showAvatar={true} showHi={true} showBadge={false} />
      </div>
    );
  }
}
