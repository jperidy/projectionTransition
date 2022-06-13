export const watchStyle = (styles, watched, defaultValue) => {
    return styles.filter(x => x.name === watched)[0] && styles.filter(x => x.name === watched)[0].value || defaultValue;
};