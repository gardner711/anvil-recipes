# Navigation

## Metadata

- **Name**: Navigation
- **Type**: Enabler
- **ID**: ENB-055534
- **Approval**: Approved
- **Capability ID**: CAP-924443
- **Owner**: Product Team
- **Status**: Ready for Implementation
- **Priority**: High
- **Analysis Review**: Required
- **Code Review**: Not Required

## Technical Overview
### Purpose
Implements a responsive left-hand navigation sidebar similar to GitHub's design, featuring a collapsible panel with hierarchical menu items, icons, labels, and active state indicators. The navigation provides intuitive access to all major sections of the website while adapting seamlessly between desktop and mobile viewports.

## Functional Requirements

| ID | Name | Requirement | Priority | Status | Approval |
|----|------|-------------|----------|--------|----------|
| FR-055001 | Left Sidebar Position | Navigation must be positioned on the left side of the content area with a fixed width of 256px on desktop | High | Ready for Implementation | Not Approved |
| FR-055002 | Collapsible Panel | Navigation must support collapse/expand functionality with a toggle button, reducing to 48px width when collapsed | High | Ready for Implementation | Not Approved |
| FR-055003 | Hierarchical Menu | Navigation must support nested menu items with up to 3 levels of hierarchy | High | Ready for Implementation | Not Approved |
| FR-055004 | Menu Items with Icons | Each navigation item must display an icon (16x16px) and label with 8px spacing | High | Ready for Implementation | Not Approved |
| FR-055005 | Active State Indicator | The current page's navigation item must be visually highlighted with a blue accent bar (3px) and background color | High | Ready for Implementation | Not Approved |
| FR-055006 | Hover States | Navigation items must display hover effects with background color change and cursor pointer | Medium | Ready for Implementation | Not Approved |
| FR-055007 | Expandable Sections | Navigation sections with children must show expand/collapse chevron icons that toggle visibility | High | Ready for Implementation | Not Approved |
| FR-055008 | Mobile Drawer | On mobile (<768px), navigation must transform into a slide-out drawer accessible via hamburger menu | High | Ready for Implementation | Not Approved |
| FR-055009 | Search Integration | Navigation must include a search input field at the top for filtering menu items | Medium | Ready for Implementation | Not Approved |
| FR-055010 | Sticky Positioning | Navigation must remain visible during page scrolling with position:sticky behavior | High | Ready for Implementation | Not Approved |
| FR-055011 | Badge Support | Navigation items must support optional numeric badges for counts or notifications | Low | Ready for Implementation | Not Approved |
| FR-055012 | Keyboard Navigation | Navigation must be fully accessible via keyboard with Tab/Arrow key navigation and Enter/Space activation | High | Ready for Implementation | Not Approved |

## Non-Functional Requirements

| ID | Name | Type | Requirement | Priority | Status | Approval |
|----|------|------|-------------|----------|--------|----------|
| NFR-055001 | Smooth Transitions | Usability | Collapse/expand and hover animations must complete within 200ms with smooth easing | High | Ready for Implementation | Not Approved |
| NFR-055002 | Performance | Performance | Navigation rendering must not block main thread for more than 50ms | Medium | Ready for Implementation | Not Approved |
| NFR-055003 | State Persistence | Usability | Navigation expanded/collapsed state must persist across page navigations via localStorage | Medium | Ready for Implementation | Not Approved |
| NFR-055004 | Mobile Touch Targets | Accessibility | All navigation items must have minimum touch target size of 44x44px on mobile | High | Ready for Implementation | Not Approved |
| NFR-055005 | Screen Reader Support | Accessibility | Navigation must include proper ARIA labels, roles, and live regions for screen readers | High | Ready for Implementation | Not Approved |
| NFR-055006 | Semantic HTML | Maintainability | Navigation must use semantic HTML5 nav element and proper list structures | Medium | Ready for Implementation | Not Approved |
| NFR-055007 | Color Contrast | Accessibility | Navigation text must maintain minimum 4.5:1 contrast ratio against background | High | Ready for Implementation | Not Approved |
| NFR-055008 | Z-Index Management | Maintainability | Mobile drawer overlay must properly layer above content without z-index conflicts | Medium | Ready for Implementation | Not Approved |
| NFR-055009 | Responsive Breakpoints | Usability | Navigation must smoothly transition between desktop and mobile modes at 768px breakpoint | High | Ready for Implementation | Not Approved |

