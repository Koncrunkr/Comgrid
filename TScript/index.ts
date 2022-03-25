import {HttpClient} from "./util/HttpClient";
import {CreateTableRequest} from "./util/request/CreateTableRequest";

let store: any = {
    dialogs2: [
        {
            id: 0,
            name: 'Виталя и компания',
            lastSender: 'Виталя',
            lastMessage: 'Привет, приходи пить кровь',
            time: 'вчера',
            messagesCount: 51,
            avatar: './pictures/1.png',
            width: 100,
            height: 120
        },
        {
            id: 1,
            name: 'Беседа не для глупых',
            lastSender: 'КтоТо НеГлупый',
            lastMessage: 'Сколько будет 2+2?',
            time: 'вчера',
            messagesCount: 17,
            avatar: './pictures/2.png',
            width: 10,
            height: 112
        },
        {
            id: 2,
            name: 'Беседа только для глупых',
            lastSender: 'Самый Глупый',
            lastMessage: 'Ребята, я только что доказал гипотезу Римана! Короче, там всё просто!',
            time: '11:30',
            messagesCount: 0,
            avatar: './pictures/3.png',
            width: 20,
            height: 40
        },
        {
            id: 3,
            name: 'Беседа с очень длинным названием. Ребята, я не представляю кому в голову пришло давать такое длинное название. Ребята, предлагаю ограничить длину названий',
            lastSender: 'Виталя',
            lastMessage: 'Привет, глянь лс',
            time: '14:15',
            messagesCount: 0,
            avatar: './pictures/4.png',
            width: 1000,
            height: 1000
        },
        {
            id: 4,
            name: 'Виталя Трубоед',
            lastSender: '',
            lastMessage: 'Давно читал беседу?',
            time: '19:51',
            messagesCount: 4,
            avatar: './pictures/5.png',
            width: 1000,
            height: 500
        }
    ]
}
let link = "https://comgrid.ru:8443";
const httpClient = new HttpClient(link)

$(window).on('load', () => {
    checkAuthorization(() => {
        loadStore().then(() => {
            $('#create-table-form').on('submit', submit);
            drawDialogs()

            $('.clickable').on('click', () => {
                $('.clickable').toggleClass('d-none')
            });
        });
    });
})

function drawDialogs() {
    let $container = $('.chat-container');
    let $noDel = $container.find('.no-deletable');
    $container.html('');
    $container.append($noDel);
    store.dialogs.slice().reverse().forEach((dialog, index) => {
        let dialog2 = store.dialogs2[index];
        let $chat = $('.chat').clone();
        $chat.removeClass('chat d-none');
        $chat.find('a').attr('href', 'pages/table.html?id=' + dialog.id);
        $chat.find('.chat-name').text(dialog.name);
        $chat.find('.chat-sender').text(dialog2.lastSender + (dialog2.lastSender === '' ? '' : ':'));
        $chat.find('.chat-text').text(dialog2.lastMessage);
        $chat.find('.chat-time').text(dialog2.time);
        $chat.find('img').attr('src', dialog.avatar);
        $chat.find('.chat-size').text(dialog.width + '×' + dialog.height)
        dialog2.messagesCount === 0
            ? $chat.find('.chat-unread').remove()
            : $chat.find('.chat-unread').text(dialog2.messagesCount);
        $container.append($chat);
        $chat.on('mouseenter', () => {
            $chat.removeClass('bg-light')
        });
        $chat.on('mouseleave', () => {
            $chat.addClass('bg-light')
        });
        $chat.on('click', () => {
            dialog.messagesCount = 0;
            drawDialogs();
        });
    });
}

function submit() {
    const avatarFile: any = document.getElementById('table-image-file-input')
    let avatarLink = $('#table-image-link-input').val();
    if(avatarLink === "" && avatarFile.files[0] === null){
        alert("You must specify either image or link to image")
        return false
    }
    let height = $('#table-height-input').val();
    let width = $('#table-width-input').val();
    const newTable = new CreateTableRequest({
        name: $('#table-name-input').val() as string,
        width: width as number,
        height: height as number,
        avatarLink: avatarLink as string,
        avatarFile: avatarFile?.files[0]
    })
    if(parseInt(height as string) * parseInt(width as string) > 2500){
        alert("Размер таблицы не может превышать 2500 ячеек");
        return false;
    }
    postTable(newTable);
    clearMenu();
    closeMenu();
    return false;
}

function postTable(table) {
    httpClient.proceedRequest(
        table,
        (code, errorText) => {
            alert(`Error happened: ${code}, ${errorText}`)
        }
    ).then((table) => {
        console.log(table)
        loadStore().then(drawDialogs)
    })
}

function clearMenu() {
    $('#clear-button').click();
}

function closeMenu() {
    $('#close-button').click();
}

function loadStore() {
    return fetch(
        link + "/user/info?includeChats=true",
        {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    ).then((response) => {
        if(response.status === 200){
            response.text().then((json) => {
                store.dialogs = JSON.parse(json).chats;
            })
        }else{
            response.text().then(text => console.log(response.status + ", " + text));
        }
    });
}

function checkAuthorization(invokeAfterSuccess) {
    return fetch(
        link + "/user/login",
        {
            credentials: "include",
            method: "GET",
            headers: {"Content-Type": "application/json"}
        }
    ).then((response) =>{
        if(response.status === 200){
            invokeAfterSuccess()
        }else{
            window.location.href = link + "/oauth2/authorization/google"
        }
    });
}