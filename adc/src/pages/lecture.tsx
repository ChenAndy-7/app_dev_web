import { useState, useEffect } from "react";
import './lecture.css';

interface Lectures {
  id: number
  slideName: string
  zoomLink: string
  zoomPass: string
  url: string
}


function Lecture() {
    const [buttonPopup, setButtonPopup] = useState(false);
    const [editPopup, setEditPopup] = useState(false);
    const [lectures, setLectures] = useState<Lectures[]>([]);
    const [currentIndex, changeIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [addingLecture, setAddingLecture] = useState(false);
    const [slideNameInput, setSlideNameInput] = useState({slideName: ''})
    const [urlInput, setsUrlInput] = useState({url: ''})
    const [zoomLinkInput, setZoomLinkInput] = useState({zoomLink: ''})
    const [zoomPassInput, setsZoomPassInput] = useState({zoomPass: ''})

    function indexUp(){
        if(currentIndex == lectures.length -1){
            changeIndex(0)
        }else{
            changeIndex(currentIndex +1)

        }
    }

    function indexDown(){
        if(currentIndex == 0){
            changeIndex(lectures.length - 1)
        }else{
            changeIndex(currentIndex - 1)
        }
    }

    async function fetchLectures() {
        try {
          const response = await fetch('http://127.0.0.1:8000/lecture'); // Replace with your API endpoint
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data: Lectures[] = await response.json();
    
          setLectures(data);
        }catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }finally {
            setIsLoading(false);
        }
      };

    useEffect(() => {
        fetchLectures();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    async function createNewLecture() {
        await fetch('http://127.0.0.1:8000/lecture/new', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ // Takes your javascript object and it turns it into a string
            slideName: slideNameInput.slideName,
            zoomLink: zoomLinkInput.zoomLink,
            zoomPass: zoomPassInput.zoomPass,
            url: urlInput.url
          })
        })
        setSlideNameInput({slideName:""})
        setsUrlInput({url:""})
        setAddingLecture(false)
        await fetchLectures();
    }
    
    async function deleteLecture(id: number) {
        try {
            await fetch(`http://127.0.0.1:8000/lecture/${id}`, {
                method: "DELETE",
            });
            await fetchLectures();
        } catch (err) {
            console.error("Error deleting message:", err);
        }
    }

    async function editLecture(id: number){
        await fetch(`http://127.0.0.1:8000/lecture/${id}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ // Takes your javascript object and it turns it into a string
              slideName: slideNameInput.slideName,
              url: urlInput.url,
              zoomLink: zoomLinkInput.zoomLink,
              zoomPass: zoomPassInput.zoomPass
            })
        })
        setSlideNameInput({slideName:""})
        setsUrlInput({url:""})
        setAddingLecture(false)
        await fetchLectures();
    }

    async function deleteHelper(){
        await deleteLecture(lectures[currentIndex].id)
        changeIndex(0)
    }

    async function editHelper(){
        setEditPopup(false)
        editLecture(lectures[currentIndex].id)

    }

    return (
        <div className = "lecture-container">

            {/*This Div is for the slide and arrows*/}
            <div className = "section1">
                <button className = "rightClicker" onClick = {() => indexDown()}>&#60;</button>
                <div className = "slide">
                    <button className = "delete-Button" onClick = {() => deleteHelper()}>X</button>
                    <h1 className = "Title">{lectures[currentIndex].slideName}</h1>
                    <a href={lectures[currentIndex].url} className = "link">{lectures[currentIndex].url}</a>
                    <h3>{lectures[currentIndex].zoomLink}</h3>
                    <h3>{lectures[currentIndex].zoomPass}</h3>
                    <button onClick = {() => setEditPopup(true)}>Edit</button>
                </div>
                <button className = "leftClicker" onClick = {() => indexUp()}>&#62;</button>
            </div>

            <div className = "section2"> 
                <button onClick = {() => setButtonPopup(true)}><img id = "addImage" src="https://cdn-icons-png.flaticon.com/512/9425/9425017.png" alt="Add File" /></button>
            </div>
            {/*popup for adding a new lecture*/}
            <Popup trigger = {buttonPopup}
            setTrigger={setButtonPopup}>
                <h3 className = "popup-txt">Title:</h3>
                <input type="text" id = "new-Title" placeholder="Enter Title..." value = {slideNameInput.slideName} onChange = {(e) => setSlideNameInput({slideName: e.target.value})}/>


                <h3 className = "popup-txt">Link:</h3>
                <input type="text" id = "new-Link" placeholder="Enter Link..." value = {urlInput.url} onChange = {(e) => setsUrlInput({url: e.target.value})}/>

                <h3 className = "popup-txt">Zoom Link:</h3>
                <input type="text" name="" id="new-Zoom-Link" placeholder="Enter Zoom Link..." value = {zoomLinkInput.zoomLink} onChange = {(e) => setZoomLinkInput({zoomLink: e.target.value})}/>

                <h3 className = "popup-txt">Zoom Password:</h3>
                <input type="text" name="" id="new-Zoom-Pass" placeholder="Enter Zoom Password..." value = {zoomPassInput.zoomPass} onChange = {(e) => setsZoomPassInput({zoomPass: e.target.value})}/>

                <button className = "add-Button" onClick={() => createNewLecture()}>Add</button>
            </Popup>

            {/*popup for changing lecture slide data*/}
            <Popup trigger = {editPopup}
            setTrigger={setEditPopup}>
                <h3 className = "popup-txt">Title:</h3>
                <input type="text" id = "new-Title" placeholder = {lectures[currentIndex].slideName} value = {slideNameInput.slideName} onChange = {(e) => setSlideNameInput({slideName: e.target.value})}/>


                <h3 className = "popup-txt">Link:</h3>
                <input type="text" id = "new-Link" placeholder= {lectures[currentIndex].url} value = {urlInput.url} onChange = {(e) => setsUrlInput({url: e.target.value})}/>

                <h3 className = "popup-txt">Zoom Link:</h3>
                <input type="text" name="" id="new-Zoom-Link" placeholder= {lectures[currentIndex].zoomLink} value = {zoomLinkInput.zoomLink} onChange = {(e) => setZoomLinkInput({zoomLink: e.target.value})}/>

                <h3 className = "popup-txt">Zoom Password:</h3>
                <input type="text" name="" id="new-Zoom-Pass" placeholder= {lectures[currentIndex].zoomPass} value = {zoomPassInput.zoomPass} onChange = {(e) => setsZoomPassInput({zoomPass: e.target.value})}/>

                <button className = "add-Button" onClick={() => editHelper()}>Finish</button>
            </Popup>
        </div>

    )
}

interface PopupProps {
    trigger: boolean;
    children: React.ReactNode;
    setTrigger: (value: boolean) => void;
}

function Popup(props:PopupProps){
    return(props.trigger) ?(
        <div className = "popup">
            <div className = "popInner">
                <button className = "close-Button" onClick = {() => props.setTrigger(false)}>Close</button>
                {props.children}
            </div>
        </div>
    ):"";
}

{/*function lecture(){
    For the student login not Admin
        <div className = "section1">
            <button className = "rightClicker" onClick = {() => indexDown()}>&#60;</button>
            <div className = "slide">
                <h1 className = "Title">{lectures[currentIndex].slideName}</h1>
                <a href={lectures[currentIndex].url} className = "link">{lectures[currentIndex].url}</a>
            </div>
            <button className = "leftClicker" onClick = {() => indexUp()}>&#62;</button>
            </div>
} */}

export default Lecture;