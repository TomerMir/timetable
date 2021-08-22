import { Helmet, renderStatic } from 'react-helmet'
import Cell from './tableCell'
import React, { Component } from 'react';
import api from './api'
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';




class Table extends Component {

	constructor(props) {
		super(props);
		document.getElementsByTagName('html')[0].setAttribute("dir", "rtl")

		const hebrew = "עברית"
		const english = "אנגלית"
		const history = "היסטוריה"
		const ezrahut = "אזרחות"
		const literature = "ספרות"
		const maths = "מתמטיקה"
		const physics = "פיזיקה"
		const window = "חלון"
		const bible = "תנ״ך"
		const computer_science = "תוכנה"
		const education = "חינוך"
		const sports = "ספורט"

		this.state = {
			edit: false,
		   	editOrSave : "edit",
			data : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			highlight : this.setHighlight(),
			lessons : {0:window, 1:hebrew, 2:english, 3:history, 4:ezrahut, 5:literature, 6:maths, 7:physics, 8:bible, 9:computer_science, 10:education, 11:sports},
			reverse_lessons : {},
			error : ""
	   };  
	   this.state.reverse_lessons[window] = 0
	   this.state.reverse_lessons[hebrew] = 1
	   this.state.reverse_lessons[english] = 2
	   this.state.reverse_lessons[history] = 3
	   this.state.reverse_lessons[ezrahut] = 4
	   this.state.reverse_lessons[literature] = 5
	   this.state.reverse_lessons[maths] = 6
	   this.state.reverse_lessons[physics] = 7
	   this.state.reverse_lessons[bible] = 8
	   this.state.reverse_lessons[computer_science] = 9
	   this.state.reverse_lessons[education] = 10
	   this.state.reverse_lessons[sports] = 11
	}

	async componentDidMount() {
		try {
			const api_result = await api.FetchDataAuth('api/gettable')
  			if (api_result.data==false) {
				this.logout()
  			}
 			if (api_result.data.status==false) {
				console.log("result.data.status = false")
				this.setState({error : api_result.data.err})
				return
  			}
 		 	this.setState({data : api_result.data.data})
		} 
		catch (error) {
			this.setState({error : "Unexpected error occured"})
		}
	}
  
	changeEdit =  async() => {
      	this.setState({edit : !this.state.edit})
		this.setState({error : ""})
      	if (this.state.editOrSave == "edit") {
			this.setState({editOrSave : "save"})
    	}
    	else{
			this.setState({editOrSave : "edit"})
			let api_result = await api.PostDataAuth('api/changetable', {'Content-Type': 'application/json'}, {'data' : this.state.data})
			if (!api_result || !api_result.data.status) {
				this.setState({error : "Faild to commit to the database"})
				window.location.reload()
			}
		}
	}

	logout = () => {
		localStorage.clear()
		this.props.history.push('/login')
	}

	valueChanged = (value, index) => {
		console.log("value = " + value +"  index = "+ index)
		let items = this.state.data
		items[index] = this.state.reverse_lessons[value]
		this.setState({data : items})
	}

	isAdmin = () => {
		const tokenString = localStorage.getItem('token');
		if (!tokenString) {
            return false;
        }
		const userToken = JSON.parse(tokenString);
		const decodedToken = jwt_decode(userToken);
		return decodedToken["admin"];
	}

	setHighlight = () => {
		let d = new Date();
		let day = d.getDay();
		let time = 100 * d.getHours() + d.getMinutes();
		if (day == 6) return -1;
		let row = 0;
		if (time >= 745 && time < 830) {
			row = 0;
		}
		else if (time >= 830 && time < 915) {
			row = 1;
		}
		else if (time >= 915 && time < 1015) {
			row = 2;
		}
		else if (time >= 1015 && time < 1100) {
			row = 3;
		}
		else if (time >= 1100 && time < 1200) {
			row = 4;
		}
		else if (time >= 1200 && time < 1245) {
			row = 5;
		}
		else if (time >= 1245 && time < 1355) {
			row = 6;
		}
		else if (time >= 1355 && time < 1440) {
			row = 7;
		}
		else if (time >= 1440 && time < 1530) {
			row = 8;
		}
		else if (time >= 1530 && time < 1615) {
			row = 9;
		}
		else if (time >= 1615 && time < 1700) {
			row = 10;
		}
		else if (time >= 1700 && time < 1745) {
			row = 11;
		}
		else return -1;
		return row+(day*12)
	}

	getHourCell = (num) => {
		return(<td className={this.state.highlight==num? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[num]]} changeValue={this.valueChanged} index={num} isEditable={this.state.edit}></Cell></td>)
	}
	getHours = (lessonNum) =>{
		const rows = []
		for (let i = lessonNum-1; i < lessonNum+60; i+=12) {
			rows.push(this.getHourCell(i))
		}
		return(
		<tr>
			<td className = 'side-height'>שיעור #{lessonNum}</td>
			{rows}
		</tr>)
	}

	render(){
		var adminButton = <a onClick={() => this.props.history.push('/admin')} className='toAdminPage'>Admin</a>
		if (!this.isAdmin()) {
			adminButton = null;
		}
		return(
			<div style={{textAlign:"center"}}>
			<Helmet>
				<title>Timetable</title>
			</Helmet>
			<a onClick={this.logout} className='logout'>Logout</a>
			{adminButton}
			<table className="timetable">
					<tr>
						<td style={{border: "double 2px #eec130"}}>המערכת שלך</td>
						<td className="head-width">ראשון</td>
						<td className="golden">שני</td>
						<td className="head-width">שלישי</td>
						<td className="golden">רביעי</td>
						<td className="head-width">חמישי</td>
						<td className="golden">שישי</td>
					</tr>
					{this.getHours(1)}
					<tr>
						<td className="time">08:30 → 07:45</td>
					</tr>
					{this.getHours(2)}
					<tr>
						<td className="time">09:15 → 08:30</td>
					</tr>
					{this.getHours(3)}
					<tr>
						<td className="time">10:15 → 09:30</td>
					</tr>
					{this.getHours(4)}
					<tr>
						<td className="time">11:00 → 10:15</td>
					</tr>
					{this.getHours(5)}
					<tr>
						<td className="time">12:00 → 11:15</td>
					</tr>
					{this.getHours(6)}
					<tr>
						<td className="time">12:45 → 12:00</td>
					</tr>
					{this.getHours(7)}
					<tr>
						<td className="time">13:55 → 13:10</td>
					</tr>
					{this.getHours(8)}
					<tr>
						<td className="time">14:40 → 13:55</td>
					</tr>
					{this.getHours(9)}
					<tr>
						<td className="time">15:30 → 14:45</td>
					</tr>
					{this.getHours(10)}
					<tr>
						<td className="time">16:15 → 15:30</td>
					</tr>
					{this.getHours(11)}
					<tr>
						<td className="time">17:00 → 16:15</td>
					</tr>
					{this.getHours(12)}
					<tr>
						<td className="time">17:45 → 17:00</td>
					</tr>
				</table>
			<a onClick={this.changeEdit} className='editOrSave'>{this.state.editOrSave}</a>
			<h2 style={{color: 'red'}}>{this.state.error}</h2>
			</div>
		)
	}
}
export default withRouter(Table);
