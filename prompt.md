Continue working on the Birashoboka V2 frontend from the previous step.

The TSX → JSX conversion has already been completed.

ABSOLUTE RULE: THE UI IS NOW FROZEN

The frontend visual design from ~/grace/learn/web is the approved design.

You must preserve it exactly.

You are now allowed to change the APPLICATION ARCHITECTURE, but you are NOT allowed to redesign the UI.

Do not change:

- layouts
- CSS
- Tailwind classes
- colors
- typography
- spacing
- buttons
- cards
- icons
- images
- animations
- navigation appearance
- page structure
- forms visually
- admin dashboard visually
- responsive design

Do not recreate components.

Do not replace existing components with new designs.

TASK 1 — GLOBAL CONTEXT

Create:

src/context/GlobalContext.jsx

Create a provider and hook for shared application state.

The context should eventually be capable of holding shared application data such as:

- posts
- members
- campaigns
- volets
- activities
- partners
- testimonials
- students
- inscriptions
- loading states
- API errors
- refresh functions

Do not invent unnecessary data structures yet.

Keep existing mock data working for now where the backend is not yet connected.

The purpose of this phase is to prepare the architecture.

TASK 2 — AUTH CONTEXT

Create:

src/context/AuthContext.jsx

Prepare authentication state for the admin application.

It should manage concepts such as:

- current user
- authentication state
- JWT token
- login
- logout
- session restoration
- protected admin state

Do not invent backend endpoints yet.

The backend will be provided in the next phase.

Do not create fake API authentication.

Do not change the existing admin UI.

TASK 3 — AXIOS API WRAPPER

Create:

src/services/api.js

Install/configure Axios.

Create one centralized Axios instance.

The API base URL must be configurable.

For example:

VITE_API_URL=/api

Do not hardcode a production domain.

Prepare the Axios instance so that JWT authentication can later be attached automatically.

For example, use an Axios interceptor where appropriate.

Do not yet invent endpoint URLs that have not been verified against the backend.

TASK 4 — PROVIDERS

Configure the application so that:

GlobalProvider
    ↓
AuthProvider
    ↓
Application

or an equivalent clean architecture is used.

Do not change the application's visual output.

TASK 5 — MOVE STATE CAREFULLY

Where existing application-wide state is currently duplicated between components, you may move it into the appropriate context.

However:

DO NOT rewrite the visual JSX.

For an existing component, the goal is:

same JSX
same classes
same layout
same UI
different state/data source

not:

old component
    ↓
new component
    ↓
new design

IMPORTANT — MOCK DATA

Do not delete all mock data simply because Context now exists.

Keep the application functional until the backend is connected.

Do not invent backend behavior.

IMPORTANT — NO BACKEND YET

Do not modify backend code.

Do not create backend models.

Do not create API endpoints.

Do not guess backend routes.

The backend will be uploaded in the next prompt.

VALIDATION

After this phase:

- frontend must still build
- frontend must still run
- every existing page must look the same
- public website must look the same
- admin pages must look the same
- mobile layout must look the same
- navigation must look the same
- existing functionality must remain available

If adding Context or Axios requires changing a component, change only the minimum logic necessary.

SUCCESS CRITERIA

At the end of this phase we should have:

Birashoboka UI
      ↓
JSX
      ↓
GlobalContext
      ↓
AuthContext
      ↓
Axios API layer

while the UI remains visually unchanged.

Do not redesign anything.

Do not touch the backend.

Wait for the next phase before implementing backend integration.
