# Frontend Setup Guide - Simple Steps

## What You Need to Know First

**Backend is running on:** `http://localhost:5000`

All APIs are on this server. When you make buttons and forms, they will send data to these APIs.

**Token:** When someone logs in, they get a special code called `token`. Keep this token and send it in every request after login. Put it in the headers like this:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## ALL ROUTES AND WHAT THEY DO

### 1. REGISTRATION AND LOGIN

#### **Register (Sign Up Page)**
- **API:** `POST http://localhost:5000/auth/register`
- **What to send:**
  ```
  {
    "name": "Person Name",
    "email": "person@email.com",
    "password": "password123",
    "phone": "9876543210",
    "city": "Delhi",
    "role": "patient"  (can be: "patient", "doctor", or "institution")
  }
  ```

- **EXTRA: If role is PATIENT, also send:**
  ```
  "patientProfile": {
    "bloodType": "O+",  (choose: "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", or "Unknown")
    "isAvailableToDonate": true,  (true or false)
    "lastDonationDate": "2025-01-15"  (put a date or null)
  }
  ```

- **EXTRA: If role is DOCTOR, also send:**
  ```
  "doctorProfile": {
    "specialization": "Cardiologist",
    "availabilitySlots": "Mon-Fri 4PM-8PM"
  }
  ```

- **EXTRA: If role is INSTITUTION, also send:**
  ```
  "institutionProfile": {
    "institutionType": "Hospital",  (choose: "Hospital", "Blood Bank", or "Clinic")
    "registrationNumber": "HOSPITAL123"
  }
  ```

- **What you get back:**
  ```
  {
    "status": "success",
    "_id": "user_id_number",
    "role": "patient",
    "token": "JWT_TOKEN_HERE",
    "message": "patient registered successfully!"
  }
  ```

- **What to do:** Save the `token` in `localStorage` or `sessionStorage`. This token is needed for all next steps.

---

#### **Login (Sign In Page)**
- **API:** `POST http://localhost:5000/auth/login`
- **What to send:**
  ```
  {
    "email": "person@email.com",
    "password": "password123"
  }
  ```

- **What you get back:**
  ```
  {
    "status": "success",
    "_id": "user_id_number",
    "role": "patient",
    "token": "JWT_TOKEN_HERE",
    "message": "Login successful!"
  }
  ```

- **What to do:** Save the `token`. Now user is logged in!

---

#### **Check if User is Still Logged In**
- **API:** `GET http://localhost:5000/auth/me`
- **Headers needed:** `Authorization: Bearer TOKEN_HERE`
- **What you send:** Nothing (just send the token in header)

- **What you get back:**
  ```
  {
    "message": "Token verified! This user is authenticated.",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@email.com",
      "role": "patient",
      ...
    }
  }
  ```

- **What to do:** Use this to check if user is still logged in when they refresh the page.

---

#### **Patient Dashboard (Only for Patients)**
- **API:** `GET http://localhost:5000/auth/patient-dashboard`
- **Headers needed:** `Authorization: Bearer TOKEN_HERE`
- **What you send:** Nothing

- **What you get back:**
  ```
  {
    "message": "Welcome to the private patient portal!"
  }
  ```

- **What to do:** Show this message only to patients. If user is not a patient, this API will give error.

---

### 2. HEALTH LOGS (Patient Health Records)

#### **Patient Saves Their Health Info**
- **API:** `POST http://localhost:5000/health/log`
- **Headers needed:** `Authorization: Bearer TOKEN_HERE`
- **Only for:** Patients
- **What to send (For Vitals):**
  ```
  {
    "logType": "vitals",
    "vitalsData": {
      "heartRate": 75,
      "bloodPressure": "120/80",
      "steps": 5000,
      "sugarLevel": 100
    }
  }
  ```

- **What to send (For Medical Summary):**
  ```
  {
    "logType": "medical_summary",
    "summaryData": {
      "title": "Check Up",
      "doctorName": "Dr. Sharma",
      "diagnosis": "Fever",
      "recommendations": "Take rest"
    }
  }
  ```

