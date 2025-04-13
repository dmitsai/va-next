export const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const today = new Date();

    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (dateWithoutTime.getTime() === todayWithoutTime.getTime()) {
        return "Сегодня";
    }

    const yesterday = new Date(todayWithoutTime);

    yesterday.setDate(yesterday.getDate() - 1);


    if (dateWithoutTime.getTime() === yesterday.getTime()) {
        return "Вчера";
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}