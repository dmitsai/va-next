'use client';

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDatePicker from 'react-datepicker';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-datepicker/dist/react-datepicker.css';
import cn from 'classnames';
import styles from './DatePicker.module.scss';

type PickerMode = 'month' | 'year';

export interface DatePickerProps {
    value?: string;
    onChange: (_value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    mode?: PickerMode;
}

const parseValue = (value?: string, mode: PickerMode = 'month') => {
    if (!value) return null;

    if (mode === 'year') {
        const year = Number(value);
        if (!Number.isInteger(year) || year < 1000 || year > 9999) {
            return null;
        }
        return new Date(year, 0, 1);
    }

    const match = /^(\d{2})\/(\d{4})$/.exec(value);
    if (!match) return null;
    const month = Number(match[1]);
    const year = Number(match[2]);
    if (!Number.isInteger(month) || month < 1 || month > 12) return null;
    if (!Number.isInteger(year) || year < 1000 || year > 9999) return null;

    return new Date(year, month - 1, 1);
};

const formatValue = (
    date: Date | null | undefined,
    mode: PickerMode = 'month'
) => {
    if (!date) return '';
    const year = date.getFullYear().toString();

    if (mode === 'year') {
        return year;
    }

    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${month}/${year}`;
};

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    placeholder,
    disabled,
    className,
    mode = 'month',
}) => (
    <div className={styles.root}>
        <ReactDatePicker
            selected={parseValue(value, mode)}
            onChange={(date: Date | null | undefined) =>
                onChange(formatValue(date, mode))
            }
            dateFormat={mode === 'year' ? 'yyyy' : 'MM/yyyy'}
            showMonthYearPicker={mode === 'month'}
            showYearPicker={mode === 'year'}
            placeholderText={placeholder}
            disabled={disabled}
            className={cn(styles.input, className)}
            calendarClassName={styles.calendar}
            popperClassName={styles.popper}
            isClearable={!disabled}
            onChangeRaw={(e) => e?.preventDefault()}
        />
    </div>
);
