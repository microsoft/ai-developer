# Application Architecture

This diagram provides a high-level overview of the application's structure, including the Next.js framework, context providers, UI layer, service layer, telemetry, and external systems.

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Next_Framework["Next.js Framework"]
        App[App Router]
        Layout[Root Layout]
        Page[Page Component]
    end
    
    subgraph Context_Providers["Context Providers"]
        CP[ChatProvider]
        TP[ThemeProvider]
        SP[ServiceProvider]
    end
    
    subgraph UI_Layer["UI Layer"]
        TPL[ChatPageLayout Template]
        Components[UI Components]
    end
    
    subgraph Service_Layer["Service Layer"]
        SF[ServiceFactory]
        
        subgraph Chat_Services["Chat Services"]
            ICS[IChatService Interface]
            MCS[MockChatService]
            ACS[ApiChatService]
        end
        
        subgraph History_Services["History Services"]
            IHS[IHistoryService Interface]
            LHS[LocalHistoryService]
            AHS[ApiHistoryService]
            MHS[MockHistoryService]
        end
    end
    
    subgraph Telemetry["Telemetry"]
        OpenTel[OpenTelemetry]
        TelUtils[Telemetry Utils]
    end
    
    subgraph External_Systems["External Systems"]
        APIs[Chat & History APIs]
        LocalStorage[Browser LocalStorage]
        TelBackend[Telemetry Backend]
    end
    
    App --> Layout
    Layout --> Page
    Layout --> Context_Providers
    Page --> UI_Layer
    
    Context_Providers --> TPL
    
    CP --> Components
    TP --> Components
    SP --> SF
    
    SF --> ICS
    SF --> IHS
    
    ICS --> MCS
    ICS --> ACS
    
    IHS --> LHS
    IHS --> AHS
    IHS --> MHS
    
    ACS --> APIs
    AHS --> APIs
    LHS --> LocalStorage
    
    Components --> TelUtils
    TelUtils --> OpenTel
    OpenTel --> TelBackend
    
    style Next_Framework fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style Context_Providers fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    style UI_Layer fill:#e65100,stroke:#bf360c,color:#ffffff
    style Service_Layer fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    style External_Systems fill:#d84315,stroke:#bf360c,color:#ffffff
    style Telemetry fill:#0097a7,stroke:#006064,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
``` 