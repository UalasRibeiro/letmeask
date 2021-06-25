import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';

import { Button } from '../../components/Button';

import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
// import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';

import './style.scss';
import { database } from '../../services/firebase';

type RoomProsp = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomProsp>();
    const roomId = params.id;

    // const { user } = useAuth();
    const { title, questions } = useRoom(roomId);
    
    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({ closedAt: new Date(), });

        history.push('/');
    }

    async function handleAnsweredQuestion(questionId: string, bIsAnswered: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isAnswered: !bIsAnswered, });
    }

    async function handleHighlightedQuestion(questionId: string, bIsHighlighted: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isHighlighted: !bIsHighlighted, });
    }
    
    async function handleDeleteQuestion(questionId: string) {

        if(window.confirm("Tem certeza que deseja excluir essa pergunta?"))
        {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return (
        <div id='page-room'>
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom} >Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta{questions.length > 1 && "s"}</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question key={question.id} content={question.content} author={question.author} isAnswered={question.isAnswered} isHighlighted={question.isHighlighted}>
                                { !question.isAnswered &&
                                    (
                                        <>
                                            <button 
                                                type="button"
                                                onClick={() => handleAnsweredQuestion(question.id, question.isAnswered)}
                                                >
                                                <img src={checkImg} alt="Marcar pergunta como respondida" />
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => handleHighlightedQuestion(question.id, question.isHighlighted)}
                                                >
                                                <img src={answerImg} alt="Destacar pergunta" />
                                            </button>
                                        </>
                                    )
                                }
                                <button 
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                       <img src={deleteImg} alt="Deletar pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}