# Definition of Done

A task is **not** finished when the code is written. It is finished when
**all** of the following are true.

## For every task

- [ ] Acceptance criteria are satisfied.
- [ ] Code is reviewed (or self-reviewed for solo work).
- [ ] Relevant tests pass locally and in CI.
- [ ] No known critical or high-severity errors are introduced.
- [ ] Accessibility and responsive behaviour are checked where relevant.
- [ ] Documentation is updated (README, docs/, or inline comments).
- [ ] Changes are committed with a descriptive message.
- [ ] Changes are pushed to the remote.
- [ ] Pull request (if used) is merged into the target branch.
- [ ] The GitHub Issue is closed with a reference to the commit or PR.
- [ ] The card on the project board is moved to **Done**.

## Additional criteria for deployed features

- [ ] Feature is verified on staging.
- [ ] Feature is verified on production after deployment.
- [ ] Monitoring shows no unexpected errors.
- [ ] Rollback plan exists (for significant changes).

## Additional criteria for user-facing features

- [ ] Works on mobile, tablet, and desktop.
- [ ] Keyboard-navigable.
- [ ] Screen-reader-friendly (labels, ARIA where needed).
- [ ] Colour contrast meets WCAG AA.
- [ ] Loading, empty, error, and permission states handled.