## Non-Functional Requirements (NFR)

* **NFR-01:** The system must be developed as a full-stack web application.
* **NFR-02:** The system must use JavaScript, Node.js, Express, and MongoDB as the main back-end technologies.
* **NFR-03:** The system must use HTML, CSS, JavaScript, and the Bootstrap framework as the main front-end technologies.
* **NFR-04:** The system must use MongoDB, specifically through the MongoDB Atlas cloud service, for data persistence.
* **NFR-05:** The code must follow the Model-View-Controller (MVC) design pattern.
* **NFR-06:** The visual design of the system must be implemented by strictly following 100% of the guidelines (colors, typography, and styles) from the institutional brand book provided by the client.
* **NFR-07:** The system must have a responsive design that, on desktop screens, displays a horizontal menu, cards distributed in multiple columns, well-distributed lists, and centered forms.
* **NFR-08:** The system must adapt its interface on mobile devices by reorganizing the menu, displaying cards in a single column, and expanding forms to the full width of the screen to facilitate reading.
* **NFR-09:** Buttons in the mobile version must have a minimum touch target area of 44x44 pixels.
* **NFR-10:** The system must mandatorily implement custom media queries to support a visual dark mode.
* **NFR-11:** The system must provide clear visual feedback (success, warning, or error messages on screen) after any major interaction, such as submitting the enrollment form.
* **NFR-12:** The system must validate all data entries via client-side JavaScript to verify mandatory fields and correct formats (e.g., email) before sending the request.
* **NFR-13:** The backend must re-validate and sanitize incoming information to prevent malicious code injection or the insertion of corrupt data into the database.
* **NFR-14:** Access credentials for the administrator role must be securely managed using a one-way encryption algorithm (hashing) with an appropriate work factor (bcrypt) before being stored in the database.
* **NFR-15:** The system must process catalog queries and apply filters in a response time of less than 2 seconds under normal network conditions.
* **NFR-16:** The system must support a minimum of 100 concurrent requests on the enrollment form without the server error rate exceeding 1%.
* **NFR-17:** The source code and documentation must be backed up using a GitHub repository to facilitate its maintenance.
* **NFR-18:** The system must handle database connection errors or server failures in a controlled manner, displaying user-friendly messages instead of exposing the error trace.
* **NFR-19:** The user interface must comply with accessibility regulations, specifically implementing the WCAG 2.4.7 (Focus Visible) criterion to ensure all interactive elements have a clear focus indicator when navigating by keyboard.
* **NFR-20:** All informative images in the activities catalog, stands, and banners must mandatorily include the "alt" attribute with a precise description of the content for users with blindness or very low-speed connections.
* **NFR-21:** The system must use semantic HTML5 tags (nav, main, section, footer) to structure content, facilitating keyboard navigation and the browser's reading hierarchy.
* **NFR-22:** No critical notification (such as enrollment errors, full capacity warnings, or confirmations) should rely exclusively on auditory signals; all must be accompanied by persistent visual alerts until dismissed by the user.
* **NFR-23:** If the visitor loses internet connection while filling out the enrollment form or if a server error occurs upon submission (NFR-18), the system must preserve the entered data on the client side so the user does not have to retype it when retrying.
* **NFR-24:** Data communication between the front-end and back-end must mandatorily be done by consuming a RESTful API, using the JSON format for requests and responses.
