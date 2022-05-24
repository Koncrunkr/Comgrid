import { getHttpClient } from "./util/HttpClient";
import {UserInfoRequest} from "./util/request/UserInfoRequest";
import { getState } from "./authorization/State";
import { onLoad } from "./index";

let info = {
    userId: ''
}

// $(document).on('click', 'a[href^="#"]', function(e) {
//     // target element id
//     var id = $(this).attr('href');
//
//     // target element
//     var $id = $(id);
//     if ($id.length === 0) {
//         return;
//     }
//
//     // prevent standard hash navigation (avoid blinking in IE)
//     e.preventDefault();
//
//     // top position relative to the document
//     var pos = $id.offset().top;
//
//     // animated top scrolling
//     $('body, html').animate({scrollTop: pos});
// });

window.onload = () => {
    const signInVk = document.getElementById('sign-in-vk');
    signInVk.onclick = () => {
        getState().whenReady().then(state => state.authorize(null, "vk"));
        return false;
    }
    const signInGoogle = document.getElementById('sign-in-google');
    signInGoogle.onclick = async () => {
        getState().whenReady().then(state => state.authorize(null, "google"));
        return false;
    }
    const signOut = document.getElementById('sign-out');
    signOut.onclick = async () => {
        const state = await getState().whenReady()
        state.revokeAuthorization();
        window.location.reload();
        return false;
    }

    getState().whenReady().then((state) => {
        if(state.authorized) {
            $('.sign-in-div').removeClass('d-none');
            $('.sign-up-div').removeClass('d-none');
            $('.sign-out-div').addClass('d-none');

            getHttpClient().proceedRequest(
              new UserInfoRequest({includeChats: false})
            ).then(response => {
                $('#id-keeper').text(`id: ${response.id}`);
                localStorage.setItem("userId", response.id);
                onLoad()
            })
        }else{
            $('.sign-in-div').addClass('d-none');
            $('.sign-up-div').addClass('d-none');
            $('.sign-out-div').removeClass('d-none');
        }
    })
}