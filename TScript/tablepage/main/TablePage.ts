import {Table} from "./Table";
import {HttpClient} from "../../util/HttpClient";
import {TableInfoRequest} from "../../util/request/TableInfoRequest";
import {IsLoggedInRequest} from "../../util/request/IsLoggedInRequest";
import {TableMessagesRequest} from "../../util/request/TableMessagesRequest";

let table;
const link = "https://comgrid.ru:8443";
const cellsUnions = [
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
const decorations = [
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
]
export let store: any = {
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

const httpClient = new HttpClient(link);
$(window).on('load', () => {
    httpClient.proceedRequest(
        new IsLoggedInRequest(),
        () => {
            alert("You're not logged in, please log in")
        }
    ).then(loadTable)
    .then(loadTableMessages)
    .then(() => {
        console.log("Table messages")
        store.cellsUnions = cellsUnions;
        store.decorations = decorations;
        table = new Table(store);
    })
});

function loadTable(){
    let chatId = parseInt(getParam('id'));
    return httpClient.proceedRequest(
        new TableInfoRequest({
            chatId: chatId
        }),
        (code, errorText) => {
            if(code === 404) {
                console.log("Table not found")
            }else{
                console.log(`Error: '${code}, ${errorText}' while loading table info`)
            }
        }
    ).then((table) => {
        console.log(table)
        store = table
    });
}

function loadTableMessages(){
    let chatId = parseInt(getParam('id'));
    return httpClient.proceedRequest(
        new TableMessagesRequest({
            chatId: chatId,
            xcoordLeftTop: 0,
            ycoordLeftTop: 0,
            xcoordRightBottom: store.width - 1,
            ycoordRightBottom: store.height - 1,
        }),
        (code, errorText) => {
            if(code === 400){
                console.log(code + ", " + errorText)
            }
            if(code === 404){
                alert("code: " + code + ", error: " + errorText);
                console.log("code: " + code + ", error: " + errorText);
            } else if(code === 403 && errorText === "access.chat.read_messages"){
                alert("You don't have enough rights to access this chat")
            }else if(
                code === 422 && (errorText === "out_of_bounds" ||
                errorText === "time.negative-or-future"
            )){ // should not happen
                console.log(`height: ${store.height - 1}, width: ${store.width - 1}`)
                alert("Should not happen, see console")
            }
        }
    ).then((messages) => {
        store.messages = messages
    });
}
