import {Table} from "./Table";
import {HttpClient} from "../../util/HttpClient";
import {TableInfoRequest} from "../../util/request/TableInfoRequest";
import {IsLoggedInRequest} from "../../util/request/IsLoggedInRequest";
import {TableMessagesRequest} from "../../util/request/TableMessagesRequest";
import { getParam } from "../../util/Util";

let table;
const link = "https://comgrid.ru:8443";
export let settings: any = {
    selectedClasses: ['bg-dark', 'text-light'],
    noSelectedClasses: ['text-dark'],
    colorMap: ['#F8D8D9', '#D8F8D9', '#D8D8F9', '#F8F8D9', '#F8D9F8', '#D8F8F9']
}
const cellsUnions = [
];
const decorations = [
]
export let store: any = {
    height: 50,
    width: 50,
    cellsUnions: [
    ],
    messages: [
        {
            x: 22,
            y: 17,
            text: "Ребята, привет, что задали по прекрасной жизни без забот?"
        }
    ]
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
            chatId: chatId,
            includeParticipants: true
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
