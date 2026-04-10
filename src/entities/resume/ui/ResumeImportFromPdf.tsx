import Link from 'next/link';
import { ReactComponent as IconPlus } from '~/shared/assets/icons/icon-plus.svg';

export const ResumeImportFromPdf = () => (
    <Link
        href="/resume/import"
        className="group flex h-full flex-col items-start gap-y-4 rounded-10 border-2 border-base bg-mantle px-5 py-4 transition-colors hover:border-teal"
    >
        <div className="flex w-full items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-8 bg-teal/10">
                <IconPlus className="h-5 w-5 fill-teal" />
            </div>
            <span className="rounded-full bg-teal/10 px-2.5 py-1 text-10 font-600 text-teal">
                Авто-заполнение
            </span>
        </div>
        <div className="flex flex-col gap-y-1">
            <p className="text-14 font-600 text-text transition-colors group-hover:text-teal">
                Импорт из PDF
            </p>
            <p className="text-12 text-sub">Загрузите готовое резюме</p>
        </div>
    </Link>
);