## Dependencies

### Internal Upstream Dependency

| Enabler ID | Description |
|------------|-------------|
| ENB-189342 | Style Guide Implementation - provides colors, spacing, typography, and icon system |
| ENB-874140 | Layout - integrates navigation within the sidebar section of the layout structure |

### Internal Downstream Impact

| Enabler ID | Description |
|------------|-------------|
| ENB-501283 | Player Character Web Application - uses left navigation for primary app navigation |

### External Dependencies

**External Upstream Dependencies**: None identified.

**External Downstream Impact**: None identified.

## Technical Specifications (Template)

### Enabler Dependency Flow Diagram
```mermaid
flowchart TD
    ENB_189342["ENB-189342<br/>Style Guide Implementation<br/>🎨"]
    ENB_874140["ENB-874140<br/>Layout<br/>📐"]
    ENB_055534["ENB-055534<br/>Navigation<br/>🧭"]
    ENB_501283["ENB-501283<br/>Player Character Web Application<br/>🌐"]

    ENB_189342 --> ENB_874140
    ENB_189342 --> ENB_055534
    ENB_874140 --> ENB_055534
    ENB_055534 --> ENB_501283

    classDef enabler fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    class ENB_189342,ENB_874140,ENB_055534,ENB_501283 enabler
```
### API Technical Specifications (if applicable)

| API Type | Operation | Channel / Endpoint | Description | Request / Publish Payload | Response / Subscribe Data |
|----------|-----------|---------------------|-------------|----------------------------|----------------------------|
| | | | | | |

