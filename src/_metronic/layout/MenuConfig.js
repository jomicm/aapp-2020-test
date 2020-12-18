export default {
  header: {
    self: {},
    items: [
      {
        title: "Dashboards",
        root: true,
        alignment: "left",
        page: "dashboard",
        translate: "MENU.DASHBOARD",
      },
      {
        title: "Material UI",
        root: true,
        alignment: "left",
        toggle: "click",
        submenu: [
          {
            title: "Layout",
            bullet: "dot",
            submenu: [
              {
                title: "Box",
                bullet: "line",
                page: "google-material/layout/box",
              },
              {
                title: "Container",
                bullet: "line",
                page: "google-material/layout/container",
              },
              {
                title: "Grid",
                bullet: "line",
                page: "google-material/layout/grid",
              },
              {
                title: "Grid list",
                bullet: "line",
                page: "google-material/layout/grid-list",
              },
              {
                title: "Hidden",
                bullet: "line",
                page: "google-material/layout/hidden",
              },
            ],
          },
          {
            title: "Inputs",
            bullet: "dot",
            submenu: [
              {
                title: "Autocomplete",
                page: "google-material/inputs/autocomplete",
                bullet: "line",
                permission: "accessToECommerceModule",
              },
              {
                title: "Buttons",
                page: "google-material/inputs/buttons",
                bullet: "line",
              },
              {
                title: "Checkboxes",
                page: "google-material/inputs/checkboxes",
                bullet: "line",
              },
              {
                title: "Pickers",
                page: "google-material/inputs/pickers",
                bullet: "line",
              },
              {
                title: "Radio Buttons",
                page: "google-material/inputs/radio-buttons",
                bullet: "line",
              },
              {
                title: "Selects",
                page: "google-material/inputs/selects",
                bullet: "line",
              },
              {
                title: "Switches",
                page: "google-material/inputs/switches",
                bullet: "line",
              },
              {
                title: "Text Fields",
                page: "google-material/inputs/text-fields",
                bullet: "line",
              },
              {
                title: "Transfer List",
                page: "google-material/inputs/transfer-list",
                bullet: "line",
              },
            ],
          },
          {
            title: "Navigation",
            bullet: "dot",
            submenu: [
              {
                title: "Bottom Navigation",
                bullet: "line",
                page: "google-material/navigation/bottom-navigation",
              },
              {
                title: "Breadcrumbs",
                bullet: "line",
                page: "google-material/navigation/breadcrumbs",
              },
              {
                title: "Drawers",
                bullet: "line",
                page: "google-material/navigation/drawer",
              },
              {
                title: "Links",
                bullet: "line",
                page: "google-material/navigation/links",
              },
              {
                title: "Menus",
                bullet: "line",
                page: "google-material/navigation/menus",
              },
              {
                title: "Steppers",
                bullet: "line",
                page: "google-material/navigation/steppers",
              },
              {
                title: "Tabs",
                bullet: "line",
                page: "google-material/navigation/tabs",
              },
            ],
          },
          {
            title: "Surfaces",
            bullet: "dot",
            submenu: [
              {
                title: "App Bar",
                bullet: "line",
                page: "google-material/surfaces/app-bar",
              },
              {
                title: "Paper",
                bullet: "line",
                page: "google-material/surfaces/paper",
              },
              {
                title: "Cards",
                bullet: "line",
                page: "google-material/surfaces/cards",
              },
              {
                title: "Expansion Panels",
                bullet: "line",
                page: "google-material/surfaces/expansion-panels",
              },
            ],
          },
          {
            title: "Feedback",
            bullet: "dot",
            submenu: [
              {
                title: "Progress",
                bullet: "line",
                page: "google-material/feedback/progress",
              },
              {
                title: "Dialogs",
                bullet: "line",
                page: "google-material/feedback/dialogs",
              },
              {
                title: "Snackbars",
                bullet: "line",
                page: "google-material/feedback/snackbars",
              },
            ],
          },
          {
            title: "Data Display",
            bullet: "dot",
            submenu: [
              {
                title: "Avatars",
                bullet: "line",
                page: "google-material/data-displays/avatars",
              },
              {
                title: "Badges",
                bullet: "line",
                page: "google-material/data-displays/badges",
              },
              {
                title: "Chips",
                bullet: "line",
                page: "google-material/data-displays/chips",
              },
              {
                title: "Dividers",
                bullet: "line",
                page: "google-material/data-displays/dividers",
              },
              {
                title: "Icons",
                bullet: "line",
                page: "google-material/data-displays/icons",
              },
              {
                title: "Lists",
                bullet: "line",
                page: "google-material/data-displays/lists",
              },
              {
                title: "Tables",
                bullet: "line",
                page: "google-material/data-displays/tables",
              },
              {
                title: "Tooltips",
                bullet: "line",
                page: "google-material/data-displays/tooltips",
              },
              {
                title: "Typography",
                bullet: "line",
                page: "google-material/data-displays/typography",
              },
            ],
          },
          {
            title: "Utils",
            bullet: "dot",
            submenu: [
              {
                title: "Click Away Listener",
                bullet: "line",
                page: "google-material/utils/click-away-listener",
              },
              {
                title: "Modal",
                bullet: "line",
                page: "google-material/utils/modal",
              },
              {
                title: "No SSR",
                bullet: "line",
                page: "google-material/utils/no-ssr",
              },
              {
                title: "Popover",
                bullet: "line",
                page: "google-material/utils/popover",
              },
              {
                title: "Popper",
                bullet: "line",
                page: "google-material/utils/popper",
              },
              {
                title: "Portal",
                bullet: "line",
                page: "google-material/utils/portal",
              },
              {
                title: "Transitions",
                bullet: "line",
                page: "google-material/utils/transitions",
              },
              {
                title: "useMediaQuery",
                bullet: "line",
                page: "google-material/utils/use-media-query",
              },
            ],
          },
        ],
      },
      {
        title: "Bootstrap",
        root: true,
        alignment: "left",
        toggle: "click",
        submenu: {
          type: "mega",
          width: "800px",
          alignment: "left",
          columns: [
            {
              items: [
                {
                  title: "Alerts",
                  page: "react-bootstrap/alert",
                },
                {
                  title: "Accordion",
                  page: "react-bootstrap/accordion",
                },
                {
                  title: "Badge",
                  page: "react-bootstrap/badge",
                },
                {
                  title: "Breadcrumb",
                  page: "react-bootstrap/breadcrumb",
                },
                {
                  title: "Buttons",
                  page: "react-bootstrap/buttons",
                },
                {
                  title: "Button Group",
                  page: "react-bootstrap/button-group",
                },
                {
                  title: "Cards",
                  page: "react-bootstrap/cards",
                },
              ],
            },
            {
              items: [
                {
                  title: "Carousel",
                  page: "react-bootstrap/carousel",
                  bullet: "line",
                },
                {
                  title: "Dropdowns",
                  page: "react-bootstrap/dropdowns",
                  bullet: "line",
                },
                {
                  title: "Forms",
                  page: "react-bootstrap/forms",
                  bullet: "line",
                },
                {
                  title: "Input Group",
                  page: "react-bootstrap/input-group",
                  bullet: "line",
                },
                {
                  title: "Images",
                  page: "react-bootstrap/images",
                  bullet: "line",
                },
                {
                  title: "Figures",
                  page: "react-bootstrap/figures",
                  bullet: "line",
                },
                {
                  title: "Jumbotron",
                  page: "react-bootstrap/jumbotron",
                  bullet: "line",
                },
              ],
            },
            {
              items: [
                {
                  title: "List group",
                  page: "react-bootstrap/list-group",
                  bullet: "dot",
                },
                {
                  title: "Modal",
                  page: "react-bootstrap/modal",
                  bullet: "dot",
                },
                {
                  title: "Navs",
                  page: "react-bootstrap/navs",
                  bullet: "dot",
                },
                {
                  title: "Navbar",
                  page: "react-bootstrap/navbar",
                  bullet: "dot",
                },
                {
                  title: "Overlays",
                  page: "react-bootstrap/overlays",
                  bullet: "dot",
                },
                {
                  title: "Pagination",
                  page: "react-bootstrap/pagination",
                  bullet: "dot",
                },
                {
                  title: "Popovers",
                  page: "react-bootstrap/popovers",
                  bullet: "dot",
                },
              ],
            },
            {
              items: [
                {
                  title: "Progress",
                  page: "react-bootstrap/progress",
                },
                {
                  title: "Spinners",
                  page: "react-bootstrap/spinners",
                },
                {
                  title: "Table",
                  page: "react-bootstrap/table",
                },
                {
                  title: "Tabs",
                  page: "react-bootstrap/tabs",
                },
                {
                  title: "Tooltips",
                  page: "react-bootstrap/tooltips",
                },
                {
                  title: "Toasts",
                  page: "react-bootstrap/toasts",
                },
              ],
            },
          ],
        },
      },
      {
        title: "Custom",
        root: true,
        alignment: "left",
        toggle: "click",
        submenu: [
          {
            title: "Layout Builder",
            icon: "flaticon2-expand",
            page: "builder",
          },
          {
            title: "Error Pages",
            bullet: "dot",
            icon: "flaticon2-warning",
            submenu: [
              {
                title: "Error 1",
                page: "error/error-v1",
              },
              {
                title: "Error 2",
                page: "error/error-v2",
              },
              {
                title: "Error 3",
                page: "error/error-v3",
              },
              {
                title: "Error 4",
                page: "error/error-v4",
              },
              {
                title: "Error 5",
                page: "error/error-v5",
              },
              {
                title: "Error 6",
                page: "error/error-v6",
              },
            ],
          },
        ],
      },
    ],
  },
  aside: {
    self: {},
    items: [
      {
        title: "Dashboard",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "dashboard",
        translate: "MENU.DASHBOARD",
        bullet: "dot",
      },
      {
        title: "Assets",
        root: true,
        icon: "flaticon2-start-up",
        page: "assets",
        translate: "MENU.ASSETS",
        bullet: "dot",
      },
      {
        title: "Processes",
        root: true,
        icon: "flaticon-share",
        page: "processes",
        translate: "MENU.PROCESSES",
        bullet: "dot",
      },
      {
        title: "Users",
        root: true,
        icon: "flaticon-user",
        page: "users",
        translate: "MENU.USERS",
        bullet: "dot",
      },
      {
        title: "Employees",
        root: true,
        icon: "flaticon-map",
        page: "employees",
        translate: "MENU.EMPLOYEES",
        bullet: "dot",
      },
      {
        title: "Locations",
        root: true,
        icon: "flaticon-map-location",
        page: "locations",
        translate: "MENU.LOCATIONS",
        bullet: "dot",
      },
      {
        title: "Reports",
        root: true,
        icon: "flaticon-folder-1",
        page: "reports",
        translate: "MENU.REPORTS",
        bullet: "dot",
      },
      {
        title: "Settings",
        root: true,
        icon: "flaticon-settings",
        page: "settings",
        translate: "MENU.SETTINGS",
        bullet: "dot",
      },
      {
        title: "Messages",
        root: true,
        icon: "flaticon-email",
        page: "messages",
        translate: "MENU.MESSAGES",
        bullet: "dot",
      },
      {
        title: "Help",
        root: true,
        icon: "flaticon2-help",
        page: "help",
        translate: "MENU.HELP",
        bullet: "dot",
      },
    ],
  },
};
