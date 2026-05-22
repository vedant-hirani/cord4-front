# SpendAI API Integration Guide

This document details all API endpoints integrated into the frontend and how they're used.

## Backend API URL

```
Base URL: https://cord4-1-pdrt.onrender.com/api/v1
```

## Authentication Endpoints

### 1. Register User
- **Endpoint**: `POST /auth/register`
- **Service**: `authService.register()`
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "tokens": {
        "accessToken": "jwt_token",
        "refreshToken": "refresh_token"
      },
      "user": {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      }
    }
  }
  ```
- **Usage**: Register page form submission

### 2. Login User
- **Endpoint**: `POST /auth/login`
- **Service**: `authService.login()`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Response**: Same as Register
- **Usage**: Login page form submission

### 3. Logout User
- **Endpoint**: `POST /auth/logout`
- **Service**: `authService.logout()`
- **Headers**: Bearer token required
- **Response**:
  ```json
  {
    "success": true,
    "data": null
  }
  ```
- **Usage**: Logout button in navigation

### 4. Get Current User
- **Endpoint**: `GET /auth/me`
- **Service**: `authService.getCurrentUser()`
- **Headers**: Bearer token required
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    }
  }
  ```
- **Usage**: AuthContext initialization on app load

## Expenses Endpoints

### 1. Create Expense
- **Endpoint**: `POST /expenses`
- **Service**: `expensesService.createExpense()`
- **Request Body**:
  ```json
  {
    "amount": 84.50,
    "category": "Food",
    "date": "2026-05-22",
    "note": "Whole Foods organic groceries"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "expense_id",
      "userId": "user_id",
      "amount": 84.50,
      "category": "Food",
      "date": "2026-05-22",
      "note": "Whole Foods organic groceries",
      "createdAt": "2026-05-22T...",
      "updatedAt": "2026-05-22T..."
    }
  }
  ```
- **Usage**: Dashboard add expense modal

### 2. List Expenses
- **Endpoint**: `GET /expenses`
- **Service**: `expensesService.getExpenses(filters)`
- **Query Parameters**:
  - `month`: "2026-05" (optional)
  - `category`: "Food" (optional)
  - `startDate`, `endDate`, `minAmount`, `maxAmount` (optional)
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "expense_id",
        "amount": 84.50,
        "category": "Food",
        "date": "2026-05-22",
        "note": "Groceries"
      }
    ]
  }
  ```
- **Usage**: Dashboard expense table display

### 3. Get Analytics Stats
- **Endpoint**: `GET /expenses/stats`
- **Service**: `expensesService.getStats()`
- **Headers**: Bearer token required
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalSpent": 2500.00,
      "monthlySpent": 500.00,
      "averageExpense": 50.00,
      "categoryBreakdown": {
        "Food": 250,
        "Transport": 150,
        "Entertainment": 100
      },
      "trends": [
        {
          "month": "2026-03",
          "amount": 400
        },
        {
          "month": "2026-04",
          "amount": 450
        },
        {
          "month": "2026-05",
          "amount": 500
        }
      ]
    }
  }
  ```
- **Usage**: Dashboard stats cards and charts

### 4. Update Expense
- **Endpoint**: `PUT /expenses/{id}`
- **Service**: `expensesService.updateExpense(id, data)`
- **Request Body**: Same as Create (fields are optional)
- **Response**: Updated expense object
- **Usage**: Edit expense functionality

### 5. Delete Expense
- **Endpoint**: `DELETE /expenses/{id}`
- **Service**: `expensesService.deleteExpense(id)`
- **Response**:
  ```json
  {
    "success": true,
    "data": null
  }
  ```
- **Usage**: Delete button in expense table

### 6. Export Expenses to CSV
- **Endpoint**: `GET /expenses/export`
- **Service**: `expensesService.exportCSV(month)`
- **Query Parameters**:
  - `month`: "2026-05" (optional)
- **Response**: CSV file blob
- **Usage**: Export CSV button in dashboard

## Budgets Endpoints

### 1. Create/Configure Budget
- **Endpoint**: `POST /budgets`
- **Service**: `budgetsService.createBudget()`
- **Request Body**:
  ```json
  {
    "category": "Food",
    "limit": 500,
    "month": "2026-05"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "budget_id",
      "userId": "user_id",
      "category": "Food",
      "limit": 500,
      "month": "2026-05",
      "createdAt": "..."
    }
  }
  ```
- **Usage**: Budget settings form

