import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import toast from 'react-hot-toast';

import { FaDoorOpen, FaGoogle } from "react-icons/fa";

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import { database } from '../../services/firebase';

import './style.scss';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [ RoomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {

        if(!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        
        if(RoomCode.trim() === '') { return; }

        const roomRef = await database.ref(`rooms/${RoomCode}`).get();

        if(!roomRef.exists()) {
            toast.error('A sala informada não existe');
            return;
        }

        if(roomRef.val().closedAt) {
            toast.error("Esta sala já está fechada!");
            return;
        }

        history.push(`/rooms/${RoomCode}`);
    }

    return(
        <>
            <div id="page-auth">
                <aside>
                    <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                    <strong>Crie salas de Q&amp;A ao-vivo</strong>
                    <p>Tire as dúvidas de sua audiência em tempo real</p>
                </aside>
                <main>
                    <div className="main-content">
                        <img src={logoImg} alt="Letmeask" />
                        <button onClick={handleCreateRoom} className="create-room">
                            <FaGoogle />
                            Crie sua sala com o Google
                        </button>
                        <div className="separator">ou entre em uma sala</div>
                        <form onSubmit={handleJoinRoom}>
                            <input
                                type="text"
                                placeholder="Digite o código da sala"
                                onChange={event => setRoomCode(event.target.value)}
                            />
                            <Button type="submit">
                                <div>
                                    <FaDoorOpen />
                                    Entrar na sala
                                </div>
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    )
}