import {IsLoggedInRequest} from "./util/request/IsLoggedInRequest";
import {HttpClient} from "./util/HttpClient";
import {UserInfoRequest} from "./util/request/UserInfoRequest";

let info = {
    userId: ''
}

window.onload = () => {
    let httpClient = new HttpClient("https://comgrid.ru:8443");
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
        })
    })
}