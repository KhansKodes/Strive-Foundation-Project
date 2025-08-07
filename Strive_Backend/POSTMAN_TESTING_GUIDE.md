# Postman Testing Guide - Patient Registration API

## Server Setup
- **Base URL:** `http://127.0.0.1:8000`
- **Server Status:** Running on port 8000

## Prerequisites for Testing

### 1. Create a Test User Account
First, you need to create a user account to get authentication tokens.

**Endpoint:** `POST http://127.0.0.1:8000/api/auth/register/`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "testpatient",
  "email": "testpatient@example.com",
  "password": "testpass123",
  "role": "patient"
}
```

### 2. Get Authentication Token
**Endpoint:** `POST http://127.0.0.1:8000/api/auth/login/`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "testpatient",
  "password": "testpass123"
}
```

**Response will include:**
```json
{
  "access": "your_jwt_token_here",
  "refresh": "your_refresh_token_here"
}
```

**Save the `access` token for all subsequent requests!**

---

## Step 1: Basic Information

### Endpoint
```
POST http://127.0.0.1:8000/api/patient-registration/step1/
```

### Headers
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

### Body (JSON)
```json
{
  "registration_type": "patient",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-05-10",
  "gender": "male",
  "phone_number": "03001234567",
  "whatsapp_number": "03001234567",
  "address": "123 Main Street, Block A",
  "city": "Karachi",
  "province_state": "Sindh",
  "country": "Pakistan"
}
```

### Expected Response (201 Created)
```json
{
  "message": "Step 1 completed successfully",
  "patient_id": 1,
  "step_completed": 1,
  "next_step": "step2"
}
```

### Alternative: Caregiver Registration
```json
{
  "registration_type": "caregiver",
  "first_name": "Jane",
  "last_name": "Smith",
  "date_of_birth": "1985-03-15",
  "gender": "female",
  "phone_number": "03009876543",
  "whatsapp_number": "03009876543",
  "address": "456 Caregiver Street, Block B",
  "city": "Lahore",
  "province_state": "Punjab",
  "country": "Pakistan"
}
```

---

## Step 2: Medical Confirmation

### Endpoint
```
POST http://127.0.0.1:8000/api/patient-registration/step2/
```

### Headers
```
Authorization: Bearer your_jwt_token_here
Content-Type: multipart/form-data
```

### Body (Form Data)
| Key | Value | Type | Required |
|-----|-------|------|----------|
| `sma_type` | `type_2` | Text | Yes |
| `date_of_diagnosis` | `2020-03-15` | Text | Yes |
| `examined_by_doctor` | `yes` | Text | Yes |
| `family_history` | `no` | Text | Yes |
| `gene_test_report` | `[Select File]` | File | Yes |

### File Requirements for `gene_test_report`:
- **Supported formats:** PDF, JPG, JPEG, PNG, DOC, DOCX
- **Maximum size:** 10MB
- **Test file:** You can use any PDF or image file for testing

### Expected Response (201 Created)
```json
{
  "message": "Step 2 completed successfully",
  "patient_id": 1,
  "step_completed": 2,
  "next_step": "step3"
}
```

### Alternative Values for Testing:
```json
{
  "sma_type": "type_1",  // Options: "type_1", "type_2", "type_3", "type_4"
  "date_of_diagnosis": "2019-07-20",
  "examined_by_doctor": "no",  // Options: "yes", "no"
  "family_history": "yes"  // Options: "yes", "no"
}
```

---

## Step 3: Financial Assistance

### Endpoint
```
POST http://127.0.0.1:8000/api/patient-registration/step3/
```

### Headers
```
Authorization: Bearer your_jwt_token_here
Content-Type: multipart/form-data
```

### Body (Form Data)
| Key | Value | Type | Required |
|-----|-------|------|----------|
| `doctors_prescription` | `[Select File]` | File | Yes |
| `requested_amount_pkr` | `50000.00` | Text | Yes |
| `contribution_amount_pkr` | `5000.00` | Text | Yes |
| `cycle_number` | `1` | Text | Yes |
| `description` | `Monthly treatment costs for SMA Type 2` | Text | Yes |
| `additional_info` | `Patient requires monthly injections` | Text | No |
| `supporting_documents` | `[Select File]` | File | No |

### File Requirements:
- **doctors_prescription:** PDF, JPG, JPEG, PNG, DOC, DOCX (max 10MB)
- **supporting_documents:** PDF, JPG, JPEG, PNG, DOC, DOCX, ZIP, RAR (max 10MB, optional)

### Expected Response (201 Created)
```json
{
  "message": "Registration completed successfully!",
  "patient_id": 1,
  "step_completed": 3,
  "is_registration_complete": true
}
```

### Alternative Values for Testing:
```json
{
  "requested_amount_pkr": "75000.00",
  "contribution_amount_pkr": "10000.00",
  "cycle_number": "2",
  "description": "Quarterly treatment and medication costs",
  "additional_info": "Includes physical therapy sessions"
}
```

---

## Additional Testing Endpoints

### 1. Check Registration Status
**Endpoint:** `GET http://127.0.0.1:8000/api/patient-registration/status/`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Expected Response:**
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

