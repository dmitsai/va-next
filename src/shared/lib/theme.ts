import { useTheme as useNextTheme } from "next-themes";

export const Theme = {
    dark: 'dark',
    light: 'light',
    system: 'system',
} as const;

export type ThemeType = (typeof Theme)[keyof typeof Theme];

export const useTheme = () => {
    const { theme: nextTheme, setTheme: setNextTheme , systemTheme, ...other } = useNextTheme();

    const setTheme = (value:ThemeType) => {
       const selectedTheme = value === Theme.system ?  systemTheme as ThemeType ?? Theme.dark : value;
        localStorage.setItem('theme',selectedTheme);
        setNextTheme(selectedTheme);
    };

    const theme =  !nextTheme ? Theme.system : Theme[nextTheme as ThemeType] ;

    return {theme, setTheme, ...other};
    
}
