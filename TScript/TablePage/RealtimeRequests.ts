import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyDh3DeBU_xiQsz4kFZSQxS9Pc8sfBYSgzk",
    authDomain: "comgrid-b76cc.firebaseapp.com",
    projectId: "comgrid-b76cc",
    storageBucket: "comgrid-b76cc.appspot.com",
    messagingSenderId: "716186218438",
    appId: "1:716186218438:web:71f5d839ab5792ea634cc7",
    measurementId: "G-H7VP0TQEKW"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

set(ref(database), {
    id: 0,
    name: 'pridurak',
    family: 'semya pridurkov'
});