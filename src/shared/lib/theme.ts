import { useTheme as useNextTheme } from "next-themes";

export const Theme = {
    DARK: 'dark',
    LIGHT: 'light',
} as const;

export type ThemeType = (typeof Theme)[keyof typeof Theme];

const getTheme =  (theme: string | undefined) => {
    if(!theme) {
        return undefined;
    }
    return theme === 'light' ?  Theme.LIGHT : Theme.DARK as ThemeType

}

export const useTheme = () => {
    const {theme: nextTheme,setTheme: setNextTheme} = useNextTheme();

    const setTheme = (value:ThemeType) => {
        setNextTheme(value)
    };

    const theme = getTheme(nextTheme);

    const switchTheme = () => {
        theme === Theme.LIGHT ? setTheme(Theme.DARK) :  setTheme(Theme.LIGHT);
    }
    return {theme, setTheme, switchTheme};
    
}
