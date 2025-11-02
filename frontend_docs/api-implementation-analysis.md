# Frontend API Implementation - Comprehensive Analysis & Improvement Recommendations

**Ημερομηνία:** Ιανουάριος 2024  
**Σκοπός:** Πλήρης ανάλυση και βελτίωση της υλοποίησης APIs στο frontend

---

## Περιεχόμενα

1. [Executive Summary](#executive-summary)
2. [Critical Issues](#critical-issues)
3. [API Endpoint Mismatches](#api-endpoint-mismatches)
4. [Error Handling Improvements](#error-handling-improvements)
5. [Code Organization & Consistency](#code-organization--consistency)
6. [Missing Features](#missing-features)
7. [Performance Optimizations](#performance-optimizations)
8. [Security Improvements](#security-improvements)
9. [Detailed Hook-by-Hook Analysis](#detailed-hook-by-hook-analysis)
10. [Action Items & Priority](#action-items--priority)

---

## Executive Summary

### Τρέχουσα Κατάσταση
- ✅ **Καλά υλοποιημένα:**
  - Χρήση React Query για data fetching
  - Cookie-based authentication (withCredentials)
  - Consistent error translation functions
  - Proper query invalidation patterns

- ⚠️ **Προβλήματα:**
  - Inconsistent API base URL handling
  - Missing error boundaries
  - Hardcoded URLs σε components
  - Incomplete pagination handling
  - Missing validation για confirmed_user
  - API endpoint mismatches με backend
  - Missing password reset functionality
  - Inconsistent response data handling

---

## Critical Issues

### 1. ❌ CRITICAL: Inconsistent API Base URL Handling

**Πρόβλημα:** Πολλές διαφορετικές προσεγγίσεις για το API_BASE σε διαφορετικά files.

**Τρέχουσα κατάσταση:**
```javascript
// Pattern 1 (Καλή - useAuth.js, useRestaurants.js)
const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000";

// Pattern 2 (Κακή - useOwnerAuth.js)
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1/owner",  // Hardcoded!
  withCredentials: true,
});

// Pattern 3 (Κακή - OwnerLoginPage.js)
href="http://localhost:5000/api/v1/owner/auth/google"  // Hardcoded!
```

**Λύση:** Δημιουργία centralized API configuration file.

---

### 2. ❌ CRITICAL: API Endpoint Mismatches με Backend

#### 2.1. Owner Reservations Status Update
**Frontend:** `PATCH /api/v1/reservations/:id/status`  
**Backend:** `PATCH /api/v1/reservations/owner/status` (body: `{ reservation_id, status, cancellation_reason }`)

**Current Implementation:**
```javascript
// useReservations.js - WRONG
const { data } = await axiosInstance.patch(`/${reservationId}/status`, {
  status: "confirmed",
});
```

**Should be:**
```javascript
const { data } = await axiosInstance.patch(`/owner/status`, {
  reservation_id: reservationId,
  status: "confirmed",
  cancellation_reason: null
});
```

#### 2.2. Coupon Purchase Endpoint
**Frontend:** `POST /api/v1/coupons/:couponId/purchase` (REST alias)  
**Backend:** `POST /api/v1/coupons/purchase` (body: `{ coupon_id }`)

**Current Implementation:**
```javascript
// useCoupons.js
const { data } = await axiosInstance.post(`/${couponId}/purchase`);
```

**Should be:**
```javascript
const { data } = await axiosInstance.post(`/purchase`, {
  coupon_id: couponId
});
```

#### 2.3. Coupon Edit/Delete Endpoints
**Frontend:** `PATCH /api/v1/coupons/:couponId`, `DELETE /api/v1/coupons/:couponId`  
**Backend:** `PATCH /api/v1/coupons/edit` (body: `{ couponId, ... }`), `DELETE /api/v1/coupons/delete` (body: `{ couponId }`)

**Current Implementation:**
```javascript
// useCoupons.js - WRONG
const { data } = await axiosInstance.patch(`/${couponId}`, patch);
const { data } = await axiosInstance.delete(`/${couponId}`);
```

**Should be:**
```javascript
const { data } = await axiosInstance.patch(`/edit`, { couponId, ...patch });
const { data } = await axiosInstance.delete(`/delete`, { data: { couponId } });
```

#### 2.4. Testimonials Query Parameter
**Frontend:** `/all?page=${page}&limit=${pageSize}`  
**Backend:** Expects `limit` but documentation shows `pageSize` as standard.

**Current Implementation:**
```javascript
// useTestimonials.js
const { data } = await axiosInstance.get(`/all?page=${page}&limit=${pageSize}`);
```

**Note:** Check backend implementation. If backend uses `pageSize`, change to `pageSize`.

#### 2.5. Owner Logout Endpoint
**Frontend:** `GET /api/v1/owner/logout`  
**Backend Documentation:** User logout is `GET /api/v1/user/logout` - owner logout endpoint not explicitly documented.

**Action Required:** Verify if owner has separate logout endpoint or uses same `/user/logout`.

---

### 3. ❌ CRITICAL: Missing Confirmed User Validation

**Πρόβλημα:** Πολλά endpoints απαιτούν `confirmed_user: true` αλλά το frontend δεν ελέγχει.

**Affected Operations:**
- Creating reservations (`POST /api/v1/reservations`)
- Purchasing coupons (`POST /api/v1/coupons/purchase`)

**Current State:** No validation before allowing these actions.

**Solution:** Add validation hooks/checks before mutations.

---

### 4. ❌ CRITICAL: Owner Overview Response Structure

**Frontend expects:**
```javascript
// useOwnerRestaurant.js
const { data } = await axiosInstance.get("/owner/overview");
return data.restaurants || [];  // Expects array
```

**Backend returns:**
```json
{
  "restaurant": {...},
  "statistics": {
    "total_reservations": 150,
    "pending_reservations": 5,
    "total_revenue": 15000.00
  }
}
```

**Mismatch:** Frontend expects array, backend returns object with `restaurant` and `statistics`.

---

### 5. ⚠️ WARNING: Missing Password Reset Flow

**Backend APIs Available:**
- `POST /api/v1/user/password/reset/request` - Request reset email
- `POST /api/v1/user/password/reset` - Reset with token
- `POST /api/v1/user/password/reset/validate/token` - Validate token

**Frontend:** ❌ Not implemented

---

## API Endpoint Mismatches

| Feature | Frontend Endpoint | Backend Endpoint | Status |
|---------|------------------|------------------|--------|
| Owner Update Reservation | `PATCH /reservations/:id/status` | `PATCH /reservations/owner/status` | ❌ WRONG |
| Coupon Purchase | `POST /coupons/:id/purchase` | `POST /coupons/purchase` | ❌ WRONG |
| Coupon Edit | `PATCH /coupons/:id` | `PATCH /coupons/edit` | ❌ WRONG |
| Coupon Delete | `DELETE /coupons/:id` | `DELETE /coupons/delete` | ❌ WRONG |
| Owner Overview | Expects array | Returns object | ❌ WRONG |
| Testimonials | Uses `limit` | Should check `pageSize` | ⚠️ CHECK |

---

## Error Handling Improvements

### 1. Centralized Error Handler

**Current State:** Each hook has its own `translateError` function.

**Recommendation:** Create `src/utils/apiErrorHandler.js`:
```javascript
export const translateApiError = (error, context = '') => {
  const message = error?.response?.data?.message || error?.message || 'Άγνωστο σφάλμα.';
  const status = error?.response?.status;

  // Status-based handling
  if (status === 401) return 'Δεν είστε συνδεδεμένος. Παρακαλώ συνδεθείτε.';
  if (status === 403) return 'Δεν έχετε δικαίωμα πρόσβασης.';
  if (status === 404) return 'Δεν βρέθηκε το ζητούμενο.';
  if (status === 429) return 'Πολλά αιτήματα. Παρακαλώ δοκιμάστε αργότερα.';
  if (status >= 500) return 'Σφάλμα server. Παρακαλώ δοκιμάστε αργότερα.';

  // Message-based handling (context-specific)
  const contextHandlers = {
    auth: () => {
      if (message.includes('Invalid credentials')) return 'Λανθασμένα στοιχεία σύνδεσης.';
      if (message.includes('User already exists')) return 'Υπάρχει ήδη λογαριασμός με αυτό το email.';
      // ...
    },
    reservation: () => {
      if (message.includes('not confirmed')) return 'Ο λογαριασμός σας δεν είναι επιβεβαιωμένος.';
      // ...
    },
    // ...
  };

  return contextHandlers[context]?.() || message;
};
```

### 2. Error Boundaries

**Missing:** No error boundaries for API failures.

**Recommendation:** Add React Error Boundaries for:
- API call failures
- Network errors
- Unexpected response formats

---

## Code Organization & Consistency

### 1. Create Centralized API Configuration

**File:** `src/config/api.js`
```javascript
const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000";

export const API_VERSION = 'v1';
export const API_BASE_URL = `${API_BASE}/api/${API_VERSION}`;

// Create axios instances for each resource
export const createApiClient = (basePath) => {
  return axios.create({
    baseURL: `${API_BASE_URL}${basePath}`,
    withCredentials: true,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Pre-configured clients
export const userApi = createApiClient('/user');
export const authApi = createApiClient('/auth');
export const restaurantApi = createApiClient('/restaurant');
export const reservationApi = createApiClient('/reservations');
export const couponApi = createApiClient('/coupons');
export const menuItemApi = createApiClient('/menuItems');
export const specialMenuApi = createApiClient('/specialMenus');
export const ownerApi = createApiClient('/owner');
export const testimonialApi = createApiClient('/testimonials');
```

### 2. Standardize Query Keys

**Current State:** Inconsistent query key naming.

**Recommendation:** Create `src/config/queryKeys.js`:
```javascript
export const queryKeys = {
  // Auth
  authStatus: ['authStatus'],
  userProfile: ['userProfile'],
  ownerProfile: ['ownerProfile'],
  
  // Restaurants
  restaurant: (id) => ['restaurant', id],
  ownerRestaurant: ['ownerRestaurant'],
  ownerOverview: ['ownerOverview'],
  trendingRestaurants: (page, pageSize) => ['trendingRestaurants', page, pageSize],
  discountedRestaurants: (page, pageSize) => ['discountedRestaurants', page, pageSize],
  filteredRestaurants: (filters, page, pageSize) => ['filteredRestaurants', filters, page, pageSize],
  
  // Reservations
  userReservations: ['userReservations'],
  filteredReservations: (date, status, page, pageSize) => ['filteredReservations', date, status, page, pageSize],
  reservation: (id) => ['reservation', id],
  ownerReservations: (date, status, page, pageSize) => ['ownerReservations', date, status, page, pageSize],
  
  // Coupons
  userCoupons: (page, pageSize) => ['userCoupons', page, pageSize],
  availableCoupons: (restaurantId, page, pageSize) => ['availableCoupons', restaurantId, page, pageSize],
  restaurantsWithPurchasedCoupons: ['restaurantsWithPurchasedCoupons'],
  
  // Testimonials
  testimonials: (page, pageSize) => ['testimonials', page, pageSize],
  
  // User
  userPoints: ['userPoints'],
  favorites: (page, pageSize) => ['favorites', page, pageSize],
};
```

### 3. Standardize Response Data Extraction

**Current State:** Inconsistent data extraction from responses.

**Recommendation:** Create response transformers:
```javascript
// src/utils/responseTransformers.js
export const extractRestaurant = (response) => {
  return response?.data?.restaurant || response?.data || response;
};

export const extractRestaurants = (response) => {
  return response?.data?.restaurants || response?.data?.allTrendingRestaurants || [];
};

export const extractPagination = (response) => {
  return response?.data?.Pagination || response?.data?.pagination || null;
};
```

---

## Missing Features

### 1. Password Reset Flow

**Missing Components:**
- `src/pages/customer/ForgotPasswordPage.js`
- `src/pages/customer/ResetPasswordPage.js`
- Hooks: `useRequestPasswordReset`, `useResetPassword`, `useValidateResetToken`

**Backend APIs Available:**
- `POST /api/v1/user/password/reset/request`
- `POST /api/v1/user/password/reset`
- `POST /api/v1/user/password/reset/validate/token`

### 2. Confirmed User Check Hook

**Missing:** Hook to check if user is confirmed before allowing actions.

**Recommendation:**
```javascript
// src/hooks/customer/useConfirmedUser.js
export const useConfirmedUser = () => {
  const { data: authStatus } = useAuthStatus();
  return authStatus?.user?.confirmed_user === true;
};

// Usage in components:
const isConfirmed = useConfirmedUser();
if (!isConfirmed) {
  // Show message: "Please confirm your email first"
}
```

### 3. Owner Reservation Status Update - Correct Implementation

**Current:** Uses wrong endpoint pattern.

**Should be:**
```javascript
export const useOwnerUpdateReservationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservation_id, status, cancellation_reason = null }) => {
      const { data } = await reservationApi.patch('/owner/status', {
        reservation_id,
        status,
        cancellation_reason,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerReservations() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerOverview });
    },
  });
};
```

### 4. Pagination Component Standardization

**Missing:** Reusable pagination component that handles all pagination metadata consistently.

**Backend Response Format:**
```json
{
  "Pagination": {
    "currentPage": 1,
    "recordsOnCurrentPage": 10,
    "viewedRecords": 10,
    "remainingRecords": 5,
    "total": 15
  }
}
```

**Recommendation:** Create `src/components/common/Pagination.js` that accepts pagination object and handles navigation.

---

## Performance Optimizations

### 1. Query Stale Time Configuration

**Current State:** Some queries don't have staleTime, causing unnecessary refetches.

**Recommendation:**
```javascript
// For cached data (restaurants, testimonials)
staleTime: 15 * 60 * 1000, // 15 minutes (matches backend cache)

// For user-specific data (profile, points)
staleTime: 5 * 60 * 1000, // 5 minutes

// For real-time data (reservations)
staleTime: 0, // Always fresh
```

### 2. Request Deduplication

**Current:** Multiple components might trigger same query simultaneously.

**Recommendation:** React Query handles this, but ensure `queryKey` is consistent across components.

### 3. Optimistic Updates

**Missing:** No optimistic updates for mutations.

**Recommendation:** Add optimistic updates for:
- Toggle favorites
- Update reservation status (owner)
- Cancel/delete reservations

Example:
```javascript
onMutate: async (newReservation) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: ['userReservations'] });
  
  // Snapshot previous value
  const previous = queryClient.getQueryData(['userReservations']);
  
  // Optimistically update
  queryClient.setQueryData(['userReservations'], (old) => [...old, newReservation]);
  
  return { previous };
},
onError: (err, newReservation, context) => {
  // Rollback on error
  queryClient.setQueryData(['userReservations'], context.previous);
},
```

---

## Security Improvements

### 1. Environment Variables Validation

**Current:** No validation that required env vars are set.

**Recommendation:**
```javascript
// src/config/env.js
const requiredEnvVars = ['VITE_API_BASE_URL'];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter(
    (key) => !process.env[key] && !import.meta.env[key]
  );
  
  if (missing.length > 0 && import.meta.env.MODE !== 'development') {
    console.error('Missing required environment variables:', missing);
    throw new Error('Missing environment variables');
  }
};
```

### 2. API Request Interceptors

**Recommendation:** Add interceptors for:
- Request logging (dev only)
- Token refresh (if implemented)
- Error retry logic

```javascript
// src/config/api.js
reservationApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. Input Sanitization

**Missing:** No explicit input sanitization before sending to API.

**Recommendation:** Create utility functions:
```javascript
// src/utils/validation.js
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 255); // Max length validation
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
```

---

## Detailed Hook-by-Hook Analysis

### useAuth.js

**Issues:**
1. ✅ Good: Uses unified auth status
2. ✅ Good: Proper error handling
3. ⚠️ Missing: No password reset hooks
4. ⚠️ Missing: No confirmation status check hook

**Improvements:**
- Add `useConfirmedUser` hook
- Add password reset hooks
- Add `useUpdateUser` - check if `updates` wrapper is necessary

### useOwnerAuth.js

**Critical Issues:**
1. ❌ Hardcoded baseURL: `"http://localhost:5000/api/v1/owner"`
2. ❌ `useResendVerification` - endpoint might not exist for owner
3. ⚠️ Check: Owner logout endpoint

**Required Fixes:**
```javascript
// BEFORE
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1/owner",  // ❌
  withCredentials: true,
});

// AFTER
import { ownerApi } from '../config/api';
const axiosInstance = ownerApi;
```

### useRestaurants.js

**Issues:**
1. ✅ Good: Proper error handling
2. ✅ Good: Data transformation functions
3. ⚠️ Check: Response structure for `allTrendingRestaurants` vs `restaurants`

**Improvements:**
- Use centralized API client
- Standardize response transformation

### useReservations.js

**Critical Issues:**
1. ❌ Owner status update uses wrong endpoint pattern
2. ⚠️ Missing: Validation for confirmed_user before create

**Required Fixes:**
```javascript
// Current (WRONG)
export const useOwnerConfirmReservation = () => {
  return useMutation({
    mutationFn: async (reservationId) => {
      const { data } = await axiosInstance.patch(`/${reservationId}/status`, {
        status: "confirmed",
      });
      return data;
    },
  });
};

// Should be
export const useOwnerUpdateReservationStatus = () => {
  return useMutation({
    mutationFn: async ({ reservation_id, status, cancellation_reason = null }) => {
      const { data } = await reservationApi.patch('/owner/status', {
        reservation_id,
        status,
        cancellation_reason,
      });
      return data;
    },
  });
};
```

### useCoupons.js

**Critical Issues:**
1. ❌ Purchase uses wrong endpoint
2. ❌ Edit uses wrong endpoint
3. ❌ Delete uses wrong endpoint
4. ⚠️ Missing: Validation for confirmed_user before purchase

**Required Fixes:**
```javascript
// Purchase - BEFORE (WRONG)
const { data } = await axiosInstance.post(`/${couponId}/purchase`);

// Purchase - AFTER
const { data } = await axiosInstance.post('/purchase', {
  coupon_id: couponId
});

// Edit - BEFORE (WRONG)
const { data } = await axiosInstance.patch(`/${couponId}`, patch);

// Edit - AFTER
const { data } = await axiosInstance.patch('/edit', {
  couponId,
  ...patch
});

// Delete - BEFORE (WRONG)
const { data } = await axiosInstance.delete(`/${couponId}`);

// Delete - AFTER
const { data } = await axiosInstance.delete('/delete', {
  data: { couponId }
});
```

### useOwnerRestaurant.js

**Critical Issues:**
1. ❌ Owner overview expects array but backend returns object

**Required Fixes:**
```javascript
// BEFORE
export const useOwnerOverview = () => {
  return useQuery({
    queryKey: ["ownerOverview"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/owner/overview");
      return data.restaurants || [];  // ❌ Wrong expectation
    },
  });
};

// AFTER
export const useOwnerOverview = () => {
  return useQuery({
    queryKey: ["ownerOverview"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/owner/overview");
      return {
        restaurant: data.restaurant,
        statistics: data.statistics || {},
      };
    },
  });
};
```

### useTestimonials.js

**Issues:**
1. ⚠️ Uses `limit` instead of `pageSize` - check backend consistency

### MenuManagement.js Component

**Issues:**
1. ⚠️ Creates own axios instance instead of using centralized config
2. ✅ Good: Proper validation

**Improvements:**
- Use centralized API client

### SpecialMenuManagement.js Component

**Issues:**
1. ⚠️ Creates own axios instance
2. ✅ Good: Complex availability handling

**Improvements:**
- Use centralized API client

---

## Action Items & Priority

### Priority 1: CRITICAL (Must Fix Immediately)

1. **Fix Owner Reservation Status Update Endpoint**
   - File: `src/hooks/customer/useReservations.js`
   - Change: Use `/owner/status` with body `{ reservation_id, status, cancellation_reason }`
   - Impact: Owner cannot update reservation status

2. **Fix Coupon Endpoints (Purchase, Edit, Delete)**
   - File: `src/hooks/customer/useCoupons.js`
   - Changes:
     - Purchase: Use `/purchase` with body `{ coupon_id }`
     - Edit: Use `/edit` with body `{ couponId, ... }`
     - Delete: Use `/delete` with body `{ couponId }`
   - Impact: Coupon management broken

3. **Fix Owner Overview Response Handling**
   - File: `src/hooks/owner/useOwnerRestaurant.js`
   - Change: Handle object response instead of array
   - Impact: Owner dashboard broken

4. **Replace All Hardcoded URLs**
   - Files: `useOwnerAuth.js`, `OwnerLoginPage.js`, `LoginPage.js`
   - Change: Use centralized API config
   - Impact: Production deployment issues

### Priority 2: HIGH (Fix Soon)

5. **Create Centralized API Configuration**
   - New file: `src/config/api.js`
   - Create pre-configured axios instances
   - Update all hooks to use them

6. **Add Confirmed User Validation**
   - New hook: `src/hooks/customer/useConfirmedUser.js`
   - Add checks before reservations and coupon purchases
   - Show user-friendly messages

7. **Implement Password Reset Flow**
   - New pages: ForgotPasswordPage, ResetPasswordPage
   - New hooks: useRequestPasswordReset, useResetPassword, useValidateResetToken
   - Add routes

8. **Standardize Query Keys**
   - New file: `src/config/queryKeys.js`
   - Update all hooks to use centralized keys

### Priority 3: MEDIUM (Improvements)

9. **Centralize Error Handling**
   - New file: `src/utils/apiErrorHandler.js`
   - Replace individual translate functions
   - Add context-aware error messages

10. **Add Optimistic Updates**
    - Update mutations for better UX
    - Implement rollback on errors

11. **Standardize Response Transformers**
    - New file: `src/utils/responseTransformers.js`
    - Consistent data extraction

12. **Add Environment Variable Validation**
    - New file: `src/config/env.js`
    - Validate required vars on app startup

### Priority 4: LOW (Nice to Have)

13. **Add Request/Response Interceptors**
    - Logging (dev only)
    - Error retry logic
    - Token refresh handling

14. **Create Reusable Pagination Component**
    - New component: `src/components/common/Pagination.js`
    - Handle all pagination metadata

15. **Add Input Sanitization Utilities**
    - New file: `src/utils/validation.js`
    - Sanitize all user inputs

16. **Performance Optimizations**
    - Configure staleTime appropriately
    - Add request deduplication checks

---

## Migration Guide

### Step 1: Create Centralized API Config

1. Create `src/config/api.js` with all axios instances
2. Export all API clients
3. Update imports in hooks

### Step 2: Fix Critical Endpoint Issues

1. Update `useReservations.js` - owner status update
2. Update `useCoupons.js` - all three endpoints
3. Update `useOwnerRestaurant.js` - overview response

### Step 3: Replace Hardcoded URLs

1. Update `useOwnerAuth.js`
2. Update `OwnerLoginPage.js`
3. Update `LoginPage.js`

### Step 4: Add Missing Features

1. Create `useConfirmedUser` hook
2. Implement password reset flow
3. Add validation checks

### Step 5: Standardize & Optimize

1. Create query keys file
2. Centralize error handling
3. Add optimistic updates
4. Performance tuning

---

## Testing Checklist

After implementing fixes, test:

- [ ] Owner can update reservation status (pending → confirmed → completed)
- [ ] Owner can cancel reservations with reason
- [ ] User can purchase coupons (only if confirmed)
- [ ] Owner can create/edit/delete coupons
- [ ] Owner overview shows correct statistics
- [ ] All API calls use centralized config (no hardcoded URLs)
- [ ] Error messages are user-friendly
- [ ] Password reset flow works end-to-end
- [ ] Confirmed user validation works
- [ ] Pagination works on all list views

---

## Notes

- This document is based on backend API documentation (`backend_docs/api-documentation.md`)
- Some endpoints might need backend verification
- Priority levels are recommendations - adjust based on business needs
- All fixes should be tested in development before production deployment

---

**Last Updated:** January 2024  
**Next Review:** After implementing Priority 1 fixes

