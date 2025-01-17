import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCwYXXFcW5FEwoqS_ecauLtl-N5fAJ9fO8",
    authDomain: "gaep-c338c.firebaseapp.com",
    projectId: "gaep-c338c",
    storageBucket: "gaep-c338c.firebasestorage.app",
    messagingSenderId: "956438356274",
    appId: "1:956438356274:web:eda7666078825026cf772b",
    measurementId: "G-P0L0TEPNKL"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
        console.log('The current browser does not support persistence.');
    }
});

export { db, auth };