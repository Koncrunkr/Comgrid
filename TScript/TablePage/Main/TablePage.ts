import {Table} from "./Table";

let table;
const link = "https://comgrid.ru:8443";
let cellsUnions = [
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
];
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

$(window).on('load', async () => {
    await getTableInfo();
    await getTableMessages();
    store.cellsUnions = cellsUnions;
    table = new Table(store);
});

function getTableInfo() {
    let id = window.location.href.match(/id=.*/)[0].slice(3);
    return fetch(
        link + "/table/info?chatId=" + id,
        {
            credentials: "include",
            method: "GET",
            headers: {"Content-Type": "application/json"}
        }
    ).then((result) =>
        result.text()
    ).then((html) =>
        store = JSON.parse(html)
    );
}

function getTableMessages() {
    let id = window.location.href.match(/id=.*/)[0].slice(3);
    return fetch(
        link + "/table/messages",
        {
            credentials: "include",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                chatId: +id,
                xCoordLeftTop: 0,
                yCoordLeftTop: 0,
                xCoordRightBottom: store.height - 1,
                yCoordLeftBottom: store.width - 1
            })
        }
    ).then((result) =>
        result.text()
    ).then((html) =>
        store.messages = JSON.parse(html)
    );
}