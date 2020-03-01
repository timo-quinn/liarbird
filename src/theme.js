import { createMuiTheme } from '@material-ui/core/styles';
import {
  red,
  indigo,
  green,
} from '@material-ui/core/colors';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[900],
    },
    secondary: {
      main: indigo[600],
    },
    error: {
      main: red.A700,
    },
  },
});

export default theme;
