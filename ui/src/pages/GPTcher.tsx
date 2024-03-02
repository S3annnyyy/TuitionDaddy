import { useState } from "react";

const GPTcher = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null); 
    const [userInfo, setUserInfo] = useState({ name: "", id: "", age: "" }); 

    async function MakeRequest() {
        try {
            const formData = new FormData();

            if (!file) {
                return;
            }
    
            formData.append("file", file); 
            formData.append("name", userInfo.name);
            formData.append("age", userInfo.age);
    
            const url = "http://localhost:8000/quiz/pdf/" + userInfo.id;
    
            const req = await fetch(url, {
                method: 'POST',
                body: formData 
            });
    
            const res = await req.text();
            setText(res);
        } catch (error) {
            console.log(error);
            setText("Error occurred");
        }
    }

    return (
        <>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <input 
                type="text" 
                placeholder="Name" 
                value={userInfo.name} 
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} 
            />
            <input 
                type="text" 
                placeholder="ID" 
                value={userInfo.id} 
                onChange={(e) => setUserInfo({ ...userInfo, id: e.target.value })} 
            />
            <input 
                type="text" 
                placeholder="Age" 
                value={userInfo.age} 
                onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })} 
            />
            {text && <h1>{text}</h1>}
            <button onClick={MakeRequest}>test</button>
        </>
    );
}

export default GPTcher;
