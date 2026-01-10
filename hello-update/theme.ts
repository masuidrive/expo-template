export type Theme = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
};

export const lightTheme: Theme = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#007AFF',
  secondary: '#5856D6',
};

export const darkTheme: Theme = {
  background: '#000000',
  text: '#FFFFFF',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
};
