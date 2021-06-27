import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { FaPlus } from 'react-icons/fa';

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import { database } from '../../services/firebase';

import './style.scss';

export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if(newRoom.trim() === '') { return; }

        const roomRef = database.ref('rooms');

        await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        }).then((data) =>{
            toast.success(`A sala ${newRoom} foi criada com sucesso!`);
            history.push(`/admin/rooms/${data.key}`);
        }).catch((error) => {
            toast.error(error);
        })
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas de sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit" disabled={!user}>
                            <div>
                                <FaPlus />
                                Criar sala
                            </div>
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}