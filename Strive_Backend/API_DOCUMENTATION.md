# Strive Foundation - Patient Registration API Documentation


#To run this project you need to did this first

#Used to show all the requirements
pip freeze > requirements.txt

'''
#Step 1
python -m venv .venv
source .venv/bin/activate 

#Step 2
pip install -r requirements.txt

#Step 3
python manage.py makemigrations  # create DB migration files

#Step 4
python manage.py migrate

#Step 5
python manage.py runserver       


python manage.py startapp users 
python manage.py createsuperuser # admin account

'''
## Base URL
```
http://127.0.0.1:8000/api/
```

## Authentication
All endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles
The system now supports the following roles:
- `patient` - Individual patients
- `caregiver` - Caregivers registering on behalf of patients
- `donor` - Donors
- `volunteer` - Volunteers
- `admin` - Administrative users

## Registration Process Overview

The patient registration is divided into 3 steps:
1. **Step 1: Basic Information** - Personal details
2. **Step 2: Medical Confirmation** - Medical history and diagnosis
3. **Step 3: Financial Assistance** - Financial support requirements

## API Endpoints

### 1. Patient Registration - Step 1: Basic Information

**Endpoint:** `POST /api/patient-registration/step1/`

**Description:** Submit basic patient information (first step of registration)

**Request Body:**
```json
{
  "registration_type": "patient",  
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-05-10",  // Format: YYYY-MM-DD
  "gender": "male",  // Options: "male", "female", "other"
  "phone_number": "03001234567",
  "whatsapp_number": "03001234567",
  "address": "123 Main Street, Block A",
  "city": "Karachi",
  "province_state": "Sindh",
  "country": "Pakistan"
}
```

**Response:**
```json
{
  "message": "Step 1 completed successfully",
  "patient_id": 1,
  "step_completed": 1,
  "next_step": "step2"
}
```

### 2. Patient Registration - Step 2: Medical Confirmation

**Endpoint:** `POST /api/patient-registration/step2/`

**Description:** Submit medical information and diagnosis details

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
```
sma_type: "type_2"  // Options: "type_1", "type_2", "type_3", "type_4"
date_of_diagnosis: "2020-03-15"  // Format: YYYY-MM-DD
examined_by_doctor: "yes"  // Options: "yes", "no"
family_history: "no"  // Options: "yes", "no"
gene_test_report: [FILE]  // PDF, JPG, PNG, DOC, DOCX (max 10MB)
```

**Response:**
```json
{
  "message": "Step 2 completed successfully",
  "patient_id": 1,
  "step_completed": 2,
  "next_step": "step3"
}
```

### 3. Patient Registration - Step 3: Financial Assistance

**Endpoint:** `POST /api/patient-registration/step3/`

**Description:** Submit financial assistance requirements and complete registration

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
```
doctors_prescription: [FILE]  // PDF, JPG, PNG, DOC, DOCX (max 10MB)
requested_amount_pkr: "50000.00"  // Decimal format
contribution_amount_pkr: "5000.00"  // Decimal format
cycle_number: 1  // Integer
description: "Monthly treatment costs for SMA Type 2"
additional_info: "Patient requires monthly injections"  // Optional
supporting_documents: [FILE]  // Optional - PDF, JPG, PNG, DOC, DOCX, ZIP, RAR (max 10MB)
```

**Response:**
```json
{
  "message": "Registration completed successfully!",
  "patient_id": 1,
  "step_completed": 3,
  "is_registration_complete": true
}
```

### 4. Registration Status

**Endpoint:** `GET /api/patient-registration/status/`

**Description:** Check the current registration status

