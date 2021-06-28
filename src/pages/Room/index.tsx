import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import EmptyQuestionImg from '../../assets/images/empty-questions.svg';

import { MdThumbUp } from 'react-icons/md';

import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';

import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import './style.scss';

type RoomProsp = {
    id: string;
}

export function Room() {
    const params = useParams<RoomProsp>();
    const roomId = params.id;

    const { user, signInWithGoogle } = useAuth();
    const { title, questions } = useRoom(roomId);
    const [newQuestion, setNewQuestion] = useState('');

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

        await database.ref(`rooms/${roomId}/questions`).push(question).then((data) => {
            toast.success('Sua pergunta foi enviada com sucesso');
            setNewQuestion('');
        }).catch((error) => {
            toast.error(error);
        })
    }

    async function handleCreateRoom() {

        if(!user) {
            await signInWithGoogle();
        }
    }

    async function handleLiked(questionId: string, likeId: string | undefined) {

        if(!questionId) { toast.error("Pergunta não informada!"); return; }

        if(likeId)
        {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove().catch((error) => {
                toast.error(error);
            })
        }
        else
        {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({ authorId: user?.id, }).catch((error) => {
                toast.error(error);
            })
        }
    }

    return (
        <div id='page-room'>
            <Header>
                <RoomCode code={roomId} />
            </Header>
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

                { questions.length > 0 ? (
                    <div className="question-list">
                        {questions.map(question => {
                            return (
                                <Question key={question.id} roomId={roomId} questionId={question.id} content={question.content} response={question.response} author={question.author} isAnswered={question.isAnswered} isHighlighted={question.isHighlighted}>
                                    {!question.isAnswered && 
                                        (
                                            <button 
                                                className={`like-button ${question.likeCount > 0 ? 'liked' : ''}`}
                                                type="button"
                                                aria-label="Marcar como gostei"
                                                onClick={() => {handleLiked(question.id, question.likeId)}}
                                                >
                                                    { question.likeCount > 0 && <span>{question.likeCount}</span> }
                                                    <MdThumbUp />
                                            </button>
                                        )
                                    }
                                </Question>
                            )
                        })}
                    </div>
                ) : (
                    <div className="empty-questions">
                        <img src={EmptyQuestionImg} alt="Não existem perguntas para esta sala." />
                        <h3>Esta sala não possui perguntas</h3>
                    </div>
                )}
            </main>
        </div>
    );
}