### Data Models
```mermaid
erDiagram
    NavigationConfig {
        number width
        number collapsedWidth
        boolean isCollapsed
        boolean isPersistent
        string position
    }
    
    NavigationItem {
        string id PK
        string parentId FK
        string label
        string icon
        string url
        number order
        boolean isExpandable
        boolean isExpanded
        boolean isActive
        number level
        number badgeCount
    }
    
    NavigationSection {
        string id PK
        string title
        number order
        boolean isCollapsible
        boolean isCollapsed
    }
    
    NavigationSection ||--o{ NavigationItem : contains
    NavigationItem ||--o{ NavigationItem : hasChildren
    NavigationConfig ||--o{ NavigationSection : configures
```
### Class Diagrams
```mermaid
classDiagram
    class Navigation {
        -NavigationConfig config
        -NavigationSection[] sections
        -boolean isCollapsed
        -boolean isMobileDrawerOpen
        +render() JSX.Element
        +toggleCollapse() void
        +toggleMobileDrawer() void
        +handleItemClick(itemId: string) void
        +setActiveItem(itemId: string) void
    }
    
    class NavigationSection {
        -string id
        -string title
        -NavigationItem[] items
        -boolean isCollapsed
        +render() JSX.Element
        +toggleSection() void
        +renderItems() JSX.Element
    }
    
    class NavigationItem {
        -string id
        -string label
        -string icon
        -string url
        -NavigationItem[] children
        -boolean isExpanded
        -boolean isActive
        -number level
        -number badgeCount
        +render() JSX.Element
        +toggleExpand() void
        +navigate() void
        +renderBadge() JSX.Element
        +renderIcon() JSX.Element
        +renderChildren() JSX.Element
    }
    
    class NavigationSearch {
        -string query
        -NavigationItem[] filteredItems
        +render() JSX.Element
        +handleSearch(query: string) void
        +filterItems() NavigationItem[]
    }
    
    class MobileDrawer {
        -boolean isOpen
        -Navigation navigation
        +render() JSX.Element
        +open() void
        +close() void
        +renderOverlay() JSX.Element
    }
    
    Navigation "1" --> "*" NavigationSection : contains
    NavigationSection "1" --> "*" NavigationItem : contains
    NavigationItem "1" --> "*" NavigationItem : hasChildren
    Navigation "1" --> "0..1" NavigationSearch : includes
    Navigation "1" --> "0..1" MobileDrawer : hasMobileView
```
### Sequence Diagrams
```mermaid
sequenceDiagram
    participant User
    participant Navigation
    participant LocalStorage
    participant Router
    participant Page

    User->>Navigation: Page loads
    Navigation->>LocalStorage: Read collapsed state
    LocalStorage-->>Navigation: isCollapsed=false
    Navigation->>Navigation: Render navigation (256px width)
    Navigation->>Navigation: Load navigation items
    Navigation->>Navigation: Highlight active item
    Navigation-->>User: Display navigation
    
    User->>Navigation: Click toggle button
    Navigation->>Navigation: Toggle collapse state
    Navigation->>Navigation: Animate to 48px width
    Navigation->>LocalStorage: Save collapsed state
    Navigation-->>User: Show collapsed navigation
    
    User->>Navigation: Click expandable item
    Navigation->>Navigation: Toggle expand state
    Navigation->>Navigation: Animate children reveal
    Navigation-->>User: Show child items
    
    User->>Navigation: Click navigation link
    Navigation->>Router: Navigate to URL
    Router->>Page: Load new page
    Page->>Navigation: Update active state
    Navigation-->>User: Highlight new active item
```
### Dataflow Diagrams
```mermaid
flowchart TB
    NavConfig[Navigation Configuration<br/>width: 256px<br/>collapsedWidth: 48px] --> Nav[Navigation Component]
    StyleGuide[Style Guide<br/>Colors, Icons, Typography] --> Nav
    
    NavData[Navigation Menu Data<br/>Hierarchical Structure] --> Nav
    CurrentRoute[Current Route/Path] --> Nav
    
    Nav --> State{Navigation State}
    
    State --> Expanded[Expanded State<br/>Show labels & icons<br/>Full width 256px]
    State --> Collapsed[Collapsed State<br/>Icons only<br/>Width 48px]
    
    Nav --> Rendering{Render Mode}
    
    Rendering --> Desktop[Desktop Sidebar<br/>Fixed left position<br/>Sticky scroll]
    Rendering --> Mobile[Mobile Drawer<br/>Slide-out panel<br/>Overlay backdrop]
    
    Desktop --> Items[Navigation Items]
    Mobile --> Items
    
    Items --> TopLevel[Top-Level Items<br/>Level 0]
    Items --> Nested[Nested Items<br/>Levels 1-2]
    
    TopLevel --> Active[Active Indicator<br/>Blue accent bar]
    Nested --> Expandable[Expandable Sections<br/>Chevron icons]
    
    UserAction[User Interaction] --> Events{Event Handlers}
    Events --> Click[Click Item: Navigate]
    Events --> Toggle[Toggle Collapse/Expand]
    Events --> Search[Search Filter Items]
```
### State Diagrams
```mermaid
stateDiagram-v2
    [*] --> Desktop: viewport >= 768px
    [*] --> Mobile: viewport < 768px
    
    state Desktop {
        [*] --> Expanded
        Expanded --> Collapsed: click toggle
        Collapsed --> Expanded: click toggle
        
        state Expanded {
            [*] --> ShowingLabels
            ShowingLabels --> ShowingIcons: always visible
            ShowingIcons --> ShowingBadges: if badges exist
        }
        
        state Collapsed {
            [*] --> IconsOnly
            IconsOnly --> TooltipOnHover: hover item
        }
    }
    
    state Mobile {
        [*] --> DrawerClosed
        DrawerClosed --> DrawerOpen: click hamburger
        DrawerOpen --> DrawerClosed: click overlay/close
        
        state DrawerOpen {
            [*] --> FullNavigation
            FullNavigation --> SearchActive: type in search
            SearchActive --> FilteredResults: matching items
        }
    }
    
    Desktop --> Mobile: resize < 768px
    Mobile --> Desktop: resize >= 768px
    
    state "Navigation Item" as NavItem {
        [*] --> Inactive
        Inactive --> Active: navigate to page
        Active --> Inactive: navigate away
        
        Inactive --> Hover: mouse enter
        Hover --> Inactive: mouse leave
        
        state "Expandable Item" as ExpandItem {
            [*] --> Collapsed_Item
            Collapsed_Item --> Expanded_Item: click chevron
            Expanded_Item --> Collapsed_Item: click chevron
        }
    }
```

