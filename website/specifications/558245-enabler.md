# Linter

## Metadata

- **Name**: Linter
- **Type**: Enabler
- **ID**: ENB-558245
- **Approval**: Approved
- **Capability ID**: CAP-529947
- **Owner**: Product Team
- **Status**: Ready for Implementation
- **Priority**: High
- **Analysis Review**: Required
- **Code Review**: Not Required

## Technical Overview
### Purpose
Ensure code quality by identifying and resolving ALL linting issues using ESLint and enforcing consistent code formatting with Prettier. The codebase MUST have zero linting errors and zero linting warnings before completion.

## Functional Requirements

| ID | Name | Requirement | Priority | Status | Approval |
|----|------|-------------|----------|--------|----------|
| FR-558246 | ESLint Configuration | Configure ESLint with React, TypeScript, and recommended rules for comprehensive code analysis | Must Have | Ready for Implementation | Approved |
| FR-558247 | Linter Execution | Discover all linting issues with ESLint v8+ across all TypeScript and React files | Must Have | Ready for Implementation | Approved |
| FR-558248 | Linter Results | Resolve ALL errors found by ESLint - zero errors required | Must Have | Ready for Implementation | Approved |
| FR-558249 | Linter Warnings | Resolve ALL warnings found by ESLint - zero warnings required | Must Have | Ready for Implementation | Approved |
| FR-558250 | Code Formatting | Ensure all files are properly formatted with Prettier (no formatting issues) | Must Have | Ready for Implementation | Approved |
| FR-558251 | React Rules | Apply React-specific linting rules including hooks and component best practices | Must Have | Ready for Implementation | Approved |
| FR-558252 | TypeScript Rules | Enforce TypeScript-specific rules for type safety and best practices | Must Have | Ready for Implementation | Approved |
| FR-558253 | Verification | Run `npm run lint` and verify output shows zero errors and zero warnings | Must Have | Ready for Implementation | Approved |

## Non-Functional Requirements

| ID | Name | Type | Requirement | Priority | Status | Approval |
|----|------|------|-------------|----------|--------|----------|
| NFR-558254 | Zero Tolerance | Quality | No linting errors or warnings are acceptable - 100% clean code required | Must Have | Ready for Implementation | Approved |
| NFR-558255 | Build Gate | Quality | Linting must pass before any build or deployment | Must Have | Ready for Implementation | Approved |
| NFR-558256 | Continuous Compliance | Quality | All code changes must maintain zero linting issues | Must Have | Ready for Implementation | Approved |
| NFR-558257 | Complete Coverage | Quality | All TypeScript/JavaScript/React files in the project must be linted with zero issues | Must Have | Ready for Implementation | Approved |
| NFR-558258 | Format Consistency | Quality | All files must follow Prettier formatting rules consistently | Must Have | Ready for Implementation | Approved |

## Dependencies

### Internal Upstream Dependency

| Enabler ID | Description |
|------------|-------------|
| ENB-847347 | React + Vite Framework provides the codebase to lint |
| ENB-847343 | NPM Package Management installs ESLint and Prettier |

### Internal Downstream Impact

| Enabler ID | Description |
|------------|-------------|
| ENB-189342 | Design System components must pass linting |
| ENB-XXXXXX | Test files must pass linting standards |

### External Dependencies

**External Upstream Dependencies**: ESLint v8+, Prettier v3+, TypeScript ESLint parser and plugin

**External Downstream Impact**: All React application code quality depends on passing lint checks

## Technical Specifications

### Enabler Dependency Flow Diagram
```mermaid
flowchart TD
    ENB_558245["ENB-558245<br/>Linter and Formatter<br/>📡"]
    
    ENB_847347["ENB-847347<br/>React + Vite<br/>⚛️"]
    ENB_847343["ENB-847343<br/>NPM Packages<br/>📦"]
    ENB_189342["ENB-189342<br/>Design System<br/>🎨"]
    ENB_847348["ENB-XXXXXX<br/>Testing<br/>🧪"]
    
    ESLINT["ESLint v8+<br/>Linter<br/>🔍"]
    PRETTIER["Prettier v3+<br/>Formatter<br/>✨"]
    TS_ESLINT["TypeScript ESLint<br/>Parser & Plugin<br/>📘"]
    
    CODE_QUALITY["Code Quality<br/>Zero Issues<br/>✓"]
    BUILD_SUCCESS["Build Success<br/>✓"]
    
    ENB_847347 --> ENB_558245
    ENB_847343 --> ESLINT
    ENB_847343 --> PRETTIER
    ENB_847343 --> TS_ESLINT
    
    ESLINT --> ENB_558245
    PRETTIER --> ENB_558245
    TS_ESLINT --> ENB_558245
    
    ENB_558245 --> CODE_QUALITY
    CODE_QUALITY --> BUILD_SUCCESS
    
    ENB_189342 --> ENB_558245
    ENB_847348 --> ENB_558245

    classDef enabler fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef tool fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef success fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
    
    class ENB_558245,ENB_847347,ENB_847343,ENB_189342,ENB_847348 enabler
    class ESLINT,PRETTIER,TS_ESLINT tool
    class CODE_QUALITY,BUILD_SUCCESS success
```