- **What you get back:**
  ```
  {
    "status": "success",
    "message": "Vitals logged successfully!",
    "data": {
      "_id": "log_id",
      "patientId": "patient_id",
      "logType": "vitals",
      "vitalsData": {
        "heartRate": 75,
        "bloodPressure": "120/80",
        "steps": 5000,
        "sugarLevel": 100
      },
      "createdAt": "2025-01-20T10:30:00Z"
    }
  }
  ```

- **What to do:** Show a form where patient can type health info. When they click save, send this API.

---

#### **Patient Sees Their All Health Records**
- **API:** `GET http://localhost:5000/health/history`
- **Headers needed:** `Authorization: Bearer TOKEN_HERE`
- **Only for:** Patients
- **What you send:** Nothing

- **What you get back:**
  ```
  {
    "status": "success",
    "count": 3,
    "data": [
      {
        "_id": "log_id_1",
        "patientId": "patient_id",
        "logType": "vitals",
        "vitalsData": {
          "heartRate": 75,
          "bloodPressure": "120/80",
          "steps": 5000,
          "sugarLevel": 100
        },
        "createdAt": "2025-01-20T10:30:00Z"
      },
      {
        "_id": "log_id_2",
        "logType": "medical_summary",
        "summaryData": {
          "title": "Annual Check",
          "doctorName": "Dr. Patel",
          "diagnosis": "Everything OK",
          "recommendations": "Keep healthy"
        },
        "createdAt": "2025-01-18T14:20:00Z"
      }
    ]
  }
  ```

- **What to do:** Show all health records in a list. Show newest first. Each item can show date, type (vitals or summary), and details.

---

### 3. DOCTOR FEATURES

#### **Doctor Searches for a Patient (Find Patient by Name/Email/Phone)**
- **API:** `GET http://localhost:5000/doctor/search-patient?searchKey=EMAIL_OR_PHONE_OR_NAME`
- **Headers needed:** `Authorization: Bearer TOKEN_HERE`
- **Only for:** Doctors
- **Example:** `GET http://localhost:5000/doctor/search-patient?searchKey=john@email.com`

- **What you get back:**
  ```
  {
    "status": "success",
    "patient": {
      "id": "patient_id",
      "username": "john_doe",
      "email": "john@email.com",
      "phone": "9876543210"
    },
    "logs": [
      {
        "_id": "log_id",
        "logType": "vitals",
        "vitalsData": {
          "heartRate": 75,
          "bloodPressure": "120/80",
          "steps": 5000,
          "sugarLevel": 100
        },
        "createdAt": "2025-01-20T10:30:00Z"
      }
    ]
  }
  ```

- **What to do:** Make a search box. When doctor types email/phone/name and clicks search, send this API. Show the patient info and all their health records.

---

#### **Doctor Writes Review for Patient**
- **API:** `POST http://localhost:5000/doctor/review`
- **Headers needed:** `Authorization: Bearer TOKEN_HERE`
- **Only for:** Doctors
- **What to send:**
  ```
  {
    "patientId": "patient_id_here",
    "comments": "Patient has fever",
    "prescription": "Paracetamol 500mg twice daily",
    "followUpDate": "2025-02-01"
  }
  ```

- **What you get back:**
  ```
  {
    "status": "success",
    "message": "Doctor review submitted successfully!",
    "data": {
      "_id": "review_id",
      "patientId": "patient_id",
      "doctorId": "doctor_id",
      "doctorName": "Dr. Sharma",
      "comments": "Patient has fever",
      "prescription": "Paracetamol 500mg twice daily",
      "followUpDate": "2025-02-01",
      "createdAt": "2025-01-20T11:00:00Z"
    }
  }
  ```

- **What to do:** After finding patient, show a form with fields for comments, prescription, and follow-up date. When doctor clicks save, send this API.

---

## HOW TO MAKE PAGES IN FRONTEND

### **Step 1: Login/Register Page**
1. Make a form with fields: `name`, `email`, `password`, `phone`, `city`, `role`
2. If role is patient, add fields: `bloodType`, `isAvailableToDonate`, `lastDonationDate`
3. If role is doctor, add fields: `specialization`, `availabilitySlots`
4. If role is institution, add fields: `institutionType`, `registrationNumber`
5. On button click, send POST request to register or login API
6. Save token in `localStorage`
7. Redirect to dashboard

