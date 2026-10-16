# Website feedback setup

The private `/feedback` workspace can store review comments in either Notion or GitHub Issues. Set `FEEDBACK_PROVIDER` to `notion` or `github`; it defaults to Notion. The public site continues to work when feedback is not configured.

Both providers require:

```dotenv
FEEDBACK_ACCESS_PASSWORD=choose-a-shared-client-passcode
FEEDBACK_SESSION_SECRET=generate-a-long-random-secret
FEEDBACK_PROVIDER=notion
```

Generate the session secret with a password manager or `openssl rand -base64 48`. Never prefix these variables with `NEXT_PUBLIC_`.

## Notion

### 1. Create the data source

Create a database named **Website Feedback** with these exact properties:

| Property | Type |
| --- | --- |
| Name | Title |
| Status | Status, with `Open` and `Resolved` options |
| Comment | Text |
| Page Path | Text |
| Page URL | URL |
| Element Selector | Text |
| Element Label | Text |
| Anchor X | Number |
| Anchor Y | Number |
| Fallback X | Number |
| Fallback Y | Number |
| Scroll Y | Number |
| Viewport Width | Number |
| Viewport Height | Number |
| Breakpoint | Select, with `desktop`, `tablet`, and `mobile` options |
| Reviewer Name | Text |
| Reviewer ID | Text |
| Browser Context | Text |
| Screenshot | Files & media |
| Resolved At | Date |

### 2. Connect the site

1. Create an internal Notion integration with permission to read, insert, and update content.
2. Open the database, choose **Connections**, and add the integration.
3. Copy the data source ID from Notion and the integration token from the integration settings.
4. Add the following variables to `.env` (or `.env.local`) and to the production deployment:

```dotenv
FEEDBACK_PROVIDER=notion
NOTION_API_TOKEN=ntn_...
NOTION_FEEDBACK_DATA_SOURCE_ID=...
```

## GitHub Issues

### 1. Create credentials

1. Create a fine-grained personal access token for the target repository.
2. Grant the token **Issues: Read and write** access. Private repositories also require access to that repository.
3. Create a repository label named `client-feedback`, or choose another existing label.

### 2. Connect the site

Add these variables to `.env` (or `.env.local`) and to the production deployment:

```dotenv
FEEDBACK_PROVIDER=github
GITHUB_REPOSITORY=owner/repository
GITHUB_TOKEN=github_pat_...
GITHUB_FEEDBACK_LABEL=client-feedback
```

Each comment becomes an issue containing its page, selector, viewport, reviewer, and positioning metadata. Closing or reopening an issue in GitHub is reflected in the feedback workspace on its next refresh, and resolving or reopening it in the workspace updates the issue.

GitHub's Issues REST API does not accept binary file attachments. The comment is still created if screenshot upload is unavailable, and the workspace displays a warning. Use Notion when attached screenshots are required.

## Verify

Restart the app after changing environment variables, visit `/feedback`, sign in, and pin a comment. Confirm that a Notion row or GitHub issue is created, then resolve and reopen it once to verify update permission.
