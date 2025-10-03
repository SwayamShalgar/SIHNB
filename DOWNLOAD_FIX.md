# Certificate Download Fix

## Issue
The certificate download functionality was not working because the download links were hardcoded to use `http://localhost:5000`, but the server is actually running on port `5001` (as configured in the client's proxy settings).

## Root Cause
- Server runs on port `5001` (defined in `server/index.js`)
- Client proxy is configured for `http://localhost:5001` (in `client/package.json`)
- Download links were hardcoded to `http://localhost:5000` causing 404 errors

## Solution
Changed the hardcoded absolute URLs to relative URLs so they go through the React proxy:

### Files Modified:

1. **`client/src/pages/ViewCertificate.js`**
   - Changed: `href={`http://localhost:5000${certificate.pdfUrl}`}`
   - To: `href={certificate.pdfUrl}`
   - This allows the download link to use the proxy configuration

2. **`client/src/pages/IssueCertificate.js`**
   - Changed: `href={`http://localhost:5000${certificateData.pdfUrl}`}`
   - To: `href={certificateData.pdfUrl}`
   - This allows the download link to use the proxy configuration

## How It Works Now
1. The backend serves PDFs at `/certificates/*` via express.static middleware
2. The client proxy forwards all non-React requests to `http://localhost:5001`
3. When a user clicks download, the relative URL `/certificates/certificate_xxx.pdf` is used
4. The proxy automatically forwards it to `http://localhost:5001/certificates/certificate_xxx.pdf`
5. The PDF downloads successfully

## Testing
To verify the fix:
1. Start the server: `cd server && npm start`
2. Start the client: `cd client && npm start`
3. Issue a certificate
4. Click "Download PDF" - it should now work correctly

## Benefits
- Works regardless of which port the server runs on
- No hardcoded URLs to maintain
- Uses the existing proxy configuration properly
- More maintainable and production-ready
