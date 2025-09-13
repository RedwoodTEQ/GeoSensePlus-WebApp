# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Development Commands
- `npm start` - Run the main application (app-main) in development mode
- `npm run build:all` - Build all projects in order: lib-ui → lib-core → app-main
- `npm run test` - Run tests for the main application
- `npm run story` - Start Storybook for UI component development
- `npm run build-story` - Build Storybook documentation

### Development with Watch Mode
- `npm run watch` - Watch app-main for changes and rebuild
- `npm run watch:ui` - Watch lib-ui for changes and rebuild
- `npm run watch:core` - Watch lib-core for changes and rebuild

### Testing Commands
- `ng test app-main` - Run tests for main application
- `ng test lib-ui` - Run tests for UI library
- `ng test lib-core` - Run tests for core library

## Architecture Overview

### Monorepo Structure
This workspace uses Angular's native monorepo approach with three main projects:

1. **app-main** (prefix: `app`) - Main application containing:
   - Dashboard component
   - State Directory (UNS) with tree visualization
   - Position Engine functionality
   - NgRx Signal Store integration

2. **lib-ui** (prefix: `lib`) - Reusable UI components:
   - Angular Material wrapper components
   - NestedTree1 component for interactive tree data
   - VerticalSplit layout component
   - Storybook integration for component documentation

3. **lib-core** (prefix: `lib`) - Core business logic:
   - Non-component, reusable frontend utilities
   - Shared services and business logic

### Technology Stack
- **Angular 20.1.4** with standalone components
- **TypeScript 5.8.2** with strict mode
- **SCSS** for styling
- **@ngrx/signals 20.0.1** for modern signal-based state management
- **Angular Material 20.1.5** for UI components
- **Jasmine + Karma** for testing
- **PNPM** for package management

### State Management
Recently migrated to NgRx Signals for reactive state management:
- Signal stores manage component state
- Direct store injection (removed state service)
- Modern reactive patterns throughout

### Key Features
- **UNS (Unified Namespace)** - State directory with hierarchical tree data
- **Interactive Tree Components** - Nested tree with drag-drop support
- **Geospatial Data Management** - Location tracking and positioning functionality

## Build Order and Dependencies

When building the entire workspace, projects must be built in this order:
1. `lib-ui` - UI components library
2. `lib-core` - Core business logic
3. `app-main` - Main application

This order ensures proper dependency resolution.

## Component Development

### Storybook Integration
- UI components are documented and developed using Storybook
- Run `npm run story` to start Storybook on port 6006
- Accessible at `http://localhost:6006`

### Angular Schematics
- NgRx schematics are configured for generating signal stores
- Use `ng generate @ngrx/signal-store` to create new signal stores

## Configuration

### Angular CLI Configuration
- Package manager: PNPM
- Default component style: SCSS
- NgRx schematics enabled

### TypeScript Configuration
- Path mappings configured for library imports
- Strict mode enabled
- Angular strict templates enabled

### Testing Setup
- Jasmine framework with Karma runner
- Component testing setup for standalone components
- Library-specific test configurations