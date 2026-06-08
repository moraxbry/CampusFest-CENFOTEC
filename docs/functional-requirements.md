## Functional Requirements (FR)

* **FR-01:** The system must display a home page with the festival's name, a brief description, general date, main venue, navigation menu, and a section with 3 featured activities.
* **FR-02:** The system must display in the featured activities section the 3 activities determined by having the fewest available spots.
* **FR-03:** The 3 featured activities on the home page must update dynamically to exclusively show the 3 activities with the lowest number of available spots at that moment.
* **FR-04:** The system must display the festival agenda in a daily hour calendar style at the top of the activities catalog page.
* **FR-05:** The system must display the visual catalog of activities presented through cards.
* **FR-06:** The system must display the full details of an individual activity, including name, description, category, date, time, location, participation requirements, and availability.
* **FR-07:** The system must show the simulated status of available spots in the activity catalog using the statuses "full", "available", or "canceled".
* **FR-08:** The system must allow users to filter the activity catalog by category, exact date, and status (future >8 hours, in progress, or past); it must allow the use of multiple or combined filters.
* **FR-09:** The system must logically organize and display the activity catalog by the closest upcoming date and time.
* **FR-10:** The system must display a page with the participating stands or groups, detailing their name, category, person in charge, location, and description.
* **FR-11:** The system must include a contact page with the organizing committee's information, email, phone number, and an inquiry form.
* **FR-12:** The system must include a page to display the winners and recognitions for each of the concluded activities.
* **FR-13:** The system must include an "Enroll" button inside the activity cards and display the registration form in a modal (overlay) window to avoid forcing the user to leave the catalog.
* **FR-14:** The form must mandatorily capture full name, ID, email, phone number, major or group, selected activity, and optionally, comments.
* **FR-15:** The system must validate that the mandatory form fields are not empty and that the email format is correct before processing the form submission.
* **FR-16:** The system must prevent duplicate enrollments by validating the uniqueness of the entered email address for the same activity.
* **FR-17:** The system must send an automatic confirmation email to the participant after a successful enrollment and display a confirmation message directly on the screen.
* **FR-18:** The system must automatically register the participant on a waiting list in case the activity's maximum capacity status is "full".
* **FR-19:** The system must display a warning message to the participant when they are placed on the waiting list and automatically notify them via email.
* **FR-20:** The system must allow the administrator user to register, edit, and cancel activities.
* **FR-21:** The system must allow the administrator to consult the detailed enrollment information of each participant.
* **FR-22:** The system must allow the administrator to be the only one with privileges to cancel or modify user enrollments.
* **FR-23:** The system must allow the administrator to register and edit the information of the participating stands and groups.
* **FR-24:** The system must allow the administrator to update and publish results or recognitions in the winners section.
* **FR-25:** The system must allow the administrator to modify, add, or delete the general information on the home and contact pages.
