Now I am we gonna work on the backend project:

/home/grace/learn/api

You now have:

1. The original Birashoboka UI
2. The converted JSX frontend
3. GlobalContext
4. AuthContext
5. Axios API layer
6. The Birashoboka backend at /home/grace/learn/api

Your task is now to integrate them.

MOST IMPORTANT RULE

The existing frontend UI is FROZEN.

The backend must adapt to the existing frontend architecture and the frontend must connect to the backend.

DO NOT redesign the frontend.

DO NOT recreate the frontend from the backend.

DO NOT replace the existing UI with a different UI.

The existing frontend is the visual source of truth.

If backend requirements conflict with the visual implementation:

«Preserve the UI and modify only the data/logic necessary to connect it.»

FIRST: INSPECT THE BACKEND

Before changing anything, inspect the backend thoroughly.

Identify:

- database models
- migrations
- controllers
- routes
- authentication
- middleware
- validation
- image handling
- existing services
- relationships
- existing API response structures

Do not assume endpoint names.

Do not invent models that already exist.

Do not rewrite working backend functionality unnecessarily.

FINAL PROJECT STRUCTURE

The final project must contain:

learn/
├── web/
└── api/

The existing frontend remains inside:

web/

The backend remains inside:

api/

AXIOS INTEGRATION

Connect the existing:

web/src/services/api.js

to the actual backend routes.

Use the real endpoints discovered in the backend.

Do not invent endpoints.

Organize API calls cleanly.

Use Axios for:

- public data
- admin data
- authentication
- CRUD operations
- image uploads
- student/inscription submissions

GLOBAL CONTEXT

Connect GlobalContext to the real API.

Replace mock data progressively with backend data.

The backend becomes the source of truth.

For example:

API
 ↓
GlobalContext
 ↓
Existing components
 ↓
Existing UI

Do not redesign the components.

AUTH CONTEXT

Connect AuthContext to the real backend authentication.

Implement:

- admin login
- JWT storage/session restoration
- authenticated Axios requests
- logout
- current authenticated user
- protected admin routes
- handling of expired/invalid JWT

Use the actual backend authentication implementation.

Do not invent a second authentication system.

MEMBER

The backend must support the Member/team-member entity.

If Member is missing or incomplete, add the necessary:

- model
- migration
- controller
- validation
- routes
- relationships

Then connect the EXISTING admin UI to Member CRUD.

Required functionality:

- list members
- create member
- update member
- delete member
- image upload if required by the existing web/data structure

Do not redesign the Members interface.

POSTS AND IMAGES

Inspect the existing Post implementation and compare it with the existing frontend requirements.

Posts must support the required image structure, including where appropriate:

featured_image
image_urls

Images should be uploaded rather than entered merely as text URLs.

Use the existing backend image service if available.

Implement:

- image validation
- optimization
- upload
- storage
- create
- update
- replacement where required

On the frontend, use the EXISTING post forms and add only the necessary file inputs.

Do not redesign the forms.

For Posts, both ui and backend must have featured_image and a list of image_urls, for this add in the admin panel inputs type=file to allow image upload for post as for patch. adapt the backend models and controllers accordingly
Use "FormData" for multipart requests.

STUDENT / INSCRIPTION / CAMPAIGN

Inspect the existing Apply/Inscription frontend form.

Compare every field with the backend models.

If the frontend already has a student-related field that the backend cannot store, add the required backend support.

Do not remove existing fields.

Do not redesign the form.

The flow should work approximately as:

Existing Apply UI
       ↓
Existing form fields
       ↓
Axios
       ↓
Backend
       ↓
Student
       +
Inscription
       +
Campaign/related entities

Use proper database relationships and validation.

ADMIN DASHBOARD

Connect the existing admin dashboard to the real API.

Existing dashboard design must remain unchanged.

Connect existing interfaces to:

- Students
- Inscriptions
- Campaigns
- Posts
- Volets
- Activities
- Partners
- Members

Only add missing controls/inputs where the functionality genuinely requires them.

MISSING INPUTS

Compare the existing frontend forms against the actual backend requirements.

Add only genuinely missing inputs.

Examples may include:

<input type="file" />

for image uploads.

Do not add arbitrary fields.

Do not remove existing fields.

Do not redesign forms.

RESPONSIVE NAVIGATION

Preserve the existing responsive design.

For the existing hamburger navigation:

- open an off-canvas panel from the right
- animate it toward the left
- prevent background scrolling while open
- restore scrolling when closed

Do not redesign the navigation.

DEPLOYMENT

Configure Vite so:

npm run build

outputs directly into:

../api/public/

The final structure should contain:

api/
└── public/
    ├── index.html
    └── assets/

The backend should serve the React application.

SPA ROUTING

Configure ".htaccess" appropriately.

The rules must distinguish API routes from React routes.

Conceptually:

/api/*       → backend API
/assets/*    → static frontend assets
everything else → React /index.html

Routes such as:

/
/about
/programs
/news
/gallery
/partners
/contact
/apply
/admin
/admin/...

must work after refreshing the page.

API requests must NOT be rewritten to React.

ENVIRONMENT

Do not hardcode secrets.

Use appropriate ".env" files.

Frontend environment variables must not contain backend secrets.

IMPORTANT: MINIMAL CHANGES

When implementing integration:

DO NOT rewrite the frontend.

DO NOT replace existing pages.

DO NOT replace existing components.

DO NOT create a new design.

DO NOT create a new admin dashboard.

DO NOT replace the existing navigation.

DO NOT replace the existing forms.

DO NOT rebuild the UI from the backend models.

Modify only the data flow, state management, API integration, authentication, and genuinely missing functionality.

Think:

EXISTING UI
      ↓
connect data
      ↓
connect API
      ↓
connect authentication
      ↓
add missing functionality

NOT:

backend
   ↓
generate a new frontend

FINAL VALIDATION

Before finishing, verify:

UI

- existing public website is preserved
- existing admin design is preserved
- existing responsive behavior is preserved
- existing navigation is preserved
- existing forms are preserved
- no unnecessary visual changes were introduced

Frontend

- JSX builds
- Axios works
- GlobalContext works
- AuthContext works
- JWT works
- protected routes work
- mock data has been replaced by real API data where appropriate

Backend

- Member CRUD works
- image uploads work
- optimized images work
- Student works
- Inscription works
- existing resources still work
- authentication works
- relationships work
- validation works

Deployment

The final project must be:

learn/
├── web/
└── api/

and:

npm run build

must produce the frontend inside:

api/public/

The backend must serve the React SPA and API from the same application.

FINAL OUTPUT

Produce ONE complete project:

learn/

The final application must be connected and deployable.

Again:

THE EXISTING UI IS THE SOURCE OF TRUTH.

Integration is the goal.

Redesign is NOT the goal.
