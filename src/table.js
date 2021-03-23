import { Helmet, renderStatic } from 'react-helmet'
import Cell from './tableCell'
import React, { Component } from 'react';
import api from './api'

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

		this.state = {
			edit: false,
		   	editOrSave : "edit",
			data : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			highlight : this.setHighlight(),
			lessons : {0:window, 1:hebrew, 2:english, 3:history, 4:ezrahut, 5:literature, 6:maths, 7:physics, 8:bible, 9:computer_science, 10:education},
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
	}

	async componentDidMount() {
		try {
			const api_result = await api.FetchDataAuth('api/gettable')
  			if (api_result.data==false) {
  				this.setState({error : "Can't connect to the server"})
				  return
  			}
 			if (api_result.data.status==false) {
				console.log("result.data.status = false")
				this.setState({error : "API Server refused"})
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
			let api_result = await api.PostDataAuth('api/changetable', {'Content-Type': 'application/json'}, {'data' : this.state.data})
			if (!api_result || !api_result.data.status) {
				this.setState({error : "Faild to commit to the database"})
			}
			this.setState({editOrSave : "edit"})
		}
	}

	valueChanged = (value, index) => {
		console.log("value = " + value +"  index = "+ index)
		let items = this.state.data
		items[index] = this.state.reverse_lessons[value]
		this.setState({data : items})
	}

	setHighlight = () => {
		let d = new Date();
		let day = d.getDay();
		let time = 100 * d.getHours() + d.getMinutes();
		if (day == 6) return -1;
		let row = 0;
		if (time >= 745 && time < 820) {
			row = 0;
		}
		else if (time >= 820 && time < 900) {
			row = 1;
		}
		else if (time >= 900 && time < 1005) {
			row = 2;
		}
		else if (time >= 1005 && time < 1045) {
			row = 3;
		}
		else if (time >= 1045 && time < 1155) {
			row = 4;
		}
		else if (time >= 1155 && time < 1230) {
			row = 5;
		}
		else if (time >= 1230 && time < 1355) {
			row = 6;
		}
		else if (time >= 1355 && time < 1430) {
			row = 7;
		}
		else if (time >= 1430 && time < 1520) {
			row = 8;
		}
		else if (time >= 1520 && time < 1600) {
			row = 9;
		}
		else if (time >= 1615 && time < 1655) {
			row = 10;
		}
		else if (time >= 1655 && time < 1730) {
			row = 11;
		}
		else return -1;
		return row+(day*12)
	}

  render(){
	return(
		<div style={{textAlign:"center"}}>
		  <Helmet>
			<title>Timetable</title>
		  </Helmet>
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
				<tr>
					<td className = 'side-height'>שיעור #1</td>
					<td className={this.state.highlight==0? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[0]]} changeValue={this.valueChanged} index={0} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==12? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[12]]} changeValue={this.valueChanged} index={12} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==24? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[24]]} changeValue={this.valueChanged} index={24} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==36? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[36]]} changeValue={this.valueChanged} index={36} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==48? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[48]]} changeValue={this.valueChanged} index={48} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==60? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[60]]} changeValue={this.valueChanged} index={60} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">08:20 → 07:45</td>
				</tr>
				<tr>
					<td className = 'side-height'>שיעור #2</td>
					<td className={this.state.highlight==1? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[1]]} changeValue={this.valueChanged} index={1} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==13? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[13]]} changeValue={this.valueChanged} index={13} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==25? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[25]]} changeValue={this.valueChanged} index={25} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==37? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[37]]} changeValue={this.valueChanged} index={37} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==49? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[49]]} changeValue={this.valueChanged} index={49} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==61? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[61]]} changeValue={this.valueChanged} index={61} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">09:00 → 08:20</td>
				</tr>
				<tr>
					<td className = 'side-height'> שיעור #3</td>
					<td className={this.state.highlight==2? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[2]]} changeValue={this.valueChanged} index={2} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==14? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[14]]} changeValue={this.valueChanged} index={14} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==26? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[26]]} changeValue={this.valueChanged} index={26} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==38? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[38]]} changeValue={this.valueChanged} index={38} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==50? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[50]]} changeValue={this.valueChanged} index={50} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==62? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[62]]} changeValue={this.valueChanged} index={62} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">10:05 → 09:30</td>
				</tr>
				<tr>
					<td className = 'side-height'>שיעור #4</td>
					<td className={this.state.highlight==3? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[3]]} changeValue={this.valueChanged} index={3} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==15? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[15]]} changeValue={this.valueChanged} index={15} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==27? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[27]]} changeValue={this.valueChanged} index={27} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==39? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[39]]} changeValue={this.valueChanged} index={39} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==51? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[51]]} changeValue={this.valueChanged} index={51} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==63? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[63]]} changeValue={this.valueChanged} index={63} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">10:45 → 10:05</td>
				</tr>
				<tr>
					<td className = 'side-height'>שיעור #5</td>
					<td className={this.state.highlight==4? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[4]]} changeValue={this.valueChanged} index={4} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==16? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[16]]} changeValue={this.valueChanged} index={16} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==28? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[28]]} changeValue={this.valueChanged} index={28} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==40? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[40]]} changeValue={this.valueChanged} index={40} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==52? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[52]]} changeValue={this.valueChanged} index={52} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==64? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[64]]} changeValue={this.valueChanged} index={64} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">11:55 → 11:15</td>
				</tr>
				<tr>
					<td className = 'side-height'>שיעור #6</td>
					<td className={this.state.highlight==5? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[5]]} changeValue={this.valueChanged} index={5} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==17? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[17]]} changeValue={this.valueChanged} index={17} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==29? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[29]]} changeValue={this.valueChanged} index={29} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==41? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[41]]} changeValue={this.valueChanged} index={41} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==53? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[53]]} changeValue={this.valueChanged} index={53} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==65? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[65]]} changeValue={this.valueChanged} index={65} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">12:30 → 11:55</td>
				</tr>
				<tr>
					<td className = 'side-height'>שיעור #7</td>
					<td className={this.state.highlight==6? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[6]]} changeValue={this.valueChanged} index={6} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==18? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[18]]} changeValue={this.valueChanged} index={18} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==30? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[30]]} changeValue={this.valueChanged} index={30} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==42? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[42]]} changeValue={this.valueChanged} index={42} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==54? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[54]]} changeValue={this.valueChanged} index={54} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==66? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[66]]} changeValue={this.valueChanged} index={66} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">13:55 → 13:15</td>
				</tr>
				<tr>
					<td className = 'side-height'>שיעור #8</td>
					<td className={this.state.highlight==7? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[7]]} changeValue={this.valueChanged} index={7} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==19? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[19]]} changeValue={this.valueChanged} index={19} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==31? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[31]]} changeValue={this.valueChanged} index={31} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==43? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[43]]} changeValue={this.valueChanged} index={43} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==55? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[55]]} changeValue={this.valueChanged} index={55} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==67? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[67]]} changeValue={this.valueChanged} index={67} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">14:30 → 13:55</td>
				</tr>
				<tr>
					<td className = 'side-height'>שיעור #9</td>
					<td className={this.state.highlight==8? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[8]]} changeValue={this.valueChanged} index={8} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==20? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[20]]} changeValue={this.valueChanged} index={20} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==32? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[32]]} changeValue={this.valueChanged} index={32} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==44? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[44]]} changeValue={this.valueChanged} index={44} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==56? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[56]]} changeValue={this.valueChanged} index={56} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==68? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[68]]} changeValue={this.valueChanged} index={68} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">15:20 → 14:45</td>
				</tr>
				<tr>
					<td className = 'side-height'>שיעור #10</td>
					<td className={this.state.highlight==9? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[9]]} changeValue={this.valueChanged} index={9} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==21? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[21]]} changeValue={this.valueChanged} index={21} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==33? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[33]]} changeValue={this.valueChanged} index={33} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==45? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[45]]} changeValue={this.valueChanged} index={45} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==57? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[57]]} changeValue={this.valueChanged} index={57} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==69? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[69]]} changeValue={this.valueChanged} index={69} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">16:00 → 15:20</td>
				</tr>
		  		<tr>
					<td className = 'side-height'>שיעור #11</td>
					<td className={this.state.highlight==10? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[10]]} changeValue={this.valueChanged} index={10} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==22? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[22]]} changeValue={this.valueChanged} index={22} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==34? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[34]]} changeValue={this.valueChanged} index={34} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==46? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[46]]} changeValue={this.valueChanged} index={46} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==58? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[58]]} changeValue={this.valueChanged} index={58} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==70? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[70]]} changeValue={this.valueChanged} index={70} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">16:55 → 16:15</td>
				</tr>
		  		<tr>
					<td className = 'side-height'>שיעור #12</td>
					<td className={this.state.highlight==11? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[11]]} changeValue={this.valueChanged} index={11} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==23? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[23]]} changeValue={this.valueChanged} index={23} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==35? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[35]]} changeValue={this.valueChanged} index={35} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==47? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[47]]} changeValue={this.valueChanged} index={47} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==59? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[59]]} changeValue={this.valueChanged} index={59} isEditable={this.state.edit}></Cell></td>
					<td className={this.state.highlight==71? "now" : "hour"} rowSpan="2"><Cell lessonName={this.state.lessons[this.state.data[71]]} changeValue={this.valueChanged} index={71} isEditable={this.state.edit}></Cell></td>
				</tr>
				<tr>
					<td className="time">17:30 → 16:55</td>
				</tr>
			</table>
		  <a onClick={this.changeEdit} className='button3'>{this.state.editOrSave}</a>
		  <h2 style={{color: 'red'}}>{this.state.error}</h2>
		</div>
	  )
  }
}
export default Table;
