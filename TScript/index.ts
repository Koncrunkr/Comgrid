import {HttpClient} from "./util/HttpClient";
import {CreateTableRequest} from "./util/request/CreateTableRequest";
import {UserInfoRequest} from "./util/request/UserInfoRequest";
import {IsLoggedInRequest} from "./util/request/IsLoggedInRequest";

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
let leftButtonClicked = false;

export function onLoad(){
    loadStore()
      .then(() => {
          drawDialogs()
      });

    $('.clickable').on('click', () => {
        $('.clickable').toggleClass('d-none')
    });
    let input = document.getElementById('table-image-file-input');
    input.onchange = () => showImage(input);
    $("#shower").on("dragstart", () => false);
    $("#shower-cut").on("dragstart", () => false);
    $("#save-canvas").on("click", saveCanvas);
    $('#create-table-form').on('submit', submit);
}

function drawDialogs() {
    let $container = $('.chat-container');
    let $noDel = $container.find('.no-deletable');
    $container.html('');
    $container.append($noDel);
    store.dialogs.slice().reverse().forEach((dialog, index) => {
        let dialog2 = store.dialogs2[index % store.dialogs2.length];
        let $chat = $('.chat').clone();
        $chat.removeClass('chat d-none');
        $chat.find('a').attr('href', 'pages/table?id=' + dialog.id);
        $chat.find('.chat-name').text(dialog.name);
        $chat.find('.chat-sender').text(dialog2.lastSender + (dialog2.lastSender === '' ? '' : ':'));
        $chat.find('.chat-text').text(dialog2.lastMessage);
        $chat.find('.chat-time').text(dialog2.time);
        if(dialog.avatar.startsWith("/"))
            dialog.avatar = link + dialog.avatar
        let $img = $chat.find('img');
        $img.attr('src', dialog.avatar);
        $img[0].onload = () => {
            let width = $img[0].getBoundingClientRect().width;
            $img.height(width);
            $img.width(width);
        }
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
    const avatarFile = (document.getElementById('table-image-file-input') as HTMLInputElement)?.files[0];
    let avatarLink = $('#table-image-link-input').val();
    if(avatarLink === "" && avatarFile === null){
        alert("You must specify either image or link to image");
        return false;
    }
    let height = $('#table-height-input').val();
    let width = $('#table-width-input').val();
    if((+height) * (+width) > 10000) {
        alert("Размер таблицы не может превышать 10000 ячеек");
        return false;
    }
    if(+height <= 0 || +width <= 0) {
        alert("Неположительные размеры? Чтобы отправлять несуществующие сообщения? Круто, ничего не скажешь, но нельзя");
        return false;
    }
    let image = document.getElementById("shower") as HTMLImageElement;
    console.log(image.naturalHeight, image.naturalWidth);
    if(image.naturalHeight !== image.naturalWidth) {
        alert("Картинка должна быть квадратной. Обрежьте её!");
        return false;
    }
    const newTable = new CreateTableRequest({
        name: $('#table-name-input').val() as string,
        width: width as number,
        height: height as number,
        avatarLink: avatarLink as string,
        avatarFile: avatarFile
    })

    postTable(newTable)
    .then((table) => {
        console.log(table)
        loadStore().then(drawDialogs)
    });
    clearMenu();
    closeMenu();
    return false;
}

function postTable(table) {
    return httpClient.proceedRequest(
        table,
        (code, errorText) => {
            alert(`Error happened while creating table: ${code}, ${errorText}`)
        }
    )
}

function clearMenu() {
    $('#clear-button').click();
}

function closeMenu() {
    $('#close-button').click();
}

function loadStore() {
    return httpClient.proceedRequest(
        new UserInfoRequest({ includeChats: true }),
        (code, errorText) => {
            alert(`Error happened while loading user info: ${code}, ${errorText}`)
        }
    ).then(user => {
        store.dialogs = user.chats;
    })
}

function showImage(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        let shower = document.getElementById('shower') as HTMLImageElement;
        console.log(shower.naturalWidth, shower.naturalHeight);

        reader.onload = function(e) {
            shower.classList.remove('d-none');

            let method = () => {
                let dark = $('.dark-background');
                shower.width = 500;
                shower.height = shower.naturalHeight * shower.width / shower.naturalWidth;
                dark.removeClass('d-none');
                dark.width(shower.width);
                dark.height(shower.height);

                let showerCut: HTMLCanvasElement = document.getElementById('shower-cut') as HTMLCanvasElement;
                showerCut.classList.remove('d-none');
                showerCut.width = shower.width * 2 / 3;
                showerCut.height = shower.width * 2 / 3;
                let offset = shower.width / 6;
                showerCut.style.top = `${offset}px`;
                showerCut.style.left = `${offset}px`;

                showerCut.removeEventListener('mousedown', showerCutMove);
                showerCut.addEventListener('mousedown', showerCutMove);

                let context = showerCut.getContext('2d');
                context.drawImage(shower, -offset, -offset, shower.width, shower.width);
                //context.strokeRect(0, 0, shower.width, shower.width);
                shower.setAttribute('src', e.target.result as string);
                shower.removeEventListener('load', method);

                $('#save-canvas').removeClass('d-none');
            }

            shower.addEventListener('load', method);
            shower.setAttribute('src', e.target.result as string);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function saveCanvas() {
    let showerCut = document.getElementById('shower-cut') as HTMLCanvasElement;
    let keeper = document.getElementById('shower') as HTMLImageElement;


    showerCut.toBlob(blob => {
        let dt = new DataTransfer();
        dt.items.add(new File([blob], 'image.png', {type: 'image/png'}));
        let file_list = dt.files;

        console.log('Коллекция файлов создана:');
        console.dir(file_list);

        let input = document.getElementById('table-image-file-input') as HTMLInputElement
        input.files = file_list;
        showImage(input);
    })
}

let showerCutMove = function(event) {
    let shower = document.getElementById('shower-cut') as HTMLCanvasElement;
    let keeper = document.getElementById('shower') as HTMLImageElement;
    let bounding = keeper.getBoundingClientRect();
    let shiftX = event.clientX - shower.getBoundingClientRect().left;
    let shiftY = event.clientY - shower.getBoundingClientRect().top;

    shower.style.position = 'absolute';

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        let left = Math.min(Math.max(pageX - shiftX - bounding.left, 0), bounding.width - shower.width);
        let top = Math.min(Math.max(pageY - shiftY - bounding.top, 0), bounding.height - shower.height);
        shower.style.left = left + 'px';
        shower.style.top = top + 'px';
        let context = shower.getContext('2d')
        context.clearRect(0, 0, bounding.width, bounding.height);
        context.drawImage(keeper, -left, -top, bounding.width, bounding.height);
        //context.strokeRect(0, 0, shower.width, shower.height);
    }

    function resize(increase: boolean) {
        let width = Math.min(shower.width + (increase ? 6 : -6), bounding.width, bounding.height);
        shower.width = width;
        shower.height = width;
        let boundingIn = shower.getBoundingClientRect();

        let left = Math.min(Math.max(+shower.style.left.slice(0,-2), 0), bounding.width - shower.width);
        let top = Math.min(Math.max(+shower.style.top.slice(0,-2), 0), bounding.height - shower.height);
        shower.style.left = left + 'px';
        shower.style.top = top + 'px';
        let context = shower.getContext('2d')
        context.clearRect(0, 0, bounding.width, bounding.height);
        context.drawImage(keeper, -left, -top, bounding.width, bounding.height);
        //context.strokeRect(0, 0, shower.width, shower.height);
    }

    function onMouseMove(event: MouseEvent) {
        if (event.ctrlKey) {
            let newShiftX = event.clientX - shower.getBoundingClientRect().left;
            let newShiftY = event.clientY - shower.getBoundingClientRect().top;
            let increase = (newShiftX - newShiftY - shiftX + shiftY) > 0;
            shiftX = newShiftX;
            shiftY = newShiftY;
            resize(increase);
        }
        else
            moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    shower.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        shower.onmouseup = null;
    };
}