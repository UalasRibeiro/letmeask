import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import './style.scss';
import { useState } from 'react';

type QuestionProps = {
    roomId: string;
    questionId: string;
    content: string;
    response?: string;
    author: {
        name: string,
        avatar: string;
    },
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
    responsered?: boolean;
}

export function Question({
    roomId,
    questionId,
    content, 
    response = '',
    author,
    children,
    isAnswered = false,
    isHighlighted = false,
    responsered = false
}: QuestionProps) {

    const [toggleResponse, setToggleResponse] = useState(true);

    function toggle() {
        setToggleResponse(!toggleResponse);
    }

    return (
        <div className={cx('question', {answered: isAnswered}, { highlighted: isHighlighted && !isAnswered })}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                { (responsered && !isAnswered) && <div className="question-reponse"><Link to={`/admin/rooms/response/${roomId}/${questionId}`}>responder</Link></div> }
                <>
                    { isAnswered && (
                        <a onClick={toggle}>exibir resposta</a>
                    )}
                </>
                <div className="question-children">{children}</div>
            </footer>
            
            <div className={cx('question-reponse', {toggle: toggleResponse})}>
                <div className="separator">resposta</div>
                <div className={'question-show-respose'}>
                    { response ? response : ('nenhuma resposta cadastrada') }
                </div>
            </div>
        </div>
    );
}