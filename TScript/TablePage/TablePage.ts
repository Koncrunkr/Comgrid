import {Table} from "./Table";

let table;
export let store = {
    height: 50,
    width: 50,
    selectedClasses: ['bg-dark', 'text-light'],
    noSelectedClasses: ['text-dark']
}

$(window).on('load', () => {
    table = new Table(store.height, store.width);
});