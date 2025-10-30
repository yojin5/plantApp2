#!/bin/bash

# Plant Care App - Automated Setup Script
# Run this after creating your React Native project

echo "🌱 Setting up Plant Care App structure..."

# Create main source directory
mkdir -p src

# Create Entity layer
echo "📦 Creating Entity classes..."
mkdir -p src/entities
touch src/entities/User.ts
touch src/entities/Plant.ts
touch src/entities/PlantZone.ts
touch src/entities/PlantType.ts
touch src/entities/Post.ts
touch src/entities/HelpRequest.ts
touch src/entities/HelpResponse.ts
touch src/entities/WateringRecord.ts
touch src/entities/Notification.ts
touch src/entities/Comment.ts

# Create Type definitions
echo "📋 Creating Type definitions..."
mkdir -p src/types
touch src/types/index.ts
touch src/types/UserTypes.ts
touch src/types/PlantTypes.ts
touch src/types/PostTypes.ts
touch src/types/HelpRequestTypes.ts

# Create Enums
echo "🔢 Creating Enumerations..."
mkdir -p src/enums
touch src/enums/HealthStatus.ts
touch src/enums/RequestStatus.ts
touch src/enums/NotificationType.ts
touch src/enums/ExposureType.ts
touch src/enums/CoverType.ts
touch src/enums/WateringMethod.ts

# Create Controllers
echo "🎮 Creating Controllers..."
mkdir -p src/controllers
touch src/controllers/AuthController.ts
touch src/controllers/PlantManagementController.ts
touch src/controllers/WateringController.ts
touch src/controllers/WeatherController.ts
touch src/controllers/PlantZoneController.ts
touch src/controllers/CommunityController.ts
touch src/controllers/HelpRequestController.ts
touch src/controllers/NotificationController.ts

# Create Repositories
echo "💾 Creating Repositories..."
mkdir -p src/repositories
touch src/repositories/UserRepository.ts
touch src/repositories/PlantRepository.ts
touch src/repositories/PlantZoneRepository.ts
touch src/repositories/PostRepository.ts
touch src/repositories/HelpRequestRepository.ts
touch src/repositories/NotificationRepository.ts

# Create Screens (Boundary layer)
echo "📱 Creating Screens..."
mkdir -p src/screens/auth
touch src/screens/auth/LoginScreen.tsx
touch src/screens/auth/RegisterScreen.tsx
touch src/screens/auth/ProfileScreen.tsx

mkdir -p src/screens/plants
touch src/screens/plants/MyPlantsScreen.tsx
touch src/screens/plants/AddPlantScreen.tsx
touch src/screens/plants/PlantDetailsScreen.tsx
touch src/screens/plants/PlantZonesScreen.tsx

mkdir -p src/screens/community
touch src/screens/community/CommunityScreen.tsx
touch src/screens/community/CreatePostScreen.tsx
touch src/screens/community/DiscoverUsersScreen.tsx

mkdir -p src/screens/help
touch src/screens/help/HelpRequestsScreen.tsx
touch src/screens/help/CreateHelpRequestScreen.tsx

touch src/screens/DashboardScreen.tsx

# Create Components
echo "🧩 Creating Components..."
mkdir -p src/components
touch src/components/PlantCard.tsx
touch src/components/ZoneCard.tsx
touch src/components/PostCard.tsx
touch src/components/UserCard.tsx
touch src/components/HelpRequestCard.tsx
touch src/components/Button.tsx
touch src/components/Input.tsx
touch src/components/WeatherWidget.tsx

# Create Services
echo "🔌 Creating Services..."
mkdir -p src/services
touch src/services/WeatherService.ts
touch src/services/NotificationService.ts
touch src/services/LocationService.ts
touch src/services/StorageService.ts

# Create Utils
echo "🛠️  Creating Utilities..."
mkdir -p src/utils
touch src/utils/dateUtils.ts
touch src/utils/wateringCalculator.ts
touch src/utils/rainfallCalculator.ts
touch src/utils/validators.ts
touch src/utils/constants.ts

# Create Navigation
echo "🧭 Creating Navigation..."
mkdir -p src/navigation
touch src/navigation/AppNavigator.tsx

# Create Assets folders
echo "🎨 Creating Assets folders..."
mkdir -p assets/images
mkdir -p assets/fonts

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Expo
.expo/
.expo-shared/
dist/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# Local env files
.env*.local

# TypeScript
*.tsbuildinfo

# IDE
.vscode/
.idea/
EOF
fi

# Create README
echo "📖 Creating README..."
cat > PROJECT_STRUCTURE.md << 'EOF'
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
EOF

echo ""
echo "✅ Project structure created successfully!"
echo ""
echo "📂 Created directories:"
echo "   - src/entities (10 files)"
echo "   - src/types (5 files)"
echo "   - src/enums (6 files)"
echo "   - src/controllers (8 files)"
echo "   - src/repositories (6 files)"
echo "   - src/screens (13 files)"
echo "   - src/components (8 files)"
echo "   - src/services (4 files)"
echo "   - src/utils (5 files)"
echo "   - src/navigation (1 file)"
echo "   - assets/images"
echo "   - assets/fonts"
echo ""
echo "📖 See PROJECT_STRUCTURE.md for more information"
echo ""
echo "🚀 Next steps:"
echo "   1. Open project in VS Code: code ."
echo "   2. Start filling in the files with code"
echo "   3. Run: npm start"
echo ""
