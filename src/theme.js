import { createMuiTheme } from '@material-ui/core/styles';
import {
  red,
  blueGrey,
  lightGreen,
} from '@material-ui/core/colors';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      light: blueGrey[300],
      main: blueGrey[500],
      dark: blueGrey[700],
      // contrastText: '#000',
    },
    secondary: {
      light: lightGreen[300],
      main: lightGreen[500],
      dark: lightGreen[700],
      // light: '#ff844c',
      // main: '#f4511e',
      // dark: '#b91400',
      // contrastText: '#000',
    },
    error: {
      light: red[300],
      main: red[500],
      dark: red[700],
    },
  },
});

export default theme;
