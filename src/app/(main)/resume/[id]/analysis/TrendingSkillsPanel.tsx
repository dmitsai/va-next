'use client';

import { useState } from 'react';
import cn from 'classnames';
import { clientApi } from 'trpc/client';
import { useRouter } from 'next/navigation';

interface TrendingSkill {
    name: string;
    count: number;
    inResume: boolean;
}

interface TrendingSkillsPanelProps {
    skills: TrendingSkill[];
    resumeId: string;
    currentHardSkills: string[];
    currentSoftSkills: string[];
}

export const TrendingSkillsPanel = ({
    skills,
    resumeId,
    currentHardSkills,
    currentSoftSkills,
}: TrendingSkillsPanelProps) => {
    const router = useRouter();
    const [localAdded, setLocalAdded] = useState<Set<string>>(new Set());

    const { mutate: updateSection, isPending } =
        clientApi.resume.updateSection.useMutation({
            onSuccess: () => router.refresh(),
        });

    const handleAddSkill = (skillName: string) => {
        if (localAdded.has(skillName) || isPending) return;
        const nextHard = [
            ...currentHardSkills,
            ...Array.from(localAdded),
            skillName,
        ];
        updateSection({
            resume_id: resumeId,
            type: 'SKILLS',
            content: { hard: nextHard, soft: currentSoftSkills },
        });
        setLocalAdded((prev) => new Set([...prev, skillName]));
    };

    if (skills.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
                const isPresent = skill.inResume || localAdded.has(skill.name);
                return (
                    <button
                        key={skill.name}
                        type="button"
                        disabled={isPresent || isPending}
                        onClick={() => handleAddSkill(skill.name)}
                        className={cn(
                            'rounded-full border px-3 py-1 text-12 font-500 transition-all',
                            isPresent
                                ? 'cursor-default border-mauve/30 bg-mauve/15 text-mauve'
                                : 'cursor-pointer border-surface/50 bg-transparent text-sub hover:border-mauve/40 hover:text-text disabled:opacity-50'
                        )}
                    >
                        {isPresent ? skill.name : `+ ${skill.name}`}
                    </button>
                );
            })}
        </div>
    );
};