### 2. Get Complete Patient Details
**Endpoint:** `GET http://127.0.0.1:8000/api/patient-registration/`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Expected Response:**
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

### 3. Get Step Data for Editing
**Endpoints:**
- `GET http://127.0.0.1:8000/api/patient-registration/step1-data/`
- `GET http://127.0.0.1:8000/api/patient-registration/step2-data/`
- `GET http://127.0.0.1:8000/api/patient-registration/step3-data/`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

---

## Postman Collection Setup

### 1. Environment Variables
Create a Postman environment with these variables:
- `base_url`: `http://127.0.0.1:8000`
- `auth_token`: (will be set after login)

### 2. Pre-request Script for Authentication
Add this to your login request:
```javascript
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.environment.set("auth_token", jsonData.access);
});
```

### 3. Authorization Header
For all protected endpoints, use:
```
Authorization: Bearer {{auth_token}}
```

---

## Testing Flow

### Complete Registration Flow:
1. **Register User** → Get user account
2. **Login** → Get JWT token
3. **Step 1** → Submit basic information
4. **Step 2** → Submit medical confirmation (with file)
5. **Step 3** → Submit financial assistance (with files)
6. **Check Status** → Verify completion
7. **Get Details** → View complete registration

### Error Testing:
- Try accessing Step 2 without completing Step 1
- Try accessing Step 3 without completing Step 2
- Submit invalid file types
- Submit files larger than 10MB
- Submit invalid date formats
- Submit without authentication

---

## Sample Test Files

For testing file uploads, you can use:
- **PDF files:** Any PDF document
- **Images:** JPG, PNG files
- **Documents:** DOC, DOCX files
- **Archives:** ZIP, RAR files (for supporting documents)

**Note:** Create small test files (under 1MB) for faster testing.

---

## Common Error Responses

### 400 Bad Request (Validation Error):
```json
{
  "registration_type": [
    "This field is required."
  ],
  "date_of_birth": [
    "Date of birth cannot be in the future."
  ]
}
```

### 401 Unauthorized:
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 400 Bad Request (Step Order Error):
```json
{
  "error": "Please complete Step 1 first"
}
```

### 400 Bad Request (File Error):
```json
{
  "gene_test_report": [
    "File type not allowed. Allowed types: .pdf, .jpg, .jpeg, .png, .doc, .docx"
  ]
}
```

---

## Quick Test Checklist

- [ ] Server running on http://127.0.0.1:8000
- [ ] User account created
- [ ] JWT token obtained
- [ ] Step 1 completed successfully
- [ ] Step 2 completed with file upload
- [ ] Step 3 completed with file uploads
- [ ] Registration status shows complete
- [ ] Complete details retrieved successfully
