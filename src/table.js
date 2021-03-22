import { Helmet, renderStatic } from 'react-helmet'
import Cell from './tableCell'
import React, { Component } from 'react';
import api from './api'

class Table extends Component {

	constructor(props) {
		super(props);
		document.getElementsByTagName('html')[0].setAttribute("dir", "rtl");
		this.state = {
			edit: false,
		   	editOrSave : "edit",
			data : []
	   };  		
	}

	async componentDidMount() {
		const api_result = await api.FetchDataAuth('gettable')
  		if (api_result.data==false) {
  			//error while fething the api
  		}
 		if (api_result.data.status==false) {
  			//the api returned error
  		}
 		 this.setState({data : api_result.data.data})
	}
  
	changeEdit = () => {
      	this.setState({edit : !this.state.edit})
      	if (this.state.editOrSave == "edit") {
			this.setState({editOrSave : "save"})
    	}
    	else{
			this.setState({editOrSave : "edit"})
		}
	}
  render(){
	return(
		<div>
		  <Helmet>
			<title>Timetable</title>
		  </Helmet>
		  <table className="timetable">
				<tr>
					<td style={{border: "double 2px #eec130"}}>המערכת שלך</td>
					<td>ראשון</td>
					<td className="golden">שני</td>
					<td>שלישי</td>
					<td className="golden">רביעי</td>
					<td>חמישי</td>
					<td className="golden">שישי</td>
				</tr>
				<tr>
					<td>שיעור #1</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">08:20 → 07:45</td>
				</tr>
				<tr>
					<td>שיעור #2</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">09:00 → 08:20</td>
				</tr>
				<tr>
					<td>שיעור #3</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">10:05 → 09:30</td>
				</tr>
				<tr>
					<td>שיעור #4</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">10:45 → 10:05</td>
				</tr>
				<tr>
					<td>שיעור #5</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">11:55 → 11:15</td>
				</tr>
				<tr>
					<td>שיעור #6</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">12:30 → 11:55</td>
				</tr>
				<tr>
					<td>שיעור #7</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">13:55 → 13:15</td>
				</tr>
				<tr>
					<td>שיעור #8</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">14:30 → 13:55</td>
				</tr>
				<tr>
					<td>שיעור #9</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">15:20 → 14:45</td>
				</tr>
				<tr>
					<td>שיעור #10</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">16:00 → 15:20</td>
				</tr>
		  		<tr>
					<td>שיעור #11</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">16:55 → 16:15</td>
				</tr>
		  		<tr>
					<td>שיעור #12</td>
					{/* שיעורים */}
				</tr>
				<tr>
					<td className="time">17:30 → 16:55</td>
				</tr>
			</table>
		  <Cell isEditable={this.state.edit} lessonName="מתמטיקה"/>
		  <button onClick={this.changeEdit}>{this.state.editOrSave}</button>
		</div>
	  )
  }
}
export default Table;
