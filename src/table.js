import { Helmet, renderStatic } from 'react-helmet'
import Cell from './tableCell'
import React, { Component } from 'react';
import api from './api'
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';



//Class of the timetable
class Table extends Component {

	constructor(props) {
		super(props);
		document.getElementsByTagName('html')[0].setAttribute("dir", "rtl")
		//Names of the lessons
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
			edit: false, //Variable that says if the table is in edit mode

		   	editOrSave : "edit", //The text thta is displayed on the "edit" button

			data : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //Data that represents each lesson in the table

			highlight : this.setHighlight(), //The current lesson cell to highlight

			lessons : {0:window, 1:hebrew, 2:english, 3:history, 4:ezrahut, 5:literature, 6:maths, 
				7:physics, 8:bible, 9:computer_science, 10:education, 11:sports}, //Dictionary that converts each lesson's name to it's numerical representation.
				//In the database, the lessons are saved in their numerical representation.

			reverse_lessons : {}, //Dictionary to convert each lesson's numerical representation to it's name

			error : "", //The error that is displayed on the screen

			changedCells : [] //The cells that have changed, to send to the api
	   };  
	   //Initialize the dictionary
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


	//Function that is called after the window is loaded.
	async componentDidMount() {
		try {

			//Gets the table from the api
			const api_result = await api.FetchDataAuth('api/gettable')

            //If there was an error while fetching the data, logout
  			if (api_result.data==false) {
				this.logout()
  			}

            //If the server status if false:
 			if (api_result.data.status==false) {
				this.setState({error : api_result.data.err})
				return
  			}

			//Set the data state
 		 	this.setState({data : api_result.data.data})
		} 
		catch (error) {
			this.setState({error : "Unexpected error occured"})
		}
	}
	

	//Function that called when the "edit" or "save" button is clicked.
	changeEdit =  async() => {
		//Swap the edit table mode
      	this.setState({edit : !this.state.edit})
		
		//Remove any shown errors
		this.setState({error : ""})

		//If the user clicked edit button
      	if (this.state.editOrSave == "edit") {
			//Change the button's text to "save"
			this.setState({editOrSave : "save"})
    	}
    	else{
			//Change the button's text to "edit"
			this.setState({editOrSave : "edit"})

			//Checks wich data is changed and need to be sent to the api.
			let data_to_send = []
			for (let i = 0; i < this.state.changedCells.length; i++) {
				const element = this.state.changedCells[i];
				const index = parseInt(Object.keys(element)[0])
				data_to_send.push([index, this.state.data[index]])
			}

			//Sends the changed cells new values to the api and resets the changedCells list.
			let api_result = await api.PostDataAuth('api/changetable', {'Content-Type': 'application/json'}, {'data' : data_to_send})
			this.setState({changedCells : []})

			//If there was an error:
			if (!api_result || !api_result.data.status) {
				this.setState({error : "Faild to commit to the database"})
				window.location.reload()
			}
		}
	}
	//Log out 
    logout = () => {
        //Delets the token and the expiration date from the local storage
		localStorage.clear()
        //Redirects to login page
		this.props.history.push('/login')
	}

	//Called when a value of a cell is changed, and changes the array of changed cells.
	//index -> the index of the canged cell
	//value -> the new value of the changed cell
	valueChanged = (value, index) => {

		var flag = false;
		//Loops over the current changed cells.
		for (let i = 0; i < this.state.changedCells.length; i++) {
			//If the cell was already changed but hasn't been sent to the api and it was changed again,
			//so it removes him from the list and exits the loop.
			if (this.state.changedCells[i][index] == this.state.reverse_lessons[value]) {
				this.state.changedCells.splice(i, 1)
				flag = true;
				break;
			}
			//If the user had clicked on the same value that the lesson had before.
			if (Object.keys(this.state.changedCells[i])[0] == index) {
				flag = true;
				break;
			}
		}
		//If the cell actually changed, insert it to the list.
		if (!flag) {
			this.state.changedCells.push({[index]: this.state.data[index]})
		}
		//Change the actual cell's value.
		let items = this.state.data
		items[index] = this.state.reverse_lessons[value]
		this.setState({data : items})

	}

	//Checks if the user is an admin with his token.
	isAdmin = () => {
		const tokenString = localStorage.getItem('token');
		if (!tokenString) {
            return false;
        }
		const userToken = JSON.parse(tokenString);
		const decodedToken = jwt_decode(userToken);
		return decodedToken["admin"];
	}

	//Function that reutrns the index in the table of the cell.
	//that represents the curren hour.
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

	//Returns the cell for each hour.
	//num -> the index of the cell in the data array.
	getHourCell = (num) => {
		return(<td className={this.state.highlight==num? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[num]]} changeValue={this.valueChanged} index={num} isEditable={this.state.edit}></Cell></td>)
	}

	//Return a table row for each hour.
	//lessonNum -> the hour to create the row for.
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

	//Renders the page and displays the whole table.
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
