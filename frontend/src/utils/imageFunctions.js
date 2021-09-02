import { deleteImage } from "../actions/imagesActions";

export const recursiveDeleteAction = async (array) => {

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