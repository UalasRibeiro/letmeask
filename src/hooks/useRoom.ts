import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type Questions = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string, someAuthorId: boolean = false) {
    const [questions, setQuestions] = useState<Questions[]>([]);
    const [authorId, setAuthorId] = useState();
    const [title, setTitle] = useState('');
    const { user } = useAuth();
    const history = useHistory();
    
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        if(!roomRef) {
            toast.error('A sala informada não existe!');
            return;
        }

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            
            if(!databaseRoom) {
                toast.error('A sala informada não existe!');
                return;
            }

            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            });

            setAuthorId(databaseRoom.authorId);
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
                
            if(someAuthorId) {
                if(authorId) {
                    if(authorId !== user?.id) {
                        toast.error('Você precisa ser o criador da sala para acessar esta página!');

                        history.push('/');
                    }
                }
            }

            return () => {
                roomRef.off();
            }
        })

    }, [roomId, user, authorId, someAuthorId, history]);
    
    return {title, questions}
}