---

### **Step 2: Dashboard Page (For Patients)**
1. Show "Welcome [Name]"
2. Show two buttons: "Add Health Record" and "View My Records"
3. Show patient details: name, email, phone, blood type, donation status

---

### **Step 3: Add Health Record Page (For Patients)**
1. Make two sections: "Add Vitals" and "Add Medical Summary"
2. **Add Vitals:**
   - Fields: Heart Rate (number), Blood Pressure (text), Steps (number), Sugar Level (number)
   - Button: "Save Vitals"
3. **Add Medical Summary:**
   - Fields: Title, Doctor Name, Diagnosis, Recommendations
   - Button: "Save Summary"
4. When button clicked, send POST request to create health log
5. Show success message

---

### **Step 4: View Health Records Page (For Patients)**
1. Show all health records from API
2. Show them as cards or list
3. Each card shows: date, type (vitals/summary), and details
4. Show newest first

---

### **Step 5: Dashboard Page (For Doctors)**
1. Show "Welcome Dr. [Name]"
2. Show two sections: "Search Patient" and "Write Review"
3. **Search Patient:**
   - Input box: Search by email/phone/name
   - Button: "Search"
   - Show patient info and their health records below
4. **Write Review:**
   - Fields: Comments, Prescription, Follow-up Date
   - Button: "Submit Review"
5. After clicking, show success message

---

## HOW TO USE TOKEN IN REQUESTS

### **Example: With Fetch API**
```javascript
const token = localStorage.getItem('token');

// GET request
fetch('http://localhost:5000/health/history', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.log(err));

// POST request
fetch('http://localhost:5000/health/log', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    logType: 'vitals',
    vitalsData: {
      heartRate: 75,
      bloodPressure: '120/80',
      steps: 5000,
      sugarLevel: 100
    }
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.log(err));
```

### **Example: With Axios**
```javascript
import axios from 'axios';

const token = localStorage.getItem('token');

// GET request
axios.get('http://localhost:5000/health/history', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => console.log(res.data))
.catch(err => console.log(err));

// POST request
axios.post('http://localhost:5000/health/log', {
  logType: 'vitals',
  vitalsData: {
    heartRate: 75,
    bloodPressure: '120/80',
    steps: 5000,
    sugarLevel: 100
  }
}, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => console.log(res.data))
.catch(err => console.log(err));
```

---

## IMPORTANT THINGS TO REMEMBER

1. **Always save token** when user logs in or registers
2. **Always send token** in headers for every request after login
3. **Check token** when page loads. If no token, show login page
4. **Different pages for different roles:** Patients see patient pages, Doctors see doctor pages
5. **Show loading state** while API is working (show "Loading..." or spinner)
6. **Show error messages** if API fails
7. **Format dates** like "Jan 20, 2025" for better look
8. **Store data** in state (React) or variables so you can use it again

---

## QUICK REFERENCE TABLE

| What | URL | Method | Need Token? | For Who |
|------|-----|--------|-------------|---------|
| Register | `/auth/register` | POST | No | Everyone |
| Login | `/auth/login` | POST | No | Everyone |
| Check Login | `/auth/me` | GET | Yes | Everyone |
| Patient Dashboard | `/auth/patient-dashboard` | GET | Yes | Patient Only |
| Add Health Log | `/health/log` | POST | Yes | Patient Only |
| Get Health History | `/health/history` | GET | Yes | Patient Only |
| Search Patient | `/doctor/search-patient` | GET | Yes | Doctor Only |
| Write Review | `/doctor/review` | POST | Yes | Doctor Only |

---

## MAKING YOUR FIRST PAGE

### Step 1: Make Login Form
```html
<form id="loginForm">
  <input type="email" id="email" placeholder="Email" required>
  <input type="password" id="password" placeholder="Password" required>
  <button type="submit">Login</button>
</form>
```

### Step 2: Handle Form Submit
```javascript
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      alert('Login failed: ' + data.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});
```

---

**That's it! Now you know how to make the frontend. Start with login page first, then make other pages. Good luck!** 🎯
