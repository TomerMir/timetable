import React, { useState } from 'react';
import Checkbox from "react-custom-checkbox";
import * as Icon from "react-icons/fi";

//Class that represents each user cell in the users table.
export default function UserCell(props){
    return(
        <tr>
            <td><h4>{props.username}</h4></td>
            <td><Checkbox checked={props.isAdmin}
                disabled={props.your_user == props.username}
                icon={
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            backgroundColor: "#174A41",
                            alignSelf: "stretch",
                        }}
                    >
                        <Icon.FiCheck color="white" size={30} />
                    </div>
                }
                onChange={(value) => {props.adminChange(props.username)}}
                borderColor="#174A41"
                borderRadius={30}
                style={{ overflow: "hidden" }}
                size={30}/></td>
            <td><a className="deleteAccount" style={props.your_user == props.username ? {pointerEvents : "none", cursor : "no-drop"} : null} onClick={() => props.deleteUser(props.username)}>Delete</a></td>
        </tr>
    )
}