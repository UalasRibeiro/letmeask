import toast from 'react-hot-toast';

import { FaRegClone } from 'react-icons/fa';

import './style.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {

    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
        
        toast.success("copiado!");
    }

    return(
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <FaRegClone />
            </div>
            <span>Sala {props.code}</span>
        </button>
    );
}