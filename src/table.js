import { Helmet } from 'react-helmet'
import Cell from './tableCell'
import React, { useState } from 'react';

function Table() {
    
  const [edit, setEdit] = useState(false)
  const [editOrSave, setEditOrSave] = useState("edit")
  const changeEdit = () => {
    setEdit(!edit)
    if (editOrSave == "edit") {
      setEditOrSave("save")
    }
    else{
      setEditOrSave("edit")
    }
  }
  return(
    <div>
      <Helmet>
        <title>Timetable</title>
      </Helmet>
      <Cell isEditable={edit} lessonName="מתמטיקה"/>
      <button onClick={changeEdit}>{editOrSave}</button>
    </div>
  )
}
export default Table;
