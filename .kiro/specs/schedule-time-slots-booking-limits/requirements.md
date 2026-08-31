# Requirements Document

## Introduction

This feature adds per-time-slot booking limits to the Dani & Miki Auto Solution scheduling system. The four predefined time slots — two morning (8:30 AM–10:30 AM, 10:35 AM–12:00 PM) and two afternoon (2:00 PM–3:30 PM, 3:35 PM–5:00 PM) — must each carry a configurable maximum number of bookings. Admins control those limits from the Schedules page. The booking system enforces the limits in real time so that customers can only select slots with remaining capacity.

## Glossary

- **Booking_Limit**: The maximum number of approved or pending bookings allowed within a single time slot on any given day.
- **Time_Slot**: One of the four predefined periods: Morning Slot 1 (8:30 AM–10:30 AM), Morning Slot 2 (10:35 AM–12:00 PM), Afternoon Slot 1 (2:00 PM–3:30 PM), Afternoon Slot 2 (3:35 PM–5:00 PM).
- **TimeClassification**: The existing database model that groups time slots into named periods (Morning, Afternoon) with associated time ranges.
- **Availability_API**: The existing `/api/availability` endpoint that returns available time slots for a given date.
- **Admin**: An authenticated administrator who manages the scheduling configuration through the admin portal.
- **Booking_Modal**: The customer-facing UI component through which customers choose a date and time slot when making a booking.
- **Schedules_Page**: The admin page at `/admin/schedule` where scheduling configuration — including time slot booking limits — is managed.
- **Active_Bookings**: Bookings with status `PENDING_VERIFICATION`, `APPROVED`, `CHECKED_IN`, or `IN_PROGRESS` that count toward a slot's booking limit.

---

## Requirements

### Requirement 1: Booking Limit Configuration per Time Slot

**User Story:** As an admin, I want to set a maximum number of bookings for each time slot, so that the garage does not get overbooked within any single period.

#### Acceptance Criteria

1. THE Schedules_Page SHALL display a "Booking Limits" section within the Time Groups (Time Classifications) tab that shows each active Time_Slot alongside its current Booking_Limit.
2. WHEN an admin updates the Booking_Limit for a Time_Slot, THE Schedules_Page SHALL save the new value to the database without requiring a full page reload.
3. THE Booking_Limit for each Time_Slot SHALL accept only positive integer values greater than or equal to 1.
4. IF an admin submits a Booking_Limit value that is not a positive integer, THEN THE Schedules_Page SHALL display a validation error message and reject the save operation.
5. WHERE a Booking_Limit has not yet been configured for a Time_Slot, THE System SHALL default the Booking_Limit to 5.

---

### Requirement 2: Persisting Booking Limits in the Data Model

**User Story:** As a developer, I want the booking limit for each time slot persisted in the database, so that the value is reliably available to both the admin UI and the availability checks.

#### Acceptance Criteria

1. THE TimeClassification model SHALL include a `bookingLimit` integer field with a default value of 5.
2. WHEN a TimeClassification record is created without specifying a `bookingLimit`, THE System SHALL store the value 5 in that field.
3. THE Admin_API for time classifications SHALL expose the `bookingLimit` field in both read and write operations.
4. WHEN the admin updates the `bookingLimit` via the API, THE System SHALL persist the new value and return the updated record in the response.

---

### Requirement 3: Real-Time Booking Limit Enforcement

**User Story:** As a customer, I want the booking system to prevent me from selecting a time slot that has reached its limit, so that I don't book an already-full period.

#### Acceptance Criteria

1. WHEN the Availability_API receives a date query, THE Availability_API SHALL count Active_Bookings per Time_Slot for that date and compare each count against the corresponding Booking_Limit.
2. WHEN the Active_Bookings count for a Time_Slot equals or exceeds its Booking_Limit on the requested date, THE Availability_API SHALL exclude all individual time times within that Time_Slot from the response.
3. WHEN the Active_Bookings count for a Time_Slot is less than its Booking_Limit on the requested date, THE Availability_API SHALL include the available individual times within that Time_Slot in the response as before.
4. THE Availability_API SHALL apply the booking limit check in addition to — not instead of — existing checks for break hours, blocked times, and in-person bookings.
5. WHEN a booking is submitted for a time that belongs to a Time_Slot that has reached its Booking_Limit, THE Booking_API SHALL reject the request and return an error indicating the slot is full.

---

### Requirement 4: Displaying Slot Capacity in the Booking Modal

**User Story:** As a customer, I want to see when a time group is fully booked, so that I can choose an available period without confusion.

#### Acceptance Criteria

1. WHEN all individual times within a Time_Slot are unavailable due to the Booking_Limit being reached, THE Booking_Modal SHALL display that Time_Slot group as "Fully Booked" instead of hiding the group entirely.
2. WHEN a Time_Slot group is fully booked, THE Booking_Modal SHALL prevent the customer from selecting any time within that group.
3. WHEN at least one individual time within a Time_Slot remains available, THE Booking_Modal SHALL display the available times normally within the group.
4. THE Booking_Modal SHALL show the remaining availability count (e.g., "3 of 5 slots remaining") inside each Time_Slot group header.

---

### Requirement 5: Booking Limits Reflected in Admin Bookings View

**User Story:** As an admin, I want to see how many bookings exist for each time slot on a given day, so that I can monitor capacity at a glance.

#### Acceptance Criteria

1. THE Schedules_Page SHALL display, within the Booking Limits section, the current Active_Bookings count for each Time_Slot for today's date.
2. WHEN the admin selects a specific date on the Schedules_Page, THE Schedules_Page SHALL refresh the Active_Bookings count for all Time_Slots to reflect that date.
3. THE Schedules_Page SHALL visually distinguish Time_Slots that have reached their Booking_Limit (e.g., with a full/red indicator) from those with remaining capacity.
