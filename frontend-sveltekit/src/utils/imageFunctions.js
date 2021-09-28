import { deleteImage } from "../actions/imagesActions";

export const recursiveDeleteAction = async (array) => {

    //console.log('recursive delete', array);

    // if no array passed (partner case)
    if (array.url && array.url.values.length) {
        recursiveDeleteAction(array.url.values);
    }
    if (array.values && array.values.length) {
        recursiveDeleteAction(array.values);
    }
    
    for (let ind = 0 ; ind < array.length ; ind++) {
        
        if (array[ind].url && array[ind].url.length) {
            await deleteImage(array[ind].url);
        }
          
        if (array[ind].component && array[ind].component.values && array[ind].component.values.length) {
            recursiveDeleteAction(array[ind].component.values);
        }
        if (array[ind].values && array[ind].values.length) {
            recursiveDeleteAction(array[ind].values);
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