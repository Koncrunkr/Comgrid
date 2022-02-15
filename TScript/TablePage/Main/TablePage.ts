import {Table} from "./Table";

let table;
export let store = {
    height: 50,
    width: 50,
    cellsUnions: [
        {
            leftUpX: 11,
            leftUpY: 14,
            rightDownX: 17,
            rightDownY: 17
        },
        {
            leftUpX: 22,
            leftUpY: 17,
            rightDownX: 24,
            rightDownY: 30
        }
    ],
    decorations: [
        {
            leftUpX: 11,
            leftUpY: 14,
            rightDownX: 17,
            rightDownY: 17,
            cssText: "background-color: blue; color: yellow !important; border-color: red !important;"
        },
        {
            leftUpX: 31,
            leftUpY: 41,
            rightDownX: 31,
            rightDownY: 41,
            cssText: "background-color: rgb(204,11,11); color: green !important; border-color: blue !important;"
        }
    ],
    messages: [
        {
            x: 22,
            y: 17,
            text: "Ребята, привет, что задали по прекрасной жизни без забот?"
        }
    ],
    selectedClasses: ['bg-dark', 'text-light'],
    noSelectedClasses: ['text-dark']
}

$(window).on('load', () => {
    table = new Table(store);
});