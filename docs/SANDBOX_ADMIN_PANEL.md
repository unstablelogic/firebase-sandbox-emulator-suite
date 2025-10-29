# Sandbox Admin Panel

The Firebase Sandbox Admin Panel is a web-based interface that provides an interactive way to manage your local Firebase emulator environment. It's only accessible when running in emulator mode for safety.

## Overview

The admin panel is built with Next.js and provides four main tabs:

- **Collections** - Browse and inspect Firestore data
- **Seeding** - Manage seed data and modules
- **Functions** - Trigger Cloud Functions with custom payloads
- **Console** - View real-time logs and activity

## Accessing the Panel

1. Start the sandbox environment:
   ```bash
   npm run sandbox:test
   ```

2. Open your browser to: http://localhost:3000/sandbox

3. The panel will only load if `NEXT_PUBLIC_FIREBASE_EMULATOR=true` in your `.env.local`

## Environment Safety

The admin panel includes several safety mechanisms:

- **Environment Check**: Only renders when `NEXT_PUBLIC_FIREBASE_EMULATOR=true`
- **Warning Banner**: Displays "EMULATOR MODE" indicator
- **No Production Calls**: All Firebase SDK calls are directed to local emulators
- **Port Display**: Shows which emulator ports are being used

## Collections Tab

### Features
- **Collection Selector**: Dropdown to choose Firestore collections
- **Pagination**: Navigate through large datasets (20 documents per page)
- **Document Preview**: View document data in formatted JSON
- **Refresh Button**: Reload collection data
- **Empty State**: Helpful message when collections are empty

### Usage
1. Select a collection from the dropdown
2. Browse documents using pagination controls
3. Click "Refresh" to reload data
4. Use "Previous/Next" to navigate pages

## Seeding Tab

### Features
- **Module Grid**: Visual cards for each seed module
- **Individual Seeding**: Seed specific modules with custom options
- **Bulk Operations**: "Seed All" button for complete reseeding
- **Options Panel**: Configure clear flag and document count
- **Progress Indicators**: Real-time feedback during seeding
- **Toast Notifications**: Success/error messages

### Available Modules
- **Users** - User profiles with roles
- **Products** - E-commerce items
- **Orders** - Order lifecycle data
- **Config** - Application settings

### Usage
1. Configure options (clear existing data, document count)
2. Click individual module cards to seed specific collections
3. Use "Seed All" for complete database reset
4. Monitor progress via indicators and console logs

## Functions Tab

### Features
- **Function Selector**: Dropdown of available Cloud Functions
- **Payload Editor**: JSON textarea for function parameters
- **Example Loader**: Pre-populate with sample payloads
- **Trigger Button**: Execute function calls
- **Response Display**: Show status, response body, and duration
- **Emulator Logs Link**: Direct link to Functions emulator UI

### Available Functions
- **exampleHttpFunction** - HTTP trigger example
- **onOrderCreated** - Firestore trigger example
- **dailyCleanup** - Scheduled function example
- **validateUser** - User validation example

### Usage
1. Select a function from the dropdown
2. Enter JSON payload in the textarea (or use "Load Example")
3. Click "Trigger Function"
4. View response details and execution time
5. Check emulator logs for detailed output

## Console Tab

### Features
- **Auto-scrolling Logs**: Real-time activity feed
- **Color-coded Messages**: Different colors for success, error, info, warning
- **Timestamp Display**: When each event occurred
- **Clear Logs**: Reset console history
- **Export Logs**: Download logs as JSON file

### Message Types
- **Success** (Green): Successful operations
- **Error** (Red): Failed operations with details
- **Info** (Blue): General information
- **Warning** (Yellow): Non-critical issues

## API Routes

The admin panel uses several API routes:

### `/api/sandbox/seed`
- **POST**: Execute seed operations
- **GET**: List available seed modules

### `/api/sandbox/collections`
- **GET**: Fetch paginated collection data

### `/api/sandbox/trigger`
- **POST**: Trigger Cloud Functions

## Extending the Panel

### Adding Custom Views

1. Create new components in `components/Sandbox/`
2. Add tabs to `SandboxTabs.tsx`
3. Implement corresponding API routes if needed

### Custom Seed Modules

1. Add module to `sandbox/modules/`
2. Update the seeding tab to include your module
3. Add corresponding JSON template

### Custom Functions

1. Add functions to `firebase/functions/src/index.ts`
2. Update function selector dropdown
3. Create example payloads

## Troubleshooting

### Panel Won't Load
- Verify `NEXT_PUBLIC_FIREBASE_EMULATOR=true` in `.env.local`
- Check that emulators are running (`npm run sandbox:health`)
- Clear browser cache and reload

### Seeding Fails
- Ensure emulators are running
- Check Firestore rules allow writes
- Verify seed modules are properly configured

### Functions Don't Trigger
- Check Functions emulator is running on port 5001
- Verify function names match exactly
- Check payload JSON is valid

### Console Shows Errors
- Check browser developer console for JavaScript errors
- Verify API routes are accessible
- Check emulator logs for backend errors

## Best Practices

1. **Always use emulator mode** - Never run the panel against production
2. **Monitor console logs** - Watch for errors and warnings
3. **Use pagination** - Don't load too many documents at once
4. **Clear data regularly** - Use seeding to reset test data
5. **Export logs** - Save logs for debugging and analysis

## Security Notes

- The panel is designed for local development only
- No authentication is required (emulator environment)
- All data is temporary and stored locally
- Never deploy this panel to production

For more information, see the [Getting Started Guide](GETTING_STARTED.md) and [Troubleshooting](TROUBLESHOOTING.md).