**Response:**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "step_completed": 2,
  "is_registration_complete": false,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:45:00Z"
}
```

### 5. Get Step Data for Editing

**Endpoints:**
- `GET /api/patient-registration/step1-data/`
- `GET /api/patient-registration/step2-data/`
- `GET /api/patient-registration/step3-data/`

**Description:** Retrieve existing data for each step to allow editing

### 6. Complete Patient Details

**Endpoint:** `GET /api/patient-registration/`

**Description:** Get complete patient registration details

**Response:**
```json
{
  "id": 1,
  "registration_type": "patient",
  "first_name": "John",
  "last_name": "Doe",
  "full_name": "John Doe",
  "date_of_birth": "1990-05-10",
  "gender": "male",
  "phone_number": "03001234567",
  "whatsapp_number": "03001234567",
  "address": "123 Main Street, Block A",
  "city": "Karachi",
  "province_state": "Sindh",
  "country": "Pakistan",
  "step_completed": 3,
  "is_registration_complete": true,
  "medical_confirmation": {
    "sma_type": "type_2",
    "date_of_diagnosis": "2020-03-15",
    "examined_by_doctor": "yes",
    "family_history": "no",
    "gene_test_report": "/media/medical_documents/1/gene_report_uuid.pdf"
  },
  "financial_assistance": {
    "doctors_prescription": "/media/financial_documents/1/prescription_uuid.pdf",
    "requested_amount_pkr": "50000.00",
    "contribution_amount_pkr": "5000.00",
    "cycle_number": 1,
    "description": "Monthly treatment costs for SMA Type 2",
    "additional_info": "Patient requires monthly injections",
    "supporting_documents": "/media/financial_documents/1/supporting/support_doc_uuid.pdf"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:45:00Z"
}
```

### 7. Appointments Management

**Endpoints:**
- `GET /api/appointments/` - List all appointments
- `POST /api/appointments/` - Create new appointment
- `GET /api/appointments/{id}/` - Get appointment details
- `PUT /api/appointments/{id}/` - Update appointment
- `DELETE /api/appointments/{id}/` - Delete appointment

**Create Appointment Request:**
```json
{
  "doctor_name": "Dr. Smith",
  "date": "2024-02-15",
  "notes": "Follow-up consultation"
}
```

## File Upload Guidelines

### Supported File Types:
- **Documents:** PDF, DOC, DOCX
- **Images:** JPG, JPEG, PNG
- **Archives:** ZIP, RAR (for supporting documents only)

### File Size Limits:
- Maximum file size: 10MB per file
- Files are automatically renamed with UUIDs for security

### File Storage Structure:
```
media/
├── medical_documents/{patient_id}/
│   └── gene_report_{uuid}.{ext}
├── financial_documents/{patient_id}/
│   ├── prescription_{uuid}.{ext}
│   └── supporting/
│       └── support_doc_{uuid}.{ext}
└── patient_documents/{patient_id}/
    └── {uuid}.{ext}
```

## Error Responses

### Validation Errors (400 Bad Request):
```json
{
  "field_name": [
    "This field is required."when 
  ],
  "date_of_birth": [
    "Date of birth cannot be in the future."
  ]
}
```

### Authentication Errors (401 Unauthorized):
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Permission Errors (403 Forbidden):
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### Step Order Errors (400 Bad Request):
```json
{
  "error": "Please complete Step 1 first"
}
```

## Frontend Integration Notes

1. **Step Navigation:** Always check the `step_completed` field to determine which step the user should be on
2. **File Uploads:** Use `FormData` for steps 2 and 3 that include file uploads
3. **Progress Tracking:** Use the `/status/` endpoint to show registration progress
4. **Data Editing:** Use the step-specific data endpoints to pre-populate forms for editing
5. **Validation:** Handle validation errors gracefully and display field-specific error messages

## Example Frontend Flow

```javascript
// Step 1: Basic Information
const step1Data = {
  registration_type: "patient",
  first_name: "John",
  last_name: "Doe",
  // ... other fields
};

fetch('/api/patient-registration/step1/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(step1Data)
});

// Step 2: Medical Confirmation (with file upload)
const formData = new FormData();
formData.append('sma_type', 'type_2');
formData.append('date_of_diagnosis', '2020-03-15');
formData.append('examined_by_doctor', 'yes');
formData.append('family_history', 'no');
formData.append('gene_test_report', fileInput.files[0]);

fetch('/api/patient-registration/step2/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```