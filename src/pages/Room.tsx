import { useEffect } from 'react';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useHistory } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/rooms.scss';

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnsweres: boolean;
    isHighlighted: boolean;
}>

type Questions = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnsweres: boolean;
    isHighlighted: boolean;
}

type RoomProsp = {
    id: string;
}

export function Room() {
    const { user, signInWithGoogle } = useAuth();
    const history = useHistory();
    const params = useParams<RoomProsp>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Questions[]>([]);
    const [title, setTitle] = useState('');

    const roomId = params.id;

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        if(!roomRef) {
            toast.error('A sala informada não existe!');
            history.push('/');
            return;
        }

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            
            if(!databaseRoom) {
                toast.error('A sala informada não existe!');
                history.push('/');
                return;
            }

            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnsweres: value.isAnsweres,
                }
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })

    }, [roomId]);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === '') { return; }

        if(!user) {
            toast.error('You must be logged in');
            return;
        }

        const question = {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            isHighlighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);

        toast.success('Sua pergunta foi enviada com sucesso');

        setNewQuestion('');
    }

    async function handleCreateRoom() {

        if(!user) {
            await signInWithGoogle();
        }
    }

    return (
        <div id='page-room'>
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta{questions.length > 1 && "s"}</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="Oque você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ): (
                            <span>Para enviar uma pergunta, <button onClick={handleCreateRoom}>faça seu login</button>.</span>
                        )}
                        
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

                {JSON.stringify(questions)}

            </main>
        </div>
    );
}