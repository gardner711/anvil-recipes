# Mongo Data Store

## Metadata

- **Name**: Mongo Data Store
- **Type**: Enabler
- **ID**: ENB-492038
- **Approval**: Approved
- **Capability ID**: CAP-290474
- **Owner**: Product Team
- **Status**: Ready for Implementation
- **Priority**: High
- **Analysis Review**: Required
- **Code Review**: Required

## Technical Overview
### Purpose
A Mongo Database with a dedicated collection for storing and managing data objects providing persistence, indexing, and query capabilities.

## Functional Requirements

| ID | Name | Requirement | Priority | Status | Approval |
|----|------|-------------|----------|--------|----------|
| FR-492001 | Database Instance | A MongoDB Community Server database instance SHALL be provisioned for storage | High | Implemented | Approved |
| FR-492004 | Unique Identifiers | Each document SHALL have a unique `_id` field (MongoDB ObjectId) | High | Implemented | Approved |
| FR-492005 | Timestamp Fields | All documents SHALL include `createdAt` and `updatedAt` timestamp fields | High | Implemented | Approved |
| FR-492006 | Primary Index | The collection SHALL have a primary index on the `_id` field | High | Implemented | Approved |

## Non-Functional Requirements

| ID | Name | Type | Requirement | Priority | Status | Approval |
|----|------|------|-------------|----------|--------|----------|
| NFR-492002 | Query Performance | Performance | Queries SHALL execute within 100ms for indexed fields | High | Implemented | Approved |
| NFR-492003 | Connection Pool | Performance | The database SHALL support connection pooling for concurrent requests | High | Implemented | Approved |
| NFR-492007 | Deployment | Infrastructure | MongoDB Community Server SHALL be deployed as a Docker container with persistent volumes | High | Ready for Implementation | Approved |
| NFR-492008 | Data Persistence | Reliability | MongoDB data SHALL persist across container restarts using Docker volumes | High | Ready for Implementation | Approved |

## Dependencies

### Internal Upstream Dependency

| Enabler ID | Description |
|------------|-------------|
|  | None - This is a foundational data storage enabler |

### Internal Downstream Impact

| Enabler ID | Description |
|------------|-------------|
| | |

### External Dependencies

**External Upstream Dependencies**: MongoDB server instance (self-hosted or MongoDB Atlas)

**External Downstream Impact**: All API endpoints depend on this database

## Technical Specifications (Template)

### Enabler Dependency Flow Diagram
```mermaid
flowchart TD
    ENB_492038["ENB-492038<br/>MongoDB Character Database<br/>💾"]
    
    CREATE["Create API<br/>ENB-432891<br/>📝"]
    LIST["List API<br/>ENB-813945<br/>📋"]
    UPDATE["Update API<br/>ENB-745321<br/>✏️"]
    DELETE["Delete API<br/>ENB-536812<br/>🗑️"]
    
    COLLECTION["Characters Collection<br/>Document Storage<br/>📦"]
    INDEXES["Database Indexes<br/>Performance Optimization<br/>⚡"]
    VALIDATION["Schema Validation<br/>Data Integrity<br/>✓"]
    
    CREATE -->|Insert Documents| ENB_492038
    LIST -->|Query Documents| ENB_492038
    UPDATE -->|Update Documents| ENB_492038
    DELETE -->|Remove Documents| ENB_492038
    
    ENB_492038 --> COLLECTION
    ENB_492038 --> INDEXES
    ENB_492038 --> VALIDATION
    
    COLLECTION -->|Uses| INDEXES
    COLLECTION -->|Enforces| VALIDATION

    classDef enabler fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef api fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef process fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class ENB_492038 enabler
    class CREATE,LIST,UPDATE,DELETE api
    class COLLECTION,INDEXES,VALIDATION process
```

### API Technical Specifications (if applicable)

