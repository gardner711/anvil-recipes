# Logging

## Metadata

- **Name**: Logging
- **Type**: Enabler
- **ID**: ENB-847293
- **Approval**: Approved
- **Capability ID**: CAP-529947
- **Owner**: Development Team
- **Status**: Ready for Implementation
- **Priority**: High
- **Analysis Review**: Not Required
- **Code Review**: Not Required

## Technical Overview
### Purpose
Provide centralized logging capabilities for displaying in the console all core functional activities, validation failures, API requests, responses, errors, and events with configurable log levels and output formats.

## Functional Requirements

| ID | Name | Requirement | Priority | Status | Approval |
|----|------|-------------|----------|--------|----------|
| FR-847400 | Log Levels | Support multiple log levels: DEBUG, INFO, WARN, ERROR, FATAL | Must Have | Ready for Implementation | Approved |
| FR-847304 | Request Logging | Capture and display in the console outgoing API requests with timestamp, endpoint, method, and server info | Must Have | Ready for Implementation | Approved |
| FR-847305 | API Client Error Logging | Capture and display in the console all errors response and context | Must Have | Ready for Implementation | Approved |
| FR-847306 | Website Error Logging | Capture and display in the console all errors handled in the website components | Must Have | Ready for Implementation | Approved |
| FR-123130 | Website Debug Logging | Capture and display in the console core functionality entry and critical process steps. | Must Have | In Draft | Not Approved |

## Non-Functional Requirements

| ID | Name | Type | Requirement | Priority | Status | Approval |
|----|------|------|-------------|----------|--------|----------|
| NFR-847307 | Performance Impact | Performance | Logging operations should not add more than 5ms overhead per request | Must Have | Ready for Implementation | Approved |

## Dependencies

### Internal Upstream Dependency

| Enabler ID | Description |
|------------|-------------|
| | |

### Internal Downstream Impact

| Enabler ID | Description |
|------------|-------------|
| | |

### External Dependencies

**External Upstream Dependencies**: None identified.

**External Downstream Impact**: None identified.

## Technical Specifications

### Enabler Dependency Flow Diagram
```mermaid
flowchart TD
    ENB_847293["ENB-847293<br/>Application Logging<br/>📝"]
    
    FILE["File System<br/>Log Files<br/>💾"]
    CONSOLE["Console Output<br/>Standard Output<br/>🖥️"]
    EXTERNAL["External Service<br/>Log Aggregation (Optional)<br/>☁️"]
    
    ENB_847293 --> FILE
    ENB_847293 --> CONSOLE
    ENB_847293 -.-> EXTERNAL

    classDef enabler fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef output fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class ENB_847293 enabler
    class FILE,CONSOLE,EXTERNAL output
```

### API Technical Specifications

| API Type | Operation | Channel / Endpoint | Description | Request / Publish Payload | Response / Subscribe Data |
|----------|-----------|---------------------|-------------|----------------------------|----------------------------|
| Internal | Method | logger.debug(message, context) | Log debug information | `{message: string, context: object}` | void |
| Internal | Method | logger.info(message, context) | Log informational message | `{message: string, context: object}` | void |
| Internal | Method | logger.warn(message, context) | Log warning message | `{message: string, context: object}` | void |
| Internal | Method | logger.error(message, error, context) | Log error with stack trace | `{message: string, error: Error, context: object}` | void |

### Data Models
```mermaid
erDiagram
    LogEntry {
        string timestamp
        string level
        string message
        string requestId
        object context
        string stackTrace
        object metadata
    }
    
    LogConfiguration {
        string level
        array outputs
        boolean includeTimestamp
        boolean includeStackTrace
        object rotationPolicy
    }
```

### Class Diagrams
```mermaid
classDiagram
    class Logger {
        -LogConfiguration config
        +debug(message, context)
        +info(message, context)
        +warn(message, context)
        +error(message, error, context)
        -formatLog(level, message, context)
        -writeLog(logEntry)
    }
    
    class LogFormatter {
        +formatJSON(logEntry)
        +formatText(logEntry)
        +addTimestamp(logEntry)
    }
    
    class LogTransport {
        <<interface>>
        +write(logEntry)
    }
    
    class FileTransport {
        -string filePath
        +write(logEntry)
        +rotate()
    }
    
    class ConsoleTransport {
        +write(logEntry)
    }
    
    Logger --> LogFormatter
    Logger --> LogTransport
    LogTransport <|-- FileTransport
    LogTransport <|-- ConsoleTransport
```

### Sequence Diagrams
```mermaid
sequenceDiagram
    participant App as Application
    participant Logger
    participant Formatter as Log Formatter
    participant Transport as Log Transport
    participant File as File System
    
    App->>Logger: error(message, error, context)
    Logger->>Formatter: formatLog(level, message, context)
    Formatter-->>Logger: formatted log entry
    Logger->>Transport: write(logEntry)
    Transport->>File: append to log file
    File-->>Transport: write confirmation
    Transport-->>Logger: success
```

### Dataflow Diagrams
```mermaid
flowchart TD
    Request[API Request] --> Handler[Request Handler]
    Handler --> Logger[Logger Service]
    Logger --> Formatter[Log Formatter]
    Formatter --> Level{Log Level Check}
    
    Level -->|Enabled| Console[Console Output]
    Level -->|Enabled| File[File Output]
    Level -->|Enabled| External[External Service]
    Level -->|Disabled| Drop[Drop Log]
    
    Console --> Archive[Log Archive]
    File --> Archive
```

### State Diagrams
```mermaid
stateDiagram-v2
    [*] --> Initialized
    Initialized --> Ready: Configuration Loaded
    Ready --> Logging: Log Request
    Logging --> Formatting: Format Log
    Formatting --> Writing: Write to Transport
    Writing --> Ready: Complete
    Writing --> Error: Write Failed
    Error --> Ready: Retry/Skip
    Ready --> Shutdown: Close Logger
    Shutdown --> [*]
```

