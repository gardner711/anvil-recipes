// MongoDB Initialization Script
// This script runs when the MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('anvil_recipes');

// Create the characters collection
db.createCollection('characters');

// Create indexes for the characters collection
db.characters.createIndex({ "_id": 1 }); // Primary index (automatically created)
db.characters.createIndex({ "characterName": 1 }); // Name index
db.characters.createIndex({ "race": 1 }); // Race index
db.characters.createIndex({ "class": 1 }); // Class index
db.characters.createIndex({ "level": 1 }); // Level index
db.characters.createIndex({ "alignment": 1 }); // Alignment index
db.characters.createIndex({ "createdAt": 1 }); // Creation timestamp index
db.characters.createIndex({ "updatedAt": 1 }); // Update timestamp index

// Create compound indexes for common queries
db.characters.createIndex({ "class": 1, "level": 1 }); // Class and level queries
db.characters.createIndex({ "race": 1, "class": 1 }); // Race and class queries

// Create a user for the application (optional, for additional security)
db.createUser({
    user: 'anvil_app',
    pwd: 'app_password123',
    roles: [
        {
            role: 'readWrite',
            db: 'anvil_recipes'
        }
    ]
});

print('MongoDB initialization completed successfully');
print('Database: anvil_recipes');
print('Collections: characters');
print('Indexes created for optimal query performance');