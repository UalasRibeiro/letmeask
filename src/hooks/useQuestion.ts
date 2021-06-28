import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { database } from "../services/firebase";

type Author = {
    name: string;
    avatar: string;
}

export function useQuestion(roomId: string, questionId: string) {
    const history = useHistory();

    const [content, setContent] = useState('');
    const [author, setAuthor] = useState<Author>({ name:'', avatar: '' });
    const [response, setResponse] = useState('');
    
    useEffect(() => {
        const questionRef = database.ref(`rooms/${roomId}/questions/${questionId}`);

        if(!questionRef) {
            toast.error('A pergunta informada não existe!');
            return;
        }

        questionRef.on('value', question => {
            const databaseQuestion = question.val();
            
            if(!databaseQuestion) {
                toast.error('A sala informada não existe!');
                return;
            }

            setContent(databaseQuestion.content);
            setAuthor(databaseQuestion.author);
            setResponse(databaseQuestion.response);

            return () => {
                questionRef.off();
            }
        })

    }, [roomId, questionId, history]);
    
    return { content, author, response }
}