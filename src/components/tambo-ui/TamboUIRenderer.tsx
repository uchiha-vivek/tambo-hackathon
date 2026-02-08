'use client';

import { ReactNode } from 'react';
import { UIComponentSpec } from '@/services/tambo-ui-generator';

interface TamboUIRendererProps {
  spec: UIComponentSpec;
  onAction?: (action: string, data?: any) => void;
}

/**
 * Tambo UI Renderer
 * Dynamically renders UI components from Tambo-generated specs
 * This is the CORE of the architecture - UI is generated, not designed
 */
export default function TamboUIRenderer({ spec, onAction }: TamboUIRendererProps) {
  const renderComponent = (componentSpec: UIComponentSpec): ReactNode => {
    const { type, props, children } = componentSpec;

    switch (type) {
      case 'SkillTree':
        return (
          <div className="skill-tree-container" style={props.style}>
            {props.topics?.map((topic: any) => (
              <div
                key={topic.id}
                className={`topic-node topic-${topic.status}`}
                style={{
                  position: 'absolute',
                  left: `${topic.position?.x || 0}px`,
                  top: `${topic.position?.y || 0}px`,
                }}
              >
                {topic.name}
              </div>
            ))}
            {children?.map((child, idx) => (
              <TamboUIRenderer key={idx} spec={child} onAction={onAction} />
            ))}
          </div>
        );

      case 'QuizInterface':
        return (
          <div className={`quiz-interface theme-${props.theme}`} style={props.style}>
            {children?.map((child, idx) => (
              <TamboUIRenderer key={idx} spec={child} onAction={onAction} />
            ))}
          </div>
        );

      case 'Dashboard':
        return (
          <div className={`dashboard layout-${props.layout} theme-${props.theme}`} style={props.style}>
            {props.widgets?.map((widget: any, idx: number) => (
              <div key={idx} className="widget" data-widget-type={widget.type}>
                {widget.type}
              </div>
            ))}
            {children?.map((child, idx) => (
              <TamboUIRenderer key={idx} spec={child} onAction={onAction} />
            ))}
          </div>
        );

      case 'Card':
        return (
          <div className="tambo-card" style={props.style}>
            {props.title && <h3>{props.title}</h3>}
            {props.content && <p>{props.content}</p>}
            {children?.map((child, idx) => (
              <TamboUIRenderer key={idx} spec={child} onAction={onAction} />
            ))}
          </div>
        );

      case 'Button':
        return (
          <button
            className="tambo-button"
            onClick={() => onAction?.(props.action || 'click', props)}
            style={props.style}
          >
            {props.label || props.text}
          </button>
        );

      case 'Text':
        return (
          <div className="tambo-text" style={props.style}>
            {props.content || props.text}
          </div>
        );

      case 'Container':
        return (
          <div className="tambo-container" style={props.style}>
            {children?.map((child, idx) => (
              <TamboUIRenderer key={idx} spec={child} onAction={onAction} />
            ))}
          </div>
        );

      default:
        console.warn(`Unknown component type: ${type}`);
        return (
          <div className="tambo-unknown-component">
            {type}: {JSON.stringify(props)}
          </div>
        );
    }
  };

  return <>{renderComponent(spec)}</>;
}

