export const updateStyle = (styles, {name, value}) => {
    const curentStyleItem = styles.filter(x => x.name === name);
    if (curentStyleItem.length) {
        for (let index = 0; index < styles.length; index++) {
            if (styles[index].name === name) {
                styles[index].value = value;
            }
        }
    } else {
        styles = [...styles, {name, value}];
    }
    return styles;
};

export const watchStyle = (styles, watched, defaultValue) => {
    return styles.filter(x => x.name === watched)[0] && styles.filter(x => x.name === watched)[0].value || defaultValue;
};