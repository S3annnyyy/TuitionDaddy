import { useState } from "react";

const Quiz = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [userInfo, setUserInfo] = useState({ name: "", id: ""});
    const [quizUuid, setQuizUuid] = useState("");

    async function MakeRequest() {
        try {
            const formData = new FormData();

            if (!file) {
                return;
            }
    
            formData.append("file", file); 
            formData.append("name", userInfo.name);
            formData.append("userId", userInfo.id);

            const url = `http://localhost:8000/quiz/pdf/${userInfo.id}`;            
    
            const req = await fetch(url, {
                method: 'POST',
                body: formData 
            });
    
            const res = await req.text();
            setText(res);
        } catch (error) {
            console.log(error);
            setText(`Error occurred: ${error}`);
        }
    }

    return (
        <>
            <input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
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
                placeholder="Quiz UUID" 
                value={quizUuid} 
                onChange={(e) => setQuizUuid(e.target.value)} 
            />
            {text && <h1>{text}</h1>}
            <button onClick={MakeRequest}>test</button>
        </>
    );
}

export default Quiz;
