import React from "react";
import { connect } from "react-redux";
import objectPath from "object-path";
import { Link, withRouter } from "react-router-dom";
import clsx from "clsx";
import * as builder from "../../ducks/builder";
import MenuList from "./MenuList";
import KTMenu from "../../_assets/js/menu";

class AsideLeft extends React.Component {
  asideMenuRef = React.createRef();

  insideTm;
  outsideTm;

  componentDidMount() {
    this.initMenu(); // By ID

    const options = this.setupMenuOptions();
    const ktMenu = new KTMenu(this.asideMenuRef.current, options); // eslint-disable-line
  }

  initMenu() {
    const { config } = this.props;
    if (
      objectPath.get(config, "aside.menu.dropdown") !== "true" &&
      objectPath.get(config, "aside.self.fixed")
    ) {
      this.asideMenuRef.current.setAttribute("data-ktmenu-scroll", "1");
    }

    if (objectPath.get(config, "aside.menu.dropdown") === "true") {
      this.asideMenuRef.current.setAttribute("data-ktmenu-dropdown", "1");
      this.asideMenuRef.current.setAttribute(
        "data-ktmenu-dropdown-timeout",
        objectPath.get(config, "aside.menu.submenu.dropdown.hover-timeout")
      );
    }
  }

  setupMenuOptions() {
    let menuOptions = {
      // vertical scroll
      scroll: null,
      // submenu setup
      submenu: {
        desktop: {
          // by default the menu mode set to accordion in desktop mode
          default: "dropdown"
        },
        tablet: "accordion", // menu set to accordion in tablet mode
        mobile: "accordion" // menu set to accordion in mobile mode
      },
      // accordion setup
      accordion: {
        expandAll: false // allow having multiple expanded accordions in the menu
      }
    };

    // init aside menu
    let menuDesktopMode = "accordion";
    const dataKtmenuDropdown = this.asideMenuRef.current.getAttribute(
      "data-ktmenu-dropdown"
    );
    if (dataKtmenuDropdown === "1") {
      menuDesktopMode = "dropdown";
    }

    if (typeof objectPath.get(menuOptions, "submenu.desktop") === "object") {
      menuOptions.submenu.desktop.default = menuDesktopMode;
    }

    return menuOptions;
  }

  get currentUrl() {
    return this.props.location.pathname.split(/[?#]/)[0];
  }

  render() {
    const {
      ulClasses,
      menuConfig,
      layoutConfig,
      asideMenuAttr,
      asideClassesFromConfig,
      location: { pathname }
    } = this.props;

    return (
      <>
        <div
          id="kt_aside_menu"
          ref={this.asideMenuRef}
          style={{ maxHeight: "90vh", position: "relative" }}
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
          data-ktmenu-vertical="1"
          className={clsx("kt-aside-menu", asideClassesFromConfig)}
          {...asideMenuAttr}
        >
          {this.props.disableAsideSelfDisplay && (
            <div className="kt-header-logo">
              <Link to="">
                <img alt="logo" src={this.props.headerLogo} />
              </Link>
            </div>
          )}
          <ul className={clsx("kt-menu__nav", ulClasses)}>
            <MenuList
              currentUrl={pathname}
              menuConfig={menuConfig}
              layoutConfig={layoutConfig}
            />
          </ul>
        </div>
      </>
    );
  }
}

const mapStateToProps = store => ({
  menuConfig: store.builder.menuConfig,
  layoutConfig: store.builder.layoutConfig,
  headerLogo: builder.selectors.getLogo(store),
  asideMenuAttr: builder.selectors.getAttributes(store, { path: "aside_menu" }),
  disableAsideSelfDisplay:
    builder.selectors.getConfig(store, "aside.self.display") === false,

  ulClasses: builder.selectors.getClasses(store, {
    path: "aside_menu_nav",
    toString: true
  }),

  asideClassesFromConfig: builder.selectors.getClasses(store, {
    path: "aside_menu",
    toString: true
  })
});

export default withRouter(connect(mapStateToProps)(AsideLeft));
