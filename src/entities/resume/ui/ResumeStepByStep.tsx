import Link from 'next/link';
import { ReactComponent as IconFile } from '~/shared/assets/icons/icon-file.svg';

// TODO: add visialisation for step by step
export const ResumeStepByStep = () => (
    <Link
        href="/resume/builder/new"
        className="group flex h-full flex-col items-start gap-y-4 rounded-10 border-2 border-base bg-mantle px-5 py-4 transition-colors hover:border-mauve"
    >
        <div className="flex w-full items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-8 bg-mauve/10">
                <IconFile className="h-5 w-5 fill-mauve" />
            </div>
            <span className="rounded-full bg-mauve/10 px-2.5 py-1 text-10 font-600 text-mauve">
                ИИ-помощник
            </span>
        </div>
        <div className="flex flex-col gap-y-1">
            <p className="text-14 font-600 text-text transition-colors group-hover:text-mauve">
                Создать с нуля
            </p>
            <p className="text-12 text-sub">
                Пошаговый конструктор с подсказками ИИ. Помогает заполнить
                каждую секцию.
            </p>
        </div>
    </Link>
);
