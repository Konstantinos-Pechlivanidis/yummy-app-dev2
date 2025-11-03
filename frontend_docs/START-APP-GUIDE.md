# 🚀 Guide: Starting the App Successfully

## Πριν Ξεκινήσεις

### 1. ✅ Verify Dependencies
```powershell
# Εάν δεν έχεις εγκαταστήσει dependencies
npm install
```

### 2. ✅ Clear All Caches (IMPORTANT!)
```powershell
# Stop όλα τα Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Καθαρισμός cache
Remove-Item -Recurse -Force .\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\node_modules\.cache -ErrorAction SilentlyContinue
if (Test-Path ".eslintcache") { Remove-Item -Force .eslintcache }
```

### 3. ✅ Create .env File (Recommended)

Δημιούργησε ένα `.env` file στο root directory με το παρακάτω content:

```env
SKIP_PREFLIGHT_CHECK=true
GENERATE_SOURCEMAP=false
FAST_REFRESH=true
WDS_SOCKET_HOST=localhost
WDS_SOCKET_PORT=3000
```

Αυτό βοηθάει το webpack dev server να servάρει σωστά τα JavaScript chunks.

## Ξεκίνα την Εφαρμογή

### Development Mode
```powershell
npm start
```

Το app θα ανοίξει αυτόματα στο browser στο `http://localhost:3000`

## Αν Παίρνεις Chunk Load Errors

### Step 1: Hard Refresh Browser
- **Chrome/Edge**: `Ctrl + Shift + R`
- **Firefox**: `Ctrl + F5`
- **Or**: Clear browser cache (`Ctrl + Shift + Delete`)

### Step 2: Clear Browser Storage
1. Άνοιξε Developer Tools (F12)
2. Application → Storage → Clear site data
3. Refresh page

### Step 3: Try Incognito/Private Mode
Αν το πρόβλημα συνεχίζεται, δοκίμασε incognito mode για να αποκλείσεις browser cache issues.

### Step 4: Full Restart
```powershell
# Stop server (Ctrl+C στο terminal όπου τρέχει)
# Then:
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .\node_modules\.cache -ErrorAction SilentlyContinue
npm start
```

## Verify Everything Works

### ✅ Checklist:
- [ ] Server ξεκίνησε χωρίς compilation errors
- [ ] Browser ανοίγει στο `localhost:3000`
- [ ] Console (F12) δεν έχει chunk errors
- [ ] Network tab (F12) δείχνει JavaScript files με status 200
- [ ] App φορτώνει και λειτουργεί

## Common Issues

### Issue: "Unexpected token '<'"
**Cause**: Server επιστρέφει HTML αντί για JavaScript  
**Fix**: 
1. Clear browser cache
2. Restart server
3. Verify `.env` file exists

### Issue: ChunkLoadError
**Cause**: Browser δεν μπορεί να φορτώσει JavaScript chunks  
**Fix**:
1. Hard refresh browser
2. Clear browser storage
3. Restart server με clean cache

### Issue: Port 3000 already in use
**Fix**:
```powershell
# Stop process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
# Or use different port:
$env:PORT=3001; npm start
```

## Production Build

Για production build:
```powershell
npm run build
```

Το build folder θα δημιουργηθεί. **Μην** τρέχεις `npm start` όταν υπάρχει build folder - αυτό προκαλεί conflicts.

## Notes

- **Development mode** (`npm start`) ≠ **Production build** (`npm run build`)
- Μην έχεις `build/` folder όταν τρέχεις development server
- Browser cache μπορεί να προκαλεί issues - hard refresh συχνά λύνει το πρόβλημα
- Αν το πρόβλημα συνεχίζεται, δοκίμασε **different browser**

## Success Indicators

✅ Server compiles successfully (no errors in terminal)  
✅ Browser console is clean (no red errors)  
✅ Network tab shows all JavaScript files loading with 200 status  
✅ App UI loads and is interactive

---

**Status**: ✅ Ready to start!  
**Next Step**: `npm start` και έλεγξε το browser!

