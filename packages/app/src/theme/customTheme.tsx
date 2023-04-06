import { BackstageOverrides } from '@backstage/core-components';
import {
  BackstagePalette,
  BackstageTheme,
  createTheme,
  genPageTheme,
  darkTheme,
  lightTheme,
  shapes,
} from '@backstage/theme';

const sweetOrange = '#FBB040';
const vividOrange = '#F15A29';
const blue = '#253F66';
const gradient = [sweetOrange, vividOrange];

const simpleThemeOptions = (palette: BackstagePalette) => ({
  palette: {
    ...palette,
    navigation: {
      background: blue,
      indicator: vividOrange,
      color: 'white',
      selectedColor: vividOrange,
      navItem: {
        hoverBackground: 'rgba(0, 0, 0, 0.2);',
      },
    },
  },
  defaultPageTheme: 'home',
  fontFamily: 'Poppins, sans-serif;',
  /* below drives the header colors */
  pageTheme: {
    home: genPageTheme({ colors: gradient, shape: shapes.wave }),
    documentation: genPageTheme({ colors: gradient, shape: shapes.wave2 }),
    tool: genPageTheme({ colors: gradient, shape: shapes.round }),
    service: genPageTheme({ colors: gradient, shape: shapes.wave }),
    website: genPageTheme({ colors: gradient, shape: shapes.wave }),
    library: genPageTheme({ colors: gradient, shape: shapes.wave }),
    other: genPageTheme({ colors: gradient, shape: shapes.wave }),
    app: genPageTheme({ colors: gradient, shape: shapes.wave }),
    apis: genPageTheme({ colors: gradient, shape: shapes.wave }),
  },
});

const createCustomThemeOverrides = (): BackstageOverrides => {
  const fontFamily = 'Montserrat, sans-serif;';
  return {
    BackstageHeader: {
      title: { fontFamily },
      subtitle: { fontFamily },
    },
  };
};

const baseLightTheme = createTheme(simpleThemeOptions(lightTheme.palette));
export const customLightTheme: BackstageTheme = {
  ...baseLightTheme,
  overrides: {
    // These are the overrides that Backstage applies to `material-ui` components
    ...baseLightTheme.overrides,
    // These are your custom overrides, either to `material-ui` or Backstage components.
    ...createCustomThemeOverrides(),
  },
};

const baseDarkTheme = createTheme(simpleThemeOptions(darkTheme.palette));
export const customDarkTheme: BackstageTheme = {
  ...baseDarkTheme,
  overrides: {
    // These are the overrides that Backstage applies to `material-ui` components
    ...baseDarkTheme.overrides,
    // These are your custom overrides, either to `material-ui` or Backstage components.
    ...createCustomThemeOverrides(),
  },
};
