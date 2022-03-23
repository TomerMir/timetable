import React, { useState } from 'react';
import { DropdownList } from 'react-widgets'
import "react-widgets/dist/css/react-widgets.css";

const lessons = ["עברית","אנגלית","תוכנה","פיזיקה","ספרות","תנ״ך","מתמטיקה","היסטוריה","אזרחות","חלון", "חינוך","ספורט"] 

//Class for each table cell
export default function Cell(props){
    //If the table is in edit mode, return a cell that can be edited:
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
    //Else return a normal cell
    return(<div className ='cell'><p>{props.lessonName == "חלון" ? " " : props.lessonName}</p></div>)
}