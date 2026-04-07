export const daysAgo = (date: Date | string): string => {
    const diff = Math.floor(
        (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return 'сегодня';
    if (diff === 1) return '1 день назад';
    if (diff < 5) return `${diff} дня назад`;
    return `${diff} дней назад`;
};

export const getSectionWord = (count: number): string => {
    if (count === 1) return 'секция';
    if (count < 5) return 'секции';
    return 'секций';
};

export const getScoreClassName = (score: number): string => {
    const baseClassName = 'text-base border ';
    if (score < 50) return `${baseClassName} text-red border-red/25 bg-red/15`;
    if (score < 70)
        return `${baseClassName} text-yellow border-yellow/25 bg-yellow/15`;
    if (score < 90) {
        return `${baseClassName} text-score-success-text border-score-success-border/25 bg-score-success-bg/15`;
    }
    return `${baseClassName} text-blue border-blue/25 bg-blue/15`;
};
