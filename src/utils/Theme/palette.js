import Theme from './theme.json';

const palette = {
    common: {
        black: '#000',
        white: '#fff',
        fontColor: Theme.fontColor,
        disableColor: Theme.disableColor,
    },
    text: {
      // primary: '#fff',
      // secondary: '#fff',
        success: Theme.successColor,
        disabled: 'rgba(0, 0, 0, 0.38)',
    },
    primary: {
        main: Theme.primaryColor,
        light: Theme.primaryColorLight,
        dark: Theme.primaryColorDark,
        contrastText: Theme.primaryContrastTextColor,
    },
    secondary: {
        main: Theme.secondaryColor,
        light: Theme.secondaryColorLight,
        dark: Theme.secondaryColorDark,
        contrastText: Theme.secondaryContrastTextColor,
    },
    success: {
        main: Theme.successColor,
        light: Theme.successColorLight,
        dark: Theme.successColorDark,
        contrastText: Theme.successContrastTextColor,
    },
    warning: {
        main: Theme.warningColor,
        light: Theme.warningColorLight,
        dark: Theme.warningColorDark,
        contrastText: Theme.warningContrastTextColor,
    },
    error: {
        main: Theme.errorColor,
        light: Theme.errorColorLight,
        dark: Theme.errorColorDark,
        contrastText: Theme.errorContrastTextColor,
    },
    background: {
        default: '#fff',
        paper: "#fff",
    },
    action: {
        disabled: Theme.disableColor,
        active: Theme.linkColor,
    },
    divider: Theme.divider
};

export default palette;