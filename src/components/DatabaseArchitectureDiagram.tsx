import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Server, 
  Cloud, 
  Users, 
  Zap, 
  Shield, 
  BarChart3,
  ArrowRight,
  ArrowDown,
  Globe
} from "lucide-react";

interface DatabaseArchitectureDiagramProps {
  recommendation: any;
  requirements: any;
}

export const DatabaseArchitectureDiagram = ({ recommendation, requirements }: DatabaseArchitectureDiagramProps) => {
  const primary = recommendation.primary;
  const architecture = recommendation.architecture;

  const getArchitectureComponents = () => {
    const components = [];
    
    // User layer
    components.push({
      id: 'users',
      name: 'Users',
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      position: { x: 50, y: 10 }
    });

    // Load balancer (if high load)
    if (requirements.expectedLoad === 'high') {
      components.push({
        id: 'loadbalancer',
        name: 'Load Balancer',
        icon: Globe,
        color: 'bg-purple-100 text-purple-700',
        position: { x: 50, y: 25 }
      });
    }

    // Application layer
    components.push({
      id: 'app',
      name: 'Application Server',
      icon: Server,
      color: 'bg-green-100 text-green-700',
      position: { x: 50, y: requirements.expectedLoad === 'high' ? 40 : 30 }
    });

    // Cache layer (if needed)
    if (requirements.expectedLoad !== 'low') {
      components.push({
        id: 'cache',
        name: 'Cache Layer',
        icon: Zap,
        color: 'bg-orange-100 text-orange-700',
        position: { x: 25, y: requirements.expectedLoad === 'high' ? 55 : 50 }
      });
    }

    // Primary database
    components.push({
      id: 'primary-db',
      name: `${primary.database.name}`,
      icon: Database,
      color: 'bg-indigo-100 text-indigo-700',
      position: { x: 50, y: requirements.expectedLoad === 'high' ? 70 : 60 }
    });

    // Read replicas (if high load)
    if (requirements.expectedLoad === 'high' && primary.database.features.includes('High Availability')) {
      components.push({
        id: 'read-replica',
        name: 'Read Replicas',
        icon: Database,
        color: 'bg-gray-100 text-gray-700',
        position: { x: 75, y: 70 }
      });
    }

    // Analytics/Monitoring
    if (requirements.projectType === 'analytics platform') {
      components.push({
        id: 'analytics',
        name: 'Analytics Engine',
        icon: BarChart3,
        color: 'bg-yellow-100 text-yellow-700',
        position: { x: 75, y: 55 }
      });
    }

    return components;
  };

  const getConnections = () => {
    const connections = [];
    const hasLoadBalancer = requirements.expectedLoad === 'high';
    const hasCache = requirements.expectedLoad !== 'low';
    const hasReplicas = requirements.expectedLoad === 'high' && primary.database.features.includes('High Availability');

    // Users to Load Balancer or App
    connections.push({
      from: 'users',
      to: hasLoadBalancer ? 'loadbalancer' : 'app',
      label: 'HTTP/HTTPS'
    });

    // Load Balancer to App
    if (hasLoadBalancer) {
      connections.push({
        from: 'loadbalancer',
        to: 'app',
        label: 'Distribute Load'
      });
    }

    // App to Cache
    if (hasCache) {
      connections.push({
        from: 'app',
        to: 'cache',
        label: 'Cache Queries'
      });
    }

    // App to Primary DB
    connections.push({
      from: 'app',
      to: 'primary-db',
      label: 'Read/Write'
    });

    // Primary to Read Replicas
    if (hasReplicas) {
      connections.push({
        from: 'primary-db',
        to: 'read-replica',
        label: 'Replication'
      });
    }

    return connections;
  };

  const components = getArchitectureComponents();
  const connections = getConnections();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Architecture Diagram
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 min-h-[400px]">
          {/* Architecture Pattern Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="bg-white dark:bg-gray-800">
              {architecture.pattern}
            </Badge>
          </div>

          {/* Components */}
          {components.map((component) => {
            const Icon = component.icon;
            return (
              <div
                key={component.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${component.color} rounded-lg p-3 shadow-md border-2 border-white dark:border-gray-700 min-w-[120px] text-center`}
                style={{
                  left: `${component.position.x}%`,
                  top: `${component.position.y}%`,
                }}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{component.name}</div>
              </div>
            );
          })}

          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((connection, index) => {
              const fromComponent = components.find(c => c.id === connection.from);
              const toComponent = components.find(c => c.id === connection.to);
              
              if (!fromComponent || !toComponent) return null;

              const fromX = (fromComponent.position.x / 100) * 100;
              const fromY = (fromComponent.position.y / 100) * 100;
              const toX = (toComponent.position.x / 100) * 100;
              const toY = (toComponent.position.y / 100) * 100;

              return (
                <g key={index}>
                  <line
                    x1={`${fromX}%`}
                    y1={`${fromY}%`}
                    x2={`${toX}%`}
                    y2={`${toY}%`}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="text-gray-400"
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x={`${(fromX + toX) / 2}%`}
                    y={`${(fromY + toY) / 2}%`}
                    textAnchor="middle"
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                    dy="-5"
                  >
                    {connection.label}
                  </text>
                </g>
              );
            })}
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  className="fill-gray-400"
                />
              </marker>
            </defs>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md border">
            <div className="text-sm font-medium mb-2">Data Flow</div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="w-4 h-0 border-t-2 border-dashed border-gray-400"></div>
              <span>Request/Response</span>
            </div>
          </div>

          {/* Scaling Strategy */}
          <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md border max-w-[200px]">
            <div className="text-sm font-medium mb-1">Scaling Strategy</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {architecture.scalingStrategy}
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Key Components</h4>
            <div className="space-y-1">
              {architecture.components.map((component, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {component}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Database Features</h4>
            <div className="flex flex-wrap gap-1">
              {primary.database.features.slice(0, 4).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};