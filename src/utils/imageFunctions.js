import { deleteFile } from "../actions/uploadActions";

export const recursiveDeleteAction = async (objectToDelete) => {

    // if no objectToDelete passed (partner case)
    if (objectToDelete.url && objectToDelete.url.values.length) {
        await recursiveDeleteAction(objectToDelete.url.values);
    }
    if (objectToDelete.values && objectToDelete.values.length) {
        await recursiveDeleteAction(objectToDelete.values);
    }
    
    for (let ind = 0 ; ind < objectToDelete.length ; ind++) {
        
        if (objectToDelete[ind].url && objectToDelete[ind].url.length) {
            await deleteFile(objectToDelete[ind].url);
        }
          
        if (objectToDelete[ind].component && objectToDelete[ind].component.values && objectToDelete[ind].component.values.length) {
            await recursiveDeleteAction(objectToDelete[ind].component.values);
        }
        if (objectToDelete[ind].values && objectToDelete[ind].values.length) {
            await recursiveDeleteAction(objectToDelete[ind].values);
        }
    }
    return;
}

export const recursiveBlankMedias = (array) => {

    for (let ind=0; ind<array.length; ind++) {
        if (array[ind].url) {
            if (typeof array[ind].url === "string") {
                array[ind].url = "";
            } else {
                if (array[ind].url.values && array[ind].url.values.length) {
                    recursiveBlankMedias(array[ind].url.values)
                }
            }
        }
        if (array[ind].component && array[ind].component.values && array[ind].component.values.length) {
            recursiveBlankMedias(array[ind].component.values);
        }
        if (array[ind].values && array[ind].values.length) {
            recursiveBlankMedias(array[ind].values);
        }
    }
};

export const recursiveDeleteStyle = async (styleToDelete) => {

    if (styleToDelete.values && styleToDelete.values.length) {
        for (let ind = 0 ; ind < styleToDelete.values.length ; ind++) {
            const childObject = styleToDelete.values[ind];
            await recursiveDeleteStyle(childObject);
        }
    }

    if (styleToDelete.styles && styleToDelete.styles.length > 0) {
        for (let ind = 0; ind < styleToDelete.styles.length; ind++) {
            if (['backgroundImage'].includes(styleToDelete.styles[ind].name && typeof styleToDelete.styles[ind].value === "string")) {
                await deleteFile(styleToDelete.styles[ind].value)
            }
        }
    }
    return;
};