import { Tags } from '~/shared/api/model/tags/type';

export const getTagArrayWithColors = (
    tags: Tags | null
): Array<{ name: string; color: string }> => {
    if (!tags) return [];

    type TagGroup = {
        items: string[];
        color: string;
    };

    const tagGroups: TagGroup[] = [
        {
            items: (tags.workSchedule?.filter(Boolean) as string[]) ?? [],
            color: 'green',
        },
        {
            items: (tags.employmentTypes?.filter(Boolean) as string[]) ?? [],
            color: 'peach',
        },
        {
            items: (tags.education?.filter(Boolean) as string[]) ?? [],
            color: 'pink',
        },
        {
            items: (tags.experience?.filter(Boolean) as string[]) ?? [],
            color: 'sapphire',
        },
    ].filter((group) => group.items.length > 0);

    const result: Array<{ name: string; color: string }> = [];

    const maxLength = Math.max(
        0,
        ...tagGroups.map((group) => group.items.length)
    );

    for (let i = 0; i < maxLength; i++) {
        tagGroups.forEach((group) => {
            const item = group.items[i];
            if (item) {
                result.push({
                    name: item,
                    color: group.color,
                });
            }
        });
    }

    return result;
};
