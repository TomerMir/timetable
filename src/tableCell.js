import React, { useState } from 'react';
import { DropdownList } from 'react-widgets'
import "react-widgets/dist/css/react-widgets.css";

const lessons = ["עברית","אנגלית","תוכנה","פיזיקה","ספרות","תנך","מתמטיקה","היסטוריה","אזרחות", "חלון"]

export default function Cell(props){
    if (props.isEditable) {
        let widget = (
            <div style={{width: 100}}>
                <DropdownList
                    //onChange={value => alert(value)}
                    defaultValue={props.lessonName.toString()}
                    data={lessons}
                />
            </div>
            
        )    
        return widget  
    } 
    return(<div><h2>{props.lessonName}</h2></div>)
}