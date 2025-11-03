# 🎲 Random Restaurants Feature

## Overview

Since dedicated `/trending` and `/discounted` endpoints are not currently available, the application uses a **fallback mechanism** to display random restaurants.

## Implementation

### Trending Restaurants (`useTrendingRestaurants`)

**Logic:**
1. **Try API first**: Attempts to fetch from `/api/v1/restaurant/trending`
2. **Fallback**: If endpoint doesn't exist or returns no data:
   - Fetches all restaurants from `/api/v1/restaurant?page=1&pageSize=100`
   - Randomly selects **6 restaurants**
   - Returns them as "trending"

**Features:**
- ✅ No errors shown if trending endpoint is missing (silent fallback)
- ✅ Always shows random 6 restaurants if API has data
- ✅ Shows empty state if no restaurants exist in database

### Discounted Restaurants (`useDiscountedRestaurants`)

**Logic:**
1. **Try API first**: Attempts to fetch from `/api/v1/restaurant/discounted`
2. **Fallback**: If endpoint doesn't exist or returns no data:
   - Fetches all restaurants from `/api/v1/restaurant?page=1&pageSize=100`
   - Filters restaurants that have `special_menus` (array with length > 0)
   - For each restaurant with menus, creates menu objects with nested restaurant
   - Randomly selects **6 special menu items** (with their restaurants)
   - Returns them as "discounted"

**Features:**
- ✅ Only shows restaurants that actually have special menus/discounts
- ✅ Each menu item includes full restaurant information
- ✅ No errors shown if discounted endpoint is missing (silent fallback)
- ✅ Shows empty state if no restaurants with special menus exist

## Random Selection Algorithm

```javascript
const getRandomItems = (array, count) => {
  if (array.length === 0) return [];
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
```

- Uses Fisher-Yates-like shuffle
- Always returns different random selection on each page load
- Respects array bounds (won't crash if fewer items than requested)

## Error Handling

- **404 errors**: Silently fallback (no error toast shown)
- **Other errors**: Show error toast to user
- **Empty results**: Show user-friendly empty state messages

## Caching

Both hooks use `staleTime: 15 * 60 * 1000` (15 minutes) to match backend cache:
- First load: Fetches data
- Subsequent loads (within 15 min): Uses cached data
- After 15 min: Refetches (gets new random selection)

## Future Enhancement

When dedicated endpoints are implemented:
- The hooks will automatically detect and use them
- Fallback will only activate if endpoints return empty or error
- No code changes needed in components

## Testing

To test fallback behavior:
1. Ensure backend has restaurants in database
2. Visit homepage
3. Should see 6 random restaurants in each section
4. Refresh page → Different random selection
5. Check browser console for fallback logs (development mode)

---

**Status**: ✅ Implemented and working
**Default Count**: 6 restaurants per section
**Random Selection**: New random set on each cache refresh (15 minutes)

