import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download,
  Maximize,
  Table,
  Key,
  Link
} from 'lucide-react';
import { DatabaseSchema, TableSchema, RelationshipDefinition } from '@/services/aiSchemaDesignService';

interface ERDiagramProps {
  schema: DatabaseSchema;
  onTableSelect?: (table: TableSchema) => void;
  selectedTable?: string;
}

interface TablePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ERDiagram = ({ schema, onTableSelect, selectedTable }: ERDiagramProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tablePositions, setTablePositions] = useState<Record<string, TablePosition>>({});

  // Calculate table positions using a simple grid layout
  useEffect(() => {
    const positions: Record<string, TablePosition> = {};
    const tableWidth = 200;
    const tableHeight = 150;
    const spacing = 50;
    const cols = Math.ceil(Math.sqrt(schema.tables.length));
    
    schema.tables.forEach((table, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      positions[table.name] = {
        x: col * (tableWidth + spacing) + 50,
        y: row * (tableHeight + spacing) + 50,
        width: tableWidth,
        height: Math.max(tableHeight, table.columns.length * 25 + 60)
      };
    });
    
    setTablePositions(positions);
  }, [schema.tables]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.3));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const exportDiagram = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${schema.name}_er_diagram.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const renderTable = (table: TableSchema) => {
    const position = tablePositions[table.name];
    if (!position) return null;

    const isSelected = selectedTable === table.name;
    const primaryKeys = table.primaryKey || [];
    const foreignKeys = table.foreignKeys?.map(fk => fk.columnName) || [];

    return (
      <g key={table.name}>
        {/* Table container */}
        <rect
          x={position.x}
          y={position.y}
          width={position.width}
          height={position.height}
          fill={isSelected ? '#dbeafe' : '#ffffff'}
          stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
          strokeWidth={isSelected ? 2 : 1}
          rx={8}
          className="cursor-pointer hover:fill-gray-50"
          onClick={() => onTableSelect?.(table)}
        />
        
        {/* Table header */}
        <rect
          x={position.x}
          y={position.y}
          width={position.width}
          height={40}
          fill={isSelected ? '#3b82f6' : '#f3f4f6'}
          stroke="none"
          rx={8}
        />
        <rect
          x={position.x}
          y={position.y + 32}
          width={position.width}
          height={8}
          fill={isSelected ? '#3b82f6' : '#f3f4f6'}
          stroke="none"
        />
        
        {/* Table name */}
        <text
          x={position.x + position.width / 2}
          y={position.y + 25}
          textAnchor="middle"
          className={`text-sm font-semibold ${isSelected ? 'fill-white' : 'fill-gray-800'}`}
        >
          {table.name}
        </text>
        
        {/* Columns */}
        {table.columns.slice(0, 8).map((column, index) => {
          const isPrimaryKey = primaryKeys.includes(column.name);
          const isForeignKey = foreignKeys.includes(column.name);
          const y = position.y + 50 + index * 20;
          
          return (
            <g key={column.name}>
              {/* Column background */}
              <rect
                x={position.x + 2}
                y={y - 8}
                width={position.width - 4}
                height={18}
                fill="transparent"
                className="hover:fill-gray-50"
              />
              
              {/* Key icons */}
              {isPrimaryKey && (
                <circle
                  cx={position.x + 12}
                  cy={y}
                  r={4}
                  fill="#fbbf24"
                  stroke="#f59e0b"
                  strokeWidth={1}
                />
              )}
              {isForeignKey && (
                <rect
                  x={position.x + 8}
                  y={y - 4}
                  width={8}
                  height={8}
                  fill="#6b7280"
                  stroke="#4b5563"
                  strokeWidth={1}
                />
              )}
              
              {/* Column name */}
              <text
                x={position.x + (isPrimaryKey || isForeignKey ? 25 : 10)}
                y={y + 3}
                className="text-xs fill-gray-700"
              >
                {column.name}
              </text>
              
              {/* Column type */}
              <text
                x={position.x + position.width - 10}
                y={y + 3}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {column.type}
              </text>
            </g>
          );
        })}
        
        {/* Show more indicator */}
        {table.columns.length > 8 && (
          <text
            x={position.x + 10}
            y={position.y + 50 + 8 * 20 + 10}
            className="text-xs fill-gray-400"
          >
            +{table.columns.length - 8} more...
          </text>
        )}
      </g>
    );
  };

  const renderRelationship = (relationship: RelationshipDefinition) => {
    const fromPos = tablePositions[relationship.fromTable];
    const toPos = tablePositions[relationship.toTable];
    
    if (!fromPos || !toPos) return null;

    // Calculate connection points
    const fromX = fromPos.x + fromPos.width;
    const fromY = fromPos.y + fromPos.height / 2;
    const toX = toPos.x;
    const toY = toPos.y + toPos.height / 2;

    // Create curved path
    const midX = (fromX + toX) / 2;
    const path = `M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${(fromY + toY) / 2} Q ${midX} ${toY} ${toX} ${toY}`;

    return (
      <g key={relationship.id}>
        <path
          d={path}
          stroke="#6b7280"
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        
        {/* Relationship label */}
        <text
          x={midX}
          y={(fromY + toY) / 2 - 10}
          textAnchor="middle"
          className="text-xs fill-gray-600"
        >
          {relationship.type.replace('_', ' ')}
        </text>
      </g>
    );
  };

  const viewBox = `${-pan.x / zoom} ${-pan.y / zoom} ${(containerRef.current?.clientWidth || 800) / zoom} ${(containerRef.current?.clientHeight || 600) / zoom}`;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            Entity Relationship Diagram
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {schema.tables.length} tables
            </Badge>
            <Badge variant="outline" className="text-xs">
              {schema.relationships.length} relationships
            </Badge>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={exportDiagram}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative w-full h-[600px] overflow-hidden border rounded-lg bg-gray-50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            viewBox={viewBox}
            style={{ transform: `scale(${zoom})` }}
          >
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
                  fill="#6b7280"
                />
              </marker>
            </defs>
            
            {/* Render relationships first (behind tables) */}
            {schema.relationships.map(renderRelationship)}
            
            {/* Render tables */}
            {schema.tables.map(renderTable)}
          </svg>
          
          {/* Zoom indicator */}
          <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded border text-xs">
            {Math.round(zoom * 100)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};