| API Type | Operation | Channel / Endpoint | Description | Request / Publish Payload | Response / Subscribe Data |
|----------|-----------|---------------------|-------------|----------------------------|----------------------------|
| MongoDB | insert | `db.characters.insertOne()` | Inserts a new character document | Character document object | Inserted document with `_id` |
| MongoDB | find | `db.characters.find()` | Queries character documents | Query filter object | Array of matching documents |
| MongoDB | update | `db.characters.updateOne()` | Updates a character document | Filter and update objects | Update result |
| MongoDB | delete | `db.characters.deleteOne()` | Deletes a character document | Filter object | Delete result |

### Data Models
```mermaid
erDiagram
    Character {
        ObjectId _id PK "Auto-generated unique identifier"
        string characterName "Character name (indexed)"
        string race "Character race (indexed)"
        string class "Character class (indexed)"
        number level "Character level 1-20 (indexed)"
        string alignment "D&D alignment enum (indexed)"
        number armorClass "Armor Class value"
        number speed "Movement speed in feet"
        number proficiencyBonus "Proficiency bonus based on level"
        string appearance "Character appearance description"
        string backstory "Character backstory"
        datetime createdAt "Document creation timestamp"
        datetime updatedAt "Document last update timestamp"
    }
    
    AbilityScores {
        object strength "Strength ability"
        object dexterity "Dexterity ability"
        object constitution "Constitution ability"
        object intelligence "Intelligence ability"
        object wisdom "Wisdom ability"
        object charisma "Charisma ability"
    }
    
    AbilityScore {
        number score "Ability score 1-30"
        number modifier "Calculated modifier"
        boolean savingThrowProficiency "Proficiency in saving throw"
    }
    
    HitPoints {
        number current "Current hit points"
        number maximum "Maximum hit points"
        number temporary "Temporary hit points"
    }
    
    Skills {
        object acrobatics "Dexterity-based skill"
        object animalHandling "Wisdom-based skill"
        object arcana "Intelligence-based skill"
        object athletics "Strength-based skill"
        object deception "Charisma-based skill"
        object history "Intelligence-based skill"
        object insight "Wisdom-based skill"
        object intimidation "Charisma-based skill"
        object investigation "Intelligence-based skill"
        object medicine "Wisdom-based skill"
        object nature "Intelligence-based skill"
        object perception "Wisdom-based skill"
        object performance "Charisma-based skill"
        object persuasion "Charisma-based skill"
        object religion "Intelligence-based skill"
        object sleightOfHand "Dexterity-based skill"
        object stealth "Dexterity-based skill"
        object survival "Wisdom-based skill"
    }
    
    Skill {
        boolean proficiency "Proficient in skill"
        number modifier "Skill modifier value"
    }
    
    Inventory {
        object currency "Copper, silver, electrum, gold, platinum"
        array weapons "Weapon objects"
        array armor "Armor objects"
        array equipment "Other equipment items"
    }
    
    Spellcasting {
        string spellcastingAbility "Intelligence, Wisdom, or Charisma"
        number spellSaveDC "Spell save DC"
        number spellAttackBonus "Spell attack bonus"
        array knownSpells "List of known spells"
        object spellSlots "Available spell slots by level"
    }
    
    Personality {
        array traits "Personality traits"
        array ideals "Character ideals"
        array bonds "Character bonds"
        array flaws "Character flaws"
    }
    
    Character ||--|| AbilityScores : has
    Character ||--|| HitPoints : has
    Character ||--|| Skills : has
    Character ||--|| Inventory : has
    Character ||--o| Spellcasting : "may have"
    Character ||--|| Personality : has
    AbilityScores ||--|| AbilityScore : "contains 6"
    Skills ||--|| Skill : "contains 18"
```

### Class Diagrams
```mermaid
classDiagram
    class MongoDBConnection {
        +string uri
        +string databaseName
        +number poolSize
        +connect() Promise~Database~
        +disconnect() void
    }
    
    class CharacterCollection {
        +string collectionName
        +object schema
        +array indexes
        +createIndexes() Promise~void~
        +validateSchema() Promise~void~
    }
    
    class SchemaValidator {
        +object validationRules
        +validate(document) boolean
        +getValidationErrors(document) Array
    }
    
    class IndexManager {
        +array indexDefinitions
        +createIndex(field, options) Promise~void~
        +listIndexes() Promise~Array~
        +dropIndex(name) Promise~void~
    }
    
    MongoDBConnection --> CharacterCollection : provides
    CharacterCollection --> SchemaValidator : uses
    CharacterCollection --> IndexManager : manages
```

