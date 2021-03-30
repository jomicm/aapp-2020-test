/* eslint-disable no-restricted-imports */
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  alert: {
    "& .MuiAlert-icon": {
      fontSize: 30
    }
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
}));
