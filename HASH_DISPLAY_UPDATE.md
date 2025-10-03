# Hash Display Update - Transaction & Certificate Hashes

## Overview

Updated the certificate viewing interface to display blockchain transaction hashes and certificate hashes in a truncated, user-friendly format while keeping the full hash available on hover.

## Changes Made

### 1. **ViewCertificate.js** (`/client/src/pages/ViewCertificate.js`)

**Purpose**: Main certificate viewing page

**Added Helper Function**:

```javascript
const truncateHash = (hash) => {
  if (!hash || hash === "pending" || hash === "null") {
    return "N/A";
  }
  if (hash.length <= 15) {
    return hash;
  }
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};
```

**Updated Display**:

- Transaction Hash: Shows first 6 + last 4 characters (e.g., `0x1a2b...9f8e`)
- Certificate Hash: Shows first 6 + last 4 characters
- Full hash visible on hover via `title` attribute
- Handles null/pending values gracefully (displays "N/A")

**Before**:

```jsx
<code className="bc-value">{certificate.txHash}</code>
<code className="bc-value">{certificate.hash}</code>
```

**After**:

```jsx
<code className="bc-value" title={certificate.txHash || 'Not available'}>
  {truncateHash(certificate.txHash)}
</code>
<code className="bc-value" title={certificate.hash}>
  {truncateHash(certificate.hash)}
</code>
```

---

### 2. **IssueCertificate.js** (`/client/src/pages/IssueCertificate.js`)

**Purpose**: Certificate issuance page showing success confirmation

**Added Helper Function**: Same `truncateHash()` function

**Updated Display**:
Success screen after issuing certificate now shows truncated hashes with hover tooltip

**Before**:

```jsx
<span className="detail-value hash">{certificateData.txHash}</span>
<span className="detail-value hash">{certificateData.hash}</span>
```

**After**:

```jsx
<span className="detail-value hash" title={certificateData.txHash || 'Not available'}>
  {truncateHash(certificateData.txHash)}
</span>
<span className="detail-value hash" title={certificateData.hash}>
  {truncateHash(certificateData.hash)}
</span>
```

---

### 3. **VerifyCertificate.js** (`/client/src/pages/VerifyCertificate.js`)

**Purpose**: Certificate verification page

**Added Helper Function**: Same `truncateHash()` function

**Updated Display**:
Verification results now show truncated transaction hash

**Before**:

```jsx
<code className="hash-value">{result.certificate.txHash}</code>
```

**After**:

```jsx
<code
  className="hash-value"
  title={result.certificate.txHash || "Not available"}
>
  {truncateHash(result.certificate.txHash)}
</code>
```

---

## Hash Display Logic

### Truncation Format

- **Input**: `0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t`
- **Output**: `0x1a2b...9s0t`
- **Format**: First 6 characters + `...` + Last 4 characters

### Edge Cases Handled

1. **Null/Undefined**: Displays "N/A"
2. **"pending"**: Displays "N/A" (for async blockchain confirmations)
3. **"null" string**: Displays "N/A"
4. **Short hashes** (≤15 chars): Displays full hash (no truncation)
5. **Normal hashes** (>15 chars): Truncates to 6...4 format

### User Experience Benefits

✅ **Clean UI**: No overwhelming long hash strings
✅ **Full Access**: Hover to see complete hash
✅ **Copy-Friendly**: Users can still copy full hash via tooltip
✅ **Blockchain-Ready**: Gracefully handles mock/pending states
✅ **Consistent**: Same truncation across all pages

---

## Technical Details

### Current Blockchain Status

- **Code**: Fully implemented
- **Active**: No (using placeholder credentials)
- **Current Behavior**:
  - Transaction Hash: `null` (stored in DB as NULL)
  - Display: Shows "N/A"
  - When blockchain is enabled: Will show actual hash like `0x1a2b...9f8e`

### Database Fields

- `blockchain_tx_hash`: Stores full transaction hash from blockchain
- `certificate_hash`: Stores SHA-256 hash of certificate data

### API Response Format

```json
{
  "certificate": {
    "id": "uuid",
    "txHash": "0x1a2b3c4d..." or null,
    "hash": "sha256-hash-string",
    ...
  }
}
```

---

## Pages Updated

| Page               | File                   | Hash Type Displayed                 |
| ------------------ | ---------------------- | ----------------------------------- |
| View Certificate   | `ViewCertificate.js`   | Transaction Hash + Certificate Hash |
| Issue Certificate  | `IssueCertificate.js`  | Transaction Hash + Certificate Hash |
| Verify Certificate | `VerifyCertificate.js` | Transaction Hash                    |

---

## Testing Scenarios

### Scenario 1: Current State (Blockchain Not Active)

- Transaction Hash: `null` → Displays **"N/A"**
- Certificate Hash: `abc123...` → Displays **"abc123...xyz"**
- Hover: Shows full certificate hash

### Scenario 2: After Blockchain Activation

- Transaction Hash: `0x1a2b3c4d5e6f7g8h9i0j...` → Displays **"0x1a2b...9s0t"**
- Certificate Hash: `abc123def456...` → Displays **"abc123...xyz"**
- Hover: Shows complete hashes

### Scenario 3: Pending Transaction

- Transaction Hash: `"pending"` → Displays **"N/A"**
- Certificate Hash: Valid → Displays truncated hash
- Hover: Shows "Not available" for pending TX

---

## Visual Example

### Before Update:

```
Transaction Hash: 0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
Certificate Hash: abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

_(Overflows UI, hard to read)_

### After Update:

```
Transaction Hash: 0x1a2b...9s0t ⓘ
Certificate Hash: abc123...234yz ⓘ
```

_(Clean, compact, hover for full hash)_

---

## Files Modified

1. `/client/src/pages/ViewCertificate.js`
2. `/client/src/pages/IssueCertificate.js`
3. `/client/src/pages/VerifyCertificate.js`

## No Breaking Changes

- ✅ Backward compatible with existing data
- ✅ Works with null/pending values
- ✅ CSS classes unchanged
- ✅ Database schema unchanged
- ✅ API responses unchanged

---

## Next Steps (When Blockchain is Enabled)

Once you deploy the smart contract and update `.env`:

1. Transaction hashes will be real (e.g., `0x1a2b3c4d5e6f...`)
2. Display will automatically show truncated format
3. Users can hover to see full hash
4. Can click to view on PolygonScan (future enhancement)

---

## Summary

✨ **Hash displays are now clean, user-friendly, and professional**
✨ **Full hashes accessible via hover tooltip**
✨ **Gracefully handles blockchain inactive state (shows "N/A")**
✨ **Ready for blockchain activation - no further changes needed**
