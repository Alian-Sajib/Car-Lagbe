import React, { useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import '../css/body.css';

// const { RangePicker } = DatePicker;

const DateRangePicker = ({ onChange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (date && endDate && date.isAfter(endDate)) {
            setEndDate(null); // Reset end date if it’s before start date
        }
        triggerChange(date, endDate);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        triggerChange(startDate, date);
    };

    const triggerChange = (start, end) => {
        if (onChange) {
            onChange([start, end]);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '300px' }}>
            <DatePicker
                value={startDate}
                onChange={handleStartDateChange}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                placeholder="Start Date"
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
            />
            <DatePicker
                value={endDate}
                onChange={handleEndDateChange}
                disabledDate={(current) => current && (startDate !== null && current < startDate.startOf('day'))}
                placeholder="End Date"
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
            />
        </div>
    );
}

export default DateRangePicker;
