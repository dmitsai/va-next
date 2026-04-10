import { redirect } from 'next/navigation';
import { getServerSession } from '~/shared/lib/auth';
import { PdfImportForm } from './PdfImportForm';

export default async () => {
    const session = await getServerSession();

    if (session?.user.role !== 'USER') {
        redirect('/user/login');
    }

    return (
        <main className="flex w-full flex-grow flex-col items-center justify-center px-20 py-10">
            <div className="w-full max-w-xl">
                <div className="mb-8">
                    <a
                        href="/resume"
                        className="mb-6 inline-flex items-center gap-2 text-14 text-sub transition-colors hover:text-text"
                    >
                        ← Назад к резюме
                    </a>
                    <h1 className="mt-4 text-28 font-700 text-text">
                        Импорт резюме из PDF
                    </h1>
                    <p className="mt-2 text-14 text-sub">
                        Загрузите PDF — мы извлечём текст и создадим черновик,
                        который вы заполните вручную.
                    </p>
                </div>
                <PdfImportForm />
            </div>
        </main>
    );
};
