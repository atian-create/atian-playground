# A continuous, walkable Skill park

The previous page moved static visitor PNGs over four backgrounds. This release renders all 48 project attractions in one connected Three.js world, with 58 articulated visitors walking on shared paths. District selection moves the camera without restarting the simulation.

Each visitor alternates legs, flexes knees, swings arms and shifts weight. Ferris wheels, coaster cars, carousels, pendulums, swan boats and trains have distinct animations. Whole-building hit volumes make openings and wheel spokes selectable. Search, bilingual launch guides, repository previews, documentation status and a refreshed 48-repository audit complete the project discovery flow.

## Validation

- Production single-file build succeeded; approximately 0.59 MB before compression.
- Browser rendered 48 facilities and 58 visitors without JavaScript errors; approximately 60 FPS in the tested desktop environment.
- Joint angles changed over time and remained stable after pause.
- Clicking the 3D Ferris wheel opened the correct mother-content project.
- Project search, English guide, clipboard prompt and camera locate action verified.
- 390 × 844 mobile viewport: all 48 project entries, no horizontal document overflow, full park overview; screenshots included in docs/screenshots.
- Public GitHub catalog: 48 repositories, 48 included, zero missing; all have README. 26 README image checks and 34 English-documentation checks remain unresolved, explicitly labeled as static audit results.

## Boundaries

This release uses procedural low-poly geometry. It does not import the complete original RollerCoaster game model, motion capture, original saves, queueing/boarding or management simulation. Existing unrelated Docker and nginx deployment changes on main must be preserved. It does not publish private local Skill material or claim all external repository tutorials are complete.
