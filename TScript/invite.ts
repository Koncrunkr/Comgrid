import {HttpClient} from "./util/HttpClient";
import {IsLoggedInRequest} from "./util/request/IsLoggedInRequest";
import {PostLinkRequest} from "./util/request/PostLinkRequest";
import {getParam} from "./util/Util";

window.onload = () => {
    const http = new HttpClient("https://comgrid.ru:8443");
    http.proceedRequest(
        new IsLoggedInRequest(),
        (code, err) => {
            if (code === 401) {
                alert("Вы не вошли в систему, войдите, пожалуйста");
                let link = document.createElement('a');
                link.href = "https://comgrid.ru";
                link.click();
            }
            console.log(code, err);
        }
    ).then(response => {
        if (response === 200) {
            http.proceedRequest(
                new PostLinkRequest({ code: getParam('code') }),
                (code, err) => {
                    if (code === 422) {
                        let link = document.createElement('a');
                        link.href = "https://comgrid.ru/pages/table?id=" + getParam('chatId');
                        link.click();
                        return;
                    }
                    alert(err);
                    let link = document.createElement('a');
                    link.href = "https://comgrid.ru";
                    link.click();
                }
            ).then(response => {
                let link = document.createElement('a');
                link.href = "https://comgrid.ru/pages/table?id=" + getParam('chatId');
                link.click();
            });
        }
    })
}