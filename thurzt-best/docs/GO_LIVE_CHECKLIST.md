# Thurzt Go-Live Checklist & Architecture Guide

This document outlines the production-ready architecture implemented for Thurzt and provides instructions for testing and transitioning from Mock Mode to Firebase Mode.

## Feature Flags

The application uses feature flags to control the active backend services. These are defined in `src/config.ts` and can be overridden via environment variables.

*   `VITE_DATA_MODE`: Controls the data source (`"mock"` or `"firebase"`). Default is `"mock"`.
*   `VITE_PAYMENTS_MODE`: Controls payment processing (`"mock"` or `"live"`). Default is `"mock"`.

**To switch to Firebase mode for local development:**
1. Create a `.env.local` file in the root directory.
2. Add `VITE_DATA_MODE=firebase`.
3. Restart the development server.

## Architectural Changes (P0 & P1)

### P0.1: Server-Authoritative Entitlements & Credits
*   **Implementation:** `EntitlementsService` has been abstracted. In Firebase mode, it relies on `FirebaseFunctionsStubs.ts` which simulates server-side validation and retrieval of entitlements.
*   **Testing (Mock):** Verify that credits decrement correctly when sending Instant Messages and that the paywall appears when credits are 0.
*   **Testing (Firebase):** Switch `DATA_MODE` to `firebase`. Verify that `FirebaseFunctionsStubs.decrementCredits` and `getEntitlements` are called (check console logs).

### P0.2: Matching Distance Querying
*   **Implementation:** `GeoQueryHelper.ts` has been added to simulate geohash-based querying. `MatchingService.ts` uses this helper when in Firebase mode.
*   **Testing (Mock):** Verify that distance filtering works as before using the mock data's `distance` property.
*   **Testing (Firebase):** Switch `DATA_MODE` to `firebase`. Verify that `GeoQueryHelper.filterByDistanceFirebase` is called during candidate fetching (check console logs).

### P0.3: Chat Real-time Architecture
*   **Implementation:** `ChatScreen.tsx` has been updated to use `FirebaseBridge.subscribeToMessages` (an `onSnapshot` stub) instead of polling when in Firebase mode.
*   **Testing (Mock):** Verify that chat messages load and auto-replies appear via the polling mechanism.
*   **Testing (Firebase):** Switch `DATA_MODE` to `firebase`. Verify that `FirebaseBridge.subscribeToMessages` is called and that polling is disabled.

### P0.4: Media Upload Pipeline
*   **Implementation:** `FirebaseBridge.uploadProfilePhoto` now includes a client-side compression stub (`compressImage`) and simulates a Firebase Storage upload path (`/entities/{entityId}/photos/`) in Firebase mode.
*   **Testing (Mock):** Verify that profile photo uploads return a local blob URL.
*   **Testing (Firebase):** Switch `DATA_MODE` to `firebase`. Verify that the compression stub is called and the simulated upload path is logged.

### P1.5: Auth + Onboarding Enforcement
*   **Implementation:** `App.tsx` acts as a central router. It enforces onboarding completion and blocks access to `MATCHING` and `CHAT` tabs if the user's verification status is restricted.
*   **Testing (Mock):** In `OnboardingScreen.tsx`, use the "Simulate Fail" button to set the status to `FAILED_UNCERTAIN`. Verify that Matching and Chat tabs show the "Access Restricted" screen.

### P1.6: Push Notifications
*   **Implementation:** `PushService.ts` now includes a `registerDeviceToken` method that simulates FCM token registration in Firebase mode.
*   **Testing (Mock):** Verify that mock push logs are still generated.
*   **Testing (Firebase):** Switch `DATA_MODE` to `firebase`. Verify that `registerDeviceToken` logs the simulated FCM registration.

### P1.7: Verification Flow Reality
*   **Implementation:** `VerificationService.ts` has been added as a stub for third-party verification providers (e.g., Persona).
*   **Testing (Mock/Firebase):** The onboarding screen currently uses local state to simulate the verification outcome. In a real implementation, it would call `VerificationService.startVerificationFlow`.

### P1.8: Moderation Enforcement
*   **Implementation:** `MockService.blockEntity` and `reportEntity` now call `FirebaseFunctionsStubs` in Firebase mode to simulate secure backend enforcement.
*   **Testing (Mock):** Verify that blocking a user removes them from Matching and Chat.
*   **Testing (Firebase):** Switch `DATA_MODE` to `firebase`. Verify that the Cloud Function stubs for blocking and reporting are called.

## Transitioning to Live Firebase

When you are ready to connect to a live Firebase project:

1.  **Replace Stubs:** Implement the actual Firebase SDK calls in `FirebaseBridge.ts`, `GeoQueryHelper.ts`, and `PushService.ts`.
2.  **Deploy Cloud Functions:** Implement and deploy the functions defined in `FirebaseFunctionsStubs.ts` to your Firebase project. Ensure they include proper security checks and idempotency logic.
3.  **Configure Firestore Rules:** Deploy strict security rules to protect user data, entitlements, and private galleries.
4.  **Configure Storage Rules:** Deploy rules to restrict access to the `/entities/{entityId}/photos/` path.
5.  **Enable Feature Flags:** Set `VITE_DATA_MODE=firebase` and `VITE_PAYMENTS_MODE=live` in your production environment variables.
