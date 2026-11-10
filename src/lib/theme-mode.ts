export const themeStorageKey = "lp-theme";

/** Runs before paint so a saved light/dark choice never flashes the wrong theme. */
export const themeInitScript = `try{var t=localStorage.getItem("${themeStorageKey}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
