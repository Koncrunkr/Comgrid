import {IsLoggedInRequest} from "./util/request/IsLoggedInRequest";
import {HttpClient} from "./util/HttpClient";

window.onload = () => {
    let httpClient = new HttpClient("https://comgrid.ru:8443");
    httpClient.proceedRequest(
        new IsLoggedInRequest(),
        () => {
            console.log("unauthorizated");
        }
    ).then(() => {
        $('.clickable').toggleClass('d-none');
    })
}