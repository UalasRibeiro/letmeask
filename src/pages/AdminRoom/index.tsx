import { useHistory, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { MdThumbUp, MdModeComment, MdDelete, MdCheck } from 'react-icons/md';

import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';
import { useState } from 'react';

import { Header } from '../../components/Header';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
import { Button } from '../../components/Button';
import { ModalConfirm } from '../../components/Modal/Confirm';

import EmptyQuestionImg from '../../assets/images/empty-questions.svg';

import './style.scss';

type RoomProsp = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomProsp>();
    const roomId = params.id;
    let questionId = "";
    
    const { title, questions } = useRoom(roomId, true);
    const [isModalOpenEndRoom, setIsModalOpenEndRoom] = useState(false);
    const [isModalOpenDeleteQuestion, setIsModalOpenDeleteQuestion] = useState(false);
    
    function openConfirmModalEndRoom() {
        setIsModalOpenEndRoom(true);
    }

    function closeConfirmModalEndRoom() {
        setIsModalOpenEndRoom(false);
    }

    function openConfirmModalDeleteQuestion(question_id: string) {
        questionId = question_id;
        setIsModalOpenDeleteQuestion(true);
    }
    
    function closeConfirmModalDeleteQuestion() {
        setIsModalOpenDeleteQuestion(false);
    }

    async function handleEndRoom() {
        closeConfirmModalEndRoom();

        await database.ref(`rooms/${roomId}`).update({ closedAt: new Date(), }).then((data) => {
            toast.success("A sala foi encerrada");
            history.push('/');
        }).catch((error) =>{
            toast.error(error);
        })
    }

    async function handleAnsweredQuestion(questionId: string, bIsAnswered: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isAnswered: !bIsAnswered, }).catch((error) => {
            toast.error(error);
        })
    }

    async function handleHighlightedQuestion(questionId: string, bIsHighlighted: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isHighlighted: !bIsHighlighted, }).catch((error) => {
            toast.error(error);
        })
    }
    
    async function handleDeleteQuestion(questionId: string) {
        closeConfirmModalDeleteQuestion();
            
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove().then((data) => {
            toast.success("A pergunta foi deletada!");
        }).catch((error) => {
            toast.error(error);
        })
    }

    return (
        <div id='page-room'>
            <ModalConfirm 
                isOpen={isModalOpenEndRoom} 
                onRequestClose={closeConfirmModalEndRoom}
                onRequestConfirm={handleEndRoom}
                title="Encerrar sala"
                message="Tem certeza que você deseja encerrar esta sala?"
                confirmButtonText="Sim, Encerrar"
            />
            <ModalConfirm 
                isOpen={isModalOpenDeleteQuestion} 
                onRequestClose={closeConfirmModalDeleteQuestion}
                onRequestConfirm={() => handleDeleteQuestion(questionId)}
                title="Deletar pergunta"
                message="Tem certeza que você deseja deletar esta pergunta?"
                confirmButtonText="Sim, Deletar"
            />
            <Header>
                <RoomCode code={roomId} />
                <Button isOutlined onClick={openConfirmModalEndRoom} >Encerrar sala</Button>
            </Header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta{questions.length > 1 && "s"}</span>}
                </div>

                { questions.length > 0 ? (
                    <div className="question-list">
                        {questions.sort((a, b) => a.likeCount < b.likeCount ? 1 : -1).map(question => {
                            return (
                                <Question key={question.id} roomId={roomId} questionId={question.id} content={question.content} response={question.response} author={question.author} isAnswered={question.isAnswered} isHighlighted={question.isHighlighted} responsered={true}>
                                    
                                    { !question.isAnswered &&
                                        (
                                            <>
                                                <div>
                                                    { question.likeCount > 0 && (<><span>{question.likeCount}</span> <MdThumbUp /> </>)}
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleAnsweredQuestion(question.id, question.isAnswered)}
                                                    data-tip="Marcar pergunta como respondida"
                                                    >
                                                    {/* <img src={checkImg} alt="Marcar pergunta como respondida" /> */}
                                                    <MdCheck />
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleHighlightedQuestion(question.id, question.isHighlighted)}
                                                    data-tip="Destacar pergunta"
                                                    >
                                                    {/* <img src={MdModeComment} alt="Destacar pergunta" /> */}
                                                    <MdModeComment />
                                                </button>
                                            </>
                                        )
                                    }
                                    <button 
                                        type="button"
                                        onClick={() => {openConfirmModalDeleteQuestion(question.id)}}
                                        data-tip="Deletar pergunta"
                                        >
                                        {/* <img src={deleteImg} alt="Deletar pergunta" /> */}
                                        <MdDelete />
                                    </button>
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