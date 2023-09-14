import React, { useEffect, useRef, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { ToastContainer, toast } from 'react-toastify';
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import firebaseConfig from '../../firebaseConfig';
import { Helmet } from 'react-helmet';
import "./Tasks.css";
import logo from "./logo.png"
import 'react-toastify/dist/ReactToastify.css';

export default function Tasks() {

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    let user = auth.currentUser;
    const db = getFirestore(app);

    const blurEff = useRef();
    const codeData = useRef();
    const codeTitle = useRef();
    const editRef = useRef();
    const displayEditWindow = useRef();
    const date = useRef();

    const [changedValue, setchangedValue] = useState("");
    const [viewEditor, setviewEditor] = useState(false);
    const [nameofLang, setnameofLang] = useState("");
    const [array, setarray] = useState([]);
    const [loading, setloading] = useState(true);
    const [obj, setobj] = useState("");
    const [loadingWheel, setloadingWheel] = useState(false);

    const proLang = async (e) => {
        setviewEditor(true);
        setnameofLang(e);
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                async function operate() {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setarray(docSnap.data().arrayOfObject || []);
                    }
                    setloading(false);
                }
                operate();
            }
        });
        return () => {
            unsubscribe();
        }
    }, []);


    function getCurrentTimeAndDay() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        const currentTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[now.getDay()];

        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const currentDate = `${month}/${day}/${year}`;

        const fullDateTime = `${currentTime},  ${dayName}, ${currentDate}`;
        return fullDateTime;
    }


    const handleClose = async () => {
        setviewEditor(false);
    }

    function getDateDifference(inputDate) {
        const inputDateObj = new Date(inputDate);
        const currentDate = new Date();
        const inputYear = inputDateObj.getFullYear();
        const inputMonth = inputDateObj.getMonth();
        const inputDay = inputDateObj.getDate();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        const inputDateOnly = new Date(inputYear, inputMonth, inputDay);
        const currentDateOnly = new Date(currentYear, currentMonth, currentDay);
        const differenceInMilliseconds = currentDateOnly - inputDateOnly;
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
        return differenceInDays;
    }


    const handleSave = async () => {
        let user = auth.currentUser;
        if (!user) {
            toast.error("Please login", { autoClose: 1500 });
            return;
        }
        if (codeData.current.value === "") {
            toast.error("Please enter some task", { autoClose: 1500 });
            return;
        }
        else if (date.current.value === "") {
            toast.error("Please enter due date", { autoClose: 1500 });
            return;
        }
        else if (codeTitle.current.value === "") {
            toast.error("Please enter title", { autoClose: 1500 });
            return;
        }
        let obj = {
            "name": nameofLang,
            "codeInfo": codeData.current.value || "No task",
            "dateAndTime": getCurrentTimeAndDay(),
            "codeTitle": codeTitle.current.value || "No title",
            "dueDate": date.current.value || ""
        }
        let tempArray = [];
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            tempArray = docSnap.data().arrayOfObject || [];
        }
        tempArray.push(obj);
        setarray(tempArray);
        const info = docSnap.data();
        setDoc(docRef, {
            ...info, arrayOfObject: tempArray,
        });
        setviewEditor(false);
    }

    const handlTaskDelete = async (codetime) => {
        let newTemp = array.filter((e) => {
            return e.dateAndTime !== codetime;
        });
        setarray(newTemp);
        let user = auth.currentUser;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const info = docSnap.data();
        setDoc(docRef, {
            ...info, arrayOfObject: newTemp,
        });
    }
    const handleCopy = async (textToCopy) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success("Task copied to clipboard", { autoClose: 1700 });
        }
        catch (error) {
            toast.error('Error copying to clipboard:', error);
        }
    }

    const handleEdits = (dateAndTime, codeInfo, name, codeTitle) => {
        setobj((e) => ({
            date: dateAndTime,
            task: codeInfo,
            name: name,
            title: codeTitle
        }))
        displayEditWindow.current.style.display = "block";
        editRef.current.value = codeInfo;
    }

    const handleEditSave = async (date, task) => {
        const updatedArray = array.map((e) => {
            if (e.dateAndTime === date) {
                if (changedValue !== "") {
                    return { ...e, codeInfo: changedValue };
                }
            }
            return e;
        });
        setloadingWheel(true);
        setarray(updatedArray);

        let user = auth.currentUser;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const info = docSnap.data();

        setDoc(docRef, {
            ...info,
            arrayOfObject: updatedArray,
        });
        setloadingWheel(false);
        displayEditWindow.current.style.display = "none";
    }


    const handleEditClose = () => {
        displayEditWindow.current.style.display = "none";
    }

    const handleChanges = (e) => {
        setchangedValue(e.target.value);
    }

    const filterArray = async (e) => {
        setloading(true);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        setloading(false);
        let updatedArray = docSnap.data().arrayOfObject || [];;
        if (e === "completed") {
            updatedArray = updatedArray.filter((e) => {
                console.log("in the first one ")
                return getDateDifference(e.dueDate) > 0;
            })
        }
        else if (e === "not_completed") {
            console.log("in the seocnd one ")
            updatedArray = updatedArray.filter((e) => {
                return getDateDifference(e.dueDate) <= 0;
            })
        }
        setarray(updatedArray);
        console.log("this is the array-> ", array);
    }

    const dayandData = getCurrentTimeAndDay();

    return (
        <>
            <main ref={blurEff} className="align code_main">
                <ToastContainer className="custom-toast" />
                <Helmet>
                    <title>Collab Wave | TASKS</title>
                </Helmet>
                <nav className="code_nav" >
                    <ul>
                        <img style={{ margin: "0px" }} onClick={() => { window.location.href = "/" }} src={logo} alt="logo image" />
                    </ul>
                </nav>
                <section className='SecondSection' >
                    <h3>~Welcome <b style={{ color: "#ff2d2d" }} >{user?.displayName}</b> ~</h3>
                    <h2>~Add You task from here~</h2>
                    <button onClick={() => { proLang("HTML") }} ><b>Add New Task</b></button>
                    <br /><br />
                </section>
                <section>
                    <br />
                    <br />
                    <b>Filter : &nbsp; &nbsp; </b>
                    <select onChange={(event) => { filterArray(event.target.value) }}>
                        <option value="default">Default</option>
                        <option value="completed">Completed</option>
                        <option value="not_completed">Not Completed</option>
                    </select>

                </section>
                <br />
                {
                    viewEditor ?
                        (<main style={{ marginTop: "3.3rem" }} className='in_tasks'>
                            <h4>Start - {dayandData}</h4>
                            <input placeholder='Task title' ref={codeTitle} type="text" /> <br /><br />
                            <b htmlFor="">Enter Due Date : &nbsp; &nbsp;&nbsp;</b>
                            <input type="date" ref={date} />
                            <textarea className='CodeTextArea' ref={codeData} placeholder="Enter you task here" cols="100" rows="20"></textarea>
                            <button onClick={handleSave}>Save</button>
                            &nbsp; &nbsp;
                            <button onClick={handleClose}>Close</button>
                            <br />
                        </main>)
                        : (
                            <main>
                                {
                                    loading ? (
                                        <section className='align' >
                                            <div className="wheel"></div>
                                            <br />
                                            <main className='firebaseCodes'>
                                                <br /><br />
                                                <b>Task Title : Waiting</b>
                                                <br /> <br />
                                                <b>Started on : Waiting</b>
                                                <br /><br />
                                                <b>Due Date : Waiting</b>
                                                <pre>
                                                    <button className='copyButton'>Dummy - Copy</button>
                                                    <code className='codeInfo' >Some tasks (if any) will be here soon.
                                                        <br />
                                                        Thanks for your patience. While you are here, here is an interesting
                                                        <br />
                                                        fact related to website loading: Did you know that Amazon calculated
                                                        <br />
                                                        that a page load slowdown of just one second could cost it <br />
                                                        $1.6 billion in sales each year?</code>
                                                </pre>
                                                <button style={{ fontSize: "13px" }} >Dummy - Delete</button>
                                                &nbsp; &nbsp;
                                                <button>Dummy - Edit</button>
                                                <button className='Status' style={{ background: "lightgreen", color: "black" }}>
                                                    Status :  waiting
                                                </button>
                                                <br /><br />
                                            </main>
                                        </section>
                                    )
                                        : (
                                            array?.map((e) => {
                                                const { codeInfo, dateAndTime, name, codeTitle, dueDate } = e;
                                                return (
                                                    <>
                                                        <main className='firebaseCodes' key={dateAndTime}>
                                                            <br /><br />
                                                            <b>Task Title : {codeTitle}</b>
                                                            <br /> <br />
                                                            <b>Started on : {dateAndTime}</b>
                                                            <br /><br />
                                                            <b>Due Date : {dueDate}</b>
                                                            <pre>
                                                                <button className='copyButton' onClick={() => { handleCopy(codeInfo) }}>Copy</button>
                                                                <code className='codeInfo' >{codeInfo}</code>
                                                            </pre>
                                                            <button style={{ fontSize: "13px" }} onClick={() => { handlTaskDelete(dateAndTime) }}>Delete</button>
                                                            &nbsp; &nbsp;
                                                            <button onClick={() => { handleEdits(dateAndTime, codeInfo, name, codeTitle) }} >Edit</button>
                                                            <button className='Status' style={{ background: "lightgreen", color: "black" }}>
                                                                {
                                                                    getDateDifference(dueDate) > 0 ? "Status : Completed" : "Status : Not Completed"
                                                                }
                                                            </button>
                                                            <br /><br />
                                                        </main>
                                                    </>
                                                )
                                            })
                                        )
                                }
                            </main>
                        )
                }
                {
                    !loadingWheel ?
                        (
                            <main style={{ marginTop: "4.3rem", display: "none" }} ref={displayEditWindow} className='in_tasks'>
                                <h4>Start - {obj.date}</h4>
                                <b>{obj.title}</b>
                                <textarea className='CodeTextArea' onChange={handleChanges} ref={editRef} cols="90" rows="23"></textarea>
                                <button onClick={() => { handleEditSave(obj.date, obj.task) }}>Save</button>
                                &nbsp; &nbsp;
                                <button onClick={handleEditClose}>Close</button>
                                <br />
                            </main>
                        )
                        :
                        (
                            < center >
                                <main className='saveLoadingWheel'></main>
                            </center>
                        )
                }

            </main >
        </>
    )
}
