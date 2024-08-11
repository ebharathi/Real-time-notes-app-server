Hi Guys!<br/>

SCREEN RECORD DRIVE LINK : https://drive.google.com/file/d/1JDlkWkQdJcbKqEPNEPK4G4NNQputJyvI/view?usp=sharing
<br/>
Here also I have attached the screenshot of the recording for the task
<br/>

![image](https://github.com/user-attachments/assets/c2d330a2-ed9d-4786-ab97-0c73c5587d40)
![image](https://github.com/user-attachments/assets/e239f8d6-a07c-4814-8954-b3ac164f1ee8)
![image](https://github.com/user-attachments/assets/f82b781c-9021-4a48-926a-ddca68d255e5)
![image](https://github.com/user-attachments/assets/c313984e-df75-451b-88ce-72dfcb812790)
![image](https://github.com/user-attachments/assets/137d9fb2-aead-407b-93e0-416065c60f04)

To Get Started,
<br/>
Run npm install and npm start
<br/><br/><br/><br/>
Features:
<br/>
<br/>

Signup/login with JWT Verification token
<br/><br/>
Adding new Notes
<br/><br/>
Deleting, sharing, editing the note
<br/><br/>
The Creator can add users by email to grant access to read and write, alos remove users
<br/><br/>
If some other user who don't have access tries to use the url, then it will say you are not authorized. If have access to read, then you can see the notes. But you can only edit if you have access to edit granted by the owner
<br/><br/>
For one edge case , if both users edit at same place in a docuemnt, then according to basic nodejs rule that is the server handles each request independently. So the first user's change will reflect in frontend because the request goes linearly. 
