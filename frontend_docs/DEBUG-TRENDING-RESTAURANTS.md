# 🔍 Debug: Δημοφιλή Εστιατόρια - Troubleshooting

## Πρόβλημα

Τα "Δυναμικές Εκπτώσεις" εμφανίζονται, αλλά τα "Δημοφιλή Εστιατόρια" **δεν εμφανίζονται**.

## API Endpoints

### 1. Primary Endpoint (Trending)
```
GET /api/v1/restaurant/trending?page=1&pageSize=6
```

**Expected Response:**
```json
{
  "restaurants": [...],
  "Pagination": {
    "currentPage": 1,
    "total": 10
  }
}
```

### 2. Fallback Endpoint (All Restaurants)
```
GET /api/v1/restaurant/?page=1&pageSize=100
```

**Expected Response:**
```json
{
  "restaurants": [...],
  "Pagination": {...}
}
```

## 🔍 Debugging Steps

### Step 1: Check Browser Console (F12)

Άνοιξε **Developer Tools** (F12) → **Console** tab και ψάξε για:

1. **`[Trending API] Response:`**
   - Αν βλέπεις αυτό → Το `/trending` endpoint απάντησε
   - Check: `restaurantsCount` - πόσα εστιατόρια επέστρεψε

2. **`[Trending API] Endpoint failed, using fallback:`**
   - Αν βλέπεις αυτό → Το `/trending` endpoint failed ή δεν υπάρχει
   - Check: `status` - ποιο HTTP status code

3. **`[Trending Fallback] Fetching all restaurants...`**
   - Αν βλέπεις αυτό → Το fallback ξεκίνησε

4. **`[Trending Fallback] Received:`**
   - Αν βλέπεις αυτό → Το fallback API απάντησε
   - Check: `restaurantsCount` - πόσα εστιατόρια βρέθηκαν στη βάση

5. **`[TrendingRestaurantsCarousel] Hook state:`**
   - Shows component state
   - Check: `trendingCount` - πόσα εστιατόρια έχει το component

### Step 2: Check Network Tab (F12)

1. F12 → **Network** tab
2. Filter: "XHR" or "Fetch"
3. Reload page
4. Look for:
   - `/api/v1/restaurant/trending?page=1&pageSize=6`
   - `/api/v1/restaurant/?page=1&pageSize=100`

5. Click on each request → **Preview** tab
6. Check:
   - **Status**: 200 OK (green) or error?
   - **Response**: Τι επιστρέφει;

### Step 3: Verify Backend

#### Test Trending Endpoint:
```bash
curl http://localhost:5000/api/v1/restaurant/trending?page=1&pageSize=6
```

#### Test Fallback Endpoint:
```bash
curl http://localhost:5000/api/v1/restaurant/?page=1&pageSize=100
```

### Step 4: Check API Base URL

1. Check `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

2. Or check `src/config/api.js`:
   ```javascript
   const API_BASE = "http://localhost:5000"; // Default
   ```

## 🐛 Common Issues

### Issue 1: Trending Endpoint Returns Empty Array
**Symptom**: Console shows `restaurantsCount: 0`

**Solution**: 
- Backend doesn't have trending data
- Fallback should activate → Check if fallback works

### Issue 2: Trending Endpoint Returns 404/500
**Symptom**: Console shows `status: 404` or `500`

**Solution**:
- Endpoint doesn't exist → Fallback should activate
- If fallback also fails → Backend issue

### Issue 3: Fallback Returns Empty Array
**Symptom**: Console shows `[Trending Fallback] Received: restaurantsCount: 0`

**Solution**:
- **Database is empty** → Add restaurants to backend database
- Backend needs data!

### Issue 4: Fallback Fails with Error
**Symptom**: Console shows `Error in trending restaurants fallback:`

**Possible Causes**:
- Backend not running
- Wrong API base URL
- CORS error
- Network error

## ✅ Expected Console Output (Success)

```
[Trending API] Response: { hasData: true, restaurantsCount: 6, ... }
// OR
[Trending API] Endpoint failed, using fallback: { status: 404 }
[Trending Fallback] Fetching all restaurants...
[Trending Fallback] Received: { restaurantsCount: 20, ... }
[Trending Fallback] Selected random restaurants: 6
[TrendingRestaurantsCarousel] Hook state: { trendingCount: 6, ... }
```

## 🎯 Quick Fix Checklist

- [ ] Backend is running (`http://localhost:5000`)
- [ ] Backend has restaurants in database
- [ ] API base URL is correct (check `.env`)
- [ ] No CORS errors in console
- [ ] Network tab shows successful API calls (200 OK)
- [ ] Console shows debug logs with data

## 📝 Next Steps

Μετά από debugging, στείλε μου:
1. Console logs (F12 → Console)
2. Network tab screenshots (F12 → Network → Preview)
3. API responses (αν τα βλέπεις)

---

**Status**: Debugging enabled. Check browser console for detailed logs.

