import React, { Component } from 'react';
import { Helmet, renderStatic } from 'react-helmet'
import api from './api'
import UserCell from './adminPanelRow';
import jwt_decode from 'jwt-decode';



class AdminPanel extends Component {
    constructor(props){
        super(props)
        if (!this.isAdmin()) {
            this.props.history.push('/')
        }
        document.getElementsByTagName('html')[0].setAttribute("dir", "ltr")
        this.state = {
            data : [],
            error: "",
            myUser : ""
        }
    }
    async componentDidMount() {
		try {
			const api_result = await api.FetchDataAuth('api/getusers')
  			if (api_result.data==false) {
  				this.logout()
  			}
 			if (api_result.data.status==false) {
				this.setState({error : api_result.data.err})
				return
  			}
 		 	this.setState({data : api_result.data.data})
            this.setState({myUser : api_result.data.your_user})
            console.log(this.state.data)
            console.log(this.state.data[0][0])
            console.log(this.state.data[1])

		} 
		catch (error) {
			this.setState({error : "Unexpected error occured " + error})
		}
	}

    logout = () => {
		localStorage.clear()
		this.props.history.push('/login')
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

    adminChange =  async(username) => {
        try {
            const api_result = await api.PostDataAuth("api/changeadmin", {'Content-Type': 'application/json'}, {'username' : username})
            if (api_result.data == false) {
                this.logout()
            }
            if (api_result.data.status==false) {
				this.setState({error : api_result.data.err})
				return
  			} 
        }
        catch (error) {
            this.setState({error : "Unexpected error occured " + error})
        }
    }

    delete_user = async(username) => {
        try {
            const api_result = await api.PostDataAuth("api/deleteuser", {'Content-Type': 'application/json'}, {'username' : username})
            if (api_result.data == false) {
                this.logout()
            }
            if (api_result.data.status==false) {
				this.setState({error : api_result.data.err})
				return
  			}
            window.location.reload()
        }
        catch (error) {
            this.setState({error : "Unexpected error occured " + error})
        }
    }

    createTable = () => {
        return (
            <table className="admintable">
                <thead>
                    <tr>
                        <td style={{width : "100px"}}><h3>User</h3></td>
                        <td style={{width : "33%"}}><h3>Admin</h3></td>
                        <td style={{width : "33%"}}><h3>Delete</h3></td>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map((user) => {
                        return <UserCell username={user[0]} your_user={this.state.myUser} isAdmin={user[1] == 1} adminChange={this.adminChange} deleteUser={this.delete_user}></UserCell>
                    })}
                </tbody>
            </table>
        )
        
    }
///<UserCell username={"tomer"} your_user={this.state.myUser} isAdmin={true} adminChange={this.adminChange} deleteUser={this.delete_user}></UserCell>
///<UserCell username={"tomermir"} your_user={this.state.myUser} isAdmin={true} adminChange={this.adminChange} deleteUser={this.delete_user}></UserCell>

///<h2>{this.state.error}</h2>

    render(){
        return(
            <div>
                <Helmet>
			        <title>Admin</title>
		        </Helmet>
                <a onClick={this.logout} className='logout'>Logout</a>
		        <a onClick={() => this.props.history.push('/')} className='toAdminPage'>Timetable</a>
                <div className="alignCenter">
                    {this.createTable()}
                    <h3 style={{color: 'red'}}>{this.state.error}</h3>
                </div>
            </div>
            
            
        )
    }
}

export default AdminPanel;

