import { deleteImage } from "../actions/imagesActions";

export const recursiveDeleteAction = async (objectToDelete) => {

    //console.log('recursive delete', objectToDelete);

    // if no objectToDelete passed (partner case)
    if (objectToDelete.url && objectToDelete.url.values.length) {
        recursiveDeleteAction(objectToDelete.url.values);
    }
    if (objectToDelete.values && objectToDelete.values.length) {
        recursiveDeleteAction(objectToDelete.values);
    }
    
    for (let ind = 0 ; ind < objectToDelete.length ; ind++) {
        
        if (objectToDelete[ind].url && objectToDelete[ind].url.length) {
            await deleteImage(objectToDelete[ind].url);
        }
          
        if (objectToDelete[ind].component && objectToDelete[ind].component.values && objectToDelete[ind].component.values.length) {
            recursiveDeleteAction(objectToDelete[ind].component.values);
        }
        if (objectToDelete[ind].values && objectToDelete[ind].values.length) {
            recursiveDeleteAction(objectToDelete[ind].values);
        }
    }
    return;
}

export const recursiveBlankMedias = (array) => {

    // const arrayOut = [...arrayIn];
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
    //return array;
};