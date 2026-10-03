# dopa-drill workspace instructions

## Current management entry (2026-10-01)

Read [dopa-drill management entry](docs/operations/management-entry.md) before cloud work. Use official provider tools and the maintainer's existing native login; metadata reads do not require new IAM or database roles. Never load repository production env files for management commands. Preserve existing release/migration gates, unrelated modifications and historical evidence.

## Development entry

For setup or runtime changes, use [dopa-drill setup](README.md) and the current
package/toolchain manifests. Select checks for the affected module; a
documentation-only change needs reference and diff checks. Complete
authorized local implementation and verification, then report unavailable
platform, device, or production evidence explicitly.