### Sequence Diagrams
```mermaid
sequenceDiagram
    participant App as Application Startup
    participant Conn as MongoDB Connection
    participant DB as MongoDB Database
    participant Coll as Characters Collection
    participant Index as Index Manager
    participant Schema as Schema Validator

    App->>Conn: connect(uri)
    Conn->>DB: Establish Connection
    DB-->>Conn: Connection Established
    
    App->>Coll: Initialize Collection
    Coll->>DB: Get or Create Collection
    DB-->>Coll: Collection Reference
    
    App->>Index: createIndexes()
    Index->>Coll: createIndex({name: 1})
    Coll->>DB: Create Index
    DB-->>Coll: Index Created
    
    Index->>Coll: createIndex({class: 1, level: 1})
    Coll->>DB: Create Compound Index
    DB-->>Coll: Index Created
    
    App->>Schema: setupValidation()
    Schema->>Coll: Set Validation Rules
    Coll->>DB: Apply Schema Validation
    DB-->>Coll: Validation Applied
    
    Coll-->>App: Database Ready
    
    Note over App,DB: Runtime Operations
    App->>Coll: insertOne(character)
    Coll->>Schema: validate(character)
    
    alt Validation Failed
        Schema-->>Coll: ValidationError
        Coll-->>App: Error
    else Validation Passed
        Schema-->>Coll: Valid
        Coll->>DB: Insert Document
        DB-->>Coll: Inserted Document
        Coll-->>App: Success
    end
```

### Dataflow Diagrams
```mermaid
flowchart TD
    Start([Application Starts]) --> Connect[Connect to MongoDB]
    Connect --> Connected{Connection Success?}
    
    Connected -->|No| Retry[Retry Connection]
    Retry --> Connect
    Connected -->|Yes| SelectDB[Select Database]
    
    SelectDB --> GetCollection[Get Characters Collection]
    GetCollection --> CheckIndexes{Indexes Exist?}
    
    CheckIndexes -->|No| CreateIndexes[Create Indexes]
    CreateIndexes --> SetValidation[Set Schema Validation]
    CheckIndexes -->|Yes| SetValidation
    
    SetValidation --> Ready[Database Ready]
    
    Ready --> Operations{API Operation}
    
    Operations -->|Create| ValidateInsert[Validate Document]
    ValidateInsert --> InsertDoc[Insert Document]
    InsertDoc --> Operations
    
    Operations -->|Read| QueryDocs[Query Documents]
    QueryDocs --> UseIndexes[Use Indexes]
    UseIndexes --> ReturnDocs[Return Documents]
    ReturnDocs --> Operations
    
    Operations -->|Update| ValidateUpdate[Validate Update]
    ValidateUpdate --> UpdateDoc[Update Document]
    UpdateDoc --> Operations
    
    Operations -->|Delete| DeleteDoc[Delete Document]
    DeleteDoc --> Operations
    
    Operations -->|Shutdown| Disconnect[Disconnect]
    Disconnect --> End([Application Stops])
```

### State Diagrams
```mermaid
stateDiagram-v2
    [*] --> Disconnected: Application Starts
    
    Disconnected --> Connecting: Initiate Connection
    
    Connecting --> Connected: Connection Successful
    Connecting --> ConnectionError: Connection Failed
    
    ConnectionError --> Connecting: Retry
    
    Connected --> Initializing: Setup Collection
    
    Initializing --> CreatingIndexes: Indexes Missing
    CreatingIndexes --> SettingValidation: Indexes Created
    
    Initializing --> SettingValidation: Indexes Exist
    
    SettingValidation --> Ready: Validation Applied
    
    Ready --> Operating: Accepting Requests
    
    Operating --> Ready: Operation Complete
    
    Ready --> Disconnecting: Shutdown Signal
    
    Disconnecting --> Disconnected: Connection Closed
    
    Disconnected --> [*]: Application Stopped
```

