import React, { useState } from 'react';
import { DropdownList } from 'react-widgets'
import "react-widgets/dist/css/react-widgets.css";

const lessons = ["עברית","אנגלית","תוכנה","פיזיקה","ספרות","תנ״ך","מתמטיקה","היסטוריה","אזרחות", "חלון"]

export default function Cell(props){
    if (props.isEditable) {
        return (
            <div>
                <DropdownList
                    onChange={value => props.changeValue(value, props.index)}
                    defaultValue={props.lessonName}
                    data={lessons}
                />
            </div>       
        )
    } 
    return(<div className ='cell'><p>{props.lessonName == "חלון" ? " " : props.lessonName}</p></div>)
}