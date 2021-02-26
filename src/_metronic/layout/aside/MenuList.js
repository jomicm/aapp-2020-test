import React from "react";
import { connect } from "react-redux";
import MenuSection from "./MenuSection";
import MenuItemSeparator from "./MenuItemSeparator";
import MenuItem from "./MenuItem";
import { filterObject } from '../../utils/utils';

class MenuList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Tabs: []
    };
  }

  componentDidMount() {
    if (this.props.user.profilePermissions) {
      const tabs = Object.keys(filterObject(this.props.user.profilePermissions, (element) => element.length > 1))
      this.setState({ Tabs: tabs })
    }
  }

  render() {
    const { currentUrl, menuConfig, layoutConfig } = this.props;

    return menuConfig.aside.items.map((child, index) => {
      return (
        <React.Fragment key={`menuList${index}`}>
          {child.section && <MenuSection item={child} />}
          {child.separator && <MenuItemSeparator item={child} />}
          {child.title && (
            this.state.Tabs.includes(child.page) && (
              <MenuItem
                item={child}
                currentUrl={currentUrl}
                layoutConfig={layoutConfig}
              />
            )
          )}
        </React.Fragment>
      );
    });
  }
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(MenuList);
