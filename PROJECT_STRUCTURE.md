# Plant Care App - Project Structure

## Directory Structure

```
src/
├── entities/          # Entity layer - Domain models with business logic
├── types/            # TypeScript type definitions and interfaces
├── enums/            # Enumerations for status, types, etc.
├── controllers/      # Control layer - Business logic orchestration
├── repositories/     # Data access layer - CRUD operations
├── screens/          # Boundary layer - UI screens
│   ├── auth/        # Authentication screens
│   ├── plants/      # Plant management screens
│   ├── community/   # Community features screens
│   └── help/        # Help request screens
├── components/       # Reusable UI components
├── services/        # External service integrations
├── utils/           # Utility functions
└── navigation/      # Navigation configuration
```

## BCE Architecture

**Boundary**: All files in `screens/` and `components/`
**Control**: All files in `controllers/`
**Entity**: All files in `entities/`

## Getting Started

1. Install dependencies: `npm install`
2. Start development: `npm start`
3. Open Expo Go app and scan QR code

## Team Roles

- **Jerick**: Controllers & Integration
- **Vivian**: Entities & Types
- **Charles**: Screens & Components
- **Yojin**: Services & Testing
