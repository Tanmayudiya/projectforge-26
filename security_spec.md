# ProjectForge Security Specification

## 1. Data Invariants
1. **Ownership Invariant**: A user can only access, create, update, or delete their own student profile (`users/{userId}` where `userId == request.auth.uid`).
2. **Project Master Gate**: A project cannot exist without a valid `userId` matching `request.auth.uid`. All subcollections (`milestones`, `mentorMessages`) must verify that parent project belongs to `request.auth.uid`.
3. **Immutability Invariant**: Project `id`, `userId`, and `createdAt` cannot be modified after document creation.
4. **Milestone Integrity**: Milestone documents cannot have invalid statuses and cannot exceed bounded length constraints.
5. **No Cross-Tenant Leaks**: Listing operations must strictly enforce `resource.data.userId == request.auth.uid` so that query scraping across other students is impossible.

## 2. The Dirty Dozen Payloads (Designed to be Rejected)
1. **Ghost Field Attack**: Injecting `{ "isAdmin": true }` into student profile update.
2. **Identity Spoofing**: Creating a project with `userId: "attacker-uuid"` while logged in as `student-uuid`.
3. **Unauthenticated Read**: Attempting to read `/projects/{projectId}` without auth token.
4. **Cross-Tenant Read**: Attempting to read another student's `/projects/{projectId}`.
5. **Parent Hijacking**: Writing a milestone to `/projects/{victimProjectId}/milestones/{milestoneId}`.
6. **Immortal Field Tampering**: Attempting to update `userId` or `createdAt` on an existing project.
7. **Resource Poisoning**: Writing a 2MB string into `title` or `content` fields.
8. **Invalid Path ID**: Attempting to create a document with an ID containing SQL/XSS characters like `<script>` or `/..`.
9. **Status Shortcut/Poisoning**: Attempting to set milestone status to `"hacked"` instead of `"Not Started" | "In Progress" | "Completed"`.
10. **Blanket Query Scraping**: Attempting `collection('projects')` without a matching `where('userId', '==', auth.uid)`.
11. **Excessive Array Injection**: Attempting to inject a list of 5,000 items into user skills.
12. **Unverified Email Privilege Escalation**: Attempting admin operations with unverified credentials.
