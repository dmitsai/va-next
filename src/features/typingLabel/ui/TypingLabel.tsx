'use client';

import { useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Typed from 'typed.js';


const createStyledString = (text: string, className: string) => (`<span class="${className}">${text}</span>`);


export const TypingLabel = () => {
    const el = useRef(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const typed = new Typed(el.current, {
            strings: [
                createStyledString('Работа ', 'text-text') + createStyledString('близко.', 'text-mauve') +
                createStyledString(' Вакансии ', 'text-text') + createStyledString('рядом', 'text-green') +
                createStyledString(', результат - ', 'text-text') + createStyledString('сегодня!', 'text-green'),
            ],
            typeSpeed: 50,
            backSpeed: 25,
            loop: true,
            contentType: 'html',
            cursorChar: '|',
            showCursor: true,
            autoInsertCss: false,
        });

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            typed.destroy();
        };
    }, []);

    return (
        <div className={'w-full text-48 font-800 text-text'}>
            <span ref={el} />
        </div>
    );
};
