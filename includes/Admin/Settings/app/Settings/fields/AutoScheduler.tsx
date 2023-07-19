import React, { useState,useEffect } from 'react'
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { generateTimeOptions } from '../helper/helper';
import Select from 'react-select';
import { Toggle, useBuilderContext } from 'quickbuilder';
import { selectStyles } from '../helper/styles';

const AutoScheduler = (props) => {
    let { name, multiple, onChange } = props;
    const builderContext = useBuilderContext();
    const modifiedDayDataFormet = [];
    const weeks = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    weeks.forEach(day => {
      const obj = builderContext.values['manage_schedule']?.[name]?.find(item => item[`${day}_post_limit`]);
      if (obj) {
        modifiedDayDataFormet.push({
          day: day,
          value: obj[`${day}_post_limit`]
        });
      }
    });
    let getStartTime = builderContext.values['manage_schedule']?.[name]?.find( (item) => item['start_time'] );
    getStartTime = getStartTime ? getStartTime['start_time'] : '';
    let getEndTime = builderContext.values['manage_schedule']?.[name]?.find( (item) => item['end_time'] );
    let getAutoSchedulerStatus = builderContext.values['manage_schedule']?.[name]?.find( (item) => item['is_active_status'] );
    getEndTime = getEndTime ? getEndTime['end_time'] : '';
    const startTimeFormat = { label : getStartTime, value : getStartTime };
    const endTimeFormat = { label : getEndTime, value : getEndTime };
    
    const [autoScheduler,setAutoSchedulerValue] = useState(modifiedDayDataFormet ?? []);
    const [startSelectedTime, setStartSelectedTime] = useState(startTimeFormat);
    const [endSelectedTime, setEndSelectedTime] = useState(endTimeFormat);
    const [autoSchedulerStatus, setautoSchedulerStatus] = useState(getAutoSchedulerStatus ?? null)

    const timeOptions = generateTimeOptions();

    const handleDayChange = (day, event) => {
        setAutoSchedulerValue((prevWeeks) => {
            const existingWeekIndex = prevWeeks.findIndex((item) => item.day === day);
            if (existingWeekIndex !== -1) {
              const updatedWeeks = [...prevWeeks];
              updatedWeeks[existingWeekIndex].value = event.target.value;
              return updatedWeeks;
            } else {
              return [
                ...prevWeeks,
                {
                  day: day,
                  value: event.target.value,
                },
              ];
            }
        });
    }

    const handleTimeChange = (type,event) => {
        
        if( type === 'start' ) {
            setStartSelectedTime(event);
        }else{
            setEndSelectedTime(event);
        }
    }

    useEffect(() => {
        let autoSchedulerObj = autoScheduler?.map( (item) => {
            let property_name = item?.day+'_post_limit';
            return { [property_name] : item?.value }
        } )
        autoSchedulerObj.push( { start_time : startSelectedTime?.value }  );
        autoSchedulerObj.push( { end_time : endSelectedTime?.value }  );
        autoSchedulerObj.push( { is_active_status : autoSchedulerStatus }  );
		onChange({
			target: {
				type: "auto-scheduler",
				name:["manage_schedule",name],
				value: autoSchedulerObj,
				multiple,
			},
		});
	}, [autoScheduler,startSelectedTime,endSelectedTime, autoSchedulerStatus]);
    
    const handleAutoScheduleStatusToogle = (event) => {
        setautoSchedulerStatus(event.target.checked)
    }
    
    return (
        <div className={classNames('wprf-control', 'wprf-auto-scheduler', `wprf-${props.name}-auto-scheduler`, props?.classes)}>
            <div className="header">
                <Toggle name="is_active_status" id="auto_is_active_status" label="Auto Scheduler" description="To configure the Auto Scheduler Settings, check out this Doc" value={autoSchedulerStatus} onChange={handleAutoScheduleStatusToogle}  />
            </div>
            <div className="content">
                <div className="start-time set-timing">
                    <div className="time-title">
                        <h4>{ __('Start Time','wp-scheduled-posts') }</h4>
                        <span>{ __('Default','wp-scheduled-posts') } : { startSelectedTime?.label }</span>
                    </div>
                    <div className="time">
                        <Select
                            styles={selectStyles}
                            value={startSelectedTime}
                            options={ timeOptions }
                            onChange={ (event) => handleTimeChange('start',event) }
                            className='select-start-time main-select'
                        />
                    </div>
                </div>
                <div className="end-time set-timing">
                    <div className="time-title">
                        <h4>{ __('End Time','wp-scheduled-posts') }</h4>
                        <span>{ __('Default','wp-scheduled-posts') } : {endSelectedTime?.label}</span>
                    </div>
                    <div className="time">
                        <Select
                            styles={selectStyles}
                            value={endSelectedTime}
                            options={ timeOptions }
                            onChange={ (event) => handleTimeChange('end',event) }
                            className='select-start-time main-select'
                        />
                    </div>
                </div>
            </div>
            <div className="weeks">
                {
                    weeks.map( (day,index) => (
                        <div key={index} className="week">
                            <input 
                                type="number" 
                                defaultValue={0}
                                value={ autoScheduler?.find(item => item.day === day)?.value } 
                                onChange={ (event) => handleDayChange( day, event ) } 
                            />
                            <span>{ __('Number of posts','wp-scheduled-posts') }</span>
                            <h6>{ day.toUpperCase() }</h6>
                        </div>
                    ) )
                }
            </div>
      </div>
    )
}

export default AutoScheduler;