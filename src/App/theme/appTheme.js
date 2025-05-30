import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FF0083",
    },
    secondary: {
      main: "#FD2B88",
      blue: "#17174A",
      grey1: "#82889C",
      greyBlue: "#434966",
      yellowDark: "#8B7424",
      black: "#020826",
      green: "#00D498",
      red: "#FF0040",
      grey3: "#DDDFE6",
      whiteSmoke: "#F5F5F5",
      ltPurple: "#F1EEFF",
      languidLavender: "#CFD2DD",
      midnightBlush: "#9AA0BF",
      ghostWhite: "#F9F9FF",
      darkGrey: "#A8A8A8",
      fiord: "#434966",
      skyBlue: "#6945FC",
      orange: "#DC6803",
      darkGreen: "#039855",
      darkBlue: "#007AFF",
      lightGray: "#EAECF0",
      gray300: "#D0D5DD",
      DkBlue: "#1F1F30",
      darkGray: "#565674",
      extradarkBlue: "#08083D",
      gray4: "#667085",
    },
    error: {
      main: "rgba(255,0,64,0.6)",
    },
    background: {
      default: "#09092D",
      white: "#FFFFFF",
      ltYellow: "#FCEFC1",
      lightBlue: "#F3F4F7",
      lightPink: "#FFE3F2",
      ltGreen: "#E3F8FA",
      ltRed: "#FFDBDB",
      grey4: "#EDECF5",
      grey2: "#929AB3",
      extraLtPink: "#FFF1F8",
      green: "#1BA781",
      ltOrange: "#FFFCF5",
      ltgreen: "#F6FEF9",
      skyBlue: "#F5FAFF",
    },
  },
  typography: {
    fontFamily: "Manrope",
    h1: {
      fontSize: 34,
      lineHeight: 50 / 34,
      fontWeight: 600,
    },
    h2: {
      fontSize: 30,
      lineHeight: 41 / 30,
      fontWeight: 600,
    },
    h3: {
      fontSize: 26,
      lineHeight: 34 / 26,
      fontWeight: 400,
    },
    h4: {
      fontSize: 24,
      lineHeight: 33 / 24,
      fontWeight: 700,
    },
    h5: {
      fontSize: 18,
      lineHeight: 24 / 18,
      fontWeight: 600,
    },
    h6: {
      fontSize: 20,
      lineHeight: 27 / 20,
      fontWeight: 400,
    },
    p1: {
      fontSize: 15,
      lineHeight: 26 / 15,
      fontWeight: 400,
    },
    p2: {
      fontSize: 14,
      lineHeight: 22 / 14,
      fontWeight: 400,
    },
    button: {
      fontSize: 13,
      lineHeight: 18 / 13,
      letterSpacing: 0.2,
      fontWeight: 700,
      textTransform: "unset",
    },
    c1: {
      fontSize: 13,
      lineHeight: 20 / 13,
      fontWeight: 500,
    },
    c2: {
      fontSize: 12,
      lineHeight: 17 / 12,
      fontWeight: 600,
    },
    label: {
      fontSize: 11,
      lineHeight: 15 / 11,
      fontWeight: 600,
    },
  },
  shadows: ["none", "none"],
  overrides: {},
});

export default theme;