### API Technical Specifications

| API Type | Operation | Channel / Endpoint | Description | Request / Publish Payload | Response / Subscribe Data |
|----------|-----------|---------------------|-------------|----------------------------|----------------------------|
| CLI | Command | npm run lint | Run ESLint on all source files | None | Lint results with errors/warnings |
| CLI | Command | npm run lint:fix | Run ESLint with auto-fix enabled | None | Fixed files + remaining issues |
| CLI | Command | npm run format | Run Prettier to format all files | None | Formatted files list |
| CLI | Command | npm run format:check | Check if files are formatted | None | Format violations report |
| CLI | Command | npx eslint . --ext .ts,.tsx | Lint specific file extensions | File patterns | Detailed lint report |
| CLI | Command | npx prettier --write "src/**/*.{ts,tsx,css}" | Format specific patterns | File patterns | Formatted file paths |

### Data Models
```mermaid
erDiagram
    ESLintConfig {
        object env
        object extends
        object parser
        object parserOptions
        object plugins
        object rules
        array ignorePatterns
    }
    
    PrettierConfig {
        int printWidth
        int tabWidth
        boolean semi
        boolean singleQuote
        string trailingComma
        string arrowParens
    }
    
    LintResult {
        string filePath
        int errorCount
        int warningCount
        array messages
        string source
    }
    
    LintMessage {
        string ruleId
        string severity
        string message
        int line
        int column
        string nodeType
    }
    
    FormatResult {
        string filePath
        boolean formatted
        string output
    }
    
    ESLintConfig ||--o{ LintResult : produces
    LintResult ||--o{ LintMessage : contains
    PrettierConfig ||--o{ FormatResult : produces
```

### Class Diagrams
```mermaid
classDiagram
    class ESLintRunner {
        -ESLint eslint
        -string[] filePaths
        +lintFiles(): Promise~LintResult[]~
        +lintText(text, filePath): Promise~LintResult~
        +loadConfig(): Promise~Config~
        +getErrorCount(): int
        +getWarningCount(): int
    }
    
    class ESLintFixer {
        -ESLint eslint
        +fixFiles(filePaths): Promise~FixResult[]~
        +applyFixes(results): Promise~void~
        +canFix(message): boolean
    }
    
    class PrettierFormatter {
        -Config config
        -string[] patterns
        +formatFiles(patterns): Promise~FormatResult[]~
        +formatText(text, parser): string
        +checkFormat(filePath): Promise~boolean~
        +getConfig(filePath): Promise~Config~
    }
    
    class RuleValidator {
        +validateReactRules(): ValidationResult
        +validateTypeScriptRules(): ValidationResult
        +validateHooksRules(): ValidationResult
        +checkDeprecated(): DeprecationWarning[]
    }
    
    class Reporter {
        +format(results): string
        +printResults(results): void
        +generateReport(results): Report
        +hasErrors(): boolean
        +hasWarnings(): boolean
    }
    
    ESLintRunner --> ESLintFixer
    ESLintRunner --> Reporter
    PrettierFormatter --> Reporter
    RuleValidator --> ESLintRunner
```

### Sequence Diagrams
```mermaid
sequenceDiagram
    participant Dev as Developer
    participant NPM as npm Script
    participant ESLint as ESLint
    participant Prettier as Prettier
    participant Files as Source Files

    Dev->>NPM: npm run lint
    NPM->>ESLint: eslint src --ext .ts,.tsx
    ESLint->>Files: Read source files
    Files-->>ESLint: File contents
    
    ESLint->>ESLint: Parse TypeScript
    ESLint->>ESLint: Apply React rules
    ESLint->>ESLint: Apply TypeScript rules
    ESLint->>ESLint: Check hooks rules
    ESLint->>ESLint: Analyze patterns
    
    ESLint-->>NPM: Lint results
    NPM-->>Dev: Report errors + warnings
    
    alt Errors or Warnings Found
        Note over Dev,ESLint: MUST fix ALL issues AND warnings
        
        Dev->>NPM: npm run format
        NPM->>Prettier: prettier --write src/
        Prettier->>Files: Format all files
        Files-->>Prettier: Formatted
        Prettier-->>Dev: Files formatted
        
        Dev->>Files: Fix remaining lint errors
        Dev->>Files: Fix all warnings
        Dev->>Files: Fix React hook violations
        Dev->>Files: Fix TypeScript issues
        
        Dev->>NPM: npm run lint
        
        alt Still has issues
            ESLint-->>Dev: ❌ Issues/warnings remain
            Note over Dev: Loop until zero issues
        else All clean
            ESLint-->>Dev: ✓ No errors or warnings
            Dev->>NPM: npm run typecheck
            NPM-->>Dev: ✓ Types valid
            Dev->>NPM: npm run build
            NPM-->>Dev: ✓ Build successful
        end
    else No Issues or Warnings
        ESLint-->>Dev: ✓ No errors or warnings
        Dev->>NPM: npm run typecheck
        NPM-->>Dev: ✓ Types valid
        Dev->>NPM: npm run build
        NPM-->>Dev: ✓ Build successful
    end
```

