# Scale Survey - TODO Action Items

## Current Status Summary

### ✅ Completed
- Landing page with hero, features, how-it-works, footer
- Dark mode with theme toggle
- Animated grid background
- Database schema (surveys, questions, responses)
- Convex backend mutations (surveys, questions CRUD)
- Modular question type system with registry
- Single choice and multiple choice question types
- Survey builder UI (/create page)
- Drag-and-drop for questions and answer options
- Survey settings (live results, scheduling)
- Success modal with admin code

### 🚧 Not Yet Implemented

## Phase 1: Complete Survey Creation Flow (High Priority)

### 1.1 Implement Full Publish Functionality
**File:** `src/app/create/page.tsx`
- Save all questions to database when publishing
- Serialize question configs to JSON strings
- Call question mutations for each question
- Call survey publish mutation after questions saved
- Handle errors gracefully with rollback
- Update success modal to show published status

### 1.2 Question Validation
**File:** `src/app/create/page.tsx`
- Validate all questions have titles
- Validate options have text (for choice questions)
- Validate at least 2 options for choice questions
- Show inline error messages
- Prevent publish if validation fails

### 1.3 Update Survey Mutations
**File:** `convex/surveys.ts`
- Add startDate and endDate to create mutation
- Handle date conversion (Date to number)

## Phase 2: Participant Survey View (High Priority)

### 2.1 Create Survey Response Page
**New File:** `src/app/survey/[key]/page.tsx`
- Fetch survey by key
- Check if survey is published and within date range
- Display survey title and description
- Render all questions using response components
- Form validation with react-hook-form + zod
- Submit responses

### 2.2 Create Response Submission
**File:** `convex/responses.ts` (new)
- Create `submit` mutation
- Validate survey exists and is active
- Store answers as JSON string
- Optional: Generate participant fingerprint

### 2.3 Survey Status Handling
**File:** `src/app/survey/[key]/page.tsx`
- Show appropriate messages for:
  - Survey not found
  - Survey is draft (not published)
  - Survey not started yet
  - Survey has ended
  - Survey successfully submitted

## Phase 3: Admin Dashboard (High Priority)

### 3.1 Create Admin Access Page
**New File:** `src/app/access/page.tsx`
- Form to enter admin code
- Validate and redirect to admin dashboard

### 3.2 Create Admin Dashboard
**New File:** `src/app/admin/[code]/page.tsx`
- Fetch survey by admin code
- Show survey details (title, description, status)
- Display survey URL for sharing
- Show question count
- Action buttons:
  - Edit survey (if draft)
  - Publish (if draft)
  - Close (if published)
  - View results

### 3.3 Create Results View
**New File:** `src/app/admin/[code]/results/page.tsx`
- Fetch all responses for survey
- Display response count
- Group responses by question
- Render results using result components
- Export functionality (CSV/JSON)

### 3.4 Create Edit Survey Page
**New File:** `src/app/admin/[code]/edit/page.tsx`
- Reuse survey builder components
- Pre-populate with existing survey data
- Save changes to existing survey
- Only allow editing if survey is draft

## Phase 4: Live Results (Medium Priority)

### 4.1 Participant Results View
**New File:** `src/app/survey/[key]/results/page.tsx`
- Check if survey allows live results
- Real-time subscription to responses using Convex
- Display aggregated results
- Auto-update when new responses come in

## Phase 5: Additional Question Types (Medium Priority)

### 5.1 Text Question Type
**New Files:**
- `src/components/questions/text/text-editor.tsx`
- `src/components/questions/text/text-response.tsx`
- `src/components/questions/text/text-results.tsx`
- `src/components/questions/text/index.ts`
- Register in `src/lib/questions/init.ts`

### 5.2 Rating Question Type
**New Files:**
- `src/components/questions/rating/rating-editor.tsx`
- `src/components/questions/rating/rating-response.tsx`
- `src/components/questions/rating/rating-results.tsx`
- `src/components/questions/rating/index.ts`
- Register in `src/lib/questions/init.ts`

### 5.3 Scale Question Type
**New Files:**
- `src/components/questions/scale/scale-editor.tsx`
- `src/components/questions/scale/scale-response.tsx`
- `src/components/questions/scale/scale-results.tsx`
- `src/components/questions/scale/index.ts`
- Register in `src/lib/questions/init.ts`

## Phase 6: Polish & UX Improvements (Low Priority)

### 6.1 Loading States
- Add skeleton loaders for survey loading
- Add spinner for form submission
- Add progress indicators

### 6.2 Error Handling
- Better error messages throughout
- Toast notifications instead of alerts
- Retry mechanisms for failed requests

### 6.3 Responsive Design
- Test and optimize for mobile
- Improve touch interactions for drag-and-drop
- Adjust layouts for small screens

### 6.4 Accessibility
- Add ARIA labels
- Keyboard navigation for drag-and-drop
- Focus management
- Screen reader support

## Phase 7: Advanced Features (Future)

### 7.1 Survey Templates
- Pre-built question sets
- Template marketplace
- Clone existing surveys

### 7.2 Logic & Branching
- Conditional questions
- Skip logic
- Question piping

### 7.3 Analytics
- Response rate tracking
- Time to complete
- Completion funnel
- Demographics

### 7.4 Export & Integrations
- CSV export
- PDF reports
- Webhook integrations
- API access

## Immediate Next Steps (Recommended Order)

1. **Complete Publish Flow** (Phase 1.1) - Unblock survey creation
2. **Survey Response Page** (Phase 2.1) - Enable participants to take surveys
3. **Admin Dashboard** (Phase 3.2) - Enable survey management
4. **Results View** (Phase 3.3) - Enable viewing responses
5. **Question Validation** (Phase 1.2) - Improve UX
6. **Text Question Type** (Phase 5.1) - Expand question options

---

## Technical Notes

- All mutations need admin code authentication
- Use Convex real-time subscriptions for live results
- Store question configs and answers as JSON strings
- Use nanoid for generating survey keys
- Follow existing modular architecture for new question types