### 2. List Budgets
- **Endpoint**: `GET /budgets`
- **Service**: `budgetsService.getBudgets()`
- **Headers**: Bearer token required
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "budget_id",
        "category": "Food",
        "limit": 500,
        "month": "2026-05"
      }
    ]
  }
  ```
- **Usage**: Budget management page

### 3. Get Budget Alerts
- **Endpoint**: `GET /budgets/alerts`
- **Service**: `budgetsService.getAlerts(month)`
- **Query Parameters**:
  - `month`: "2026-05" (optional)
- **Headers**: Bearer token required
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "alert_id",
        "category": "Food",
        "spent": 425.50,
        "limit": 500,
        "percentage": 85,
        "status": "warning"
      },
      {
        "id": "alert_id2",
        "category": "Transport",
        "spent": 520.00,
        "limit": 500,
        "percentage": 104,
        "status": "danger"
      }
    ]
  }
  ```
- **Status Values**:
  - `normal`: < 80% of limit
  - `warning`: 80-99% of limit
  - `danger`: >= 100% of limit
- **Usage**: Dashboard budget alerts section

### 4. Update Budget
- **Endpoint**: `PUT /budgets/{id}`
- **Service**: `budgetsService.updateBudget(id, data)`
- **Request Body**: Same as Create (fields optional)
- **Response**: Updated budget object
- **Usage**: Edit budget functionality

### 5. Delete Budget
- **Endpoint**: `DELETE /budgets/{id}`
- **Service**: `budgetsService.deleteBudget(id)`
- **Response**:
  ```json
  {
    "success": true,
    "data": null
  }
  ```
- **Usage**: Delete budget functionality

## AI Endpoints

### 1. Extract from Receipt
- **Endpoint**: `POST /ai/extract`
- **Service**: `aiService.extractFromReceipt(rawText)`
- **Request Body**:
  ```json
  {
    "rawText": "Paid $32.45 for a ride back home from the office with Uber on 2026-05-22"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "amount": 32.45,
      "category": "Transport",
      "date": "2026-05-22",
      "description": "Uber ride home from office",
      "confidence": 0.95
    }
  }
  ```
- **Powered by**: Grok AI (xAI)
- **Usage**: AI Receipt Parser widget in dashboard

## Implementation Details

### Error Handling

All failed requests return standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

The API client automatically:
- Sets Authorization Bearer token from localStorage
- Clears tokens and redirects to login on 401 Unauthorized
- Converts errors to readable messages

### Request/Response Format

- **Content-Type**: `application/json` for all requests
- **Authorization**: Bearer `{accessToken}` (auto-added for authenticated endpoints)
- **Token Storage**: Both `accessToken` and `refreshToken` stored in localStorage

### Rate Limiting & CORS

- CORS enabled for frontend origin
- Rate limiting per user (check backend for limits)
- Tokens expire after defined period (check backend for duration)

## Service Usage Examples

### Creating an Expense (Dashboard)
```typescript
const expense = await expensesService.createExpense({
  amount: 84.50,
  category: 'Food',
  date: '2026-05-22',
  note: 'Groceries'
});
```

### Fetching Expenses with Filters
```typescript
const expenses = await expensesService.getExpenses({
  month: '2026-05',
  category: 'Food'
});
```

### Getting Budget Alerts
```typescript
const alerts = await budgetsService.getAlerts('2026-05');
// Filter by status
const warningAlerts = alerts.filter(a => a.status !== 'normal');
```

### AI Receipt Parsing
```typescript
const extracted = await aiService.extractFromReceipt(
  'Paid $32.45 for Uber ride on 2026-05-22'
);
// Pre-fill form with extracted data
setFormData({
  amount: extracted.amount,
  category: extracted.category,
  date: extracted.date,
  note: extracted.description
});
```

## Category Support

Supported expense categories (from Postman collection):
- Food
- Transport
- Entertainment
- Utilities
- Shopping
- Health
- Education
- Other

## Testing with Postman

The Postman collection variables are:
- `{{base_url}}` = `https://cord4-1-pdrt.onrender.com/api/v1`
- `{{auth_token}}` = Auto-stored from login/register response
- `{{refresh_token}}` = Auto-stored from login/register response

Test credentials:
```
Email: vedant.hirani@example.com
Password: SecurePass123!
```

## Frontend Integration Map

| Page | Endpoints Used |
|------|---|
| Landing | None (public) |
| Register | POST /auth/register |
| Login | POST /auth/login |
| Dashboard | GET /expenses, GET /expenses/stats, GET /budgets/alerts, POST /expenses, DELETE /expenses |
| Sidebar | POST /auth/logout |
| AI Widget | POST /ai/extract |
| Export | GET /expenses/export |

## Troubleshooting

### 401 Unauthorized
- Token has expired or is invalid
- Frontend will auto-redirect to login
- Check localStorage for valid auth_token

### CORS Errors
- Backend CORS settings may need adjustment
- Check browser console for specific origin issues

### API Connection Errors
- Verify backend is running at `https://cord4-1-pdrt.onrender.com`
- Check network connectivity
- Review console logs for detailed error messages

