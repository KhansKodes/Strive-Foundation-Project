# UrgentNeed API Update

## Overview
The UrgentNeed API has been updated to automatically calculate donation percentages instead of requiring manual input.

## Changes Made

### Model Changes
- **Removed**: `donation_percentage` field (manual input)
- **Added**: `required_amount` field (total amount needed)
- **Added**: `donated_amount` field (amount already raised)
- **Added**: Computed `donation_percentage` property (calculated automatically)

### API Changes
The API now accepts and returns the following structure:

#### Request Body (POST/PUT)
```json
{
  "title": "SMA stage 1",
  "description": "Baby A needs immediate spinal muscular atrophy treatment to stand a chance at a normal life.",
  "required_amount": 50000.00,
  "donated_amount": 25000.00,
  "donate_url": "https://your-website.com/donate/sma-stage-1",
  "priority": 1,
  "is_active": true
}
```

#### Response Body
```json
{
  "id": 1,
  "title": "SMA stage 1",
  "description": "Baby A needs immediate spinal muscular atrophy treatment to stand a chance at a normal life.",
  "required_amount": "50000.00",
  "donated_amount": "25000.00",
  "donation_percentage": 50.0,
  "image": null,
  "donate_url": "https://your-website.com/donate/sma-stage-1",
  "is_active": true,
  "priority": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Benefits

1. **Automatic Calculation**: Donation percentage is calculated automatically based on required and donated amounts
2. **Accurate Tracking**: Admins can track exact amounts instead of estimating percentages
3. **Real-time Updates**: Percentage updates automatically when donated amount changes
4. **Frontend Compatibility**: Existing frontend code continues to work without changes
5. **Admin Interface**: Enhanced admin interface with organized fieldsets

## Migration Notes

- Run `python manage.py migrate` to apply database changes
- Existing data will need to be updated with required_amount and donated_amount values
- The `donation_percentage` field will be automatically calculated for all new and updated records

## Frontend Impact

**No changes required** - the frontend will continue to receive the `donation_percentage` field as before, but now it's automatically calculated instead of manually entered.

## Admin Interface

The Django admin interface now shows:
- Required amount and donated amount fields for easy editing
- Computed donation percentage (read-only)
- Organized fieldsets for better data management
- List view showing all relevant financial information
