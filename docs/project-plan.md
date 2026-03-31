# Task Manager CLI Project Plan

## 1. Project overview
Task Manager CLI is a lightweight Node.js 20+ command-line application for managing personal tasks in memory with no external dependencies. Users can create, list, update, and delete tasks, then quickly filter by status or priority and sort by priority or creation date to focus on what matters next. The app is intentionally scoped for workshop learning, emphasizing clear modular design, predictable validation, and testable business logic.

## 2. User stories
1. As a user, I want to create a task so I can track new work items.
   - Acceptance criteria: Given valid input, the system creates a task with a generated `id`, default `description` of empty string when omitted, and valid timestamps.
   - Acceptance criteria: Given missing or invalid required fields, the system returns a clear validation error and does not create the task.

2. As a user, I want to list all tasks so I can see my current workload.
   - Acceptance criteria: The list command returns all tasks currently in memory.
   - Acceptance criteria: When no tasks exist, the system returns an empty list with a friendly message.

3. As a user, I want to update a task so I can reflect progress and priority changes.
   - Acceptance criteria: Given an existing task `id`, the system updates provided fields only and refreshes `updatedAt`.
   - Acceptance criteria: Given an unknown `id` or invalid field values, the system returns a clear error and preserves existing data.

4. As a user, I want to delete a task so I can remove completed or irrelevant items.
   - Acceptance criteria: Given an existing task `id`, the task is removed from memory.
   - Acceptance criteria: Given an unknown `id`, the system returns a not-found error and leaves task data unchanged.

5. As a user, I want to filter tasks by status or priority so I can narrow the list to relevant items.
   - Acceptance criteria: Filtering by valid `status` returns only matching tasks.
   - Acceptance criteria: Filtering by valid `priority` returns only matching tasks.
   - Acceptance criteria: Invalid filter values return validation errors.

6. As a user, I want to sort tasks by priority or creation date so I can prioritize work effectively.
   - Acceptance criteria: Sorting by priority orders tasks as `high`, `medium`, `low`.
   - Acceptance criteria: Sorting by creation date supports `newest` and `oldest` order.
   - Acceptance criteria: Invalid sort options return validation errors.

## 3. Data model
- Entity: `Task`
  - `id`: `string` (generated with `crypto.randomUUID()`)
  - `title`: `string` (required, non-empty)
  - `description`: `string` (optional, defaults to `""`)
  - `status`: `"todo" | "in-progress" | "done"`
  - `priority`: `"low" | "medium" | "high"`
  - `createdAt`: `string` (ISO 8601 timestamp)
  - `updatedAt`: `string` (ISO 8601 timestamp)

- In-memory store
  - `tasks`: `Task[]`

- Supporting types
  - `TaskStatus`: `"todo" | "in-progress" | "done"`
  - `TaskPriority`: `"low" | "medium" | "high"`
  - `TaskCreateInput`: `{ title: string; description?: string; status?: TaskStatus; priority?: TaskPriority }`
  - `TaskUpdateInput`: `{ title?: string; description?: string; status?: TaskStatus; priority?: TaskPriority }`

## 4. File structure
```text
src/
  cli/
    index.js            # Entry point, argument parsing, command routing
    help.js             # Help text and usage examples
  models/
    task.js             # Task factory and shape helpers
  services/
    task-service.js     # CRUD, filtering, sorting, in-memory store
  validation/
    task-validation.js  # Input and option validation
  utils/
    time.js             # Timestamp helper functions
    format.js           # Output formatting for terminal
  constants/
    enums.js            # Status/priority allowed values and sort maps
```

## 5. Implementation phases
1. Milestone 1: Foundation and constants
   - Create project folders and module boundaries.
   - Define enums for status and priority.
   - Add shared timestamp and formatting helpers.

2. Milestone 2: Task model and validation
   - Implement task creation helper with defaults.
   - Implement validators for create/update inputs and query options.
   - Define consistent error shapes/messages.

3. Milestone 3: Core task service
   - Build in-memory store and CRUD operations.
   - Add filter by status/priority.
   - Add sorting by priority and creation date.

4. Milestone 4: CLI command integration
   - Implement commands: create, list, update, delete.
   - Wire filter and sort flags for list command.
   - Add help output and usage examples.

5. Milestone 5: Verification and polish
   - Add lightweight checks using Node.js built-ins (`assert`) where appropriate.
   - Verify edge cases: empty lists, invalid input, unknown ids.
   - Refine output messages for clarity and workshop readability.
