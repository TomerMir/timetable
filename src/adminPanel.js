import React, { Component } from 'react';
import { Helmet, renderStatic } from 'react-helmet'
import api from './api'
import UserCell from './adminPanelRow';
import jwt_decode from 'jwt-decode';


//The admin panel
class AdminPanel extends Component {
    
    constructor(props){
        super(props)
        
        //If the user is not an admin, reutrn him to the main page.
        if (!this.isAdmin()) {
            this.props.history.push('/')
        }
        document.getElementsByTagName('html')[0].setAttribute("dir", "ltr")
        this.state = {
            data : [], //Data that recived from the api
            error: "", //The error to display
            myUser : "" //The user's username
        }
    }

    //Function that is called after the window is loaded.
    async componentDidMount() {

		try {
            //Gets the users from the api
			const api_result = await api.FetchDataAuth('api/getusers')

            //If there was an error while fetching the data, logout
  			if (api_result.data==false) {
  				this.logout()
  			}

            //If the server status if false:
 			if (api_result.data.status==false) {
				this.setState({error : api_result.data.err})
				return
  			}
            //Sets the data
 		 	this.setState({data : api_result.data.data})
            this.setState({myUser : api_result.data.your_user})
		} 
		catch (error) {
			this.setState({error : "Unexpected error occured " + error})
		}
	}

    //Log out 
    logout = () => {
        //Delets the token and the expiration date from the local storage
		localStorage.clear()
        //Redirects to login page
		this.props.history.push('/login')
	}
    
    //Checks if the user is an admin with his token
    isAdmin = () => {
		const tokenString = localStorage.getItem('token');
        if (!tokenString) {
            return false;
        }
		const userToken = JSON.parse(tokenString);
		const decodedToken = jwt_decode(userToken);
		return decodedToken["admin"];
	}

    //Change the role of a user, if he's an admin, make him a normal user, else make him an admin.
    //Username -> username to change his role.
    adminChange =  async(username) => {
        try {
            //Sends the request to change the role to the api
            const api_result = await api.PostDataAuth("api/changeadmin", {'Content-Type': 'application/json'}, {'username' : username})
            
            //If there was an error while fetching the data, logout            
            if (api_result.data == false) {
                this.logout()
            }

            //If the server status if false:
            if (api_result.data.status==false) {
				this.setState({error : api_result.data.err})
				return
  			} 
        }
        catch (error) {
            this.setState({error : "Unexpected error occured " + error})
        }
    }

    //Deletes a user.
    //username -> user to delete.
    delete_user = async(username) => {
        try {
            //Sends the request to delete the user to the api.
            const api_result = await api.PostDataAuth("api/deleteuser", {'Content-Type': 'application/json'}, {'username' : username})

            //If there was an error while fetching the data, logout            
            if (api_result.data == false) {
                this.logout()
            }

            //If the server status if false:
            if (api_result.data.status==false) {
				this.setState({error : api_result.data.err})
				return
  			}

            //Reload the window so the table of the users will refresh
            window.location.reload()
        }
        catch (error) {
            this.setState({error : "Unexpected error occured " + error})
        }
    }

    //Creates the users table.
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

