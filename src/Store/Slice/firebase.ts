// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBUJ_B3Et1NKni5Zqe7cb4BwllLGLdQOXU",
    authDomain: "algo-textiles.firebaseapp.com",
    databaseURL: "https://algo-textiles-default-rtdb.firebaseio.com/",
    projectId: "algo-textiles",
    storageBucket: "algo-textiles.firebasestorage.app",
    messagingSenderId: "223849227491",
    appId: "1:223849227491:web:4a84e2f4648351e38751d6",
    measurementId: "G-ZWRPFYDP3W"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
