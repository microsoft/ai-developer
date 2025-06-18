# Theming System

This diagram shows how theme settings (light/dark) flow through the Theme Context, configure different style systems (MUI, CSS Variables), and are applied to components, with persistence in localStorage.

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Theme_Settings["Theme Settings"]
        LT[Light Theme]
        DT[Dark Theme]
    end
    
    subgraph Theme_Context["Theme Context"]
        TS[ThemeState]
        TF[ToggleTheme Function]
    end
    
    subgraph Style_Systems["Style Systems"]
        MUI[Material-UI Theme]
        TW[Tailwind CSS]
        CS[CSS Variables]
    end
    
    subgraph Components["Component Styling"]
        Atoms[Atomic Components]
        Molecules[Molecular Components]
        Organisms[Organism Components]
        Templates[Template Components]
    end
    
    subgraph Storage["Storage"]
        LS[localStorage]
    end
    
    TS -->|Current Theme| MUI
    TS -->|Current Theme| TW
    TS -->|Current Theme| CS
    TF -->|Toggles| TS
    
    TS -->|Persists| LS
    LS -->|Restores| TS
    
    LT -->|Configures| MUI
    DT -->|Configures| MUI
    
    MUI -->|Styles| Atoms
    MUI -->|Styles| Molecules
    TW -->|Styles| Atoms
    TW -->|Styles| Molecules
    TW -->|Styles| Organisms
    CS -->|Styles| Atoms
    CS -->|Styles| Molecules
    
    style Theme_Settings fill:#8e24aa,stroke:#6a1b9a,color:#ffffff
    style Theme_Context fill:#5e35b1,stroke:#4527a0,color:#ffffff
    style Style_Systems fill:#3949ab,stroke:#283593,color:#ffffff
    style Components fill:#0097a7,stroke:#006064,color:#ffffff
    style Storage fill:#d84315,stroke:#bf360c,color:#ffffff
    
    linkStyle default stroke:#d1c4e9,stroke-width:2px
``` 