# Changelog

All notable changes to this project will be documented in this file.

## 2026-04-15 - Simplified Reminder Time Selection

### Changed
- Replaced quick time button grid with dropdown template selector
- Replaced template cards with dropdown options
- Template selection now appends times with automatic deduplication
- Added empty state placeholder for better UX

### Migration Notes
- No data migration needed
- Existing projects load and work correctly
- Users familiar with old UI will need brief orientation to new dropdown

### User Impact
- Simplified interface with less visual clutter
- Faster template selection (1 click vs multiple)
- More flexible time combination with append+dedup behavior
