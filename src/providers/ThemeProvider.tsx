import { FC, PropsWithChildren } from 'react'
import { deepmerge } from '@mui/utils'
import { Theme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider as MuiThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'
import { Settings } from 'src/@core/context/settingsContext'
import themeConfig from 'src/configs/themeConfig'
import overrides from '../@core/theme/overrides'
import typography from '../@core/theme/typography'
import themeOptions from '../@core/theme/ThemeOptions'
import UserThemeOptions from 'src/layouts/UserThemeOptions'
import GlobalStyling from '../@core/theme/globalStyles'
import { Direction } from 'src/layouts/components/Direction'

type Props = {
  settings: Settings
}

export const ThemeProvider: FC<PropsWithChildren<Props>> = ({ settings, children }) => {
  const coreThemeConfig = themeOptions(settings)

  let theme = createTheme(coreThemeConfig)

  const mergeComponentOverrides = (theme: Theme, settings: Settings) =>
    deepmerge({ ...overrides(theme, settings) }, UserThemeOptions()?.components)

  const mergeTypography = (theme: Theme) => deepmerge(typography(theme), UserThemeOptions()?.typography)

  theme = createTheme(theme, {
    components: { ...mergeComponentOverrides(theme, settings) },
    typography: { ...mergeTypography(theme) }
  })

  if (themeConfig.responsiveFontSizes) {
    theme = responsiveFontSizes(theme)
  }

  return (
    <MuiThemeProvider theme={theme}>
      <Direction direction={settings.direction}>
        <CssBaseline />

        <GlobalStyles styles={() => GlobalStyling(theme) as any} />

        {children}
      </Direction>
    </MuiThemeProvider>
  )
}

ThemeProvider.displayName = 'ThemeProvider'
