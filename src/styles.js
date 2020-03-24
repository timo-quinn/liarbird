import { makeStyles } from '@material-ui/core/styles';
import {
  red,
  blue,
  lightGreen,
} from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    // minWidth: 275,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  cardLeft: {
    textAlign: 'left',
    minWidth: 275,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  menuItemGreen: {
    color: lightGreen[700],
  },
  menuItemRed: {
    color: red[500],
  },
  menuItemBlue: {
    color: blue[500],
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  formFields: {
    margin: theme.spacing(1),
  },
  centered: {
    justifyContent: 'center',
  },
  logo: {
    maxWidth: 160,
    paddingLeft: theme.spacing(2),
    justifyContent: 'center',
  },
  title: {
    flexGrow: 1,
  },
  sectionTop: {
    marginBottom: theme.spacing(2),
  },
  sectionBottom: {
    marginTop: theme.spacing(2),
  },
  sectionMiddle: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  paperEditAccount: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  loginDialog: {
    minWidth: theme.breakpoints.width('sm'),
  },
  loginPaper: {
    padding: theme.spacing(2),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default useStyles;
