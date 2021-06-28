import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { MdChevronLeft, MdSend } from 'react-icons/md';
import { useHistory, useParams } from 'react-router-dom';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Question } from '../../components/Question';

import { useAuth } from '../../hooks/useAuth';
import { useQuestion } from '../../hooks/useQuestion';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import './style.scss';

type ResponseQuestionProsp = {
    roomId: string;
    questionId: string;
}
export function ResponseQuestion() {
    const params = useParams<ResponseQuestionProsp>();
    const history = useHistory();
    const roomId = params.roomId;
    const questionId = params.questionId;
    const { content, response, author } = useQuestion(roomId, questionId);

    const { user } = useAuth();
    const { title } = useRoom(roomId);

    const [newQuestionResponse, setNewQuestionResponse] = useState(response);
    
    function backRoom() {
        history.push(`/admin/rooms/${roomId}`);
    }

    async function handleSendQuestionResponse(event: FormEvent) {
        event.preventDefault();

        if(newQuestionResponse.trim() === '') { return; }

        const QuestionResponseRef = database.ref(`rooms/${roomId}/questions/${questionId}`);

        await QuestionResponseRef.update({
            response: newQuestionResponse,
        }).then((data) =>{
            toast.success(`A resposta foi salva com sucesso!`);
        }).catch((error) => {
            toast.error(error);
        })
    }

    return(
        <div id="page-response">
            <Header>
                <Button onClick={backRoom}>
                    <MdChevronLeft />
                    voltar
                </Button>
            </Header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                </div>
                <div className="question-list">
                    <Question roomId={roomId} questionId={questionId} content={content} author={author} />
                </div>
                
                <form onSubmit={handleSendQuestionResponse}>
                    <textarea 
                        placeholder="Escreva sua resposta aqui"
                        onChange={event => setNewQuestionResponse(event.target.value)}
                        value={newQuestionResponse ? newQuestionResponse : response}
                    />

                    <div className="form-footer">
                        <span>*Ao enviar a sua resposta, você poderá editá-la até marcar como respondido</span>
                        <Button type="submit" disabled={!user}><MdSend /> Enviar resposta</Button>
                    </div>
                </form>

            </main>
        </div>
    );
}