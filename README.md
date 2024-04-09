# CRM - Customer Relation Management
  It's a Customer manage Application with 3 Roles Users, Managers and Admin with Features of Notification, Tickets, Activity, Services etc...
  Each Roles have a Different Permission to interact with an Application

  
## Technologies Used
 - Node Js
 - Express JS
 - Mongoose
   
## Features
### Signup, Login, Logout and Forgot Password Flow
 - All Three Roles have the same flow with different pages 
 - When a user enters the Details in the Signup Page A confirmation Email will be sent to the user
 - When the link in the confirmation email is clicked their account will be activated
 - The user can choose to Resent the email from the login page this option will be shown when the account is not activated at the time of login
 - In the forgot password the user can update the new password with the link sent via email
 - Logout will delete the session token

### Dashboard
 - The Pie Chart For the User will show the Total tickets Created, Resolved Service used etc..
 - And show the Total number of users and tickets created and Services for the Manager and Admin
### Profile
 - Profiles are same for all Roles
 - It will show the details of the user and the user can update their details
   
### Tickets
  **Users**
  - In Tickets, only User has permission to Create a new Ticket
  - The created Ticket will be Updated to their Page
    
  **Managers**
  - All the Tickets will be Visible to the Managers
  - And Managers can Resolve the Tickets
    
  **ADMIN**
  - All the Tickets will be Visible to the Admin
  - Admins can Resolve the Tickets
  - And Admins can Delete the Tickets
    
### Services
  - Only Admin have the Permission to create a new Service or Delete an existing Service
  - Manager and Admin can see the Current number of users and Old Users for the Service
  - Users can change between 'Use Service' or 'Stop Service' it will update in the user and service Database
    
### Activity
  - For all Roles, it will show every time the user LoggedIn
  - 
### Notifications
  - All Roles can view the Notification
  - Only Admin and Manager can Create a Notification
  - The created notification ID will be updated in the user database
  - Users can view or Delete the Notification when the user Delete the Notification it will only be Deleted for the User

## Run Command
`node index.js`
