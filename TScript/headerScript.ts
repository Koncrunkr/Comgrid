import {IsLoggedInRequest} from "./util/request/IsLoggedInRequest";
import { getHttpClient, HttpClient } from "./util/HttpClient";
import {UserInfoRequest} from "./util/request/UserInfoRequest";
import { onLoad } from "./index";
import { getState } from "./authorization/State";

let info = {
    userId: ''
}

window.onload = () => {
    const link = document.getElementById('sign-in');
    link.onclick = () => {
        getState().whenReady().then(state => state.authorize())
        return false;
    }

    let httpClient = getHttpClient();
    httpClient.proceedRequest(
        new IsLoggedInRequest(),
        () => {
            console.log("unauthorizated");
        }
    ).then((response) => {
        $('.clickable').toggleClass('d-none');

        httpClient.proceedRequest(
            new UserInfoRequest({includeChats: false})
        ).then(response => {
            $('#id-keeper').text(`id: ${response.id}`);
            localStorage.setItem("userId", response.id);
            onLoad()
        })
    })
}