### Dataflow Diagrams
```mermaid
flowchart TD
    Start[Developer Initiates Lint] --> Install[Install ESLint + Prettier]
    Install --> InstallPlugins[Install TypeScript ESLint + React plugins]
    InstallPlugins --> CheckConfig{Check configs}
    
    CheckConfig -->|Missing| CreateConfig[Create .eslintrc.cjs + .prettierrc]
    CheckConfig -->|Exists| ValidateConfig[Validate config]
    CreateConfig --> ValidateConfig
    
    ValidateConfig -->|Deprecated rules| FixConfig[Update to current rules]
    ValidateConfig -->|Valid| RunLint
    FixConfig --> RunLint
    
    RunLint[Run: npm run lint] --> ParseOutput{Parse output}
    
    ParseOutput -->|Warnings found| FixWarnings[Fix ALL warnings]
    ParseOutput -->|Errors found| FixErrors[Fix ALL errors]
    ParseOutput -->|Format issues| Format[Run: npm run format]
    ParseOutput -->|React rules| FixReact[Fix React violations]
    ParseOutput -->|Hook rules| FixHooks[Fix hooks violations]
    ParseOutput -->|TS issues| FixTypes[Fix TypeScript issues]
    ParseOutput -->|Clean output| Verify
    
    FixWarnings --> RunLint
    FixErrors --> RunLint
    Format --> RunLint
    FixReact --> RunLint
    FixHooks --> RunLint
    FixTypes --> RunLint
    
    Verify{Zero issues?} -->|No| Fail[❌ Linting Failed]
    Verify -->|Yes| TypeCheck[npm run typecheck]
    
    TypeCheck --> TypeOK{Types Valid?}
    TypeOK -->|No| Fail
    TypeOK -->|Yes| Build[npm run build]
    
    Build --> BuildCheck{Build OK?}
    BuildCheck -->|No| Fail
    BuildCheck -->|Yes| Complete[✓ Linting Complete: Zero Issues]
    
    Fail --> End[Must fix all issues]
    Complete --> End
```

### State Diagrams
```mermaid
stateDiagram-v2
    [*] --> NotLinted: Code Written
    NotLinted --> Linting: Run npm run lint
    Linting --> CheckOutput: Parse output
    
    CheckOutput --> ErrorsFound: Errors detected
    CheckOutput --> WarningsFound: Warnings detected
    CheckOutput --> ZeroIssues: Zero errors + Zero warnings
    
    ErrorsFound --> CategorizeError: Identify type
    WarningsFound --> CategorizeWarning: Identify type
    
    CategorizeError --> ReactError: React rule violations
    CategorizeError --> HooksError: React hooks violations
    CategorizeError --> TypeScriptError: TypeScript issues
    CategorizeError --> FormatError: Formatting issues
    CategorizeError --> OtherError: Other violations
    
    CategorizeWarning --> UnusedVars: Unused variables
    CategorizeWarning --> NoExplicitAny: any type usage
    CategorizeWarning --> OtherWarning: Other warnings
    
    ReactError --> FixingErrors: Fix component issues
    HooksError --> FixingErrors: Fix hooks rules
    TypeScriptError --> FixingErrors: Add/fix types
    FormatError --> Formatting: Run Prettier
    OtherError --> FixingErrors: Apply fixes
    
    UnusedVars --> FixingWarnings: Remove/use variables
    NoExplicitAny --> FixingWarnings: Add proper types
    OtherWarning --> FixingWarnings: Fix warnings
    
    Formatting --> Linting: Re-run lint
    FixingErrors --> Linting: Re-run lint
    FixingWarnings --> Linting: Re-run lint
    
    ZeroIssues --> Verified: ✓ Confirmed clean
    Verified --> TypeChecking: npm run typecheck
    
    TypeChecking --> TypesValid: Types OK
    TypeChecking --> TypesFailed: Type errors
    
    TypesFailed --> FixingErrors: Fix type issues
    
    TypesValid --> Building: npm run build
    Building --> BuildSuccess: Build OK
    Building --> BuildFailed: Build Error
    
    BuildFailed --> FixingErrors: Fix and retry
    
    BuildSuccess --> Complete: ✓ Zero Issues Achieved
    Complete --> [*]
    
    note right of ZeroIssues
        REQUIRED STATE:
        - Zero errors
        - Zero warnings
        - All files formatted
        - React rules passed
        - Hooks rules passed
        - TypeScript valid
    end note
```


