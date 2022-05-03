import {IsLoggedInRequest} from "./util/request/IsLoggedInRequest";
import { getHttpClient, HttpClient } from "./util/HttpClient";
import {UserInfoRequest} from "./util/request/UserInfoRequest";
import { getState } from "./authorization/State";
import { onLoad } from "./index";

let info = {
    userId: ''
}

window.onload = () => {
    const signIn = document.getElementById('sign-in');
    signIn.onclick = () => {
        getState().whenReady().then(state => state.authorize())
        return false;
    }
    const signUp = document.getElementById('sign-up');
    signUp.onclick = () => {
        getState().whenReady().then(state => state.authorize())
        return false;
    }

    getState().whenReady().then((state) => {
        if(state.authorized) {
            $('.clickable').toggleClass('d-none');

            getHttpClient().proceedRequest(
              new UserInfoRequest({includeChats: false})
            ).then(response => {
                $('#id-keeper').text(`id: ${response.id}`);
                localStorage.setItem("userId", response.id);
                onLoad()
            })
        }
    })
}