export const colors = {
  theme: 'dark',
  bg: {
    200: '#0f1014',
    300: '#13151a',
    400: '#17191f',
    500: '#1b1d24',
    600: '1d1e24',
    700: '#23252C',
    800: '#2A2C33',
    900: '#2E3038',
    primary: '#3498DB',
    contrast: '#fff',
    separator: '#ffffff26', // 15% opacity
  },
  text: {
    primary: '#fff',
    secondary: '#aaa',
    tertiary: '#515151',
    quaternary: '#313131',
    accent: '#67cbff',
    onBg: {
      primary: '#fff',
      contrast: '#2d2d2d',
    },
  },
  red: '#E06C75',
  green: '#98C379',
  yellow: '#E5C07B',
  blue: '#61AFEF',
  purple: '#C678DD',
  cyan: '#56B6C2',
}

export const config = {
  thumbnailUrl: 'https://i.ytimg.com/vi/',
  APIKey: process.env.API_KEY,
}
