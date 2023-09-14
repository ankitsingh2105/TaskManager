import React from 'react'
import "./Home.css"

import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseConfig from '../../firebaseConfig';
export default function Home(props) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    let user = auth.currentUser;
    const handleNavigation = () => {
        let user = auth.currentUser;
        if (user) {
            async function Wait() {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                window.location.href = `/user/auth/edit/${docSnap.data().userID}`
            }
            Wait();
        }
        else {
            window.location.href = "/unauth/tempUser";
        }
    }
    return (
        <main className="main_home" id={props.id} >
            <div className='align'>
                <h1>
                    Manging Tasks
                </h1>
                <h1>
                    Made Easy
                </h1>
                <div className="align">
                    <p>
                    <b>"CollabWave"</b> is a modern and user-friendly task collaboration application designed to streamline teamwork, enhance productivity, and foster effective communication among team members. This app is built on the Firebase Firestore database, enabling real-time collaboration, notifications, and seamless task management.
                    </p>
                    <div className="align2">
                        <button onClick={() => { window.location.href = "/login" }} >Get Started</button>
                    </div>
                </div>
            </div>
        </main>
    )
}
